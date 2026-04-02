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
    const originalLength = content.length;

    // 1. Remove the duplicated blog link blocks
    // Target the specific background signature and the emoji
    // Using a more flexible regex for the color string
    const blogBlockRegex = /<div style="margin-bottom:16px; padding: 12px 16px; background: rgba\(46,\s*204,\s*113,\s*0\.08\);[\s\S]*?<\/div>/g;
    content = content.replace(blogBlockRegex, '');

    // Fallback: search for the emoji within any div that looks like ours
    const emojiBlockRegex = /<div[^>]*?>[\s\S]*?&#128214;[\s\S]*?<\/div>/g;
    content = content.replace(emojiBlockRegex, '');

    // 2. Remove the comments
    content = content.replace(/<!-- Blog Article Link -->/g, '');

    // 3. Remove legacy info bars
    const infoBarRegex = /<div style="font-size:12px;color:var\(--muted\);">[\s\S]*?Margin:[\s\S]*?Total:[\s\S]*?<\/div>/g;
    content = content.replace(infoBarRegex, '');

    // 4. Remove previous Phase 6 debris
    content = content.replace(/<div class="ad-slot-top"[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="ad-slot-mid"[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="ad-slot-bottom"[\s\S]*?<\/div>/g, '');
    content = content.replace(/<script src="\.\.\/shared\/js\/mint-core\.js[\s\S]*?<\/script>/g, '');

    // Final cleanup of excessive whitespace
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (content.length !== originalLength) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Successfully Sanitized: ${file}`);
    }
});

console.log('Final Sanitization complete.');
