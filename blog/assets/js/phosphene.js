// ==========================================
// Phosphene Background (30% intensity for blog)
// With interactive hover effects
// ==========================================

(function() {
    const canvas = document.getElementById('phosphene-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let phosphenes = [];
    const INTENSITY_MULTIPLIER = 0.3;

    // Mouse tracking variables
    let mouseX = 0, mouseY = 0;
    let smoothMouseX = 0, smoothMouseY = 0;
    let isMouseOver = false;
    let cursorGlowOpacity = 0;
    
    // Enhanced settings - more pronounced
    const CURSOR_GLOW_RADIUS = 280;
    const PROXIMITY_THRESHOLD = 350;
    const GRAVITY_STRENGTH = 0.15;
    const LERP_SPEED = 0.1;

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

    // Linear interpolation for smooth movement
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Draw cursor-following glow - more pronounced
    function drawCursorGlow() {
        if (cursorGlowOpacity <= 0.01) return;
        
        const gradient = ctx.createRadialGradient(
            smoothMouseX, smoothMouseY, 0,
            smoothMouseX, smoothMouseY, CURSOR_GLOW_RADIUS
        );
        
        // Brighter cyan-blue glow
        const glowOpacity = 0.25 * cursorGlowOpacity * INTENSITY_MULTIPLIER;
        gradient.addColorStop(0, `hsla(200, 70%, 70%, ${glowOpacity * 1.5})`);
        gradient.addColorStop(0.3, `hsla(210, 60%, 60%, ${glowOpacity})`);
        gradient.addColorStop(0.6, `hsla(220, 50%, 50%, ${glowOpacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(smoothMouseX, smoothMouseY, CURSOR_GLOW_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }

    function animatePhosphenes() {
        ctx.fillStyle = 'rgb(10, 10, 15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Smooth mouse position with lerp
        smoothMouseX = lerp(smoothMouseX, mouseX, LERP_SPEED);
        smoothMouseY = lerp(smoothMouseY, mouseY, LERP_SPEED);
        
        // Fade cursor glow in/out
        const targetOpacity = isMouseOver ? 1 : 0;
        cursorGlowOpacity = lerp(cursorGlowOpacity, targetOpacity, 0.08);

        phosphenes.forEach(p => {
            // Calculate distance to cursor for gravity and proximity effects
            const dx = smoothMouseX - p.x;
            const dy = smoothMouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Gravity pull toward cursor
            if ((isMouseOver || cursorGlowOpacity > 0.01) && distance < PROXIMITY_THRESHOLD && distance > 10) {
                const gravityCurve = 1 - (distance / PROXIMITY_THRESHOLD);
                const gravityForce = gravityCurve * gravityCurve * GRAVITY_STRENGTH * cursorGlowOpacity;
                
                // Normalize direction and apply gravity
                p.vx += (dx / distance) * gravityForce;
                p.vy += (dy / distance) * gravityForce;
            }
            
            p.x += p.vx;
            p.y += p.vy;
            p.pulsePhase += p.pulseSpeed;
            const pulse = Math.sin(p.pulsePhase);
            
            // Base radius and opacity from pulse
            let currentRadius = p.baseRadius + pulse * 40;
            let currentOpacity = p.baseOpacity + pulse * 0.02 * INTENSITY_MULTIPLIER;
            
            // Proximity boost - more pronounced brightness and size
            if ((isMouseOver || cursorGlowOpacity > 0.01) && distance < PROXIMITY_THRESHOLD) {
                const proximityFactor = 1 - (distance / PROXIMITY_THRESHOLD);
                const boost = proximityFactor * proximityFactor * cursorGlowOpacity;
                
                // Increased radius and opacity boost
                currentRadius += boost * 80;
                currentOpacity += boost * 0.08 * INTENSITY_MULTIPLIER;
            }
            
            p.radius = currentRadius;
            p.opacity = Math.min(currentOpacity, 0.15); // Cap opacity
            
            // Gentle drift + damping
            p.vx += (Math.random() - 0.5) * 0.01;
            p.vy += (Math.random() - 0.5) * 0.01;
            p.vx *= 0.99; // Slight damping for smoother movement
            p.vy *= 0.99;
            p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
            p.vy = Math.max(-0.5, Math.min(0.5, p.vy));

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

        // Draw cursor glow on top
        drawCursorGlow();

        requestAnimationFrame(animatePhosphenes);
    }

    // Mouse event listeners
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseenter', () => {
        isMouseOver = true;
    });

    canvas.addEventListener('mouseleave', () => {
        isMouseOver = false;
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        createPhosphenes();
    });

    resizeCanvas();
    createPhosphenes();
    animatePhosphenes();
    
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
        observer.observe(el);
    });
})();
