import subprocess
import re
import json
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

with open("devpost_7_0_projects.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

print(f"Loaded {len(projects)} projects to scrape...")

detailed_projects = []

for idx, p in enumerate(projects, 1):
    url = p["url"]
    print(f"[{idx}/{len(projects)}] Fetching {p['title']} ({url})...")
    res = subprocess.run(['curl.exe', '-s', '-L', url], capture_output=True, text=True, encoding='utf-8')
    html = res.stdout
    if not html:
        print(f"  Warning: empty response for {url}")
        detailed_projects.append(p)
        continue

    # Extract GitHub links
    github_matches = set(re.findall(r'href=[\'"](https?://github\.com/[^\'"\s>]+)[\'"]', html))
    github_links = []
    for g in github_matches:
        g = g.split('#')[0].rstrip('/')
        if (
            "github.com/login" not in g
            and "github.com/join" not in g
            and "github.com/features" not in g
            and "github.com/site" not in g
            and not g.endswith(".png")
            and not g.endswith(".jpg")
            and not g.endswith(".svg")
            and len(g.replace("https://github.com/", "").split("/")) >= 2
        ):
            github_links.append(g)

    # Built with
    built_with = list(dict.fromkeys(re.findall(r'/software/built-with/([^\'"\s>]+)', html)))

    # Parse sections
    sections = {}
    h2_matches = list(re.finditer(r'<h2[^>]*>(.*?)</h2>', html, re.DOTALL))
    for i, m in enumerate(h2_matches):
        raw_header = m.group(1)
        clean_header = re.sub(r'<[^>]+>', '', raw_header).strip()
        start = m.end()
        end = h2_matches[i+1].start() if i+1 < len(h2_matches) else html.find('id="built-with"', start)
        if end == -1 or end < start:
            end = html.find('</article>', start)
        if end == -1 or end < start:
            end = start + 4000
        content_chunk = html[start:end]
        # Clean text
        clean_chunk = re.sub(r'<br\s*/?>', '\n', content_chunk)
        clean_chunk = re.sub(r'</p>', '\n', clean_chunk)
        clean_chunk = re.sub(r'<[^>]+>', ' ', clean_chunk)
        clean_chunk = re.sub(r'[ \t]+', ' ', clean_chunk)
        clean_chunk = re.sub(r'\n\s*\n', '\n', clean_chunk).strip()
        if clean_header and clean_chunk:
            sections[clean_header] = clean_chunk

    p_detail = {
        **p,
        "github_links": list(set(github_links)),
        "built_with": built_with,
        "sections": sections
    }
    detailed_projects.append(p_detail)
    # Be polite to Devpost servers
    time.sleep(0.3)

with open("devpost_7_0_detailed.json", "w", encoding="utf-8") as f:
    json.dump(detailed_projects, f, indent=2, ensure_ascii=False)

print(f"Successfully scraped and saved {len(detailed_projects)} detailed projects to devpost_7_0_detailed.json")
