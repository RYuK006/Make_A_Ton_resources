import json
import os
import shutil
import subprocess
import sys
import re
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')

with open("all_repos_to_clone.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

def clean_dirname(name):
    clean = re.sub(r'[\\/*?:"<>|]', "", name).strip()
    clean = clean.replace(" ", "_")
    return clean[:45]

def is_repo_public(url):
    try:
        res = subprocess.run(
            ['curl.exe', '-s', '-o', 'NUL', '-w', '%{http_code}', '-L', url],
            capture_output=True, text=True, timeout=8
        )
        return res.stdout.strip() == "200"
    except Exception:
        return False

def clone_single_repo(item, dest_dir):
    url = item["repo_url"]
    folder_base = clean_dirname(f"{item.get('project_id', 1)}_{item['title']}")
    target_path = os.path.join(dest_dir, folder_base)

    if "/orgs/" in url:
        url = "https://github.com/make-a-ton-samurai/riskrank-web"

    if os.path.exists(target_path) and os.listdir(target_path):
        # Already cloned
        return (item["title"], True, "Already exists")

    print(f"Checking {item['title']} ({url})...", flush=True)
    if not is_repo_public(url):
        print(f"  -> Repository not publicly accessible: {url}", flush=True)
        return (item["title"], False, "404 or Private")

    print(f"Cloning {url} into {target_path}...", flush=True)
    env = {**os.environ, "GIT_TERMINAL_PROMPT": "0"}
    cmd = [
        "git",
        "-c", "credential.helper=",
        "-c", "core.askPass=",
        "clone",
        "--depth", "1",
        url,
        target_path
    ]
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, env=env, timeout=15)
        if p.returncode == 0:
            print(f"  -> Cloned successfully: {item['title']}", flush=True)
            # Remove .git
            internal_git = os.path.join(target_path, ".git")
            if os.path.exists(internal_git):
                def on_rm_error(func, path, exc_info):
                    import stat
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                shutil.rmtree(internal_git, onerror=on_rm_error)
            return (item["title"], True, "Cloned successfully")
        else:
            if os.path.exists(target_path):
                shutil.rmtree(target_path, ignore_errors=True)
            return (item["title"], False, p.stderr.strip()[:60])
    except subprocess.TimeoutExpired:
        if os.path.exists(target_path):
            shutil.rmtree(target_path, ignore_errors=True)
        return (item["title"], False, "Timeout after 15s")
    except Exception as e:
        if os.path.exists(target_path):
            shutil.rmtree(target_path, ignore_errors=True)
        return (item["title"], False, str(e))

if __name__ == "__main__":
    os.makedirs("repos_2025", exist_ok=True)
    os.makedirs("repos_7_0", exist_ok=True)

    print("--- Cloning Remaining 2025 Repositories ---", flush=True)
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures_2025 = [executor.submit(clone_single_repo, item, "repos_2025") for item in manifest["2025"]]
        for f in futures_2025:
            res = f.result()
            print(f"Result: {res[0]} -> {res[2]}", flush=True)

    print("\n--- Cloning Remaining 7.0 Repositories ---", flush=True)
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures_7_0 = [executor.submit(clone_single_repo, item, "repos_7_0") for item in manifest["7_0"]]
        for f in futures_7_0:
            res = f.result()
            print(f"Result: {res[0]} -> {res[2]}", flush=True)

    print("\nFast cloning finished!", flush=True)
