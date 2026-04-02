const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\Tyler\\Documents\\GITHUB_PROJECTS\\mintsheets-site';

function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (file === 'node_modules' || file === '.git') return;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const files = getAllHtmlFiles(baseDir).filter(f => !f.includes('blog\\') && !f.includes('scripts\\') && !f.includes('node_modules'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    // 1. Branding: Replace Your HVAC Co and YourHVACCo
    content = content.replace(/Your HVAC Co\.?/gi, 'MintSheets');
    content = content.replace(/YourHVACCo/gi, 'MintSheets');

    // 2. Trust Signals in Footer
    // Replace "Free HVAC tools used by contractors" or generic footers
    // More specifically, we want to ensure the trust list exists
    const trustSignals = `
        <div style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; color: var(--muted); font-size: 13px; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
            <span><span style="color: var(--primary);">✔</span> Used by HVAC technicians & contractors</span>
            <span><span style="color: var(--primary);">✔</span> Based on ACCA Manual standards</span>
            <span><span style="color: var(--primary);">✔</span> Free professional tools</span>
        </div>
    `;

    // Try to find the copyright line as an anchor for the trust signals
    if (content.includes('&copy; 2026 MintSheets') && !content.includes('Based on ACCA Manual standards')) {
         content = content.replace(/<p style="margin-top: 20px; color: var\(--muted\); font-size: 12px;">&copy; 2026 MintSheets\. Free HVAC technical tools\.<\/p>/, trustSignals + '<p style="margin-top: 20px; color: var(--muted); font-size: 12px;">&copy; 2026 MintSheets. Free HVAC technical tools.</p>');
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Branding & Trust Applied: ${file}`);
    }
});

console.log('Branding and Trust update complete.');
