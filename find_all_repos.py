import json
import re

with open("makeaton_2025_projects.json", "r", encoding="utf-8") as f:
    projects_2025 = json.load(f)

with open("devpost_7_0_detailed.json", "r", encoding="utf-8") as f:
    projects_7_0 = json.load(f)

print(f"Make-a-Ton 2025 projects: {len(projects_2025)}")
print(f"Make-a-Ton 7.0 projects: {len(projects_7_0)}")

repos_2025 = []
for p in projects_2025:
    gh = p.get("github")
    if gh:
        gh = gh.strip().rstrip('/')
        if not gh.startswith("http"):
            gh = "https://" + gh
        if "/tree/" in gh:
            gh = gh.split("/tree/")[0]
        repos_2025.append({
            "project_id": p.get("id"),
            "title": p.get("title"),
            "team": p.get("teamName"),
            "repo_url": gh,
            "source": "2025.makeaton.in"
        })

repos_7_0 = []
for p in projects_7_0:
    links = p.get("github_links", [])
    for l in links:
        l = l.strip().rstrip('/')
        if not l.startswith("http"):
            l = "https://" + l
        if "/tree/" in l:
            l = l.split("/tree/")[0]
        repos_7_0.append({
            "project_id": p.get("id"),
            "title": p.get("title"),
            "repo_url": l,
            "source": "devpost-7.0"
        })

print(f"Found {len(repos_2025)} repos in 2025 edition")
print(f"Found {len(repos_7_0)} repos in 7.0 edition")

with open("all_repos_to_clone.json", "w", encoding="utf-8") as f:
    json.dump({"2025": repos_2025, "7_0": repos_7_0}, f, indent=2)

print("Saved repository manifest to all_repos_to_clone.json")
