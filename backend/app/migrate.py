import sqlite3
from pathlib import Path

DB_PATH = Path("backend/data/brightloop.db")

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    def add_col(table, col, col_def):
        cols = [c[1] for c in cur.execute(f"PRAGMA table_info({table})").fetchall()]
        if col not in cols:
            cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_def}")
            print(f"Added {col} to {table}")

    add_col("products", "type", "VARCHAR(50) DEFAULT 'Service'")
    add_col("products", "cost_price", "FLOAT DEFAULT 0.0")
    add_col("products", "notes", "TEXT")

    add_col("plans", "min_quantity", "INTEGER DEFAULT 1")
    add_col("plans", "valid_from", "DATE")
    add_col("plans", "valid_until", "DATE")

    conn.commit()
    conn.close()
    print("Migration completed successfully!")

if __name__ == "__main__":
    migrate()
