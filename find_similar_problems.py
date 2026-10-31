import json

with open('makeaton_2025_projects.json', 'r', encoding='utf-8') as f:
    p2025 = json.load(f)

with open('devpost_7_0_detailed.json', 'r', encoding='utf-8') as f:
    p70 = json.load(f)

terms = ['subscription', 'billing', 'invoice', 'ledger', 'payment', 'erp', 'recurring', 'finance', 'quote', 'quotation']

print('=== 2025 MATCHES ===')
for p in p2025:
    text = (p.get('title','') + ' ' + p.get('tagline','') + ' ' + p.get('description','') + ' ' + p.get('problemStatement','')).lower()
    matches = [t for t in terms if t in text]
    if matches:
        print(f"- [{p.get('id')}] {p.get('title')} | Team: {p.get('teamName')} | Matches: {matches}")
        print(f"  Summary: {p.get('tagline')}")

print('\n=== 7.0 MATCHES ===')
for p in p70:
    sections_text = ' '.join(p.get('sections',{}).values()).lower()
    text = (p.get('title','') + ' ' + p.get('tagline','') + ' ' + sections_text).lower()
    matches = [t for t in terms if t in text]
    if matches:
        print(f"- [{p.get('id')}] {p.get('title')} | Matches: {matches}")
        print(f"  Tagline: {p.get('tagline')}")
