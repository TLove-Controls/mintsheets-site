const fs = require('fs');

let html = fs.readFileSync('c:/Users/Tyler/Documents/GITHUB_PROJECTS/mintsheets-site/hvac-bid-calculator/index.html', 'utf8');

// 1. ADD CHARSET TO HEAD
if (!html.includes('<meta charset="UTF-8">') && !html.includes('<meta charset="utf-8">')) {
    html = html.replace('<head>', '<head>\\n<meta charset="UTF-8">');
}

// 2. FIX BREADCRUMBS
html = html.replace(/<span><\\/span>/g, '<span class="separator">&rsaquo;</span>');

// 3. REWRITE HERO & SECTION 1
const mainRegex = /<main>[\\s\\S]*?<div class="content">/;
const newTop = \`<main>
  <div class="breadcrumb-bar">
    <div class="container">
      <a href="/">Home</a><span class="separator">›</span>
      <a href="/hvac-calculators/">HVAC Calculators</a><span class="separator">›</span>
      HVAC Bid Calculator
    </div>
  </div>

  <div class="container notice-container" style="margin-top: 20px;">
    <div style="background: rgba(46, 204, 113, 0.12); border: 1px solid rgba(46, 204, 113, 0.35); border-radius: 10px; padding: 12px 14px; color: #DCFFEA; font-size: 14px; line-height: 1.45;">
      <strong>Notice:</strong> This HVAC calculator provides estimates only and is for informational purposes. Results should be verified by a licensed HVAC professional. Use at your own risk.
    </div>
  </div>

  <section class="section" style="padding-top: 20px;">
    <div class="container section-card">
      <div style="margin-bottom: 30px; text-align: center;">
        <div class="eyebrow">Business Tool</div>
        <h1 style="margin-bottom: 25px;">HVAC Bid Calculator (Estimate, Pricing & Profit Margin)</h1>
        
        <!-- Ad Placeholder: Top Banner -->
        <div class="ad-placeholder ad-placeholder-top">
          <span>Advertisement</span>
        </div>
        
        <!-- Ad Placeholder: Above Calculator -->
        <div class="ad-placeholder ad-placeholder-tool" style="margin-top: 30px;">
          <span>Advertisement</span>
        </div>
      </div>

      <h2 class="section-header" style="background: rgba(46, 204, 113, 0.05); padding: 12px 18px; border-left: 4px solid var(--primary); border-radius: 4px; margin: 0 0 20px; font-size: 18px; color: #fff; text-align: left; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);"><span class="icon" style="margin-right:8px;">📋</span> SECTION 1 &mdash; JOB INFORMATION</h2>
      
      <div class="content">\`;
html = html.replace(mainRegex, newTop);

// 4. FIX SECTIONS 2-6 (remove tool ad and the floating </div>, fix headers)
function fixSection(html, icon, num, title, extra = '') {
    const robustRegex = new RegExp(\`<!-- Ad Placeholder: Above Calculator -->\\\\s*<div class="ad-placeholder ad-placeholder-tool">\\\\s*<span>Advertisement</span>\\\\s*</div>\\\\s*(?:<!--[^>]*-->\\\\s*)*(?:<span class="icon">.*?<\\\\/span>)?\\\\s*SECTION \${num}[^a-zA-Z0-9]*\${title}.*?<\\\\/div>\`, 'g');
    
    let extraHtml = extra ? \`<span class="highlight" style="font-size: 11px; margin-left: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(34, 211, 238, 0.15); color: var(--accent); white-space: nowrap; vertical-align: middle;">\${extra}</span>\` : '';
    
    let replacement = \`<h2 class="section-header" style="background: rgba(46, 204, 113, 0.05); padding: 12px 18px; border-left: 4px solid var(--primary); border-radius: 4px; margin: 30px 0 20px; font-size: 18px; color: #fff; text-align: left; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.05);"><span class="icon" style="margin-right:8px;">\${icon}</span> SECTION \${num} &mdash; \${title}\${extraHtml}</h2>\`;

    return html.replace(robustRegex, replacement);
}

html = fixSection(html, '🔧', '2', 'SYSTEM SPECIFICATIONS');
html = fixSection(html, '💰', '3', 'MATERIALS &amp; LABOR LINE ITEMS');
html = fixSection(html, '📊', '4', 'PRICING SUMMARY &amp; MARGIN CONTROL');
html = fixSection(html, '🏆', '5', 'GOOD / BETTER / BEST PROPOSAL TIERS', 'Auto-Calculated');
html = fixSection(html, '📝', '6', 'BID TRACKING &amp; FOLLOW-UP LOG');

// 5. REMOVE DUPLICATE BOTTOM AD
html = html.replace(/<div class="workflow-chain">[\\s\\S]*?<\\/div>[\\s\\S]*?(<!-- Ad Placeholder: Bottom Banner -->\\s*<div class="ad-placeholder ad-placeholder-bottom">\\s*<span>Advertisement<\\/span>\\s*<\\/div>)/, (match, p1) => {
    return match.replace(p1, '');
});

// 6. FIX BUGGY ICONS / JSON CORRUPTED STRINGS (manual replace)
// The breadcrumb weird character was already addressed.
// The workflow title icon (üöî)
html = html.replace(/<div class="workflow-title"><span>.*?<\\/span> Professional Workflow Navigation<\\/div>/, '<div class="workflow-title"><span>🔄</span> Professional Workflow Navigation</div>');
// Buttons
html = html.replace(/<button class="btn btn-primary" onclick="saveBid\\(\\)">.*?Save to Log<\\/button>/, '<button class="btn btn-primary" onclick="saveBid()">💾 Save to Log</button>');
html = html.replace(/<button class="btn btn-orange" onclick="window\\.print\\(\\)">.*?Print \\/ Save PDF<\\/button>/, '<button class="btn btn-orange" onclick="window.print()">🖨️ Print / Save PDF</button>');
html = html.replace(/<button class="btn btn-steel" onclick="clearAll\\(\\)">.*?Clear All<\\/button>/, '<button class="btn btn-steel" onclick="clearAll()">🗑️ Clear All</button>');
// Pro Tips heading (üí°)
html = html.replace(/<strong>.*?Pro Tips for Winning More Bids<\\/strong>/, '<strong>⚡ Pro Tips for Winning More Bids</strong>');
// Good Better Best Tier icons (⬛ 🥈 🥇)
// Actually we'll just rewrite the tier cards.
const tierRegex = /<div class="tier-grid">[\\s\\S]*?<div class="divider"><\\/div>/;
const newTiers = \`<div class="tier-grid">
    <div class="tier-card good">
      <div class="tier-header">⬛ GOOD</div>
      <div class="tier-price" id="t-good">$0<small>Standard Efficiency</small></div>
      <ul class="tier-features">
        <li>Base system (14.3 SEER2)</li>
        <li>Standard 1-yr parts &amp; labor</li>
        <li>Basic digital thermostat</li>
        <li>Standard installation</li>
      </ul>
    </div>
    <div class="tier-card">
      <div class="tier-header">🥈 BETTER</div>
      <div class="tier-price" id="t-better">$0<small>Mid Efficiency (+8%)</small></div>
      <ul class="tier-features">
        <li>16 SEER2 system</li>
        <li>2-yr parts &amp; labor warranty</li>
        <li>Smart thermostat included</li>
        <li>Premium air filter</li>
      </ul>
    </div>
    <div class="tier-card best">
      <div class="tier-header">🥇 BEST</div>
      <div class="tier-price" id="t-best">$0<small>High Efficiency (+18%)</small></div>
      <ul class="tier-features">
        <li>18+ SEER2 system</li>
        <li>5-yr parts &amp; labor warranty</li>
        <li>Smart thermostat + zoning</li>
        <li>UV air purifier included</li>
        <li>Annual tune-up included</li>
      </ul>
    </div>
  </div>

  <div class="divider"></div>\`;
html = html.replace(tierRegex, newTiers);

// Now grab external JS correctly replacing backticks with standard quotes.
const newJS = \`    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (document.querySelectorAll('#materialBody tr').length === 0) {
                addRow('material');
            }
            if (document.querySelectorAll('#laborBody tr').length === 0) {
                addRow('labor');
            }
            recalc();
        });

        function addRow(type) {
            const body = document.getElementById(type + 'Body');
            const row = document.createElement('tr');
            if (type === 'material') {
                row.innerHTML = 
                    '<td><input type="text" placeholder="Equipment/Part description" style="width:100%"></td>' +
                    '<td><input type="number" class="mat-qty" min="0" step="1" value="1" oninput="recalc()" style="width:100%"></td>' +
                    '<td><input type="number" class="mat-cost" min="0" step="0.01" value="0" oninput="recalc()" style="width:100%"></td>' +
                    '<td class="mat-ext">$0.00</td>' +
                    '<td><select style="width:100%"><option>Equip</option><option>Part</option><option>Misc</option></select></td>' +
                    '<td class="no-print"><button class="btn btn-delete btn-sm" onclick="deleteRow(this)" title="Delete Row" style="font-size: 16px; line-height: 1;">&times;</button></td>';
            } else {
                row.innerHTML = 
                    '<td><input type="text" placeholder="Labor Task" style="width:100%"></td>' +
                    '<td><input type="number" class="lab-hours" min="0" step="0.5" value="1" oninput="recalc()" style="width:100%"></td>' +
                    '<td><input type="number" class="lab-rate" min="0" step="1" value="45" oninput="recalc()" style="width:100%"></td>' +
                    '<td class="lab-ext">$45.00</td>' +
                    '<td><select style="width:100%"><option>Install</option><option>Service</option><option>Other</option></select></td>' +
                    '<td class="no-print"><button class="btn btn-delete btn-sm" onclick="deleteRow(this)" title="Delete Row" style="font-size: 16px; line-height: 1;">&times;</button></td>';
            }
            body.appendChild(row);
            recalc();
        }

        function deleteRow(btn) {
            const tableBody = btn.closest('tbody');
            btn.closest('tr').remove();
            
            if (tableBody.id === 'materialBody' && tableBody.querySelectorAll('tr').length === 0) {
                addRow('material');
            } else if (tableBody.id === 'laborBody' && tableBody.querySelectorAll('tr').length === 0) {
                addRow('labor');
            }
            recalc();
        }

        function updateMargin() {
            let val = parseFloat(document.getElementById('marginSlider').value) || 0;
            if (val > 90) { val = 90; document.getElementById('marginSlider').value = 90; }
            if (val < 0) { val = 0; document.getElementById('marginSlider').value = 0; }
            document.getElementById('marginBadge').innerText = val + '%';
            document.getElementById('footer-margin').innerText = val + '%';
            document.getElementById('s-mkpct').innerText = val;
            recalc();
        }

        function safeFormatCurrency(val) {
            if (isNaN(val) || !isFinite(val) || val < 0) return '$0.00';
            return '$' + val.toFixed(2);
        }

        function recalc() {
            let matTotal = 0;
            document.querySelectorAll('#materialBody tr').forEach(row => {
                const qtyInput = row.querySelector('.mat-qty');
                const costInput = row.querySelector('.mat-cost');
                if (!qtyInput || !costInput) return;
                const qty = Math.max(0, parseFloat(qtyInput.value) || 0);
                const cost = Math.max(0, parseFloat(costInput.value) || 0);
                const ext = qty * cost;
                const extEl = row.querySelector('.mat-ext');
                if(extEl) extEl.innerText = safeFormatCurrency(ext);
                matTotal += ext;
            });
            document.getElementById('matTotal').innerText = safeFormatCurrency(matTotal);

            let laborTotal = 0;
            document.querySelectorAll('#laborBody tr').forEach(row => {
                const hoursInput = row.querySelector('.lab-hours');
                const rateInput = row.querySelector('.lab-rate');
                if (!hoursInput || !rateInput) return;
                const hours = Math.max(0, parseFloat(hoursInput.value) || 0);
                const rate = Math.max(0, parseFloat(rateInput.value) || 0);
                const ext = hours * rate;
                const extEl = row.querySelector('.lab-ext');
                if(extEl) extEl.innerText = safeFormatCurrency(ext);
                laborTotal += ext;
            });
            document.getElementById('laborTotal').innerText = safeFormatCurrency(laborTotal);

            const refLbs = Math.max(0, parseFloat(document.getElementById('refLbs').value) || 0);
            const refRate = Math.max(0, parseFloat(document.getElementById('refRate').value) || 0);
            const refTotal = refLbs * refRate;

            const permit = Math.max(0, parseFloat(document.getElementById('permitFee').value) || 0);
            const disposal = Math.max(0, parseFloat(document.getElementById('disposalFee').value) || 0);
            const rawCost = matTotal + laborTotal + refTotal + permit + disposal;

            let marginPct = parseFloat(document.getElementById('marginSlider').value) || 0;
            marginPct = Math.min(Math.max(marginPct, 0), 90);
            
            let sellPriceBeforeDisc = rawCost;
            let markup = 0;
            
            if (marginPct > 0) {
               const marginMultiplier = 1 - (marginPct / 100);
               sellPriceBeforeDisc = rawCost / marginMultiplier;
               markup = sellPriceBeforeDisc - rawCost;
            }

            const discount = Math.max(0, parseFloat(document.getElementById('discount').value) || 0);
            const finPct = parseFloat(document.getElementById('financing').value) || 0;
            const finFee = Math.max(0, (sellPriceBeforeDisc - discount) * (finPct / 100));

            const taxRate = Math.max(0, parseFloat(document.getElementById('taxRate').value) || 0);
            const taxable = Math.max(0, sellPriceBeforeDisc - discount + finFee);
            const tax = taxable * (taxRate / 100);

            let totalBid = taxable + tax;
            if (isNaN(totalBid) || !isFinite(totalBid)) totalBid = 0;

            document.getElementById('s-mat').innerText = safeFormatCurrency(matTotal);
            document.getElementById('s-lab').innerText = safeFormatCurrency(laborTotal);
            document.getElementById('s-ref').innerText = safeFormatCurrency(refTotal);
            document.getElementById('s-fees').innerText = safeFormatCurrency(permit + disposal);
            document.getElementById('s-raw').innerText = safeFormatCurrency(rawCost);
            document.getElementById('s-markup').innerText = safeFormatCurrency(markup);
            document.getElementById('s-disc').innerText = '-' + safeFormatCurrency(discount);
            document.getElementById('s-fin').innerText = safeFormatCurrency(finFee);
            document.getElementById('s-tax').innerText = safeFormatCurrency(tax);
            document.getElementById('s-total').innerText = safeFormatCurrency(totalBid);
            document.getElementById('footer-total').innerText = safeFormatCurrency(totalBid);

            document.getElementById('t-good').innerHTML = safeFormatCurrency(totalBid) + '<small>Standard Efficiency</small>';
            document.getElementById('t-better').innerHTML = safeFormatCurrency(totalBid * 1.08) + '<small>Mid Efficiency (+8%)</small>';
            document.getElementById('t-best').innerHTML = safeFormatCurrency(totalBid * 1.18) + '<small>High Efficiency (+18%)</small>';

            if (typeof window.updateMintStickyBar === 'function') {
                try {
                    window.updateMintStickyBar({
                        'Bid Total': safeFormatCurrency(totalBid).replace('.00', ''),
                        'Profit': safeFormatCurrency(markup).replace('.00', '')
                    }, '/hvac-bid-calculator/');
                } catch(e){}
            }
        }

        function saveBid() {
            const logBody = document.getElementById('logBody');
            const placeholder = logBody.querySelector('tr[style*="italic"]');
            if (placeholder) placeholder.remove();

            const cust = document.getElementById('custName').value.trim() || 'Unknown Customer';
            const est = document.getElementById('estNum').value.trim() || 'N/A';
            const date = document.getElementById('jobDate').value.trim() || new Date().toLocaleDateString();
            const amt = document.getElementById('s-total').innerText;

            const row = document.createElement('tr');
            row.innerHTML = '<td>' + cust + '</td><td>' + est + '</td><td>' + date + '</td><td style="font-weight:600; color:var(--primary);">' + amt + '</td><td>7 Days</td><td><span class="status-badge" style="background:rgba(255, 153, 102, 0.2); color:#FF9966; border: 1px solid rgba(255,153,102,0.4); padding: 4px 8px; border-radius: 4px; font-size: 11px;">Pending</span></td><td class="no-print"><button class="btn btn-delete btn-sm" onclick="this.closest(\\'tr\\').remove()" title="Delete Log" style="font-size: 16px; line-height: 1;">&times;</button></td>';
            logBody.appendChild(row);
        }

        function clearAll() {
            if (confirm('Clear all bid information and start over?')) {
                location.reload();
            }
        }
    </script>\`;

html = html.replace(/<script>\\s*document\\.addEventListener\\('DOMContentLoaded'[\\s\\S]*?<\\/script>/, newJS);

// Ensure max=90
html = html.replace(/max="60"/g, 'max="90"');
html = html.replace(/max="100"/g, 'max="90"');
html = html.replace(/onclick="\\s*(.*?)\\s*this\\.closest\\('tr'\\)\\.remove\\(\\);recalc\\(\\);\\s*"/g, 'onclick="deleteRow(this)"');

// Verify there isn't multiple bottom banners left if they were stacked or formatted differently
const adBottomCount = (html.match(/ad-placeholder-bottom/g) || []).length;
if (adBottomCount > 1) {
    let removed = false;
    html = html.replace(/<!-- Ad Placeholder: Bottom Banner -->\\s*<div class="ad-placeholder ad-placeholder-bottom">\\s*<span>Advertisement<\\/span>\\s*<\\/div>/g, (match) => {
        if (!removed) {
            removed = true;
            return match; // keep first
        }
        return ''; // remove rest
    });
}

// Ensure the section titles no longer have trailing </div> that ruined layout
// Wait, the regex in fixSection replaced the trailing </div>. So it's already gone!

// Check if there are other corrupted glyphs (like üìã) maybe in the HTML, we'll replace the full document with a safety regex parsing for \u0080-\u00FF 
// Actually, setting <meta charset="UTF-8"> handles all file rendering on output, assuming we preserve exactly the UTF-8 bytes!
// Wait - fs.writeFileSync with 'utf8' string WILL preserve standard UTF-8 characters properly!

fs.writeFileSync('c:/Users/Tyler/Documents/GITHUB_PROJECTS/mintsheets-site/hvac-bid-calculator/index-fixed.html', html, 'utf8');
console.log("Written index-fixed.html");
