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

const workflowHtml = `
    <div class="workflow-chain">
        <div class="workflow-title"><span>🔄</span> Professional Workflow Navigation</div>
        <div class="workflow-steps">
            <a href="/hvac-load-calculator/" class="workflow-step">1. Load Calc</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-cfm-calculator/" class="workflow-step">2. Airflow</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-duct-size-calculator/" class="workflow-step">3. Duct Sizing</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-static-pressure-calculator/" class="workflow-step">4. Static Pressure</a>
            <span class="workflow-arrow">&rarr;</span>
            <a href="/hvac-bid-calculator/" class="workflow-step">5. Bid Tool</a>
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
    content = content.replace(/<div class="ad-slot ad-top">[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="ad-slot ad-mid">[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="conversion-block">[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="workflow-chain">[\s\S]*?<\/div>/g, '');
    content = content.replace(/<script src="\.\.\/shared\/js\/mint-core\.js"><\/script>/g, '');
    content = content.replace(/\/\/\s*Phase 6 Sticky Bar Wiring[\s\S]*?\}/g, ''); // Clean old hooks

    // --- 2. INJECT COMPONENTS ---
    // Top Ad below H1
    if (!content.includes('ad-top')) {
        content = content.replace(/(<h1[^>]*?>.*?<\/h1>)/s, '$1\n<div class="ad-slot ad-top"></div>');
    }
    
    // Mid Ad + Conversion after results-box
    if (!content.includes('ad-mid')) {
        content = content.replace(/(<div class="results-box">[\s\S]*?<\/div>)/s, '$1\n<div class="ad-slot ad-mid"></div>\n' + (folderName !== 'hvac-bid-calculator' ? conversionHtml : ''));
    }

    // Workflow before footer
    if (!content.includes('workflow-chain')) {
        content = content.replace(/(<footer id="mint-footer")/s, workflowHtml + '\n$1');
    }

    // Shared JS at end
    if (!content.includes('shared/js/mint-core.js')) {
        content = content.replace('</body>', '<script src="../shared/js/mint-core.js"></script>\n</body>');
    }

    // --- 3. WIRING (STICKY BAR HOOKS) ---
    if (folderName === 'hvac-load-calculator') {
        const hook = `
            // Phase 6 Sticky Bar Wiring
            if (window.updateMintStickyBar) {
                const coolTons = document.getElementById('coolingTons').innerText;
                const heatBtu = document.getElementById('heatingResult').innerText;
                window.updateMintStickyBar([
                    { label: 'Cooling', val: coolTons },
                    { label: 'Heating', val: heatBtu }
                ], '/hvac-cfm-calculator/', 'Calculate CFM');
            }
        `;
        // Target specifically the line before calculateLoad's final closing brace
        content = content.replace(/document\.getElementById\('total-h-display'\)\.innerText = Math\.round\(finalHeat\)\.toLocaleString\(\);/s, match => match + hook);
    } 
    else if (folderName === 'hvac-bid-calculator') {
        const hook = `
            // Phase 6 Sticky Bar Wiring
            if (window.updateMintStickyBar) {
                const total = document.getElementById('s-total').innerText;
                window.updateMintStickyBar([
                    { label: 'Total Bid', val: total }
                ], '/hvac-calculators/', 'All Tools');
            }
        `;
        content = content.replace(/document\.getElementById\('s-total'\)\.innerText = fmt\(total\);/s, match => match + hook);
    }
    else if (folderName === 'hvac-cfm-calculator') {
        const hook = `
            // Phase 6 Sticky Bar Wiring
            if (window.updateMintStickyBar) {
                const cfmVal = Math.ceil(cfm/5)*5;
                window.updateMintStickyBar([
                    { label: 'Target CFM', val: cfmVal + ' CFM' }
                ], '/hvac-duct-size-calculator/', 'Size Ducts');
            }
        `;
        content = content.replace(/document\.getElementById\('room_tfoot'\)\.innerHTML = footRow\('Required Room CFM \(Rounded\)', Math\.ceil\(cfm\/5\)\*5 \+ ' CFM'\);/s, match => match + hook);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Phase 6 Finalized: ${file}`);
});

console.log('Phase 6 Deployment Complete.');
