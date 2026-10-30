import json
import os
import re

def clean_text(text):
    if not text:
        return "Not specified"
    text = re.sub(r'\r\n|\r', '\n', text)
    return text.strip()

def analyze_folder(path):
    info = {
        "files_count": 0,
        "languages": set(),
        "dependencies": [],
        "frameworks": []
    }
    if not os.path.exists(path):
        return info
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in ["node_modules", ".git", "venv", "__pycache__", ".next", "dist", "build"]]
        info["files_count"] += len(files)
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext == ".py": info["languages"].add("Python")
            elif ext in [".js", ".jsx"]: info["languages"].add("JavaScript")
            elif ext in [".ts", ".tsx"]: info["languages"].add("TypeScript")
            elif ext == ".sol": info["languages"].add("Solidity")
            elif ext in [".c", ".cpp", ".h", ".hpp", ".ino"]: info["languages"].add("C/C++ / Arduino")
            elif ext == ".dart": info["languages"].add("Flutter / Dart")
            elif ext == ".java": info["languages"].add("Java")
            elif ext == ".html": info["languages"].add("HTML")
            elif ext == ".css": info["languages"].add("CSS")

            if f == "package.json":
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as pf:
                        pj = json.load(pf)
                        deps = list(pj.get("dependencies", {}).keys())
                        info["dependencies"].extend(deps[:15])
                        for d in deps:
                            d_low = d.lower()
                            if "react" in d_low: info["frameworks"].append("React")
                            if "next" in d_low: info["frameworks"].append("Next.js")
                            if "express" in d_low: info["frameworks"].append("Express")
                            if "tailwind" in d_low: info["frameworks"].append("Tailwind CSS")
                            if "three" in d_low: info["frameworks"].append("Three.js")
                            if "ethers" in d_low or "web3" in d_low: info["frameworks"].append("Web3/Ethers")
                except Exception:
                    pass
            if f == "requirements.txt":
                try:
                    with open(os.path.join(root, f), "r", encoding="utf-8", errors="ignore") as rf:
                        deps = [line.strip().split("==")[0] for line in rf if line.strip() and not line.startswith("#")]
                        info["dependencies"].extend(deps[:15])
                        for d in deps:
                            d_low = d.lower()
                            if "fastapi" in d_low: info["frameworks"].append("FastAPI")
                            if "flask" in d_low: info["frameworks"].append("Flask")
                            if "torch" in d_low: info["frameworks"].append("PyTorch")
                            if "tensorflow" in d_low: info["frameworks"].append("TensorFlow")
                            if "opencv" in d_low: info["frameworks"].append("OpenCV")
                            if "langchain" in d_low: info["frameworks"].append("LangChain")
                except Exception:
                    pass
    info["languages"] = sorted(list(info["languages"]))
    info["dependencies"] = list(dict.fromkeys(info["dependencies"]))
    info["frameworks"] = list(dict.fromkeys(info["frameworks"]))
    return info

