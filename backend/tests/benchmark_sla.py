import time
from backend.app.database import SessionLocal
from backend.app.engine.analytics import get_dashboard_metrics
from backend.app.models import Subscription, Invoice

def benchmark_analytics_sla():
    db = SessionLocal()
    sub_count = db.query(Subscription).count()
    inv_count = db.query(Invoice).count()

    print(f"--- Benchmark: SLA Query Latency (<2.0s Requirement) ---")
    print(f"Database Size: {sub_count} Subscriptions, {inv_count} Invoices")

    latencies = []
    iterations = 10

    for i in range(iterations):
        t0 = time.perf_counter()
        metrics = get_dashboard_metrics(db)
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        latencies.append(elapsed_ms)

    avg_ms = sum(latencies) / len(latencies)
    min_ms = min(latencies)
    max_ms = max(latencies)

    print(f"Results across {iterations} runs:")
    print(f"  Min Latency:     {min_ms:.2f} ms")
    print(f"  Max Latency:     {max_ms:.2f} ms")
    print(f"  Average Latency: {avg_ms:.2f} ms")
    print(f"  MRR Calculated:  ${metrics['mrr']:,.2f}")
    print(f"  ARR Calculated:  ${metrics['arr']:,.2f}")
    print(f"  Active Subs:     {metrics['active_subscribers_count']:,}")
    print(f"  Outstanding AR:  ${metrics['total_outstanding_ar']:,.2f}")

    for b in metrics['aging_buckets']:
        print(f"    - {b['bucket']}: {b['count']} invoices (${b['total_amount']:,.2f})")

    # Assert SLA benchmark
    SLA_BENCHMARK_MS = 2000.0 # 2.0s requirement
    CHAMPIONSHIP_TARGET_MS = 80.0

    assert avg_ms < SLA_BENCHMARK_MS, f"SLA Failed! {avg_ms:.2f}ms >= 2000ms"
    print(f"\nSUCCESS: Average query time of {avg_ms:.2f}ms destroys the 2.0s SLA requirement!")
    if avg_ms < CHAMPIONSHIP_TARGET_MS:
        print(f"CHAMPIONSHIP STATUS: Beats <80ms ultra-performance target!")

    db.close()

if __name__ == "__main__":
    benchmark_analytics_sla()
