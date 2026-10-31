import random
import uuid
import time
from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import (
    User, Product, ProductVariant, Plan, Discount,
    Subscription, SubscriptionLine, Invoice, InvoiceLine, Payment
)
from .engine.billing import compute_idempotency_key

def seed_database(target_sub_count: int = 5000):
    print(f"Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    start_time = time.perf_counter()

    # 1. Clean existing records if any
    existing_count = db.query(Subscription).count()
    if existing_count >= target_sub_count:
        print(f"Database already populated with {existing_count} subscriptions. Skipping re-seed.")
        db.close()
        return

    print("Seeding Users, Products, Variants, Plans, and Discounts...")

    # Users
    admin = User(
        email="admin@brightloop.io",
        full_name="Chief Executive Admin",
        role="ADMIN",
        company_name="Brightloop Software HQ"
    )
    sales_rep = User(
        email="sales@brightloop.io",
        full_name="Sarah Jenkins (Senior Sales Rep)",
        role="SALES_REP",
        company_name="Brightloop Sales Team"
    )
    demo_customer = User(
        email="aaron@clientcorp.com",
        full_name="Aaron Alex Mathew",
        role="CUSTOMER",
        company_name="ClientCorp International"
    )
    db.add_all([admin, sales_rep, demo_customer])
    db.flush()

    # Generate corporate customers
    customer_users = [demo_customer]
    for i in range(1, 350):
        c = User(
            email=f"billing.lead_{i}@enterprise{i}.com",
            full_name=f"Finance Lead {i}",
            role="CUSTOMER",
            company_name=f"Enterprise {i} Holdings"
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
        description="Autonomous LLM agent performing accounts receivable aging audit and analytics.",
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
    plan_annual = Plan(name="Annual Pro (15% Savings)", billing_interval="YEARLY", interval_count=1, auto_close=False, grace_period_days=14)
    plan_weekly = Plan(name="Weekly High-Frequency", billing_interval="WEEKLY", interval_count=1, auto_close=False, grace_period_days=3)
    plan_daily = Plan(name="Daily Trial Pass", billing_interval="DAILY", interval_count=1, auto_close=True, grace_period_days=1)
    db.add_all([plan_monthly, plan_annual, plan_weekly, plan_daily])
    db.flush()

    # Discounts
    disc_mak = Discount(code="MAKEATON15", discount_type="PERCENTAGE", value=15.0, min_order_amount=500.0)
    disc_odoo = Discount(code="ODOOPARTNER", discount_type="FIXED", value=200.0, min_order_amount=1000.0)
    disc_early = Discount(code="EARLYBIRD", discount_type="PERCENTAGE", value=10.0, min_order_amount=100.0)
    db.add_all([disc_mak, disc_odoo, disc_early])
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
    batch_inv_lines = []
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

            # Assign aging status based on days overdue
            days_overdue = (today - due_date).days
            if days_overdue <= 0:
                inv_status = random.choice(["POSTED", "PAID"])
            elif days_overdue <= 30:
                inv_status = random.choice(["POSTED", "PAID", "PAID"])
            else:
                inv_status = random.choice(["OVERDUE", "POSTED", "PAID"])

            amt_paid = tot_amt if inv_status == "PAID" else 0.0

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
                amount_paid=amt_paid
            )
            batch_invoices.append(invoice)

            # Add payment if paid
            if inv_status == "PAID":
                batch_payments.append(
                    Payment(
                        invoice_id=inv_id,
                        amount=tot_amt,
                        payment_method=random.choice(["CARD", "UPI", "ACH"]),
                        transaction_ref=f"TXN-{uuid.uuid4().hex[:12].upper()}"
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
