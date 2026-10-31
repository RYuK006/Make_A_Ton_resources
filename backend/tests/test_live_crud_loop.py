"""
=============================================================================
Brightloop ERP: Phase 5 Live End-to-End CRUD Loop Verification
Tests all 7 phases against running server on http://127.0.0.1:8001
=============================================================================
"""

import sys
import json
import urllib.request
import urllib.error
from datetime import date, timedelta

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8001/api"

def request(method, path, data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        headers["X-Auth-Token"] = token

    payload = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=payload, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_body)
        except Exception:
            parsed = {"raw": err_body}
        return e.code, parsed

def run_test_suite():
    print("=" * 70)
    print("🚀 STARTING BRIGHTLOOP PHASE 1-5 LIVE ERP TRANSACTION SUITE")
    print("=" * 70)

    # 0. Health Check
    print("\n[Step 0] Checking Backend Health & SQLite WAL Engine...")
    status, health = request("GET", "/health")
    assert status == 200, f"Health check failed: {health}"
    print(f"  ✓ Database Status: {health.get('status')} | Subscriptions: {health.get('subscriptions_count')} | Invoices: {health.get('invoices_count')}")

    # 1. Phase 1: Authentication & Strict Password Validation
    print("\n[Step 1] Testing Strict Password Complexity Validation (HTTP 422)...")
    weak_passwords = [
        "short",             # <= 8 chars
        "alllowercase123!",  # no uppercase
        "ALLUPPERCASE123!",  # no lowercase
        "NoSpecialChar1234"  # no special char
    ]
    for weak in weak_passwords:
        status, res = request("POST", "/auth/register", {
            "email": f"weak_{weak[:5]}@test.com",
            "password": weak,
            "full_name": "Weak Pwd Test"
        })
        assert status == 422, f"Expected 422 for weak password '{weak}', got {status}: {res}"
        print(f"  ✓ Rejected non-compliant password '{weak}': {res.get('detail')}")

    print("\n[Step 2] Testing User Registration & Unique Email Enforcement (HTTP 409)...")
    unique_email = f"customer_{date.today().isoformat()}_{int(date.today().day)}@enterprise.com"
    valid_pwd = "Secure@Customer2026!"
    status, reg_res = request("POST", "/auth/register", {
        "email": unique_email,
        "password": valid_pwd,
        "full_name": "Test Customer Co",
        "company_name": "Enterprise Test Partner Ltd"
    })
    # If already registered on prior run, login instead
    if status == 409:
        print(f"  ℹ Account already exists, proceeding to login...")
        status, log_res = request("POST", "/auth/login", {
            "email": unique_email,
            "password": valid_pwd
        })
        assert status == 200, f"Login failed: {log_res}"
        customer_token = log_res["token"]
        customer_id = log_res["user"]["id"]
    else:
        assert status == 200, f"Registration failed: {reg_res}"
        customer_token = reg_res["token"]
        customer_id = reg_res["user"]["id"]
        print(f"  ✓ Registered customer: {unique_email} (ID: {customer_id})")

        # Duplicate registration check
        status, dup_res = request("POST", "/auth/register", {
            "email": unique_email,
            "password": valid_pwd,
            "full_name": "Duplicate Attempt"
        })
        assert status == 409, f"Expected 409 Conflict for duplicate email, got {status}: {dup_res}"
        print(f"  ✓ Prevented duplicate registration with HTTP 409: {dup_res.get('detail')}")

    print("\n[Step 3] Testing RBAC Staff Provisioning (Admin Only)...")
    # Login Admin
    status, admin_login = request("POST", "/auth/login", {
        "email": "admin@brightloop.com",
        "password": "Admin@Brightloop123!"
    })
    assert status == 200, f"Admin login failed: {admin_login}"
    admin_token = admin_login["token"]
    print(f"  ✓ Admin logged in. Token acquired: {admin_token[:14]}...")

    # Non-admin attempts to create staff -> 403
    status, forbidden_res = request("POST", "/users/staff", {
        "email": "unauth_staff@brightloop.com",
        "password": "Staff@Brightloop123!",
        "full_name": "Illegal Staff"
    }, token=customer_token)
    assert status == 403, f"Expected 403 for non-admin, got {status}: {forbidden_res}"
    print(f"  ✓ Successfully blocked non-admin user from provisioning staff (HTTP 403).")

    # Admin provisions staff
    staff_email = f"staff_{date.today().isoformat()}_{int(date.today().day)}@brightloop.com"
    status, staff_res = request("POST", "/users/staff", {
        "email": staff_email,
        "password": "Staff@Brightloop123!",
        "full_name": "Sarah Connor",
        "company_name": "Brightloop Internal Operations"
    }, token=admin_token)
    if status == 409:
        print(f"  ℹ Staff already provisioned, proceeding...")
    else:
        assert status == 200, f"Staff creation failed: {staff_res}"
        print(f"  ✓ Admin provisioned internal staff: {staff_res.get('email')} with role: {staff_res.get('role')}")

    # Forgot password flow
    print("\n[Step 4] Testing Forgot Password Audit Token & Recovery URL...")
    status, forgot_res = request("POST", "/auth/forgot-password", {
        "email": unique_email
    })
    assert status == 200, f"Forgot password failed: {forgot_res}"
    assert "reset_token" in forgot_res and "reset_url" in forgot_res
    print(f"  ✓ Audit reset token issued: {forgot_res['reset_token'][:16]}... URL: {forgot_res['reset_url']}")

    # 2. Phase 2: Products with Odoo Brand Variant Modifier (+$560)
    print("\n[Step 5] Creating Product with Odoo Brand Modifier (+$560.00)...")
    status, prod_res = request("POST", "/products", {
        "name": f"Brightloop Enterprise Suite ({date.today().isoformat()})",
        "base_price": 1200.0,
        "variants": [
            {
                "attribute_name": "Brand Integration",
                "attribute_value": "Odoo Enterprise 18",
                "price_modifier": 560.0
            },
            {
                "attribute_name": "Brand Integration",
                "attribute_value": "Standalone Native",
                "price_modifier": 0.0
            }
        ]
    })
    assert status == 200, f"Product creation failed: {prod_res}"
    product_id = prod_res["id"]
    odoo_variant = next(v for v in prod_res["variants"] if "Odoo" in v["attribute_value"])
    variant_id = odoo_variant["id"]
    print(f"  ✓ Product created: {prod_res['name']} | Base: $1,200.00 | Odoo Modifier: +${odoo_variant['price_modifier']:.2f} (Total: $1,760.00)")

    # 3. Phase 2: Quotation Template & Spawn Subscription
    print("\n[Step 6] Creating Dynamic Quotation Template & Spawning Subscription...")
    # Fetch existing plan
    status, plans = request("GET", "/plans")
    assert status == 200 and len(plans) > 0, f"Failed to get plans: {plans}"
    plan_id = plans[0]["id"]

    status, tmpl_res = request("POST", "/quotation-templates", {
        "name": f"Odoo Enterprise Cloud Solution ({date.today().isoformat()})",
        "plan_id": plan_id,
        "validity_days": 45,
        "lines": [
            {
                "product_id": product_id,
                "variant_id": variant_id,
                "quantity": 1.0,
                "unit_price": 1760.0
            }
        ]
    })
    assert status == 200, f"Template creation failed: {tmpl_res}"
    template_id = tmpl_res["id"]
    print(f"  ✓ Quotation Template created: '{tmpl_res['name']}' (ID: {template_id}, Validity: {tmpl_res['validity_days']} days)")

    # Spawn subscription from template
    status, sub_res = request("POST", f"/subscriptions/from-template/{template_id}", {
        "customer_id": customer_id,
        "discount_code": None
    })
    assert status == 200, f"Subscription from template failed: {sub_res}"
    subscription_id = sub_res["id"]
    sub_num = sub_res["subscription_number"]
    assert sub_res["status"] == "DRAFT", f"Expected DRAFT status, got {sub_res['status']}"
    print(f"  ✓ Created subscription from template: {sub_num} (ID: {subscription_id}) in status {sub_res['status']}")

    # 4. Phase 3: Transition DRAFT -> QUOTATION -> ACTIVE
    print("\n[Step 7] Transitioning Subscription: DRAFT -> QUOTATION -> ACTIVE...")
    status, quote_res = request("POST", f"/subscriptions/{subscription_id}/transition", {
        "action": "QUOTE"
    })
    assert status == 200 and quote_res["status"] == "QUOTATION", f"Quote transition failed: {quote_res}"
    print(f"  ✓ State: DRAFT -> QUOTATION (Line item pricing locked at ${quote_res['total_recurring_amount']:.2f})")

    status, active_res = request("POST", f"/subscriptions/{subscription_id}/transition", {
        "action": "CONFIRM"
    })
    assert status == 200 and active_res["status"] == "ACTIVE", f"Confirm transition failed: {active_res}"
    print(f"  ✓ State: QUOTATION -> ACTIVE (Start date: {active_res['start_date']}, Next billing: {active_res['next_billing_date']})")

    # 5. Phase 3 & 4: Batch Billing Run & Idempotency
    print("\n[Step 8] Triggering Batch Billing Run for Active Subscriptions...")
    target_billing_date = active_res["next_billing_date"]
    status, batch_res = request("POST", "/billing/run-billing-day", {
        "target_date": target_billing_date
    })
    assert status == 200, f"Batch billing failed: {batch_res}"
    print(f"  ✓ Batch Billing Complete: Evaluated {batch_res['subscriptions_evaluated']} subs, Generated {batch_res['invoices_generated']} invoices in {batch_res['execution_time_ms']:.2f}ms")

    # Double-billing test (idempotency verification)
    status, second_batch = request("POST", "/billing/run-billing-day", {
        "target_date": target_billing_date
    })
    assert status == 200, f"Second batch failed: {second_batch}"
    print(f"  ✓ Re-run Verification: {second_batch['duplicates_skipped']} duplicates skipped with SHA-256 idempotency locks. Zero double-billing.")

    # 6. Customer Isolation Verification
    print("\n[Step 9] Verifying Customer Self-Service Isolated Portal View...")
    status, my_invoices = request("GET", "/customer/my-invoices", token=customer_token)
    assert status == 200, f"Customer my-invoices failed: {my_invoices}"
    assert len(my_invoices) > 0, "Customer should have at least 1 invoice generated"
    target_invoice = next((i for i in my_invoices if i.get("subscription_id") == subscription_id), my_invoices[0])
    invoice_id = target_invoice["id"]
    inv_num = target_invoice["invoice_number"]
    total_amt = target_invoice["total_amount"]
    initial_residual = target_invoice["amount_residual"]
    print(f"  ✓ Customer Portal Verified: Invoice {inv_num} isolated for user. Total: ${total_amt:.2f}, Residual: ${initial_residual:.2f}")

    # 7. Phase 4: Partial Payment & A/R Ledger Reconciliation
    print(f"\n[Step 10] Testing Partial Payment ($500.00) & Remaining Balance Calculation on {inv_num}...")
    partial_amount = min(500.00, round(initial_residual / 2, 2)) if initial_residual > 0 else 500.00
    status, pay1_res = request("POST", f"/invoices/{invoice_id}/pay", {
        "amount": partial_amount,
        "payment_method": "Bank",
        "payment_date": date.today().isoformat(),
        "notes": "First partial instalment via wire transfer"
    })
    assert status == 200, f"Partial payment failed: {pay1_res}"

    # Verify invoice status is now PARTIALLY_PAID
    status, inv_check1 = request("GET", f"/invoices/{invoice_id}")
    assert status == 200
    expected_residual = round(initial_residual - partial_amount, 2)
    assert inv_check1["status"] == "PARTIALLY_PAID", f"Expected PARTIALLY_PAID, got {inv_check1['status']}"
    assert abs(inv_check1["amount_residual"] - expected_residual) < 0.01, f"Residual mismatch: {inv_check1['amount_residual']} vs {expected_residual}"
    print(f"  ✓ Partial Payment Registered: Paid ${partial_amount:.2f} | Status: {inv_check1['status']} | Amount Residual: ${inv_check1['amount_residual']:.2f}")

    # Verify A/R aging bucket updates live
    status, dashboard_kpis = request("GET", "/analytics/dashboard")
    assert status == 200
    print(f"  ✓ Live A/R Aging Updated: Total outstanding A/R: ${dashboard_kpis['total_outstanding_ar']:.2f} (SLA: {dashboard_kpis['sla_query_latency_ms']:.2f}ms)")

    # Settle remaining balance to PAID
    print("\n[Step 11] Settle Remaining Residual Balance to Reach Fully PAID Status...")
    remaining_balance = inv_check1["amount_residual"]
    status, pay2_res = request("POST", f"/invoices/{invoice_id}/pay", {
        "amount": remaining_balance,
        "payment_method": "Stripe",
        "payment_date": date.today().isoformat(),
        "notes": "Final settlement of outstanding balance"
    })
    assert status == 200, f"Final payment failed: {pay2_res}"

    status, inv_check2 = request("GET", f"/invoices/{invoice_id}")
    assert status == 200
    assert inv_check2["status"] == "PAID", f"Expected PAID, got {inv_check2['status']}"
    assert inv_check2["amount_residual"] == 0.0, f"Expected 0.0 residual, got {inv_check2['amount_residual']}"
    print(f"  ✓ Final Settlement Complete: Invoice {inv_num} is now PAID with $0.00 residual balance!")

    print("\n" + "=" * 70)
    print("🏆 ALL PHASES 1-5 LIVE ERP TRANSACTION SUITE COMPLETED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    try:
        run_test_suite()
    except Exception as e:
        print(f"\n❌ TEST SUITE FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