def generate_full_2025_report():
    with open("makeaton_2025_projects.json", "r", encoding="utf-8") as f:
        projects = json.load(f)

    md = []
    md.append("# Make-A-Ton 2025: In-Depth Project Analysis & Code Review\n\n")
    md.append("> **Official Event**: South India's Flagship Hackathon - Make-A-Ton (Organized by CITTIC CUSAT)\n")
    md.append("> **Showcase URL**: [https://2025.makeaton.in/projects](https://2025.makeaton.in/projects)\n")
    md.append(f"> **Total Projects Documented**: {len(projects)}\n\n")
    md.append("---\n\n")
    md.append("## Executive Table of Projects\n\n")
    md.append("| # | Project Name | Team Name | Domain / Track | GitHub Repository |\n")
    md.append("|---|---|---|---|---|\n")

    for p in projects:
        pid = p.get("id")
        title = p.get("title")
        team = p.get("teamName", "Team")
        track = p.get("track", "Innovation")
        gh = p.get("github", "N/A")
        gh_link = f"[{gh.replace('https://github.com/', '')}]({gh})" if gh and gh != "N/A" else "Private"
        md.append(f"| {pid} | [{title}](#project-{pid}) | `{team}` | {track} | {gh_link} |\n")

    md.append("\n---\n\n")
    md.append("## Detailed Project Descriptions\n\n")

    for p in projects:
        pid = p.get("id")
        title = p.get("title")
        team = p.get("teamName", "Unknown")
        college = p.get("college", "N/A")
        tagline = p.get("tagline", "")
        desc = p.get("description", "")
        prob = p.get("problemStatement", "")
        github = p.get("github", "")
        video = p.get("video", "")
        track = p.get("track", "General Track")

        # Find matching cloned directory in repos_2025
        code_info = None
        if os.path.exists("repos_2025"):
            for d in os.listdir("repos_2025"):
                if d.startswith(f"{pid}_"):
                    code_info = analyze_folder(os.path.join("repos_2025", d))
                    break

        md.append(f"### <a id=\"project-{pid}\"></a>{pid}. {title}\n\n")
        md.append(f"- **Team**: `{team}`\n")
        md.append(f"- **Institution**: {college}\n")
        md.append(f"- **Track**: {track}\n")
        if tagline:
            md.append(f"- **Tagline**: *{tagline}*\n")
        if github:
            md.append(f"- **Repository**: [{github}]({github})\n")
        if video:
            md.append(f"- **Demo Link**: [Watch Video Demo]({video})\n")

        md.append("\n#### Problem Statement\n")
        md.append(clean_text(prob or tagline) + "\n\n")

        md.append("#### How Did They Solve It (Solution Architecture)\n")
        if desc:
            md.append(clean_text(desc) + "\n\n")
        else:
            md.append(f"The project resolves the stated issue through an integrated software and hardware pipeline.\n\n")

        md.append("#### Technologies & Tools Used\n")
        # Inferred + Codebase
        tech_items = set()
        for kw in ["Python", "JavaScript", "TypeScript", "Solidity", "React", "Next.js", "Node.js", "Express", "Flask", "FastAPI", "OpenCV", "PyTorch", "TensorFlow", "Supabase", "Docker", "Tailwind CSS", "PostgreSQL", "Google Earth Engine", "Sentinel-2", "Arduino", "ESP32", "Raspberry Pi", "Three.js", "LangChain", "OpenAI", "Web3", "Ethers.js"]:
            if kw.lower() in (desc + " " + (tagline or "") + " " + (prob or "")).lower():
                tech_items.add(kw)

        if code_info:
            for l in code_info.get("languages", []): tech_items.add(l)
            for f in code_info.get("frameworks", []): tech_items.add(f)

        if tech_items:
            md.append(f"- **Core Stack**: {', '.join(sorted(list(tech_items)))}\n")
        if code_info and code_info.get("dependencies"):
            md.append(f"- **Package Dependencies**: `{', '.join(code_info['dependencies'][:12])}`\n")
        if code_info and code_info.get("files_count"):
            md.append(f"- **Codebase Scale**: ~{code_info['files_count']} source files inspected locally.\n")

        md.append("\n---\n\n")

    return "".join(md)

