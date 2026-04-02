/**
 * mint-core.js
 * Shared logic for MintSheets Phase 6: Sticky Bar, Ads, and Workflow.
 */

(function() {
    // 1. Initialize Sticky Bar HTML
    function initStickyBar() {
        if (document.querySelector('.sticky-result-bar')) return;
        
        const bar = document.createElement('div');
        bar.className = 'sticky-result-bar';
        bar.id = 'mint-sticky-bar';
        bar.innerHTML = `
            <div class="sticky-metrics" id="sticky-metrics-list">
                <!-- Dynamic metrics go here -->
            </div>
            <a href="/" class="sticky-cta-btn" id="sticky-cta-link">Continue &rarr;</a>
        `;
        document.body.appendChild(bar);
        
        // Show/Hide logic based on scroll
        window.addEventListener('scroll', () => {
            const resultsBox = document.querySelector('.results-box');
            if (!resultsBox) return;
            
            const rect = resultsBox.getBoundingClientRect();
            // Show bar when results box is scrolled past (bottom of box is above viewport middle)
            const shouldShow = rect.bottom < 100 && document.body.classList.contains('has-results');
            
            if (shouldShow) {
                bar.classList.add('visible');
            } else {
                bar.classList.remove('visible');
            }
        });
    }

    /**
     * updateMintStickyBar
     * @param {Array} metrics - Array of {label, val}
     * @param {String} nextUrl - URL for Next Step
     * @param {String} nextLabel - Label for Next Step button
     */
    window.updateMintStickyBar = function(metrics, nextUrl, nextLabel) {
        initStickyBar(); // Ensure initialized
        document.body.classList.add('has-results');
        
        const metricsList = document.getElementById('sticky-metrics-list');
        const ctaLink = document.getElementById('sticky-cta-link');
        
        if (metricsList) {
            metricsList.innerHTML = metrics.map(m => `
                <div class="sticky-metric">
                    <span class="label">${m.label}</span>
                    <span class="val">${m.val}</span>
                </div>
            `).join('');
        }
        
        if (ctaLink && nextUrl) {
            ctaLink.href = nextUrl;
            ctaLink.innerHTML = `Next Step: ${nextLabel || 'Continue'} &rarr;`;
        }
    };

    // 3. Ad Slot Visual Labels (Optional/Diagnostic)
    window.initAdLabels = function() {
        document.querySelectorAll('[class*="ad-slot"]').forEach(el => {
            if (!el.querySelector('.ad-label')) {
                const span = document.createElement('span');
                span.className = 'ad-label';
                span.innerText = 'Advertisement';
                el.appendChild(span);
            }
        });
    };

    // Auto-run ad labels on load
    window.addEventListener('DOMContentLoaded', () => {
        window.initAdLabels();
    });

})();
