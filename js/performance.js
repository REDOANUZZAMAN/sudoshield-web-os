// Performance Optimization Module for SudoShield OS

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            appLaunchTimes: {},
            memoryUsage: 0,
            fps: 60,
            frameTime: 0
        };
        
        this.fpsLimit = 60;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / this.fpsLimit;
        this.performanceMode = 'balanced'; // 'performance', 'balanced', 'quality'
        
        this.init();
    }
    
    init() {
        // Load performance settings
        this.loadPerformanceSettings();
        
        // Enable CSS containment for better rendering performance
        this.enableCSSContainment();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Setup lazy loading
        this.setupLazyLoading();
        
        // Monitor performance
        this.monitorPerformance();
        
        // Start FPS monitoring
        this.startFPSMonitoring();
        
        // Apply performance mode
        this.applyPerformanceMode(this.performanceMode);
        
        console.log(`⚡ Performance optimizer initialized (${this.performanceMode} mode, ${this.fpsLimit} FPS)`);
    }
    
    loadPerformanceSettings() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const perfSettings = webOSSettings.performance || {};
            this.performanceMode = perfSettings.performanceMode || this.detectOptimalMode();
            this.fpsLimit = perfSettings.fpsLimit || 60;
            this.frameInterval = 1000 / this.fpsLimit;
        } catch (e) {
            console.error('Error loading performance settings:', e);
        }
    }
    
    savePerformanceSettings() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.performance) webOSSettings.performance = {};
            webOSSettings.performance.performanceMode = this.performanceMode;
            webOSSettings.performance.fpsLimit = this.fpsLimit;
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
        } catch (e) {
            console.error('Error saving performance settings:', e);
        }
    }
    
    detectOptimalMode() {
        // Detect device capabilities
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 4;
        
        if (cores <= 2 || memory <= 2) {
            return 'performance';
        } else if (cores >= 6 && memory >= 8) {
            return 'quality';
        }
        return 'balanced';
    }
    
    applyPerformanceMode(mode) {
        this.performanceMode = mode;
        
        switch(mode) {
            case 'performance':
                this.fpsLimit = 30;
                this.disableHeavyEffects();
                this.reduceAnimations();
                console.log('🔋 Performance mode: 30 FPS, reduced effects');
                break;
            case 'balanced':
                this.fpsLimit = 60;
                this.enableModerateEffects();
                this.normalAnimations();
                console.log('⚖️ Balanced mode: 60 FPS, moderate effects');
                break;
            case 'quality':
                this.fpsLimit = 120;
                this.enableAllEffects();
                this.normalAnimations();
                console.log('✨ Quality mode: 120 FPS, all effects');
                break;
        }
        
        this.frameInterval = 1000 / this.fpsLimit;
        this.savePerformanceSettings();
    }
    
    disableHeavyEffects() {
        // Disable particles
        if (window.particlesEffect) {
            window.particlesEffect.toggle(false);
        }
        // Reduce blur
        document.documentElement.style.setProperty('--blur-amount', '3px');
        // Disable accent pulse
        document.documentElement.classList.remove('accent-pulse');
    }
    
    enableModerateEffects() {
        // Normal blur
        document.documentElement.style.setProperty('--blur-amount', '10px');
    }
    
    enableAllEffects() {
        // Full blur
        document.documentElement.style.setProperty('--blur-amount', '15px');
    }
    
    reduceAnimations() {
        // Reduce animation durations
        document.documentElement.style.setProperty('--animation-speed', '0.15s');
    }
    
    normalAnimations() {
        // Normal animation durations
        document.documentElement.style.setProperty('--animation-speed', '0.3s');
    }
    
    startFPSMonitoring() {
        let frames = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.metrics.frameTime = (currentTime - lastTime) / frames;
                frames = 0;
                lastTime = currentTime;
                
                // Broadcast FPS to webOS
                if (window.webOS) {
                    window.webOS.fps = this.metrics.fps;
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
    }
    
    enableCSSContainment() {
        // Add containment to frequently updated elements
        const style = document.createElement('style');
        style.textContent = `
            .window {
                contain: layout style paint;
                will-change: transform;
            }
            
            .desktop-icon {
                contain: layout style;
            }
            
            .start-menu {
                contain: layout style paint;
            }
            
            .taskbar-app {
                contain: layout;
            }
            
            /* Hardware acceleration for smooth animations */
            .window, .desktop-icon, .start-menu, .context-menu {
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            
            /* Reduce repaints */
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeAnimations() {
        // Use requestAnimationFrame for smooth animations
        const smoothScroll = (element, target, duration = 300) => {
            const start = element.scrollTop;
            const change = target - start;
            const startTime = performance.now();
            
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeInOutQuad = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                element.scrollTop = start + (change * easeInOutQuad);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            
            requestAnimationFrame(animateScroll);
        };
        
        window.smoothScroll = smoothScroll;
    }
    
    setupLazyLoading() {
        // Defer loading of non-critical images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            window.lazyImageObserver = imageObserver;
        }
    }
    
    monitorPerformance() {
        // Track page load time
        window.addEventListener('load', () => {
            if (window.performance) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                this.metrics.loadTime = pageLoadTime;
                
                console.log(`📊 Page loaded in ${pageLoadTime}ms`);
            }
        });
        
        // Monitor memory usage (if available)
        if (window.performance && performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
            }, 10000);
        }
    }
    
    // Debounce function for expensive operations
    debounce(func, wait = 150) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for scroll/resize events
    throttle(func, limit = 16) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Optimize DOM operations
    batchDOMUpdates(updates) {
        requestAnimationFrame(() => {
            updates.forEach(update => update());
        });
    }
    
    // Track app launch performance
    trackAppLaunch(appName, startTime) {
        const launchTime = performance.now() - startTime;
        this.metrics.appLaunchTimes[appName] = launchTime;
        console.log(`⚡ ${appName} launched in ${Math.round(launchTime)}ms`);
        return launchTime;
    }
    
    // Get performance report
    getReport() {
        return {
            ...this.metrics,
            fps: this.getCurrentFPS(),
            timestamp: new Date().toISOString()
        };
    }
    
    getCurrentFPS() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 60;
        
        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
        return fps;
    }
}

// Initialize performance optimizer
window.perfOptimizer = new PerformanceOptimizer();

// Export utility functions globally
window.debounce = (func, wait) => window.perfOptimizer.debounce(func, wait);
window.throttle = (func, limit) => window.perfOptimizer.throttle(func, limit);
