import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
            with open(filepath, 'r', encoding='latin-1') as f:
                content = f.read()
        except Exception as e:
            print(f"Skipping {filepath}: {e}")
            return

    modified = False
    
    # 1. Fix unclosed H1 tags
    # Find <h1 ...> followed by content and potentially a newline, but no </h1> before the next major tag.
    # We'll do a simpler match first: <h1 ...> that doesn't have </h1> on the same line or next line.
    lines = content.splitlines()
    new_lines = []
    for line in lines:
        if '<h1' in line and '</h1>' not in line:
            print(f"Found unclosed <h1> in {filepath}")
            # Close it immediately at the end of the line
            line = line + "</h1>"
            modified = True
        new_lines.append(line)
    
    if modified:
        content = '\n'.join(new_lines)

    # 2. Fix the specific Bid Calculator large text issue (inline styles)
    if 'hvac-bid-calculator' in filepath:
        if '<h1 style="margin: 10px auto; max-width: none;">' in content:
            content = content.replace('<h1 style="margin: 10px auto; max-width: none;">', '<h1>')
            modified = True
        
    # 3. Fix encoding of sticky ad close button (&times; instead of Ã—)
    if 'Ã—' in content:
        print(f"Fixing encoding in {filepath}")
        content = content.replace('Ã—', '&times;')
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

def main():
    for root, dirs, files in os.walk('.'):
        if any(x in root for x in ['node_modules', '.git', 'brand']):
            continue
        for file in files:
            if file == 'index.html':
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
