import subprocess
import re
import json

def scrape_devpost_project(url):
    res = subprocess.run(['curl.exe', '-s', '-L', url], capture_output=True, text=True, encoding='utf-8')
    html = res.stdout
    if not html:
        return None

    # GitHub links
    github_matches = set(re.findall(r'href=[\'"](https?://github\.com/[^\'"\s>]+)[\'"]', html))
    github_links = [
        g for g in github_matches
        if "github.com/login" not in g
        and "github.com/join" not in g
        and "github.com/features" not in g
        and not g.endswith(".png")
        and not g.endswith(".jpg")
    ]

    # Built with tags
    built_with = list(set(re.findall(r'/software/built-with/([^\'"\s>]+)', html)))

    # Title
    title_match = re.search(r'<title>(.*?) \| Devpost</title>', html)
    title = title_match.group(1).strip() if title_match else ""

    # Sections: Devpost usually has:
    # <h2>Inspiration</h2> <p>...</p>
    # <h2>What it does</h2> <p>...</p>
    # <h2>How we built it</h2> <p>...</p>
    # <h2>Challenges we ran into</h2> <p>...</p>
    # <h2>Accomplishments that we\'re proud of</h2> <p>...</p>
    # <h2>What we learned</h2> <p>...</p>
    # <h2>What\'s next for ...</h2> <p>...</p>
    sections = {}
    pattern = r'<h2[^>]*>(.*?)</h2>(.*?)(?=<h2|id="built-with"|<footer|<div class="app-details"|$) '
    # Better approach: find all h2 inside #app-details-left
    h2_indices = [(m.start(), m.group(1)) for m in re.finditer(r'<h2[^>]*>(.*?)</h2>', html)]
    for i, (start_idx, h2_title) in enumerate(h2_indices):
        clean_header = re.sub(r'<[^>]+>', '', h2_title).strip()
        end_idx = h2_indices[i+1][0] if i+1 < len(h2_indices) else html.find('id="built-with"', start_idx)
        if end_idx == -1 or end_idx < start_idx:
            end_idx = start_idx + 4000
        sec_content = html[start_idx:end_idx]
        clean_content = re.sub(r'<br\s*/?>', '\n', sec_content)
        clean_content = re.sub(r'<[^>]+>', ' ', clean_content)
        clean_content = re.sub(r'\s+', ' ', clean_content).strip()
        # remove the header itself if at the beginning
        if clean_content.startswith(clean_header):
            clean_content = clean_content[len(clean_header):].strip()
        sections[clean_header] = clean_content

    return {
        "title": title,
        "url": url,
        "github_links": github_links,
        "built_with": built_with,
        "sections": sections
    }

if __name__ == "__main__":
    for test_url in ["https://devpost.com/software/marketingwala", "https://devpost.com/software/our-rupee", "https://devpost.com/software/agent-orange-ai-team-at-your-fingertips"]:
        print("Scraping:", test_url)
        data = scrape_devpost_project(test_url)
        print("  Title:", data["title"])
        print("  GitHub:", data["github_links"])
        print("  Built with:", data["built_with"])
        print("  Headers:", list(data["sections"].keys()))
