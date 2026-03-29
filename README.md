# Mint Sheets Repository

Specialized digital storefront for professional HVAC business tools, calculators, and templates.

## 🏗 Repository Structure

This repository uses a **product-first** organization model designed for clarity, scalability, and easy management.

### 🍱 Core Directories

- **`/products/`**: **The Source of Truth.** This is where all editable context for each product lives.
  - `source/`: Deliverable files (.docx, .xlsx, .html tool).
  - `assets/`: Previews, screenshots, and thumbnails.
  - `sales/`: Email swipes, Gumroad descriptions, and ad copy.
  - `docs/`: Setup guides, troubleshooting, and logic info.
  - `product-page/`: The master editable version of the landing page.
- **`/p/`**: **Live Routing.** Contains the public-facing `index.html` files for live URLs (e.g., `mintsheets.com/p/hvac-invoice-template`). These are **mirrored** from the product source.
- **`/shared/`**: Global styles (`/css/styles.css`) and common images (`/images/logo.png`).
- **`/brand/`**: Master brand assets including logos, favicons, and the brand color scheme.
- **`/admin/`**: Internal workflows, project notes, and maintenance scripts.
- **`/bundles/`**: Multi-product packs (e.g., `hvac-service-document-pack`).
- **`/free/`**: Free resources and lead magnets.

---

## ⚡️ Workflows

### ➕ Adding a New Product
1. **Create the Product Folder**: Add a folder in `/products/` (use lowercase-kebab-case).
2. **Populate Subfolders**: Fill the `source`, `assets`, `sales`, and `docs` folders with the respective files.
3. **Create the Landing Page**: Create `index.html` inside `products/[name]/product-page/`.
4. **Prepare for Routing**: Create an empty folder with the same name in `/p/`.
5. **Sync to Live**: Run the sync script (see below) to push your new page to the live `/p/` location.

### 📦 Adding a New Bundle
1. Create a subfolder in `/bundles/`.
2. Add an `index.html`.
3. Use root-relative paths (e.g., `/shared/css/styles.css`) for all assets.

### 🔄 Syncing Product Pages
Since the source of truth is in `/products/` but the live site uses `/p/`, you must sync changes after editing a landing page.
**Run this from the project root:**
```powershell
./admin/scripts/sync-product-pages.ps1
```

---

## 🎨 Branding & Assets

- **Updating the Logo**: Replace `shared/images/logo.png`. Most pages reference this file with a version tag for cache-busting (e.g., `?v=1.4`).
- **Updating the Favicon**: Replace `brand/favicon.png`. This is the universal favicon path for the entire site.
- **Styles**: Global UI rules live in `shared/css/styles.css`. This file uses a CSS variable system for easy color/branding overrides.

---

## 🛠 Maintenance

- **Directory Tree**: After moving large amounts of files, regenerate the repo map:
  ```powershell
  # Run the tree generator logic in powershell (refer to history for exact script)
  ```
- **Broken Links**: Use the `check_links` script (available in admin/scripts or project history) to verify all internal `/shared/` and `/products/` paths resolve correctly.

---

## 🚀 Live Environment Notes
- **Hosting**: This is a static HTML repository.
- **Routing**: Folder names in `/p/` and `/bundles/` directly determine the live URL structure.
- **Homepage**: The main site entry point is the `index.html` at the **root** level.