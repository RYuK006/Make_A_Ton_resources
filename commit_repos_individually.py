import os
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

def commit_dirs_in(base_dir, edition_label):
    if not os.path.exists(base_dir):
        return
    entries = sorted(os.listdir(base_dir))
    for idx, name in enumerate(entries, 1):
        target_path = os.path.join(base_dir, name)
        if not os.path.isdir(target_path):
            continue
        print(f"[{idx}/{len(entries)}] Committing {target_path}...", flush=True)
        # stage this specific directory
        subprocess.run(["git", "add", target_path], capture_output=True)
        # check if there's anything staged
        diff_check = subprocess.run(["git", "diff", "--cached", "--name-only"], capture_output=True, text=True)
        if diff_check.stdout.strip():
            msg = f"feat({edition_label}): import cloned codebase for {name}"
            subprocess.run(["git", "commit", "-m", msg], capture_output=True)
            print(f"  Committed: {msg}", flush=True)
        else:
            print("  No changes to commit.", flush=True)

if __name__ == "__main__":
    print("--- Committing 2025 Repositories One-By-One ---", flush=True)
    commit_dirs_in("repos_2025", "makeaton-2025")
    print("\n--- Committing 7.0 Repositories One-By-One ---", flush=True)
    commit_dirs_in("repos_7_0", "makeaton-7.0")
    print("\nAll repositories committed one-by-one!", flush=True)
