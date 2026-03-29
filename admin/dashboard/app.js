/**
 * MINT SHEETS ADMIN DASHBOARD - CORE LOGIC
 */

// --- TEMPLATES ---
const productTemplate = (slug, name) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Mint Sheets</title>
    <link rel="stylesheet" href="/shared/css/styles.css">
</head>
<body>
    <header class="site-header">
        <div class="container nav">
            <a href="/" class="brand">
                <div class="brand-mark">MS</div>
                <span>Mint Sheets</span>
            </a>
            <nav class="nav-links">
                <a href="/shop/">Shop</a>
            </nav>
        </div>
    </header>
    <main class="container page-content">
        <div class="product-hero">
            <div class="product-info">
                <div class="eyebrow">Product Template</div>
                <h1>${name}</h1>
                <p class="hero-copy">Detailed description for ${name} goes here.</p>
                <div class="product-price">$XX.XX</div>
                <div class="hero-actions">
                    <a href="#" class="btn btn-cta">Buy Now</a>
                </div>
            </div>
            <div class="product-media">
                <img src="assets/${slug}-preview.png" alt="${name} Preview">
            </div>
        </div>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Mint Sheets. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

const bundleTemplate = (slug, name) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Mint Sheets Bundle</title>
    <link rel="stylesheet" href="/shared/css/styles.css">
</head>
<body>
    <header class="site-header">
        <div class="container nav">
            <a href="/" class="brand">
                <div class="brand-mark">MS</div>
                <span>Mint Sheets Bundles</span>
            </a>
        </div>
    </header>
    <main class="container">
        <h1>${name}</h1>
        <p>Bundle description for ${name}.</p>
    </main>
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Mint Sheets.</p>
        </div>
    </footer>
