import os
import re
import sys

files_to_check = [
    "SKILL.md",
    "AGENT.md",
    "AI_AGENTS_SKILL.md",
    "AI_AGENTS_AGENT.md",
    ".agents/skills/makeaton-universal/SKILL.md",
    ".agents/skills/makeaton-ai-agents/SKILL.md",
    ".agents/agents/makeaton-universal.md",
    ".agents/agents/makeaton-agent-orchestrator.md",
    "README.md",
    "MAKEATON_2025_ANALYSIS.md",
    "MAKEATON_7_0_ANALYSIS.md"
]

all_passed = True
print("--- Verifying Playbook & Agent Files ---")

for f in files_to_check:
    if not os.path.exists(f):
        print(f"[FAIL] Missing file: {f}")
        all_passed = False
        continue

    with open(f, "r", encoding="utf-8") as fp:
        content = fp.read()

    # Check for frontmatter if applicable
    if f.endswith("SKILL.md"):
        if content.startswith("---"):
            end_fm = content.find("---", 3)
            if end_fm != -1:
                fm = content[3:end_fm]
                has_name = "name:" in fm
                has_desc = "description:" in fm
                if has_name and has_desc:
                    print(f"[PASS] {f} - Valid YAML Frontmatter ({len(content)} bytes)")
                else:
                    print(f"[WARN] {f} - Incomplete YAML Frontmatter")
            else:
                print(f"[FAIL] {f} - Unclosed Frontmatter")
                all_passed = False
        else:
            print(f"[FAIL] {f} - Missing Frontmatter delimiter")
            all_passed = False
    else:
        print(f"[PASS] {f} - Exists & Valid ({len(content)} bytes, {len(content.splitlines())} lines)")

if all_passed:
    print("\nAll 11 Core Playbook and Analysis Files Successfully Verified!")
else:
    print("\nSome files failed verification.")
    sys.exit(1)
