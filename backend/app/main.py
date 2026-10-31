import hashlib
import os
import re
import time
import uuid
from datetime import date, datetime, timedelta
from typing import List, Optional, Dict
from fastapi import FastAPI, Depends, HTTPException, Query, Header, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import (
    User, Product, ProductVariant, Plan, Discount,
    Subscription, SubscriptionLine, Invoice, InvoiceLine, Payment,
    QuotationTemplate, QuotationTemplateLine
)
from .schemas import (
    UserRegisterRequest, UserLoginRequest, UserLoginResponse, UserResponse,
    StaffCreateRequest, ForgotPasswordRequest, ForgotPasswordResponse,
    ProductCreate, ProductResponse,
    PlanResponse, DiscountCreate, DiscountResponse,
    QuotationTemplateCreate, QuotationTemplateResponse, QuotationTemplateLineResponse,
    SubscriptionFromTemplateRequest,
    SubscriptionCreate, SubscriptionResponse, SubscriptionTransitionRequest,
    InvoiceResponse, PaymentCreate, PaymentResponse,
    BillingDayBatchRequest, BillingDayBatchResponse,
    DashboardKPIResponse
)
from .engine.billing import execute_billing_day, validate_discount_rule, compute_idempotency_key, TAX_RATE
from .engine.analytics import get_dashboard_metrics

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Brightloop Software - Subscription Management API",
    description="Enterprise Quote-to-Cash subscription ERP with RBAC, templates, strict discount rules, and partial payments",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store (token -> user_id)
ACTIVE_TOKENS: Dict[str, str] = {}

def hash_password(password: str) -> str:
    salt = uuid.uuid4().hex[:16]
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}${key}"

def verify_password(password: str, hashed: str) -> bool:
    try:
        salt, key = hashed.split("$")
        check_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
        return check_key == key
    except Exception:
        return False

def validate_password_complexity(password: str):
    """
    Enforces exact password complexity rule:
    - length > 8 characters
    - at least 1 uppercase letter
    - at least 1 lowercase letter
    - at least 1 special character from [!@#$%^&*(),.?":{}|<>]
    """
    if len(password) <= 8:
        raise HTTPException(
            status_code=422,
            detail="Password must be strictly greater than 8 characters in length."
        )
    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=422,
            detail="Password must contain at least 1 uppercase letter."
        )
    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=422,
            detail="Password must contain at least 1 lowercase letter."
        )
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise HTTPException(
            status_code=422,
            detail='Password must contain at least 1 special character from [!@#$%^&*(),.?":{}|<>].'
        )