</body>
</html>`;

// --- APP STATE ---
let repoHandle = null;
let products = [];
let bundles = [];
let previewUrls = new Map(); // Store blob URLs for images

// DOM Elements
const btnConnect = document.getElementById('btn-connect');
const btnSync = document.getElementById('btn-sync');
const btnNewProduct = document.getElementById('btn-new-product');
const btnNewBundle = document.getElementById('btn-new-bundle');
const repoStatus = document.getElementById('repo-status');
const productList = document.getElementById('product-list');
const bundleList = document.getElementById('bundle-list');
const statsSummary = document.getElementById('stats-summary');
const dashboardStats = document.getElementById('dashboard-stats');
const welcomeMessage = document.getElementById('welcome-message');

// Modals
const overlayProduct = document.getElementById('overlay-product');
const overlayBundle = document.getElementById('overlay-bundle');
const btnCreateProduct = document.getElementById('btn-create-product');
const btnCreateBundle = document.getElementById('btn-create-bundle');

/**
 * UTILS
 */
window.notify = (msg, type = 'primary') => {
    const container = document.getElementById('notif-container');
    const div = document.createElement('div');
    div.className = 'notif';
    div.style.borderLeft = `4px solid ${type === 'danger' ? '#EF4444' : '#2ECC71'}`;
    div.innerText = msg;
    container.appendChild(div);
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translateX(20px)';
        div.style.transition = 'all 0.3s ease';
        setTimeout(() => div.remove(), 300);
    }, 4000);
};

window.copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
        notify(`Copied ${label} to clipboard`);
    }).catch(err => {
        console.error('Clipboard error:', err);
        notify('Failed to copy to clipboard', 'danger');
    });
};

/**
 * REPOSITORY CONNECTION
 */
async function connectRepo() {
    try {
        if (!window.showDirectoryPicker) {
            throw new Error('Your browser does not support the File System Access API. Please use Chrome or Edge.');
        }

        repoHandle = await window.showDirectoryPicker({
            mode: 'readwrite'
        });
        
        repoStatus.innerText = 'Connected';
        repoStatus.classList.remove('missing');
        btnConnect.innerText = 'Reconnect';
        btnSync.classList.remove('hidden');
        dashboardStats.classList.remove('hidden');
        welcomeMessage.classList.add('hidden');
        
        notify('Connected to repository: ' + repoHandle.name);
        await scanRepo();
    } catch (err) {
        console.error('Connection error:', err);
        notify(err.message, 'danger');
    }
}

async function scanRepo() {
    // Revoke old URLs to free memory
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    previewUrls.clear();

    products = [];
    bundles = [];
    try {
        const prodDir = await repoHandle.getDirectoryHandle('products');
        for await (const entry of prodDir.values()) {
            if (entry.kind === 'directory') {
                const product = { 
                    name: entry.name, 
                    slug: entry.name, 
                    handle: entry, 
                    hasPage: false,
                    previewUrl: null,
                    previewHandle: null
                };
                
                // Status check
                try {
                    const pageDir = await entry.getDirectoryHandle('product-page');
                    const file = await pageDir.getFileHandle('index.html');
                    if (file) product.hasPage = true;
                } catch (e) {}

                // Preview check
                try {
                    const assetsDir = await entry.getDirectoryHandle('assets');
                    for await (const file of assetsDir.values()) {
                        if (file.name.includes('-preview.') && (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg'))) {
                            const fileData = await file.getFile();
                            const url = URL.createObjectURL(fileData);
                            product.previewUrl = url;
                            product.previewHandle = file;
                            previewUrls.set(product.slug, url);
                            break;
                        }
                    }
                } catch (e) {}

                products.push(product);
            }
        }
        try {
            const bundleDir = await repoHandle.getDirectoryHandle('bundles');
            for await (const entry of bundleDir.values()) {
                if (entry.kind === 'directory') {
                    bundles.push({ name: entry.name, slug: entry.name, handle: entry });
                }
            }
        } catch (e) {}
        renderProducts();
        renderBundles();
        updateStats();
    } catch (err) {
        console.error('Scan error:', err);
        notify('Scan completed with some errors.', 'danger');
    }
}

function updateStats() {
    statsSummary.innerText = `Found ${products.length} products and ${bundles.length} bundles.`;
}

/**
 * RENDERING
 */
function renderProducts() {
    if (products.length === 0) {
        productList.innerHTML = '<p style="color: var(--muted);">No products found.</p>';
        return;
    }
    productList.innerHTML = products.map(p => {
        const liveSlug = p.slug === 'hvac-air-balance-report' ? 'air-balance-report' : p.slug;
        const imgHtml = p.previewUrl 
            ? `<img src="${p.previewUrl}" class="card-img">`
            : `<div class="img-placeholder">No Preview Image</div>`;
            
        return `
        <div class="card">
            <div class="card-img-container" onclick="triggerImageUpload('${p.slug}')">
                ${imgHtml}
                <div class="img-overlay">Change Image</div>
                <input type="file" id="input-img-${p.slug}" class="hidden" accept="image/png,image/jpeg" onchange="handleImageChange(event, '${p.slug}')">
            </div>
            <div class="card-header">
                <h3 class="card-title">${p.name}</h3>
                <span class="status-badge ${p.hasPage ? '' : 'missing'}">${p.hasPage ? 'Ready' : 'No Page'}</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-sm" onclick="window.open('../../p/${liveSlug}/index.html', '_blank')">Open Page</button>
                <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('C:\\\\Users\\\\Tyler\\\\Documents\\\\mintsheets-site\\\\products\\\\${p.slug}', 'Full Product Path')">Copy Path</button>
                <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('C:\\\\Users\\\\Tyler\\\\Documents\\\\mintsheets-site\\\\products\\\\${p.slug}\\\\assets', 'Full Assets Path')">Copy Assets Path</button>
            </div>
        </div>
    `}).join('');
}

function renderBundles() {
    if (bundles.length === 0) {
        bundleList.innerHTML = '<p style="color: var(--muted);">No bundles found.</p>';
        return;
    }
    bundleList.innerHTML = bundles.map(b => `
        <div class="card">
            <h3 class="card-title">${b.name}</h3>
            <div class="card-actions">
                <button class="btn btn-secondary btn-sm" onclick="window.open('../../bundles/${b.slug}/index.html', '_blank')">Open Bundle</button>
            </div>
        </div>
    `).join('');
}

/**
 * IMAGE MANAGEMENT
 */
window.triggerImageUpload = (slug) => {
    document.getElementById(`input-img-${slug}`).click();
};

window.handleImageChange = async (event, slug) => {
    const file = event.target.files[0];
    if (!file) return;

    notify(`Updating image for ${slug}...`);
    try {
        const prodDir = await repoHandle.getDirectoryHandle('products');
        const productHandle = await prodDir.getDirectoryHandle(slug);
        const assetsDir = await productHandle.getDirectoryHandle('assets');
        
        // Naming convention: slug-preview.ext
        const ext = file.name.split('.').pop();
        const fileName = `${slug}-preview.${ext}`;
        
        const fileHandle = await assetsDir.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        
        notify('Image updated successfully!');
        await scanRepo();
    } catch (err) {
        console.error('Image update error:', err);
        notify('Failed to update image: ' + err.message, 'danger');
    }
};

/**
 * SYNC LOGIC
 */
async function syncAll() {
    if (!repoHandle) return;
    notify('Syncing products...', 'primary');
    let count = 0;
    try {
        const prodDir = await repoHandle.getDirectoryHandle('products');
        const pDir = await repoHandle.getDirectoryHandle('p');
        for (const product of products) {
            try {
                const prodHandle = await prodDir.getDirectoryHandle(product.slug);
                const pageDir = await prodHandle.getDirectoryHandle('product-page');
                const fileHandle = await pageDir.getFileHandle('index.html');
                const file = await fileHandle.getFile();
                const content = await file.text();
                let targetSlug = product.slug;
                if (targetSlug === 'hvac-air-balance-report') targetSlug = 'air-balance-report';
                let targetDir;
                try {
                    targetDir = await pDir.getDirectoryHandle(targetSlug);
                } catch (e) {
                    if (confirm(`Folder /p/${targetSlug} does not exist. Create it?`)) {
                        targetDir = await pDir.getDirectoryHandle(targetSlug, { create: true });
                    } else { continue; }
                }
                const destFileHandle = await targetDir.getFileHandle('index.html', { create: true });
                const writable = await destFileHandle.createWritable();
                await writable.write(content);
                await writable.close();
                count++;
            } catch (e) {}
        }
        notify(`Sync complete: ${count} pages updated.`);
    } catch (err) {
        console.error('Sync error:', err);
        notify('Sync failed: ' + err.message, 'danger');
    }
}

/**
 * CREATION WIZARDS
 */
async function createProduct() {
    const nameInput = document.getElementById('prod-name');
    const slugInput = document.getElementById('prod-slug');
    const name = nameInput.value;
    const slug = slugInput.value;
    if (!name || !slug) {
        notify('Name and Slug are required', 'danger');
        return;
    }
    try {
        const prodDir = await repoHandle.getDirectoryHandle('products');
        const newProd = await prodDir.getDirectoryHandle(slug, { create: true });
        await newProd.getDirectoryHandle('assets', { create: true });
        await newProd.getDirectoryHandle('docs', { create: true });
        await newProd.getDirectoryHandle('sales', { create: true });
        await newProd.getDirectoryHandle('source', { create: true });
        const pageDir = await newProd.getDirectoryHandle('product-page', { create: true });
        const fileHandle = await pageDir.getFileHandle('index.html', { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(productTemplate(slug, name));
        await writable.close();
        notify(`Product "${name}" created.`);
        overlayProduct.style.display = 'none';
        nameInput.value = '';
        slugInput.value = '';
        await scanRepo();
    } catch (err) {
        console.error('Creation error:', err);
        notify('Creation failed: ' + err.message, 'danger');
    }
}

async function createBundle() {
    const nameInput = document.getElementById('bundle-name');
    const slugInput = document.getElementById('bundle-slug');
    const name = nameInput.value;
    const slug = slugInput.value;
    if (!name || !slug) return;
    try {
        const bundleDir = await repoHandle.getDirectoryHandle('bundles');
        const newBundle = await bundleDir.getDirectoryHandle(slug, { create: true });
        const fileHandle = await newBundle.getFileHandle('index.html', { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(bundleTemplate(slug, name));
        await writable.close();
        notify(`Bundle "${name}" created.`);
        overlayBundle.style.display = 'none';
        nameInput.value = '';
        slugInput.value = '';
        await scanRepo();
    } catch (err) {
        console.error('Bundle error:', err);
        notify('Bundle creation failed', 'danger');
    }
}

/**
 * EVENT LISTENERS
 */
if (btnConnect) btnConnect.addEventListener('click', connectRepo);
if (btnSync) btnSync.addEventListener('click', syncAll);
if (btnNewProduct) btnNewProduct.addEventListener('click', () => { overlayProduct.style.display = 'flex'; });
if (btnNewBundle) btnNewBundle.addEventListener('click', () => { overlayBundle.style.display = 'flex'; });

document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        overlayProduct.style.display = 'none';
        overlayBundle.style.display = 'none';
    });
});

if (btnCreateProduct) btnCreateProduct.addEventListener('click', createProduct);
if (btnCreateBundle) btnCreateBundle.addEventListener('click', createBundle);

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const panelId = item.dataset.panel;
        document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
        document.getElementById(panelId).classList.remove('hidden');
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('panel-title').innerText = item.innerText;
    });
});
