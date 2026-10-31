import sys
import os

pdf_path = r"C:\Users\Aaron\Downloads\Subscription_Management_System.pdf"

try:
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    text = []
    for i, p in enumerate(reader.pages):
        text.append(f"--- PAGE {i+1} ---\n" + p.extract_text())
    full_text = "\n\n".join(text)
except Exception as e:
    full_text = f"Error with pypdf: {e}"

with open("subscription_management_system_text.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

print(full_text[:3000])
