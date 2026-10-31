import random
import uuid
import time
import hashlib
from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import (
    User, Product, ProductVariant, Plan, Discount,
    Subscription, SubscriptionLine, Invoice, InvoiceLine, Payment,
    QuotationTemplate, QuotationTemplateLine
)
from .engine.billing import compute_idempotency_key

def hash_password(password: str) -> str:
    salt = uuid.uuid4().hex[:16]
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}${key}"

def seed_database(target_sub_count: int = 5000):
    print(f"Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    start_time = time.perf_counter()

    # 1. Clean existing records if any
    existing_count = db.query(Subscription).count()
    if existing_count >= target_sub_count:
        print(f"Database already populated with {existing_count} subscriptions. Verifying schema integrity...")
        # Check if users have hashed passwords, if not update them
        admin_check = db.query(User).filter(User.email == "admin@brightloop.io").first()
        if admin_check and (not admin_check.hashed_password or admin_check.role == "SALES_REP"):
            print("Updating seeded users with compliant passwords and roles...")
            admin_check.hashed_password = hash_password("Admin@Brightloop123!")
            admin_check.role = "ADMIN"
            sales = db.query(User).filter(User.email == "sales@brightloop.io").first()
            if sales:
                sales.hashed_password = hash_password("Staff@Brightloop123!")
                sales.role = "STAFF"
            demo = db.query(User).filter(User.email == "aaron@clientcorp.com").first()
            if demo:
                demo.hashed_password = hash_password("Customer@Clientcorp123!")
                demo.role = "CUSTOMER"
            db.commit()
        db.close()
        return

    print("Seeding Users with strict hashed passwords & RBAC...")

    # Users
    admin = User(
        email="admin@brightloop.com",
        hashed_password=hash_password("Admin@Brightloop123!"),
        full_name="Chief Executive Admin (Marc Demo)",
        role="ADMIN",
        company_name="Brightloop Software HQ",
        is_active=True
    )
    admin_io = User(
        email="admin@brightloop.io",
        hashed_password=hash_password("Admin@Brightloop123!"),
        full_name="Executive Admin",
        role="ADMIN",
        company_name="Brightloop Software HQ",
        is_active=True
    )
    staff_user = User(
        email="staff@brightloop.com",
        hashed_password=hash_password("Staff@Brightloop123!"),
        full_name="Sarah Connor (Staff Operations)",
        role="STAFF",
        company_name="Brightloop Operations Team",
        is_active=True
    )
    sales_io = User(
        email="sales@brightloop.io",
        hashed_password=hash_password("Staff@Brightloop123!"),
        full_name="Sarah Jenkins (Billing Lead)",
        role="STAFF",
        company_name="Brightloop Operations Team",
        is_active=True
    )
    demo_customer = User(
        email="aaron@clientcorp.com",
        hashed_password=hash_password("Customer@Clientcorp123!"),
        full_name="Aaron Alex Mathew",
        role="CUSTOMER",
        company_name="ClientCorp International",
        is_active=True
    )
    demo_cust_com = User(
        email="customer@clientcorp.com",
        hashed_password=hash_password("Customer@Clientcorp123!"),
        full_name="ClientCorp International",
        role="CUSTOMER",
        company_name="ClientCorp International",
        is_active=True
    )
    db.add_all([admin, admin_io, staff_user, sales_io, demo_customer, demo_cust_com])
    db.flush()

    # Generate corporate customers
    customer_users = [demo_customer]
    for i in range(1, 350):
        c = User(
            email=f"billing.lead_{i}@enterprise{i}.com",
            hashed_password=hash_password("Customer@Clientcorp123!"),
            full_name=f"Finance Lead {i}",
            role="CUSTOMER",
            company_name=f"Enterprise {i} Holdings",
            is_active=True
        )
        db.add(c)
        customer_users.append(c)
    db.flush()

    # Products & Variants (incorporating challenge requirement: Odoo Brand adds +$560)
    p_erp = Product(
        name="Brightloop Enterprise ERP",
        description="Core recurring cloud ERP system including inventory, sales, and reporting.",
        base_price=1200.0,
        is_active=True
    )
    p_support = Product(
        name="Mission-Critical SLA Support Node",
        description="24/7 dedicated engineering support and priority issue escalation.",
        base_price=450.0,
        is_active=True
    )
    p_copilot = Product(
        name="AI Finance Copilot Addon",
        description="Autonomous ledger agent performing accounts receivable aging audit and analytics.",
        base_price=199.0,
        is_active=True
    )
    p_tax = Product(
        name="Automated Invoicing & Tax Engine",
        description="Automated GST/VAT calculation, localized regulatory reporting, and invoice generation.",
        base_price=299.0,
        is_active=True
    )
    db.add_all([p_erp, p_support, p_copilot, p_tax])
    db.flush()

    # Variants
    v_odoo = ProductVariant(
        product_id=p_erp.id,
        attribute_name="Brand Integration",
        attribute_value="Odoo",
        price_modifier=560.0 # +$560 as requested by the challenge!
    )
    v_native = ProductVariant(
        product_id=p_erp.id,
        attribute_name="Brand Integration",
        attribute_value="Native Standalone",
        price_modifier=0.0
    )
    v_ha = ProductVariant(
        product_id=p_erp.id,
        attribute_name="Cloud Tier",
        attribute_value="High-Availability Multi-Region",
        price_modifier=250.0
    )
    db.add_all([v_odoo, v_native, v_ha])
    db.flush()

    # Plans
    plan_monthly = Plan(name="Monthly Standard", billing_interval="MONTHLY", interval_count=1, auto_close=False, grace_period_days=7)
    plan_annual = Plan(name="Annual Growth (Pro)", billing_interval="YEARLY", interval_count=1, auto_close=True, grace_period_days=15)
    plan_weekly = Plan(name="Weekly Micro-Billing", billing_interval="WEEKLY", interval_count=1, auto_close=False, grace_period_days=3)
    plan_daily = Plan(name="Daily Trial Pass", billing_interval="DAILY", interval_count=1, auto_close=True, grace_period_days=1)
    db.add_all([plan_monthly, plan_annual, plan_weekly, plan_daily])
    db.flush()

    # Quotation Templates
    tmpl_enterprise = QuotationTemplate(
        name="Enterprise Cloud Bundle (Odoo Edition)",
        plan_id=plan_monthly.id,
        validity_days=30
    )
    tmpl_starter = QuotationTemplate(
        name="SaaS Starter Pack",
        plan_id=plan_annual.id,
        validity_days=14
    )
    db.add_all([tmpl_enterprise, tmpl_starter])
    db.flush()

    tmpl_line1 = QuotationTemplateLine(
        template_id=tmpl_enterprise.id,
        product_id=p_erp.id,
        variant_id=v_odoo.id,
        quantity=1,
        unit_price=1760.0 # 1200 + 560
    )
    tmpl_line2 = QuotationTemplateLine(
        template_id=tmpl_enterprise.id,
        product_id=p_support.id,
        variant_id=None,
        quantity=1,
        unit_price=450.0
    )
    tmpl_line3 = QuotationTemplateLine(
        template_id=tmpl_starter.id,
        product_id=p_tax.id,
        variant_id=None,
        quantity=1,
        unit_price=299.0
    )
    db.add_all([tmpl_line1, tmpl_line2, tmpl_line3])
    db.flush()

    # Discounts with rules
    disc_mak = Discount(
        code="MAKEATON15",
        discount_type="PERCENTAGE",
        value=15.0,
        min_order_amount=500.0,
        min_quantity=1,
        valid_from=date(2026, 1, 1),
        valid_until=date(2026, 12, 31),
        max_uses=1000,
        used_count=12,
        is_active=True
    )
    disc_odoo = Discount(
        code="ODOOPARTNER",
        discount_type="FIXED",
        value=200.0,
        min_order_amount=1000.0,
        min_quantity=1,
        valid_from=date(2026, 1, 1),
        valid_until=date(2026, 12, 31),
        max_uses=500,
        used_count=45,
        is_active=True
    )
    disc_early = Discount(
        code="EARLYBIRD",
        discount_type="PERCENTAGE",
        value=10.0,
        min_order_amount=100.0,
        min_quantity=1,
        valid_from=date(2026, 1, 1),
        valid_until=date(2026, 12, 31),
        max_uses=200,
        used_count=18,
        is_active=True
    )
    disc_exp = Discount(
        code="EXPIRED50",
        discount_type="PERCENTAGE",
        value=50.0,
        min_order_amount=50.0,
        min_quantity=1,
        valid_from=date(2025, 1, 1),
        valid_until=date(2025, 12, 31),
        max_uses=5,
        used_count=5,
        is_active=False
    )
    db.add_all([disc_mak, disc_odoo, disc_early, disc_exp])
    db.flush()

    print(f"Generating {target_sub_count} realistic subscriptions and historical invoices...")

    products_pool = [
        (p_erp, [v_odoo, v_native, v_ha]),
        (p_support, []),
        (p_copilot, []),
        (p_tax, [])
    ]
    plans_pool = [plan_monthly, plan_annual, plan_weekly, plan_daily]
    discounts_pool = [None, None, disc_mak, disc_odoo, disc_early]

    today = date.today()
    batch_subs = []
    batch_lines = []
    batch_invoices = []
    batch_payments = []

    statuses = ["ACTIVE"] * 75 + ["QUOTATION"] * 15 + ["DRAFT"] * 5 + ["CLOSED"] * 5

    for idx in range(1, target_sub_count + 1):
        sub_id = str(uuid.uuid4())
        customer = random.choice(customer_users)
        plan = random.choice(plans_pool)
        status = random.choice(statuses)
        discount = random.choice(discounts_pool)

        # Date distributions
        days_offset = random.randint(-45, 30)
        next_billing = today + timedelta(days=days_offset)
        start = today - timedelta(days=random.randint(60, 365))
        exp = start + timedelta(days=365) if plan.auto_close else None

        # Build lines
        lines_count = random.choice([1, 2, 3])
        subtotal = 0.0
        for l_idx in range(lines_count):
            prod, variants = random.choice(products_pool)
            variant = random.choice(variants) if variants and random.random() > 0.4 else None
            unit_price = prod.base_price + (variant.price_modifier if variant else 0.0)
            qty = random.choice([1, 1, 2])
            line_tot = unit_price * qty
            subtotal += line_tot

            batch_lines.append(
                SubscriptionLine(
                    subscription_id=sub_id,
                    product_id=prod.id,
                    variant_id=variant.id if variant else None,
                    quantity=qty,
                    unit_price_frozen=unit_price,
                    line_total=line_tot
                )
            )

        # Apply discount
        disc_val = 0.0
        if discount and subtotal >= discount.min_order_amount:
            if discount.discount_type == "PERCENTAGE":
                disc_val = subtotal * (discount.value / 100.0)
            else:
                disc_val = min(discount.value, subtotal)

        total_rec = max(0.0, subtotal - disc_val)

        sub = Subscription(
            id=sub_id,
            subscription_number=f"SUB-2026-{idx:05d}",
            customer_id=customer.id,
            plan_id=plan.id,
            discount_id=discount.id if discount else None,
            status=status,
            start_date=start,
            next_billing_date=next_billing,
            expiration_date=exp,
            total_recurring_amount=round(total_rec, 2)
        )
        batch_subs.append(sub)

        # Generate realistic invoices for active & closed subs
        if status in ("ACTIVE", "CLOSED") and random.random() > 0.3:
            inv_id = str(uuid.uuid4())
            inv_date = next_billing - timedelta(days=30)
            due_date = inv_date + timedelta(days=plan.grace_period_days)
            idemp_key = compute_idempotency_key(sub_id, inv_date)

            tax_amt = round(total_rec * 0.18, 2)
            tot_amt = round(total_rec + tax_amt, 2)

            # Assign aging status based on days overdue & payments
            days_overdue = (today - due_date).days
            roll = random.random()
            if roll < 0.45:
                inv_status = "PAID"
                amt_paid = tot_amt
                amount_residual = 0.0
            elif roll < 0.65:
                inv_status = "PARTIALLY_PAID"
                amt_paid = round(tot_amt * random.uniform(0.2, 0.7), 2)
                amount_residual = round(tot_amt - amt_paid, 2)
            elif days_overdue > 30:
                inv_status = "OVERDUE"
                amt_paid = 0.0
                amount_residual = tot_amt
            else:
                inv_status = "POSTED"
                amt_paid = 0.0
                amount_residual = tot_amt

            invoice = Invoice(
                id=inv_id,
                invoice_number=f"INV-2026-{idx:05d}",
                subscription_id=sub_id,
                customer_id=customer.id,
                idempotency_key=idemp_key,
                status=inv_status,
                issue_date=inv_date,
                due_date=due_date,
                subtotal=round(total_rec, 2),
                tax_amount=tax_amt,
                total_amount=tot_amt,
                amount_paid=amt_paid,
                amount_residual=amount_residual
            )
            batch_invoices.append(invoice)

            # Add payment if paid or partially paid
            if amt_paid > 0:
                batch_payments.append(
                    Payment(
                        invoice_id=inv_id,
                        amount=amt_paid,
                        payment_method=random.choice(["CARD", "UPI", "ACH", "Cash"]),
                        transaction_ref=f"TXN-{uuid.uuid4().hex[:12].upper()}",
                        notes="Seed historical payment settlement",
                        payment_date=inv_date
                    )
                )

        # Flush in chunks of 500 for maximum bulk speed
        if idx % 500 == 0:
            db.bulk_save_objects(batch_subs)
            db.bulk_save_objects(batch_lines)
            db.bulk_save_objects(batch_invoices)
            db.bulk_save_objects(batch_payments)
            db.commit()
            batch_subs = []
            batch_lines = []
            batch_invoices = []
            batch_payments = []
            print(f"  -> Seeded {idx}/{target_sub_count} subscriptions...")

    if batch_subs:
        db.bulk_save_objects(batch_subs)
        db.bulk_save_objects(batch_lines)
        db.bulk_save_objects(batch_invoices)
        db.bulk_save_objects(batch_payments)
        db.commit()

    db.close()
    elapsed = time.perf_counter() - start_time
    print(f"Successfully populated database with {target_sub_count} subscriptions in {elapsed:.2f}s!")

if __name__ == "__main__":
    seed_database()
