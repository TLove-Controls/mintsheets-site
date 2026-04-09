const SKIP_LINK_STYLE = `<style>
    .skip-link {
      position: absolute;
      left: 16px;
      top: -56px;
      z-index: 1000;
      padding: 10px 14px;
      border-radius: 8px;
      background: #2ECC71;
      color: #08111F;
      font-weight: 700;
      text-decoration: none;
      transition: top 0.2s ease;
    }

    .skip-link:focus {
      top: 16px;
    }
  </style>`;

const SITE_HEADER = `<header class="site-header">
    <div class="container nav">
      <a href="/" class="brand">
        <img src="/brand/logo-without-background.png" alt="MintSheets Logo" width="182" height="80" decoding="async"
          loading="eager">
      </a>

      <nav class="nav-links" aria-label="Primary">
        <a href="/">Calculators</a>
        <a href="/blog/">Blog</a>
        <a href="/#troubleshooting-checklist">Free Guide</a>
        <a href="mailto:support@mintsheets.com">Support</a>
      </nav>

      <div class="header-actions">
        <a href="/free/hvac-troubleshooting-checklist/" class="btn btn-primary btn-sm" style="min-height: 40px;">Free Resources</a>
      </div>
      <button class="hamburger" id="hamburger-btn" aria-label="Open navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

const MOBILE_NAV = `<!-- Mobile Navigation -->
  <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
  <nav class="mobile-nav" aria-label="Mobile" id="mobile-nav" aria-hidden="true">
    <div class="mobile-nav-header">
      <a href="/" class="brand">
        <img src="/brand/logo-without-background.png" alt="MintSheets Logo" width="182" height="80" decoding="async"
          loading="eager">
      </a>
      <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">
        <span></span><span></span>
      </button>
    </div>
    <ul class="mobile-nav-links">
      <li><a href="/"><span class="nav-icon">&#x1F9EE;</span> Calculators</a></li>
      <li><a href="/blog/"><span class="nav-icon">&#x1F4DD;</span> Blog</a></li>
      <li><a href="/#troubleshooting-checklist"><span class="nav-icon">&#x1F4CB;</span> Free Guide</a></li>
      <li><a href="mailto:support@mintsheets.com"><span class="nav-icon">&#x2709;</span> Support</a></li>
    </ul>
    <div class="mobile-nav-cta">
      <a href="/free/hvac-troubleshooting-checklist/" class="btn btn-primary">Free Resources</a>
    </div>
  </nav>`;

const SITE_FOOTER = `<footer id="mint-footer" style="background:var(--panel-elevated);border-top:1px solid var(--line);padding:40px 0;margin-top:60px;font-family:sans-serif;clear:both;">
    <div style="max-width:1100px;margin:0 auto;padding:0 20px;">
      <h3 style="color:var(--primary);font-weight:900;font-size:18px;text-transform:uppercase;margin-bottom:20px;letter-spacing:1px;">Related HVAC Calculators</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;">
        <a href="/hvac-load-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">Load Calculator</a>
        <a href="/hvac-cfm-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">CFM Calculator</a>
        <a href="/hvac-duct-size-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">Duct Size Calculator</a>
        <a href="/hvac-static-pressure-calculator/" style="color:var(--muted);text-decoration:none;font-size:14px;">Static Pressure Calculator</a>
      </div>
      <div style="margin-top:20px;display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--muted);">
        <a href="/privacy-policy/" style="color:var(--muted);text-decoration:none;">Privacy Policy</a>
        <a href="/terms-of-service/" style="color:var(--muted);text-decoration:none;">Terms of Service</a>
        <a href="/disclaimer/" style="color:var(--muted);text-decoration:none;">Disclaimer</a>
        <a href="/cookie-policy/" style="color:var(--muted);text-decoration:none;">Cookie Policy</a>
      </div>
      <div style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; color: var(--muted); font-size: 13px; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        <span><span style="color: var(--primary);">&#10003;</span> Used by HVAC technicians & contractors</span>
        <span><span style="color: var(--primary);">&#10003;</span> Based on ACCA Manual standards</span>
        <span><span style="color: var(--primary);">&#10003;</span> Free professional tools</span>
      </div>
      <p style="margin-top:20px;color:var(--muted);font-size:12px;">&copy; 2026 MintSheets. Free HVAC technical tools.</p>
    </div>
  </footer>`;

const NAV_SCRIPT = `<script>
  (function () {
    var btn = document.getElementById('hamburger-btn');
    var nav = document.getElementById('mobile-nav');
    var overlay = document.getElementById('mobile-nav-overlay');
    var close = document.getElementById('mobile-nav-close');
    if (!btn || !nav) return;
    function setMenuState(open) {
      document.body.classList.toggle('menu-open', open);
      btn.classList.toggle('active', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    btn.addEventListener('click', function () { setMenuState(!btn.classList.contains('active')); });
    close && close.addEventListener('click', function () { setMenuState(false); });
    overlay && overlay.addEventListener('click', function () { setMenuState(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuState(false);
    });
  })();
  </script>`;

module.exports = {
  MOBILE_NAV,
  NAV_SCRIPT,
  SITE_FOOTER,
  SITE_HEADER,
  SKIP_LINK_STYLE,
};
