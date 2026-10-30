import json
import os
import shutil
import subprocess
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open("all_repos_to_clone.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

def clean_dirname(name):
    # remove invalid characters for windows path
    clean = re.sub(r'[\\/*?:"<>|]', "", name).strip()
    clean = clean.replace(" ", "_")
    return clean[:40]

def analyze_cloned_repo(repo_path):
    tech_findings = {
        "files_count": 0,
        "languages": set(),
        "frameworks": [],
        "dependencies": [],
        "has_docker": False,
        "readme_snippet": ""
    }
    
    if not os.path.exists(repo_path):
        return tech_findings
        
    for root, dirs, files in os.walk(repo_path):
        tech_findings["files_count"] += len(files)
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in [".py"]:
                tech_findings["languages"].add("Python")
            elif ext in [".js", ".jsx"]:
                tech_findings["languages"].add("JavaScript")
            elif ext in [".ts", ".tsx"]:
                tech_findings["languages"].add("TypeScript")
            elif ext in [".sol"]:
                tech_findings["languages"].add("Solidity")
            elif ext in [".java"]:
                tech_findings["languages"].add("Java")
            elif ext in [".cpp", ".c", ".h", ".hpp", ".ino"]:
                tech_findings["languages"].add("C/C++ / Arduino")
            elif ext in [".html", ".css"]:
                tech_findings["languages"].add("HTML/CSS")
            elif ext in [".dart"]:
                tech_findings["languages"].add("Dart / Flutter")
            elif ext in [".swift"]:
                tech_findings["languages"].add("Swift")
            elif ext in [".kt"]:
                tech_findings["languages"].add("Kotlin")

            if f.lower() == "dockerfile":
                tech_findings["has_docker"] = True
            
            # Check package.json
            if f == "package.json":
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as pj:
                        pj_data = json.load(pj)
                        deps = list(pj_data.get("dependencies", {}).keys()) + list(pj_data.get("devDependencies", {}).keys())
                        tech_findings["dependencies"].extend(deps[:15])
                        for d in deps:
                            if "react" in d: tech_findings["frameworks"].append("React")
                            if "next" in d: tech_findings["frameworks"].append("Next.js")
                            if "express" in d: tech_findings["frameworks"].append("Express.js")
                            if "vue" in d: tech_findings["frameworks"].append("Vue.js")
                            if "tailwind" in d: tech_findings["frameworks"].append("TailwindCSS")
                            if "three" in d: tech_findings["frameworks"].append("Three.js")
                            if "ethers" in d or "web3" in d: tech_findings["frameworks"].append("Web3/Ethers")
                except Exception:
                    pass

            # Check requirements.txt
            if f == "requirements.txt":
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as rf:
                        lines = [line.strip().split("==")[0].split(">=")[0] for line in rf if line.strip() and not line.startswith("#")]
                        tech_findings["dependencies"].extend(lines[:15])
                        for l in lines:
                            l_low = l.lower()
                            if "flask" in l_low: tech_findings["frameworks"].append("Flask")
                            if "fastapi" in l_low: tech_findings["frameworks"].append("FastAPI")
                            if "django" in l_low: tech_findings["frameworks"].append("Django")
                            if "torch" in l_low: tech_findings["frameworks"].append("PyTorch")
                            if "tensorflow" in l_low: tech_findings["frameworks"].append("TensorFlow")
                            if "opencv" in l_low: tech_findings["frameworks"].append("OpenCV")
                            if "langchain" in l_low: tech_findings["frameworks"].append("LangChain")
                            if "openai" in l_low: tech_findings["frameworks"].append("OpenAI API")
                except Exception:
                    pass

            # Read snippet from main README
            if f.lower() in ["readme.md", "readme.txt"] and not tech_findings["readme_snippet"] and root == repo_path:
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as rmf:
                        tech_findings["readme_snippet"] = rmf.read(2000)
                except Exception:
                    pass

    tech_findings["languages"] = list(tech_findings["languages"])
    tech_findings["frameworks"] = list(dict.fromkeys(tech_findings["frameworks"]))
    tech_findings["dependencies"] = list(dict.fromkeys(tech_findings["dependencies"]))
    return tech_findings

def clone_set(repo_list, dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    results = []
    for idx, item in enumerate(repo_list, 1):
        url = item["repo_url"]
        folder_base = clean_dirname(f"{item.get('project_id', idx)}_{item['title']}")
        target_path = os.path.join(dest_dir, folder_base)
        print(f"[{idx}/{len(repo_list)}] Processing {item['title']} -> {target_path}")

        # If it's an organization url like https://github.com/orgs/make-a-ton-samurai/repositories
        if "/orgs/" in url:
            url = "https://github.com/make-a-ton-samurai/riskrank-web"

        success = False
        if not os.path.exists(target_path):
            print(f"  Cloning {url}...")
            # Try git clone --depth 1
            cmd = ["git", "clone", "--depth", "1", url, target_path]
            p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
            if p.returncode == 0:
                print(f"  Successfully cloned {url}")
                success = True
            else:
                print(f"  Clone failed: {p.stderr.strip()[:100]}")
                success = False
        else:
            print("  Already exists.")
            success = True

        # Remove internal .git so parent repo can commit it
        internal_git = os.path.join(target_path, ".git")
        if os.path.exists(internal_git):
            try:
                # Remove read-only attributes if needed on windows
                def on_rm_error(func, path, exc_info):
                    import stat
                    os.chmod(path, stat.S_IWRITE)
                    func(path)
                shutil.rmtree(internal_git, onerror=on_rm_error)
            except Exception as e:
                print(f"  Could not remove .git folder: {e}")

        analysis = analyze_cloned_repo(target_path) if success else {}
        results.append({
            **item,
            "target_dir": target_path,
            "clone_status": "Success" if success else "Failed / Private / Unavailable",
            "repo_analysis": analysis
        })
    return results

if __name__ == "__main__":
    print("--- Cloning Make-a-Ton 2025 Repositories ---")
    res_2025 = clone_set(manifest["2025"], "repos_2025")
    with open("results_2025_cloned.json", "w", encoding="utf-8") as f:
        json.dump(res_2025, f, indent=2)

    print("\n--- Cloning Make-a-Ton 7.0 Repositories ---")
    res_7_0 = clone_set(manifest["7_0"], "repos_7_0")
    with open("results_7_0_cloned.json", "w", encoding="utf-8") as f:
        json.dump(res_7_0, f, indent=2)

    print("\nCloning and code analysis completed!")
