const fs = require('fs');
const content = fs.readFileSync('c:/Users/Tyler/Documents/GITHUB_PROJECTS/mintsheets-site/hvac-bid-calculator/index.html', 'latin1');
console.log(content.substring(2500, 3000));
console.log("----");
console.log(content.match(/SECTION \d.*JOB INFORMATION/));
console.log(content.match(/<span>.*Advertisement.*<\/span>/g));