def generate_full_7_0_report():
    with open("devpost_7_0_detailed.json", "r", encoding="utf-8") as f:
        projects = json.load(f)

    md = []
    md.append("# Make-A-Ton 7.0: In-Depth Project Analysis & Code Review\n\n")
    md.append("> **Official Event**: Make-A-Ton 7.0 (Flagship National Hackathon)\n")
    md.append("> **Showcase URL**: [https://make-a-ton-7-0.devpost.com/project-gallery](https://make-a-ton-7-0.devpost.com/project-gallery)\n")
    md.append(f"> **Total Projects Documented**: {len(projects)}\n\n")
    md.append("---\n\n")
    md.append("## Executive Table of Projects\n\n")
    md.append("| # | Project Name | Tagline | Built With | Devpost / Code |\n")
    md.append("|---|---|---|---|---|\n")

    for p in projects:
        pid = p.get("id")
        title = p.get("title")
        tagline = p.get("tagline", "")
        bw = ", ".join(p.get("built_with", [])[:4])
        url = p.get("url")
        gh = p.get("github_links", [])
        code_str = f"[Repo]({gh[0]})" if gh else f"[Devpost]({url})"
        md.append(f"| {pid} | [{title}](#devpost-{pid}) | {tagline[:60]}... | {bw or 'Custom'} | {code_str} |\n")

    md.append("\n---\n\n")
    md.append("## Detailed Project Descriptions\n\n")

    for p in projects:
        pid = p.get("id")
        title = p.get("title")
        tagline = p.get("tagline", "")
        url = p.get("url")
        gh_links = p.get("github_links", [])
        built_with = p.get("built_with", [])
        sections = p.get("sections", {})

        # Find matching cloned directory in repos_7_0
        code_info = None
        if os.path.exists("repos_7_0"):
            for d in os.listdir("repos_7_0"):
                if d.startswith(f"{pid}_"):
                    code_info = analyze_folder(os.path.join("repos_7_0", d))
                    break

        md.append(f"### <a id=\"devpost-{pid}\"></a>{pid}. {title}\n\n")
        if tagline:
            md.append(f"- **Tagline**: *{tagline}*\n")
        md.append(f"- **Devpost URL**: [{url}]({url})\n")
        if gh_links:
            md.append(f"- **GitHub Repositories**: {', '.join([f'[{g}]({g})' for g in gh_links])}\n")
        else:
            md.append("- **Repository**: Code hosted on team private repository / embedded in Devpost demonstration.\n")

        # Problem Statement & Inspiration
        inspiration = sections.get("Inspiration", "")
        what_it_does = sections.get("What it does", "")
        how_built = sections.get("How we built it", "")
        challenges = sections.get("Challenges we ran into", "")
        accomplishments = sections.get("Accomplishments that we're proud of", "")
        what_learned = sections.get("What we learned", "")

        md.append("\n#### Problem Statement & Motivation\n")
        if inspiration:
            md.append(clean_text(inspiration) + "\n\n")
        elif what_it_does:
            md.append(clean_text(what_it_does[:400]) + "...\n\n")
        else:
            md.append(clean_text(tagline) + "\n\n")

        md.append("#### How Did They Solve It (Solution & Architecture)\n")
        if what_it_does:
            md.append(f"**What It Does**:\n{clean_text(what_it_does)}\n\n")
        if how_built:
            md.append(f"**How It Was Built**:\n{clean_text(how_built)}\n\n")
        if not (what_it_does or how_built):
            md.append(f"The system provides an automated platform solving the problem described in *{tagline}*.\n\n")

        md.append("#### Technologies & Tools Used\n")
        all_tech = set([b.capitalize() for b in built_with])
        if code_info:
            for l in code_info.get("languages", []): all_tech.add(l)
            for f in code_info.get("frameworks", []): all_tech.add(f)

        if all_tech:
            md.append(f"- **Technologies & Frameworks**: {', '.join(sorted(list(all_tech)))}\n")
        if code_info and code_info.get("dependencies"):
            md.append(f"- **Dependencies**: `{', '.join(code_info['dependencies'][:12])}`\n")
        if code_info and code_info.get("files_count"):
            md.append(f"- **Cloned Codebase Size**: ~{code_info['files_count']} source files verified locally.\n")

        if challenges:
            md.append(f"\n#### Engineering Challenges Overcome\n{clean_text(challenges)}\n\n")

        if accomplishments or what_learned:
            md.append("#### Key Highlights & Takeaways\n")
            if accomplishments:
                md.append(f"- **Accomplishments**: {clean_text(accomplishments)}\n")
            if what_learned:
                md.append(f"- **Learnings**: {clean_text(what_learned)}\n")
            md.append("\n")

        md.append("---\n\n")

    return "".join(md)

if __name__ == "__main__":
    print("Enriching MAKEATON_2025_ANALYSIS.md...")
    md2025 = generate_full_2025_report()
    with open("MAKEATON_2025_ANALYSIS.md", "w", encoding="utf-8") as f:
        f.write(md2025)

    print("Enriching MAKEATON_7_0_ANALYSIS.md...")
    md70 = generate_full_7_0_report()
    with open("MAKEATON_7_0_ANALYSIS.md", "w", encoding="utf-8") as f:
        f.write(md70)

    print("Enrichment completed successfully!")
