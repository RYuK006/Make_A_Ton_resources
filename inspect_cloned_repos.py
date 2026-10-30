import os
import json

base_dir = "repos_2025"
if not os.path.exists(base_dir):
    print("repos_2025 does not exist yet")
    exit(0)

entries = sorted(os.listdir(base_dir))
print(f"Total cloned repos in {base_dir}: {len(entries)}")

repo_summaries = {}

for name in entries:
    repo_path = os.path.join(base_dir, name)
    if not os.path.isdir(repo_path):
        continue
    
    file_list = []
    has_package_json = False
    has_requirements = False
    deps = []
    
    for root, dirs, files in os.walk(repo_path):
        # ignore node_modules or .git if any
        dirs[:] = [d for d in dirs if d not in ["node_modules", ".git", "venv", "__pycache__"]]
        for f in files:
            rel = os.path.relpath(os.path.join(root, f), repo_path)
            file_list.append(rel)
            if f == "package.json":
                has_package_json = True
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as pf:
                        pjd = json.load(pf)
                        deps.extend(list(pjd.get("dependencies", {}).keys()))
                except Exception:
                    pass
            if f == "requirements.txt":
                has_requirements = True
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as rf:
                        deps.extend([line.strip().split("==")[0] for line in rf if line.strip() and not line.startswith("#")])
                except Exception:
                    pass

    repo_summaries[name] = {
        "files_count": len(file_list),
        "sample_files": file_list[:12],
        "has_package_json": has_package_json,
        "has_requirements": has_requirements,
        "dependencies": list(dict.fromkeys(deps))[:15]
    }

with open("repo_summaries_2025.json", "w", encoding="utf-8") as f:
    json.dump(repo_summaries, f, indent=2)

print("Saved summaries for", len(repo_summaries), "repositories to repo_summaries_2025.json")
