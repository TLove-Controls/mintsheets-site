const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\Tyler\\Documents\\GITHUB_PROJECTS\\mintsheets-site';

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === 'blog' || file === 'scripts' || file === 'shared' || file === 'brand') return;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') && file !== 'index.html') {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const files = getAllHtmlFiles(baseDir);

const workflowHtml = (active) => `
    <div class="workflow-chain">
        <div class="workflow-title"><span>🔄</span> Professional Workflow Navigation</div>
        <div class="workflow-steps">
            <a href="/hvac-load-calculator/" class="workflow-step ${active==='Load'?'active':''}">1. Load Calc</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-cfm-calculator/" class="workflow-step ${active==='CFM'?'active':''}">2. Airflow</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-duct-size-calculator/" class="workflow-step ${active==='Duct'?'active':''}">3. Duct Sizing</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-static-pressure-calculator/" class="workflow-step ${active==='Static'?'active':''}">4. Static Pressure</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-bid-calculator/" class="workflow-step ${active==='Bid'?'active':''}">5. Bid Tool</a>
        </div>
    </div>
`;

const conversionHtml = `
    <div class="conversion-block">
        <div class="eyebrow">Professional Workflow</div>
        <h3>Turn this calculation into a real job estimate</h3>
        <p>Use our HVAC Bid Calculator to instantly convert these engineering numbers into a professional customer proposal.</p>
        <a href="/hvac-bid-calculator/" class="btn btn-primary">Try the Professional Bid Tool &rarr;</a>
    </div>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const folderName = path.basename(path.dirname(file));
    
    // --- 1. CLEANUP PREVIOUS ATTEMPTS ---
    const cleanups = [
        /<div class="ad-slot ad-top">[\s\S]*?<\/div>/g,
        /<div class="ad-slot ad-mid">[\s\S]*?<\/div>/g,
        /<div class="conversion-block">[\s\S]*?<\/div>/g,
        /<div class="workflow-chain">[\s\S]*?<\/div>/g,
        /<script src="\.\.\/shared\/js\/mint-core\.js"><\/script>/g,
        /\/\/\s*Phase 6 Sticky Bar Wiring[\s\S]*?updateMintStickyBar[\s\S]*?\}/g
    ];
    cleanups.forEach(regex => { content = content.replace(regex, ''); });

    // --- 2. INJECT COMPONENTS (Using Index-based injection for reliability) ---
    
    // Top Ad below H1
    if (content.includes('</h1>')) {
        const idx = content.indexOf('</h1>') + 5;
        content = content.substring(0, idx) + '\n<div class="ad-slot ad-top"></div>' + content.substring(idx);
    }
    
    // Mid Ad + Conversion after results-box
    if (content.includes('class="results-box"')) {
        // Find the end of that specific results-box div
        let startIdx = content.indexOf('class="results-box"');
        let openDivs = 0;
        let endIdx = -1;
        for (let i = startIdx; i < content.length; i++) {
            if (content.substring(i, i+4) === '<div') openDivs++;
            if (content.substring(i, i+5) === '</div') {
                openDivs--;
                if (openDivs === 0) {
                    endIdx = i + 6;
                    break;
                }
            }
        }
        if (endIdx !== -1) {
            const inject = '\n<div class="ad-slot ad-mid"></div>\n' + (folderName !== 'hvac-bid-calculator' ? conversionHtml : '');
            content = content.substring(0, endIdx) + inject + content.substring(endIdx);
        }
    }

    // Workflow before footer
    if (content.includes('<footer id="mint-footer"')) {
        const activeMap = {
            'hvac-load-calculator': 'Load',
            'hvac-cfm-calculator': 'CFM',
            'hvac-duct-size-calculator': 'Duct',
            'hvac-static-pressure-calculator': 'Static',
            'hvac-bid-calculator': 'Bid'
        };
        const active = activeMap[folderName] || 'None';
        const idx = content.indexOf('<footer id="mint-footer"');
        content = content.substring(0, idx) + workflowHtml(active) + '\n' + content.substring(idx);
    }

    // Shared JS at end
    if (content.includes('</body>')) {
        const idx = content.indexOf('</body>');
        content = content.substring(0, idx) + '<script src="../shared/js/mint-core.js"></script>\n' + content.substring(idx);
    }

    // --- 3. WIRING (STICKY BAR HOOKS) ---
    if (folderName === 'hvac-load-calculator') {
        const target = "document.getElementById('total-h-display').innerText = Math.round(finalHeat).toLocaleString();";
        const hook = `\n            // Phase 6 Sticky Bar Wiring\n            if (window.updateMintStickyBar) {\n                const coolTons = document.getElementById('coolingTons').innerText;\n                const heatBtu = document.getElementById('heatingResult').innerText;\n                window.updateMintStickyBar([{ label: 'Cooling', val: coolTons }, { label: 'Heating', val: heatBtu }], '/hvac-cfm-calculator/', 'Calculate CFM');\n            }`;
        if (content.includes(target)) {
            content = content.replace(target, target + hook);
        }
    } 
    else if (folderName === 'hvac-bid-calculator') {
        const target = "document.getElementById('s-total').innerText = fmt(total);";
        const hook = `\n            // Phase 6 Sticky Bar Wiring\n            if (window.updateMintStickyBar) {\n                const total = document.getElementById('s-total').innerText;\n                window.updateMintStickyBar([{ label: 'Total Bid', val: total }], '/hvac-calculators/', 'All Tools');\n            }`;
        if (content.includes(target)) {
            content = content.replace(target, target + hook);
        }
    }
    else if (folderName === 'hvac-cfm-calculator') {
        const target = "$('room_tfoot').innerHTML = footRow('Required Room CFM (Rounded)', Math.ceil(cfm/5)*5 + ' CFM');";
        const hook = `\n            // Phase 6 Sticky Bar Wiring\n            if (window.updateMintStickyBar) {\n                window.updateMintStickyBar([{ label: 'Target CFM', val: (Math.ceil(cfm/5)*5) + ' CFM' }], '/hvac-duct-size-calculator/', 'Size Ducts');\n            }`;
        if (content.includes(target)) {
            content = content.replace(target, target + hook);
        }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Phase 6 Deployed: ${file}`);
});

console.log('Site-wide Phase 6 integration complete.');
