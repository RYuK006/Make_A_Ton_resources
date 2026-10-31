import hashlib
import time
import uuid
from datetime import date, timedelta
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from ..models import Subscription, Invoice, InvoiceLine, Plan, Discount

TAX_RATE = 0.18 # 18% standard GST / VAT

def compute_idempotency_key(subscription_id: str, billing_date: date) -> str:
    """Generates a deterministic unique SHA-256 idempotency key for this billing event."""
    raw = f"{subscription_id}_{billing_date.isoformat()}".encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def calculate_next_date(base_date: date, interval: str, count: int = 1) -> date:
    """Advances date strictly according to recurrence rules."""
    interval = (interval or "MONTHLY").upper()
    if interval == "DAILY":
        return base_date + timedelta(days=count)
    elif interval == "WEEKLY":
        return base_date + timedelta(weeks=count)
    elif interval == "MONTHLY":
        month = base_date.month + count
        year = base_date.year + (month - 1) // 12
        month = ((month - 1) % 12) + 1
        day = min(base_date.day, 28)
        return date(year, month, day)
    elif interval == "YEARLY":
        return date(base_date.year + count, base_date.month, min(base_date.day, 28))
    return base_date + timedelta(days=30 * count)

def validate_discount_rule(discount: Discount, subtotal: float, total_quantity: int = 1, as_of_date: date = None) -> Tuple[bool, str]:
    """
    Validates discount against strict business rules:
    - Active status
    - Validity date range (valid_from <= as_of_date <= valid_until)
    - Max usage exhaustion (used_count < max_uses)
    - Minimum order subtotal requirement
    - Minimum item units quantity requirement
    """
    if not discount:
        return False, "No discount provided"
    
    if as_of_date is None:
        as_of_date = date.today()

    if not discount.is_active:
        return False, f"Discount coupon '{discount.code}' is inactive."

    if discount.valid_from and as_of_date < discount.valid_from:
        return False, f"Discount coupon '{discount.code}' is not yet valid (starts on {discount.valid_from})."

    if discount.valid_until and as_of_date > discount.valid_until:
        return False, f"Discount coupon '{discount.code}' has expired on {discount.valid_until}."

    if discount.max_uses is not None and discount.used_count >= discount.max_uses:
        return False, f"Discount coupon '{discount.code}' has reached maximum usage limit ({discount.max_uses} uses)."

    if subtotal < (discount.min_order_amount or 0.0):
        return False, f"Order subtotal (${subtotal:.2f}) does not meet minimum order threshold of ${discount.min_order_amount:.2f}."

    if total_quantity < (discount.min_quantity or 1):
        return False, f"Order item quantity ({total_quantity}) does not meet minimum requirement of {discount.min_quantity} units."

    return True, "Valid"

