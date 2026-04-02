import sys
import os

path = r'c:\Users\Tyler\Documents\GITHUB_PROJECTS\mintsheets-site\hvac-labor-cost-calculator\index.html'
with open(path, 'rb') as f:
    content = f.read()
    # Try to decode safely
    try:
        text = content.decode('utf-8', errors='replace')
        print(text)
    except Exception as e:
        print(f"Error: {e}")
