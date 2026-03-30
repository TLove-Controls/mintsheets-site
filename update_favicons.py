import os
import re

directory = 'c:/Users/Tyler/Documents/mintsheets-site'
pattern = re.compile(r'<link rel="icon" type="image/png" href="[^"]*logo-without-background\.png">')

for root, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub('<link rel="icon" type="image/x-icon" href="/brand/favicon.ico">', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
