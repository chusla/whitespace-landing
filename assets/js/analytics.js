// ==========================================
// Vercel Analytics & Speed Insights - Shared Module
// ==========================================

(function() {
    // Vercel Analytics
    const analyticsScript = document.createElement('script');
    analyticsScript.defer = true;
    analyticsScript.src = '/_vercel/insights/script.js';
    document.body.appendChild(analyticsScript);

    // Vercel Speed Insights
    const speedInsightsScript = document.createElement('script');
    speedInsightsScript.defer = true;
    speedInsightsScript.src = '/_vercel/speed-insights/script.js';
    document.body.appendChild(speedInsightsScript);
})();

