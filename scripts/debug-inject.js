const fs = require('fs');

const f = 'c:\\Users\\Tyler\\Documents\\GITHUB_PROJECTS\\mintsheets-site\\hvac-load-calculator\\index.html';
let c = fs.readFileSync(f, 'utf8');
console.log('Original Length:', c.length);

const workflowHtml = `
    <div class="workflow-chain">
        <div class="workflow-title"><span>🔄</span> Professional Workflow Navigation</div>
        <div class="workflow-steps">
            <a href="/hvac-load-calculator/" class="workflow-step active">1. Load Calc</a>
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

// Simple string search and replace
if (!c.includes('workflow-chain')) {
    const searchStr = '<footer id="mint-footer"';
    const index = c.indexOf(searchStr);
    if (index !== -1) {
        c = c.substring(0, index) + workflowHtml + '\n' + c.substring(index);
        console.log('Injected workflow at index:', index);
    } else {
        console.log('Could not find footer');
    }
} else {
    console.log('Already has workflow');
}

fs.writeFileSync(f, c, 'utf8');
console.log('New Length:', fs.readFileSync(f, 'utf8').length);
