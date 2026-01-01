// ==========================================
// Footer - Shared Blog Component
// ==========================================

(function() {
    const footerHTML = `
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-left">
                <img src="https://c4c7ee2640e335085d93afe0c1a41ae6.cdn.bubble.io/f1766176221836x544526176091019140/whitespace.png" alt="Whitespace" class="footer-logo">
                <p class="footer-copyright inter">© 2026 Whitespace. All rights reserved.</p>
            </div>
            
            <div class="footer-links">
                <a href="/blog" class="footer-link inter">Blog</a>
                <a href="/privacy" class="footer-link inter">Privacy Policy</a>
                <a href="/terms" class="footer-link inter">Terms of Service</a>
                <a href="mailto:hello@trywhitespace.com" class="footer-link inter">Contact</a>
                <a href="https://x.com/try_whitespace" class="footer-link inter" target="_blank" rel="noopener">X</a>
                <a href="https://tiktok.com/@trywhitespace" class="footer-link inter" target="_blank" rel="noopener">TikTok</a>
            </div>
        </div>
    </footer>`;

    // Find existing footer and replace, or append to body
    const existingFooter = document.querySelector('.site-footer');
    if (existingFooter) {
        existingFooter.outerHTML = footerHTML;
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
})();

