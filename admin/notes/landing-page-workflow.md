# Landing Page Workflow

## Single Source of Truth
The **editable source** for all product landing pages is located in:
`products/[product-name]/product-page/index.html`

## Live Deployment
The `p/` directory contains the **live deploy copies** required for routing (e.g., `mintsheets.com/p/hvac-invoice-template`). 
**DO NOT edit files in the `p/` directory directly.**

## How to Update
1. Edit the landing page in `products/[product-name]/product-page/index.html`.
2. Run the sync script to push changes to the live `p/` folder:
   ```powershell
   ./admin/scripts/sync-product-pages.ps1
   ```
