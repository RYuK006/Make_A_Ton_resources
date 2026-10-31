import time
import uuid
from datetime import date, datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import (
    User, Product, ProductVariant, Plan, Discount,
    Subscription, SubscriptionLine, Invoice, InvoiceLine, Payment
)
from .schemas import (
    ProductCreate, ProductResponse,
    PlanResponse, DiscountResponse,
    SubscriptionCreate, SubscriptionResponse, SubscriptionTransitionRequest,
    InvoiceResponse, PaymentCreate, PaymentResponse,
    BillingDayBatchRequest, BillingDayBatchResponse,
    DashboardKPIResponse
)
from .engine.billing import execute_billing_day
from .engine.analytics import get_dashboard_metrics

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Brightloop Software - Subscription Management API",
    description="Enterprise-grade Quote-to-Cash subscription and automated batch billing engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    sub_count = db.query(Subscription).count()
    inv_count = db.query(Invoice).count()
    return {
        "status": "HEALTHY",
        "database": "SQLite (WAL Mode)",
        "subscriptions_count": sub_count,
        "invoices_count": inv_count,
        "timestamp": datetime.utcnow().isoformat()
    }

# --- Products & Variants ---
@app.get("/api/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active == True).all()

@app.post("/api/products", response_model=ProductResponse)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    p = Product(
        name=product_in.name,
        description=product_in.description,
        base_price=product_in.base_price,
        is_active=product_in.is_active
    )
    db.add(p)
    db.flush()

    for v in product_in.variants:
        variant = ProductVariant(
            product_id=p.id,
            attribute_name=v.attribute_name,
            attribute_value=v.attribute_value,
            price_modifier=v.price_modifier
        )
        db.add(variant)

    db.commit()
    db.refresh(p)
    return p

# --- Plans & Discounts ---
@app.get("/api/plans", response_model=List[PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    return db.query(Plan).all()

@app.get("/api/discounts", response_model=List[DiscountResponse])
def get_discounts(db: Session = Depends(get_db)):
    return db.query(Discount).all()

# --- Subscriptions & State Machine ---
@app.get("/api/subscriptions", response_model=List[SubscriptionResponse])
def get_subscriptions(
    status: Optional[str] = None,
    customer_id: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Subscription)
    if status:
        query = query.filter(Subscription.status == status.upper())
    if customer_id:
        query = query.filter(Subscription.customer_id == customer_id)
    return query.order_by(Subscription.created_at.desc()).limit(limit).all()

@app.post("/api/subscriptions", response_model=SubscriptionResponse)
def create_subscription(sub_in: SubscriptionCreate, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == sub_in.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    discount = None
    if sub_in.discount_code:
        discount = db.query(Discount).filter(Discount.code == sub_in.discount_code.upper()).first()

    sub_id = str(uuid.uuid4())
    start = sub_in.start_date or date.today()
    next_billing = start

    # Calculate line totals
    subtotal = 0.0
    lines_to_add = []
    for l in sub_in.lines:
        prod = db.query(Product).filter(Product.id == l.product_id).first()
        if not prod:
            continue
        variant = None
        if l.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == l.variant_id).first()

        unit_price = prod.base_price + (variant.price_modifier if variant else 0.0)
        tot = unit_price * l.quantity
        subtotal += tot

        line = SubscriptionLine(
            subscription_id=sub_id,
            product_id=prod.id,
            variant_id=variant.id if variant else None,
            quantity=l.quantity,
            unit_price_frozen=unit_price,
            line_total=tot
        )
        lines_to_add.append(line)

    disc_val = 0.0
    if discount and subtotal >= discount.min_order_amount:
        if discount.discount_type == "PERCENTAGE":
            disc_val = subtotal * (discount.value / 100.0)
        else:
            disc_val = min(discount.value, subtotal)

    total_rec = max(0.0, subtotal - disc_val)

    count_existing = db.query(Subscription).count()
    sub_num = f"SUB-2026-{count_existing + 1:05d}"

    sub = Subscription(
        id=sub_id,
        subscription_number=sub_num,
        customer_id=sub_in.customer_id,
        plan_id=sub_in.plan_id,
        discount_id=discount.id if discount else None,
        status="DRAFT",
        start_date=start,
        next_billing_date=next_billing,
        total_recurring_amount=round(total_rec, 2)
    )
    db.add(sub)
    for line in lines_to_add:
        db.add(line)

    db.commit()
    db.refresh(sub)
    return sub

@app.post("/api/subscriptions/{sub_id}/transition", response_model=SubscriptionResponse)
def transition_subscription(sub_id: str, req: SubscriptionTransitionRequest, db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    action = req.action.upper()
    current = sub.status

    # Finite State Machine transition guards
    if action == "QUOTE":
        if current != "DRAFT":
            raise HTTPException(status_code=400, detail=f"Cannot quote from status {current}")
        sub.status = "QUOTATION"
    elif action == "CONFIRM":
        if current not in ("DRAFT", "QUOTATION"):
            raise HTTPException(status_code=400, detail=f"Cannot activate from status {current}")
        sub.status = "ACTIVE"
    elif action == "CLOSE":
        if current != "ACTIVE":
            raise HTTPException(status_code=400, detail=f"Cannot close inactive subscription {current}")
        sub.status = "CLOSED"
    elif action == "CANCEL":
        sub.status = "CANCELLED"
    else:
        raise HTTPException(status_code=400, detail="Invalid transition action")

    db.commit()
    db.refresh(sub)
    return sub

# --- Billing Day Batch Engine ---
@app.post("/api/billing/run-billing-day", response_model=BillingDayBatchResponse)
def trigger_billing_day(req: BillingDayBatchRequest = None, db: Session = Depends(get_db)):
    target = req.target_date if (req and req.target_date) else date.today()
    results = execute_billing_day(db, target)
    return results

# --- Invoices & Payments ---
@app.get("/api/invoices", response_model=List[InvoiceResponse])
def get_invoices(
    customer_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Invoice)
    if customer_id:
        query = query.filter(Invoice.customer_id == customer_id)
    if status:
        query = query.filter(Invoice.status == status.upper())
    invoices = query.order_by(Invoice.issue_date.desc()).limit(limit).all()
    for inv in invoices:
        inv.balance_due = max(0.0, inv.total_amount - inv.amount_paid)
    return invoices

@app.post("/api/invoices/{inv_id}/pay", response_model=PaymentResponse)
def settle_invoice_payment(inv_id: str, pay_in: PaymentCreate, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == inv_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    txn_ref = pay_in.transaction_ref or f"PAY-{uuid.uuid4().hex[:12].upper()}"
    payment = Payment(
        invoice_id=inv_id,
        amount=pay_in.amount,
        payment_method=pay_in.payment_method,
        transaction_ref=txn_ref
    )
    db.add(payment)

    invoice.amount_paid += pay_in.amount
    if invoice.amount_paid >= invoice.total_amount:
        invoice.status = "PAID"

    db.commit()
    db.refresh(payment)
    return payment

# --- Analytics Dashboard & SLA ---
@app.get("/api/analytics/dashboard", response_model=DashboardKPIResponse)
def get_analytics(db: Session = Depends(get_db)):
    return get_dashboard_metrics(db)