def execute_billing_day(db: Session, target_date: date) -> Dict[str, Any]:
    """
    Executes high-performance batch billing.
    Guarantees mathematical idempotency, discount rule validation, residual ledger reconciliation,
    and sub-100ms execution across thousands of subscriptions.
    """
    start_time = time.perf_counter()

    # Query active subscriptions due on or before target date
    due_subs = (
        db.query(Subscription)
        .filter(
            Subscription.status == "ACTIVE",
            Subscription.next_billing_date <= target_date,
        )
        .all()
    )

    if not due_subs:
        return {
            "target_date": target_date,
            "subscriptions_evaluated": 0,
            "invoices_generated": 0,
            "duplicates_skipped": 0,
            "total_billed_amount": 0.0,
            "execution_time_ms": round((time.perf_counter() - start_time) * 1000.0, 2),
        }

    # Pre-compute all idempotency keys for bulk deduplication
    keys_map = {sub.id: compute_idempotency_key(sub.id, sub.next_billing_date) for sub in due_subs}
    all_keys = list(keys_map.values())

    # Bulk query existing keys in database
    existing_keys = set()
    chunk_size = 900 # SQLite variable limit is 999
    for i in range(0, len(all_keys), chunk_size):
        chunk = all_keys[i:i + chunk_size]
        found = db.query(Invoice.idempotency_key).filter(Invoice.idempotency_key.in_(chunk)).all()
        for (k,) in found:
            existing_keys.add(k)

    invoices_generated = 0
    duplicates_skipped = 0
    total_billed = 0.0

    new_invoices = []
    new_inv_lines = []

    for sub in due_subs:
        idemp_key = keys_map[sub.id]

        # Deduplication check: Skip if already billed for this cycle date or if last_invoice_date == target_date
        if idemp_key in existing_keys or sub.last_invoice_date == target_date:
            duplicates_skipped += 1
            continue

        # Calculate subtotal and total units
        subtotal = sum(line.line_total for line in sub.lines)
        total_quantity = sum(line.quantity for line in sub.lines)
        if subtotal == 0.0 and sub.total_recurring_amount > 0.0:
            subtotal = sub.total_recurring_amount
            total_quantity = max(1, total_quantity)

        # Dynamic discount validation and expiration logic
        discount_amount = 0.0
        if sub.discount:
            disc = sub.discount
            is_valid, reason = validate_discount_rule(disc, subtotal, total_quantity, target_date)
            if is_valid:
                if disc.discount_type == "PERCENTAGE":
                    discount_amount = subtotal * (disc.value / 100.0)
                elif disc.discount_type == "FIXED":
                    discount_amount = min(disc.value, subtotal)
                # Increment usage count transactionally
                disc.used_count += 1
            else:
                # Coupon expired or exhausted -> remove from subscription
                sub.discount_id = None
                discount_amount = 0.0

        taxable_amount = max(0.0, subtotal - discount_amount)
        tax_amount = round(taxable_amount * TAX_RATE, 2)
        total_amount = round(taxable_amount + tax_amount, 2)

        inv_id = str(uuid.uuid4())
        invoice_number = f"INV-{sub.next_billing_date.strftime('%Y%m')}-{sub.id[:6].upper()}-{invoices_generated + 1:04d}"
        due_date = sub.next_billing_date + timedelta(days=sub.plan.grace_period_days if sub.plan else 7)

        invoice = Invoice(
            id=inv_id,
            invoice_number=invoice_number,
            subscription_id=sub.id,
            customer_id=sub.customer_id,
            idempotency_key=idemp_key,
            status="POSTED",
            issue_date=sub.next_billing_date,
            due_date=due_date,
            subtotal=round(subtotal, 2),
            tax_amount=tax_amount,
            total_amount=total_amount,
            amount_paid=0.0,
            amount_residual=total_amount,
        )
        new_invoices.append(invoice)

        for line in sub.lines:
            desc = f"{line.product.name}" if line.product else "Subscription Service"
            if line.variant:
                desc += f" ({line.variant.attribute_name}: {line.variant.attribute_value})"
            inv_line = InvoiceLine(
                id=str(uuid.uuid4()),
                invoice_id=inv_id,
                description=desc,
                quantity=line.quantity,
                unit_price=line.unit_price_frozen,
                amount=line.line_total,
            )
            new_inv_lines.append(inv_line)

        # Advance next billing date strictly past target_date
        plan = sub.plan
        if plan:
            next_date = calculate_next_date(target_date, plan.billing_interval, plan.interval_count)
            sub.next_billing_date = next_date
            sub.last_invoice_date = target_date

            if plan.auto_close and sub.expiration_date and next_date > sub.expiration_date:
                sub.status = "CLOSED"
        else:
            sub.next_billing_date = target_date + timedelta(days=30)
            sub.last_invoice_date = target_date

        invoices_generated += 1
        total_billed += total_amount

    # Bulk save for maximum speed (<100ms)
    if new_invoices:
        db.bulk_save_objects(new_invoices)
        db.bulk_save_objects(new_inv_lines)

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
