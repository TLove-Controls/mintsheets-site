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

const workflowInfo = {
    'hvac-load-calculator': { next: 'hvac-cfm-calculator', nextLabel: 'Calculate CFM', active: 'Load' },
    'hvac-cfm-calculator': { next: 'hvac-duct-size-calculator', nextLabel: 'Size Ducts', active: 'CFM' },
    'hvac-duct-size-calculator': { next: 'hvac-static-pressure-calculator', nextLabel: 'Check Static Pressure', active: 'Duct' },
    'hvac-static-pressure-calculator': { next: 'hvac-bid-calculator', nextLabel: 'Create Bid', active: 'Static Pressure' },
    'default': { next: 'hvac-bid-calculator', nextLabel: 'Create Professional Bid', active: 'Calculator' }
};

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
    const flow = workflowInfo[folderName] || workflowInfo['default'];

    const workflowHtml = `
        <div class="workflow-chain">
            <div class="workflow-title"><span>🔄</span> Professional Workflow Step</div>
            <div class="workflow-steps">
                <a href="/hvac-load-calculator/" class="workflow-step ${flow.active === 'Load' ? 'active' : ''}">Manual J Load</a>
                <span class="workflow-arrow">&rarr;</span>
                <a href="/hvac-cfm-calculator/" class="workflow-step ${flow.active === 'CFM' ? 'active' : ''}">CFM Sizing</a>
                <span class="workflow-arrow">&rarr;</span>
                <a href="/hvac-duct-size-calculator/" class="workflow-step ${flow.active === 'Duct' ? 'active' : ''}">Duct Sizing</a>
                <span class="workflow-arrow">&rarr;</span>
                <a href="/hvac-static-pressure-calculator/" class="workflow-step ${flow.active === 'Static Pressure' ? 'active' : ''}">Static Pressure</a>
            </div>
        </div>
    `;

    // 1. Inject Top Ad below H1
    if (!content.includes('class="ad-slot ad-top"')) {
        content = content.replace(/<h1[^>]*?>.*?<\/h1>/s, (match) => match + '\n<div class="ad-slot ad-top"></div>');
    }

    // 2. Inject Mid Ad + Conversion after Results box
    if (!content.includes('class="ad-slot ad-mid"')) {
        content = content.replace(/<div class="results-box">.*?<\/div>\s*<\/div>/s, (match) => match + '\n<div class="ad-slot ad-mid"></div>\n' + (folderName !== 'hvac-bid-calculator' ? conversionHtml : ''));
    }

    // 3. Inject Workflow before footer
    if (!content.includes('class="workflow-chain"')) {
        content = content.replace(/<footer id="mint-footer"/, workflowHtml + '\n<footer id="mint-footer"');
    }

    // 4. Ensure mint-core.js is linked
    if (!content.includes('shared/js/mint-core.js')) {
        content = content.replace(/<\/body>/, '<script src="../shared/js/mint-core.js"></script>\n</body>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Phase 6 Components Injected: ${file}`);
});

console.log('Phase 6 component injection complete.');
