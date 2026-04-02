const fs = require("fs");
const content = fs.readFileSync("c:/Users/Tyler/Documents/GITHUB_PROJECTS/mintsheets-site/hvac-bid-calculator/index.html", "utf8");
fs.writeFileSync("hvac_index.json", JSON.stringify(content.split("\n")));
