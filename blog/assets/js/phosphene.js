// ==========================================
// Phosphene Background (30% intensity for blog)
// ==========================================

(function() {
    const canvas = document.getElementById('phosphene-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let phosphenes = [];
    const INTENSITY_MULTIPLIER = 0.3;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createPhosphenes() {
        phosphenes = [];
        const count = 120;
        for (let i = 0; i < count; i++) {
            const hue = Math.random() > 0.4 ? 210 + Math.random() * 30 : 250 + Math.random() * 20;
            const saturation = Math.random() * 25 + 20;
            const lightness = Math.random() * 25 + 40;
            phosphenes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 200 + 100,
                baseRadius: Math.random() * 200 + 100,
                opacity: (Math.random() * 0.04 + 0.015) * INTENSITY_MULTIPLIER,
                baseOpacity: (Math.random() * 0.04 + 0.015) * INTENSITY_MULTIPLIER,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                hue: hue,
                saturation: saturation,
                lightness: lightness,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    function animatePhosphenes() {
        ctx.fillStyle = 'rgb(10, 10, 15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        phosphenes.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.pulsePhase += p.pulseSpeed;
            const pulse = Math.sin(p.pulsePhase);
            p.radius = p.baseRadius + pulse * 40;
            p.opacity = p.baseOpacity + pulse * 0.02 * INTENSITY_MULTIPLIER;
            p.vx += (Math.random() - 0.5) * 0.01;
            p.vy += (Math.random() - 0.5) * 0.01;
            p.vx = Math.max(-0.4, Math.min(0.4, p.vx));
            p.vy = Math.max(-0.4, Math.min(0.4, p.vy));

            if (p.x < -p.radius) p.x = canvas.width + p.radius;
            if (p.x > canvas.width + p.radius) p.x = -p.radius;
            if (p.y < -p.radius) p.y = canvas.height + p.radius;
            if (p.y > canvas.height + p.radius) p.y = -p.radius;

            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animatePhosphenes);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        createPhosphenes();
    });

    resizeCanvas();
    createPhosphenes();
    animatePhosphenes();
})();

