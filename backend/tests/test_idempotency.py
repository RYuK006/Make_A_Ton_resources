import unittest
from datetime import date
from backend.app.database import SessionLocal
from backend.app.engine.billing import execute_billing_day

class TestBillingIdempotency(unittest.TestCase):
    def test_zero_double_billing(self):
        db = SessionLocal()
        today = date.today()

        # Run 1: First billing batch execution
        run_1 = execute_billing_day(db, today)
        print(f"\n[Run 1] Evaluated: {run_1['subscriptions_evaluated']}, Generated: {run_1['invoices_generated']}, Skipped: {run_1['duplicates_skipped']} in {run_1['execution_time_ms']}ms")

        # Run 2: Exact duplicate re-execution (simulating crash retry or accidental re-trigger)
        run_2 = execute_billing_day(db, today)
        print(f"[Run 2] Evaluated: {run_2['subscriptions_evaluated']}, Generated: {run_2['invoices_generated']}, Skipped: {run_2['duplicates_skipped']} in {run_2['execution_time_ms']}ms")

        db.close()

        # Mathematical Idempotency Assertion:
        # Second run MUST NOT generate any new invoices for already billed cycles
        self.assertEqual(run_2["invoices_generated"], 0, "Idempotency failure: New invoices were generated on re-run!")
        print("Idempotency guarantee verified: 0 double-billing detected.")

if __name__ == "__main__":
    unittest.main()
