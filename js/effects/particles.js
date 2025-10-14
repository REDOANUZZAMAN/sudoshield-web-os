// Cyan Particles Effect System
class ParticlesEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isActive = false;
        this.maxParticles = 80;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 120;
        
        // Particle settings
        this.settings = {
            color: '#00d4ff', // Cyan color
            glowColor: '#00ffff',
            size: { min: 2, max: 5 },
            speed: { min: 0.5, max: 2 },
            opacity: { min: 0.3, max: 0.8 },
            connectionDistance: 120,
            enableConnections: true,
            enableMouseInteraction: true,
            enableGlow: true
        };
    }

    init() {
        if (this.isActive) return;

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '5'; // Below desktop icons (10) but above wallpaper
        
        document.getElementById('desktop')?.prepend(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Create particles
        this.createParticles();
        
        // Event listeners
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Start animation
        this.isActive = true;
        this.animate();
        
        console.log('✨ Cyan particles effect activated');
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * (this.settings.speed.max - this.settings.speed.min + this.settings.speed.min),
            vy: (Math.random() - 0.5) * (this.settings.speed.max - this.settings.speed.min + this.settings.speed.min),
            size: Math.random() * (this.settings.size.max - this.settings.size.min) + this.settings.size.min,
            opacity: Math.random() * (this.settings.opacity.max - this.settings.opacity.min) + this.settings.opacity.min,
            baseOpacity: Math.random() * (this.settings.opacity.max - this.settings.opacity.min) + this.settings.opacity.min
        };
    }

    resize() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate particles on resize
        if (this.particles.length === 0) {
            this.createParticles();
        }
    }

    handleMouseMove(e) {
        if (!this.settings.enableMouseInteraction) return;
        
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    updateParticle(particle) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }
        
        // Mouse interaction
        if (this.settings.enableMouseInteraction) {
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseRadius) {
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                const angle = Math.atan2(dy, dx);
                particle.vx -= Math.cos(angle) * force * 0.2;
                particle.vy -= Math.sin(angle) * force * 0.2;
                particle.opacity = particle.baseOpacity + force * 0.3;
            } else {
                particle.opacity = particle.baseOpacity;
            }
        }
        
        // Limit velocity
        const maxVelocity = this.settings.speed.max;
        const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (velocity > maxVelocity) {
            particle.vx = (particle.vx / velocity) * maxVelocity;
            particle.vy = (particle.vy / velocity) * maxVelocity;
        }
    }

    drawParticle(particle) {
        if (!this.ctx) return;
        
        this.ctx.save();
        
        // Draw glow if enabled
        if (this.settings.enableGlow) {
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = this.settings.glowColor;
        }
        
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = this.settings.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawConnections() {
        if (!this.settings.enableConnections || !this.ctx) return;
        
        this.ctx.save();
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.settings.connectionDistance) {
                    const opacity = (1 - distance / this.settings.connectionDistance) * 0.3;
                    
                    this.ctx.strokeStyle = this.settings.color;
                    this.ctx.globalAlpha = opacity * Math.min(p1.opacity, p2.opacity);
                    this.ctx.lineWidth = 1;
                    
                    if (this.settings.enableGlow) {
                        this.ctx.shadowBlur = 5;
                        this.ctx.shadowColor = this.settings.glowColor;
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.restore();
    }

    animate() {
        if (!this.isActive || !this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Draw connections
        this.drawConnections();
        
        // Continue animation
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        
        // Update particle count if changed
        if (newSettings.maxParticles && newSettings.maxParticles !== this.maxParticles) {
            this.maxParticles = newSettings.maxParticles;
            this.createParticles();
        }
    }

    destroy() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        window.removeEventListener('resize', this.resize.bind(this));
        window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        
        console.log('✨ Cyan particles effect deactivated');
    }

    toggle(enabled) {
        if (enabled && !this.isActive) {
            this.init();
        } else if (!enabled && this.isActive) {
            this.destroy();
        }
    }
}

// Initialize global instance
if (!window.particlesEffect) {
    window.particlesEffect = new ParticlesEffect();
}

// Load from localStorage if enabled
try {
    const settings = window.webOS?.settings;
    if (settings && settings.particlesEnabled) {
        setTimeout(() => {
            window.particlesEffect.init();
        }, 500);
    }
} catch (e) {
    console.warn('Failed to load particles settings', e);
}
