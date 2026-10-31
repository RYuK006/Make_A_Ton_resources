import hashlib
import time
from datetime import date, timedelta
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from ..models import Subscription, Invoice, InvoiceLine, Plan, Discount

TAX_RATE = 0.18 # 18% standard GST / VAT

def compute_idempotency_key(subscription_id: str, billing_date: date) -> str:
    """Generates a deterministic unique SHA-256 idempotency key for this billing event."""
    raw = f"{subscription_id}_{billing_date.isoformat()}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def calculate_next_date(current_date: date, interval: str, count: int = 1) -> date:
    """Advances date strictly according to recurrence rules."""
    interval = interval.upper()
    if interval == "DAILY":
        return current_date + timedelta(days=count)
    elif interval == "WEEKLY":
        return current_date + timedelta(weeks=count)
    elif interval == "MONTHLY":
        # Average 30-day or calendar month increment
        month = current_date.month + count
        year = current_date.year + (month - 1) // 12
        month = ((month - 1) % 12) + 1
        day = min(current_date.day, 28) # safe bounds for month rollover
        return date(year, month, day)
    elif interval == "YEARLY":
        return date(current_date.year + count, current_date.month, min(current_date.day, 28))
    return current_date + timedelta(days=30 * count)

def execute_billing_day(db: Session, target_date: date) -> Dict[str, Any]:
    """
    Executes the automated batch billing run.
    Guarantees mathematical idempotency - impossible to double bill customers.
    """
    start_time = time.perf_counter()

    # Query all active subscriptions due on or before target date
    due_subs = (
        db.query(Subscription)
        .filter(
            Subscription.status == "ACTIVE",
            Subscription.next_billing_date <= target_date,
        )
        .all()
    )

    invoices_generated = 0
    duplicates_skipped = 0
    total_billed = 0.0

    for sub in due_subs:
        idempotency_key = compute_idempotency_key(sub.id, sub.next_billing_date)

        # Check if already billed for this cycle
        existing = db.query(Invoice).filter(Invoice.idempotency_key == idempotency_key).first()
        if existing:
            duplicates_skipped += 1
            continue

        # Calculate subtotal from frozen line prices
        subtotal = sum(line.line_total for line in sub.lines)
        if subtotal == 0.0 and sub.total_recurring_amount > 0.0:
            subtotal = sub.total_recurring_amount

        # Calculate dynamic discount
        discount_amount = 0.0
        if sub.discount:
            disc = sub.discount
            if subtotal >= disc.min_order_amount:
                if disc.discount_type == "PERCENTAGE":
                    discount_amount = subtotal * (disc.value / 100.0)
                elif disc.discount_type == "FIXED":
                    discount_amount = min(disc.value, subtotal)

        taxable_amount = max(0.0, subtotal - discount_amount)
        tax_amount = round(taxable_amount * TAX_RATE, 2)
        total_amount = round(taxable_amount + tax_amount, 2)

        # Create Invoice
        invoice_number = f"INV-{sub.next_billing_date.strftime('%Y%m')}-{sub.id[:6].upper()}-{invoices_generated + 1:04d}"
        due_date = sub.next_billing_date + timedelta(days=sub.plan.grace_period_days if sub.plan else 7)

        invoice = Invoice(
            invoice_number=invoice_number,
            subscription_id=sub.id,
            customer_id=sub.customer_id,
            idempotency_key=idempotency_key,
            status="POSTED",
            issue_date=sub.next_billing_date,
            due_date=due_date,
            subtotal=round(subtotal, 2),
            tax_amount=tax_amount,
            total_amount=total_amount,
            amount_paid=0.0,
        )
        db.add(invoice)
        db.flush() # obtain invoice.id

        # Create Invoice Lines
        for line in sub.lines:
            desc = f"{line.product.name}" if line.product else "Subscription Service"
            if line.variant:
                desc += f" ({line.variant.attribute_name}: {line.variant.attribute_value})"
            inv_line = InvoiceLine(
                invoice_id=invoice.id,
                description=desc,
                quantity=line.quantity,
                unit_price=line.unit_price_frozen,
                amount=line.line_total,
            )
            db.add(inv_line)

        # Advance next billing date
        plan = sub.plan
        if plan:
            next_date = calculate_next_date(sub.next_billing_date, plan.billing_interval, plan.interval_count)
            sub.next_billing_date = next_date

            # Handle Auto-Close
            if plan.auto_close and sub.expiration_date and next_date > sub.expiration_date:
                sub.status = "CLOSED"

        invoices_generated += 1
        total_billed += total_amount

    db.commit()
    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return {
        "target_date": target_date,
        "subscriptions_evaluated": len(due_subs),
        "invoices_generated": invoices_generated,
        "duplicates_skipped": duplicates_skipped,
        "total_billed_amount": round(total_billed, 2),
        "execution_time_ms": round(elapsed_ms, 2),
    }
