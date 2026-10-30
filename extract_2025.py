import urllib.request
import re
import json

url = 'https://2025.makeaton.in/assets/index-BC9p98ah.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
data = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# find JSON.parse(`[...]`)
start_token = "JSON.parse(`["
start_idx = data.find(start_token)
if start_idx != -1:
    end_token = "]`)"
    end_idx = data.find(end_token, start_idx)
    json_str = data[start_idx + len("JSON.parse(`") : end_idx + 1]
    projects = json.loads(json_str)
    print(f"Extracted {len(projects)} projects from 2025.makeaton.in")
    with open("makeaton_2025_projects.json", "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)
    for p in projects:
        print(f"ID {p.get('id')}: {p.get('title')} | Team: {p.get('teamName')} | GitHub: {p.get('github')}")
else:
    print("Could not find start token")
