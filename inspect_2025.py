import json

with open("makeaton_2025_projects.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

print(f"Total projects in 2025: {len(projects)}")
for p in projects:
    print(f"- ID: {p.get('id')}")
    print(f"  Title: {p.get('title')}")
    print(f"  Team: {p.get('teamName')}")
    print(f"  College: {p.get('college')}")
    print(f"  GitHub: {p.get('github')}")
    print(f"  Video: {p.get('video')}")
    print(f"  Problem: {p.get('problemStatement')}")
    print(f"  Tagline: {p.get('tagline')}")
    print("-" * 40)