def get_current_user_optional(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    elif x_auth_token:
        token = x_auth_token.strip()

    if not token:
        return None
    
    user_id = ACTIVE_TOKENS.get(token)
    if not user_id:
        return None
    
    return db.query(User).filter(User.id == user_id, User.is_active == True).first()

def get_current_user(
    user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required. Please provide a valid Bearer token.")
    return user

def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden: Administrator access required.")
    return user

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    sub_count = db.query(Subscription).count()
    inv_count = db.query(Invoice).count()
    users_count = db.query(User).count()
    return {
        "status": "HEALTHY",
        "database": "SQLite (WAL Mode)",
        "users_count": users_count,
        "subscriptions_count": sub_count,
        "invoices_count": inv_count,
        "timestamp": datetime.utcnow().isoformat()
    }

# ============================================================================
# PHASE 1: AUTHENTICATION, PASSWORD VALIDATION & RBAC
# ============================================================================

@app.post("/api/auth/register", response_model=UserLoginResponse)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # 1. Strict password complexity check
    validate_password_complexity(req.password)

    # 2. Strict unique email check (HTTP 409)
    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An account with email '{req.email}' already exists."
        )

    user = User(
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip(),
        role="CUSTOMER", # Default role for public self-registration
        company_name=req.company_name.strip() if req.company_name else None,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = f"tok_{uuid.uuid4().hex}"
    ACTIVE_TOKENS[token] = user.id

    return UserLoginResponse(token=token, user=user)

@app.post("/api/auth/login", response_model=UserLoginResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    email_clean = req.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Check password
    if not user.hashed_password or not verify_password(req.password, user.hashed_password):
        # Fallback for seeded test accounts
        if not (user.hashed_password == "" and req.password in ("Admin@Brightloop123!", "Staff@Brightloop123!", "Customer@Clientcorp123!", "admin", "password")):
            raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated. Contact Administrator.")

    token = f"tok_{uuid.uuid4().hex}"
    ACTIVE_TOKENS[token] = user.id

    return UserLoginResponse(token=token, user=user)

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user)):
    return user

@app.post("/api/users/staff", response_model=UserResponse)
def create_staff_user(req: StaffCreateRequest, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """Only authenticated users with role ADMIN can provision internal team staff members."""
    validate_password_complexity(req.password)

    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email '{req.email}' already exists."
        )

    staff = User(
        email=req.email.lower().strip(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip(),
        role="STAFF",
        company_name=req.company_name.strip() if req.company_name else "Brightloop Internal Operations",
        is_active=True
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff

@app.post("/api/auth/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email_clean = req.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user:
        raise HTTPException(status_code=404, detail=f"No account found with email '{req.email}'.")

    reset_token = uuid.uuid4().hex
    user.reset_token = reset_token
    db.commit()

    reset_url = f"http://127.0.0.1:3000/#reset-password?token={reset_token}&email={user.email}"
    return ForgotPasswordResponse(
        message="Password reset initiated. Use the secure audit token or link to reset password.",
        reset_token=reset_token,
        reset_url=reset_url
    )

# ============================================================================
# PHASE 2: DYNAMIC QUOTATION TEMPLATES
# ============================================================================

@app.get("/api/quotation-templates", response_model=List[QuotationTemplateResponse])
def get_quotation_templates(db: Session = Depends(get_db)):
    return db.query(QuotationTemplate).all()

@app.post("/api/quotation-templates", response_model=QuotationTemplateResponse)
def create_quotation_template(tmpl_in: QuotationTemplateCreate, db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == tmpl_in.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    template = QuotationTemplate(
        name=tmpl_in.name,
        plan_id=tmpl_in.plan_id,
        validity_days=tmpl_in.validity_days
    )
    db.add(template)
    db.flush()

    for line in tmpl_in.lines:
        tmpl_line = QuotationTemplateLine(
            template_id=template.id,
            product_id=line.product_id,
            variant_id=line.variant_id,
            quantity=line.quantity,
            unit_price=line.unit_price
        )
        db.add(tmpl_line)

    db.commit()
    db.refresh(template)
    return template

@app.post("/api/subscriptions/from-template/{template_id}", response_model=SubscriptionResponse)
def create_subscription_from_template(
    template_id: str,
    req: SubscriptionFromTemplateRequest,
    db: Session = Depends(get_db)
):
    template = db.query(QuotationTemplate).filter(QuotationTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail=f"Quotation Template '{template_id}' not found")

    customer = db.query(User).filter(User.id == req.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer '{req.customer_id}' not found")

    # Expiration date calculated as today + validity_days
    today = date.today()
    expiration_date = today + timedelta(days=template.validity_days)

    discount = None
    if req.discount_code:
        discount = db.query(Discount).filter(Discount.code == req.discount_code.upper()).first()

    sub_id = str(uuid.uuid4())
    subtotal = 0.0
    total_qty = 0
    lines_to_add = []

    for t_line in template.lines:
        line_tot = t_line.unit_price * t_line.quantity
        subtotal += line_tot
        total_qty += t_line.quantity

        line = SubscriptionLine(
            subscription_id=sub_id,
            product_id=t_line.product_id,
            variant_id=t_line.variant_id,
            quantity=t_line.quantity,
            unit_price_frozen=t_line.unit_price,
            line_total=line_tot
        )
        lines_to_add.append(line)

    # Validate discount rule
    disc_val = 0.0
    if discount:
        is_valid, reason = validate_discount_rule(discount, subtotal, total_qty, today)
        if is_valid:
            if discount.discount_type == "PERCENTAGE":
                disc_val = subtotal * (discount.value / 100.0)
            else:
                disc_val = min(discount.value, subtotal)
        else:
            discount = None

    total_rec = max(0.0, subtotal - disc_val)
    count_existing = db.query(Subscription).count()
    sub_num = f"SUB-2026-{count_existing + 1:05d}"

    sub = Subscription(
        id=sub_id,
        subscription_number=sub_num,
        customer_id=req.customer_id,
        plan_id=template.plan_id,
        discount_id=discount.id if discount else None,
        status="DRAFT", # Starts in DRAFT
        start_date=today,
        next_billing_date=today,
        expiration_date=expiration_date,
        total_recurring_amount=round(total_rec, 2)
    )
    db.add(sub)
    for line in lines_to_add:
        db.add(line)

    db.commit()
    db.refresh(sub)
    return sub

# ============================================================================
# PRODUCTS, PLANS & DISCOUNTS
# ============================================================================

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

@app.get("/api/plans", response_model=List[PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    return db.query(Plan).all()

@app.get("/api/discounts", response_model=List[DiscountResponse])
def get_discounts(db: Session = Depends(get_db)):
    return db.query(Discount).all()

@app.post("/api/discounts", response_model=DiscountResponse)
def create_discount(disc_in: DiscountCreate, db: Session = Depends(get_db)):
    existing = db.query(Discount).filter(Discount.code == disc_in.code.upper()).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Discount code '{disc_in.code}' already exists.")

    disc = Discount(
        code=disc_in.code.upper(),
        discount_type=disc_in.discount_type,
        value=disc_in.value,
        min_order_amount=disc_in.min_order_amount,
        min_quantity=disc_in.min_quantity,
        valid_from=disc_in.valid_from,
        valid_until=disc_in.valid_until,
        max_uses=disc_in.max_uses,
        used_count=0,
        is_active=disc_in.is_active
    )
    db.add(disc)
    db.commit()
    db.refresh(disc)
    return disc

# ============================================================================
# SUBSCRIPTIONS & FSM
# ============================================================================

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

    subtotal = 0.0
    total_qty = 0
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
        total_qty += l.quantity

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
    if discount:
        is_valid, reason = validate_discount_rule(discount, subtotal, total_qty, start)
        if is_valid:
            if discount.discount_type == "PERCENTAGE":
                disc_val = subtotal * (discount.value / 100.0)
            else:
                disc_val = min(discount.value, subtotal)
        else:
            discount = None

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
        raise HTTPException(status_code=404, detail=f"Subscription '{sub_id}' not found")

    action = req.action.upper()
    current = sub.status

    if action == "QUOTE":
        if current != "DRAFT":
            raise HTTPException(status_code=400, detail=f"Cannot quote from status {current}. Must be DRAFT.")
        sub.status = "QUOTATION"
    elif action == "CONFIRM":
        if current not in ("DRAFT", "QUOTATION"):
            raise HTTPException(status_code=400, detail=f"Cannot activate from status {current}.")
        sub.status = "ACTIVE"
        sub.start_date = date.today()
        # Set next billing date according to plan
        sub.next_billing_date = date.today()
    elif action == "CLOSE":
        if current != "ACTIVE":
            raise HTTPException(status_code=400, detail=f"Cannot close inactive subscription {current}.")
        sub.status = "CLOSED"
    elif action == "CANCEL":
        sub.status = "CANCELLED"
    else:
        raise HTTPException(status_code=400, detail="Invalid transition action.")

    db.commit()
    db.refresh(sub)
    return sub

# ============================================================================
# PHASE 4: INVOICES, PARTIAL PAYMENTS & RECONCILIATION
# ============================================================================

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
        inv.balance_due = inv.amount_residual
    return invoices

@app.get("/api/invoices/{inv_id}", response_model=InvoiceResponse)
def get_invoice_by_id(inv_id: str, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == inv_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice.balance_due = invoice.amount_residual
    return invoice

@app.post("/api/invoices/{inv_id}/pay", response_model=PaymentResponse)
def settle_invoice_payment(inv_id: str, pay_in: PaymentCreate, db: Session = Depends(get_db)):
    invoice = db.query(Invoice).filter(Invoice.id == inv_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if pay_in.amount <= 0:
        raise HTTPException(status_code=400, detail="Payment amount must be greater than zero.")

    if invoice.amount_residual <= 0:
        raise HTTPException(status_code=400, detail="Invoice is already fully paid.")

    txn_ref = pay_in.transaction_ref or f"PAY-{uuid.uuid4().hex[:12].upper()}"
    p_date = pay_in.payment_date or date.today()

    payment = Payment(
        invoice_id=inv_id,
        amount=pay_in.amount,
        payment_method=pay_in.payment_method,
        transaction_ref=txn_ref,
        notes=pay_in.notes,
        payment_date=p_date
    )
    db.add(payment)

    # Reconcile invoice ledger
    invoice.amount_paid = round(invoice.amount_paid + pay_in.amount, 2)

    if pay_in.amount >= invoice.amount_residual:
        invoice.amount_residual = 0.0
        invoice.status = "PAID"
    else:
        invoice.amount_residual = round(invoice.amount_residual - pay_in.amount, 2)
        invoice.status = "PARTIALLY_PAID"

    db.commit()
    db.refresh(payment)
    return payment

# Customer Self-Service Isolated Portal Endpoints
@app.get("/api/customer/my-subscriptions", response_model=List[SubscriptionResponse])
def get_customer_subscriptions(
    customer_id: Optional[str] = None,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    target_id = customer_id or (user.id if user else None)
    if not target_id:
        # Default fallback to demo customer
        demo = db.query(User).filter(User.email == "aaron@clientcorp.com").first()
        target_id = demo.id if demo else None

    if not target_id:
        return []

    return db.query(Subscription).filter(Subscription.customer_id == target_id).all()

@app.get("/api/customer/my-invoices", response_model=List[InvoiceResponse])
def get_customer_invoices(
    customer_id: Optional[str] = None,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    target_id = customer_id or (user.id if user else None)
    if not target_id:
        demo = db.query(User).filter(User.email == "aaron@clientcorp.com").first()
        target_id = demo.id if demo else None

    if not target_id:
        return []

    invoices = db.query(Invoice).filter(Invoice.customer_id == target_id).order_by(Invoice.issue_date.desc()).all()
    for inv in invoices:
        inv.balance_due = inv.amount_residual
    return invoices

# ============================================================================
# BATCH BILLING & ANALYTICS
# ============================================================================

@app.post("/api/billing/run-billing-day", response_model=BillingDayBatchResponse)
def trigger_billing_day(req: BillingDayBatchRequest = None, db: Session = Depends(get_db)):
    target = req.target_date if (req and req.target_date) else date.today()
    results = execute_billing_day(db, target)
    return results

@app.get("/api/analytics/dashboard", response_model=DashboardKPIResponse)
def get_analytics(db: Session = Depends(get_db)):
    return get_dashboard_metrics(db)
