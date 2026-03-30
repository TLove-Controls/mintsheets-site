import subprocess
import re
import os

files = [
    'hvac-business-valuation-calculator/index.html',
    'hvac-energy-savings-calculator/index.html',
    'hvac-service-markup-calculator/index.html',
    'hvac-service-price-calculator/index.html'
]

seo_data = {}

# 1. Extract SEO blocks and Metadata blocks from current broken files
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract metadata (canonical, og tags, and newly replaced description)
    # The new description starts after <title>
    meta_match = re.search(r'(<meta name="description" content="[^"]+">\n<link rel="canonical"[^>]+\/>\n(?:<meta property="og:[^>]+\/>\n){4})', content)
    meta_block = meta_match.group(1) if meta_match else ""
    
    # Also extract the <title> since it might have been updated
    title_match = re.search(r'(<title>[^<]+<\/title>)', content)
    title_block = title_match.group(1) if title_match else ""

    # Extract SEO bottom block 
    seo_match = re.search(r'(<!-- SEO CONTENT SECTION -->\s*<section class="section" id="seo-content">.*?</section>)', content, re.DOTALL)
    seo_block = seo_match.group(1) if seo_match else ""

    seo_data[path] = {
        'meta': meta_block,
        'title': title_block,
        'seo': seo_block
    }

# 2. git checkout the files from the working commit (5e0773e)
subprocess.run(['git', 'checkout', '5e0773e', '--'] + files, check=True)

# 3. Patch the restored files with the saved SEO data and Ad slots
for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # A. Replace title and insert metadata
    # Old title was just <title>...</title>
    old_title_match = re.search(r'<title>[^<]+<\/title>\n*\s*<meta name="description"[^>]+>', content)
    if old_title_match:
        content = content.replace(old_title_match.group(0), seo_data[path]['title'] + '\n' + seo_data[path]['meta'])

    # B. Insert top ad slot
    # Look for <!-- ═══ MAIN SHELL ═══ --> or <!-- SECTION 1 --> 
    # and insert ad-top before it
    if '<!-- ═══ MAIN SHELL ═══ -->' in content:
        content = re.sub(r'(\n\s*<!-- ═══ MAIN SHELL ═══ -->)', r'\n\n  <!-- Ad Placeholder: Top Banner -->\n  <div class="ad-slot ad-top" style="margin-top: 20px;"></div>\1', content)
    elif '<!-- SECTION 1 -->' in content:
        content = re.sub(r'(\n\s*<!-- SECTION 1 -->)', r'\n\n        <!-- Ad Placeholder: Top Banner -->\n        <div class="ad-slot ad-top" style="margin-top: 20px;"></div>\1', content)

    # C. Insert mid ad slot (before SECTION 4 or SECTION 3)
    if '<!-- ─ SECTION 4' in content:
        content = re.sub(r'(\n\s*<!-- ─ SECTION 4)', r'\n\n  <!-- Ad Placeholder: Mid Content -->\n  <div class="ad-slot ad-mid" style="margin-top: 20px;"></div>\1', content)
    elif '<!-- SECTION 4 -->' in content:
        content = re.sub(r'(\n\s*<!-- SECTION 4 -->)', r'\n\n        <!-- Ad Placeholder: Mid Content -->\n        <div class="ad-slot ad-mid" style="margin-top: 20px;"></div>\1', content)
    
    # D. Insert SEO block and bottom ad slot just before </main> or <footer>
    # The structure at the end of these files is typically:
    # </div>
    # </div>
    # </section>
    # <main> or <footer> (in some variants)
    
    # We will insert it just before <footer class="footer"> or <footer>
    footer_idx = content.find('<footer')
    if footer_idx != -1:
        # We need to make sure we close the main section if it's not closed.
        # But wait, checkout 5e0773e means they already HAVE proper HTML structure (</section></main><footer>)
        
        # So we just insert SEO block and ad-bottom BEFORE </main>
        main_close_idx = content.find('</main>')
        if main_close_idx != -1:
            insertion = '\n\n' + seo_data[path]['seo'] + '\n\n  <!-- Ad Placeholder: Bottom Banner -->\n  <div class="ad-slot ad-bottom" style="margin-bottom: 40px;"></div>\n\n'
            content = content[:main_close_idx] + insertion + content[main_close_idx:]
        else:
            # If no </main>, insert before <footer
            insertion = '\n\n' + seo_data[path]['seo'] + '\n\n  <!-- Ad Placeholder: Bottom Banner -->\n  <div class="ad-slot ad-bottom" style="margin-bottom: 40px;"></div>\n\n'
            content = content[:footer_idx] + insertion + content[footer_idx:]

    # E. Update favicon if it still has logo-without-background.png in head
    content = re.sub(r'<link rel="icon" type="image/png" href="([^"]*)logo-without-background\.png">', r'<link rel="icon" type="image/x-icon" href="/brand/favicon.ico">', content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Restored and patched: {path}")

