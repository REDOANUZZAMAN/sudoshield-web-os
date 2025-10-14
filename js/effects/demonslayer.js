// Demon Slayer Theme - Tanjiro Kamado Effects
class DemonSlayerEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.swordSlashes = [];
        this.waterDroplets = [];
        this.enabled = false;
        this.animationFrame = null;
        
        // Tanjiro's colors
        this.colors = {
            hanafuda: ['#c41e3a', '#000000', '#ff6b6b'],
            water: ['#409cff', '#00bfff', '#1e90ff', '#4682b4'],
            fire: ['#ff4500', '#ff6347', '#ffa500', '#ff8c00']
        };
        
        this.init();
    }
    
    init() {
        // Check if Demon Slayer theme is active
        const currentWallpaper = document.getElementById('wallpaper')?.className;
        if (currentWallpaper && currentWallpaper.includes('wallpaper-demonslayer')) {
            this.enable();
        }
    }
    
    enable() {
        if (this.enabled) return;
        this.enabled = true;
        
        // Create canvas if it doesn't exist
        if (!this.canvas) {
            this.createCanvas();
        }
        
        // Initialize particles
        this.createHanafudaParticles();
        this.createWaterDroplets();
        
        // Start animation
        this.animate();
        
        console.log('⚔️ Demon Slayer Effect Enabled - Tanjiro Mode');
    }
    
    disable() {
        if (!this.enabled) return;
        this.enabled = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (this.canvas) {
            this.canvas.style.opacity = '0';
            setTimeout(() => {
                if (this.canvas && this.canvas.parentNode) {
                    this.canvas.parentNode.removeChild(this.canvas);
                    this.canvas = null;
                    this.ctx = null;
                }
            }, 500);
        }
        
        console.log('⚔️ Demon Slayer Effect Disabled');
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'demonslayer-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '6';
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 1s ease';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Fade in
        setTimeout(() => {
            if (this.canvas) {
                this.canvas.style.opacity = '1';
            }
        }, 100);
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createHanafudaParticles() {
        // Create Hanafuda earring-inspired particles
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + Math.random() * 200,
                size: Math.random() * 8 + 4,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * -3 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 4 - 2,
                color: this.colors.hanafuda[Math.floor(Math.random() * this.colors.hanafuda.length)],
                opacity: Math.random() * 0.6 + 0.3,
                type: 'hanafuda'
            });
        }
    }
    
    createWaterDroplets() {
        // Create water breathing effect droplets
        const dropletCount = 25;
        for (let i = 0; i < dropletCount; i++) {
            this.waterDroplets.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 15 + 5,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 2 - 1,
                opacity: Math.random() * 0.4 + 0.2,
                life: Math.random() * 100,
                maxLife: 100,
                color: this.colors.water[Math.floor(Math.random() * this.colors.water.length)],
                type: 'water'
            });
        }
    }
    
    createSwordSlash() {
        // Occasionally create sword slash effects
        if (Math.random() < 0.02) {
            this.swordSlashes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                length: Math.random() * 200 + 150,
                width: Math.random() * 4 + 2,
                angle: Math.random() * 360,
                speed: Math.random() * 15 + 10,
                opacity: 0.8,
                life: 0,
                maxLife: 30,
                color: Math.random() > 0.5 ? '#409cff' : '#00bfff'
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;
            
            // Wrap around screen
            if (particle.y < -50) {
                particle.y = window.innerHeight + 50;
                particle.x = Math.random() * window.innerWidth;
            }
            if (particle.x < -50) particle.x = window.innerWidth + 50;
            if (particle.x > window.innerWidth + 50) particle.x = -50;
            
            // Fade effect
            particle.opacity += Math.sin(Date.now() * 0.001 + index) * 0.01;
            particle.opacity = Math.max(0.2, Math.min(0.8, particle.opacity));
        });
    }
    
    updateWaterDroplets() {
        this.waterDroplets.forEach((droplet, index) => {
            // Update position
            droplet.x += droplet.speedX;
            droplet.y += droplet.speedY;
            
            // Update life
            droplet.life++;
            if (droplet.life >= droplet.maxLife) {
                droplet.life = 0;
                droplet.x = Math.random() * window.innerWidth;
                droplet.y = Math.random() * window.innerHeight;
                droplet.speedX = Math.random() * 3 - 1.5;
                droplet.speedY = Math.random() * 2 - 1;
            }
            
            // Boundary check
            if (droplet.x < 0 || droplet.x > window.innerWidth) droplet.speedX *= -1;
            if (droplet.y < 0 || droplet.y > window.innerHeight) droplet.speedY *= -1;
            
            // Flowing effect
            droplet.opacity = 0.3 + Math.sin(droplet.life * 0.1) * 0.2;
        });
    }
    
    updateSwordSlashes() {
        this.swordSlashes.forEach((slash, index) => {
            slash.life++;
            slash.opacity = 1 - (slash.life / slash.maxLife);
            
            // Move slash
            const radians = slash.angle * Math.PI / 180;
            slash.x += Math.cos(radians) * slash.speed;
            slash.y += Math.sin(radians) * slash.speed;
            
            // Remove if expired
            if (slash.life >= slash.maxLife) {
                this.swordSlashes.splice(index, 1);
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            
            // Draw Hanafuda-style square with pattern
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            
            // Add glow
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.strokeStyle = particle.color;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            
            this.ctx.restore();
        });
    }
    
    drawWaterDroplets() {
        this.waterDroplets.forEach(droplet => {
            this.ctx.save();
            this.ctx.globalAlpha = droplet.opacity;
            
            // Draw water droplet
            const gradient = this.ctx.createRadialGradient(
                droplet.x, droplet.y, 0,
                droplet.x, droplet.y, droplet.size
            );
            gradient.addColorStop(0, droplet.color + 'aa');
            gradient.addColorStop(0.5, droplet.color + '44');
            gradient.addColorStop(1, droplet.color + '00');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(droplet.x, droplet.y, droplet.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add shimmer
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = droplet.color;
            
            this.ctx.restore();
        });
    }
    
    drawSwordSlashes() {
        this.swordSlashes.forEach(slash => {
            this.ctx.save();
            this.ctx.globalAlpha = slash.opacity;
            
            this.ctx.translate(slash.x, slash.y);
            this.ctx.rotate(slash.angle * Math.PI / 180);
            
            // Draw blade trail
            const gradient = this.ctx.createLinearGradient(0, 0, slash.length, 0);
            gradient.addColorStop(0, slash.color + '00');
            gradient.addColorStop(0.3, slash.color + 'ff');
            gradient.addColorStop(0.7, slash.color + 'ff');
            gradient.addColorStop(1, slash.color + '00');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = slash.width;
            this.ctx.lineCap = 'round';
            
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = slash.color;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(slash.length, 0);
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    animate() {
        if (!this.enabled || !this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw all elements
        this.updateParticles();
        this.updateWaterDroplets();
        this.updateSwordSlashes();
        this.createSwordSlash();
        
        this.drawWaterDroplets();
        this.drawParticles();
        this.drawSwordSlashes();
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Initialize Demon Slayer effect when wallpaper changes
if (typeof window !== 'undefined') {
    window.demonSlayerEffect = new DemonSlayerEffect();
    
    // Listen for wallpaper changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const wallpaper = document.getElementById('wallpaper');
                if (wallpaper && wallpaper.className.includes('wallpaper-demonslayer')) {
                    window.demonSlayerEffect.enable();
                } else if (window.demonSlayerEffect.enabled) {
                    window.demonSlayerEffect.disable();
                }
            }
        });
    });
    
    const wallpaperEl = document.getElementById('wallpaper');
    if (wallpaperEl) {
        observer.observe(wallpaperEl, { attributes: true });
    }
}
