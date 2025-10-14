// Main Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    // If auth redirected here and wants a one-time reload, handle it first
    try{
        const urlParams = new URLSearchParams(window.location.search);
        const authReloadParam = urlParams.get('auth_reload');
        const reloadOnce = localStorage.getItem('sudoshield.os.reload_once');

        if (authReloadParam === '1' || reloadOnce === 'true') {
            // Clear both sources so we only reload once
            try{ localStorage.removeItem('sudoshield.os.reload_once'); }catch(e){}
            // Remove the query param from URL so reload won't loop
            urlParams.delete('auth_reload');
            const cleanUrl = window.location.pathname + (urlParams.toString() ? ('?' + urlParams.toString()) : '');
            console.log('🔁 auth reload requested - performing one-time reload to finalize init');
            // Replace URL without query param and reload once
            location.replace(cleanUrl);
            return; // stop further initialization in this pass
        }
    }catch(e){ console.warn('reload-once check failed', e); }
    // Check for maintenance mode reload trigger
    checkMaintenanceReload();
    
    // Initialize admin change listener
    initAdminChangeListener();
    
    // Initialize the desktop environment
    console.log('🚀 Starting SudoShield OS...');
    
    // Check if all required components are loaded
    const requiredApps = [
        'BrowserApp',
        'YouTubeApp', 
        'FacebookApp',
        'GamesApp',
        'TerminalApp',
        'FileManagerApp',
        'SettingsApp'
    ];
    
    const missingApps = requiredApps.filter(app => !window[app.toLowerCase().replace('app', 'App')]);
    
    if (missingApps.length > 0) {
        console.warn('⚠️  Some applications failed to load:', missingApps);
    }
    
    // Initialize desktop after a short delay to ensure all components are ready
    setTimeout(() => {
        if (window.desktop) {
            console.log('✅ SudoShield OS desktop initialized successfully');
            // Apply persisted theme early
            if (window.webOS?.theme) {
                const root = document.documentElement;
                root.style.setProperty('--accent', window.webOS.theme.accentColor);
                root.style.setProperty('--accent-light', window.webOS.theme.accentColor + '20');
                
                // Apply wallpaper with proper initialization
                const wallpaperEl = document.getElementById('wallpaper');
                if (wallpaperEl) {
                    const currentWallpaper = window.webOS.theme.wallpaper || 'nebula';
                    
                    // Clear existing classes and set new one
                    wallpaperEl.removeAttribute('class');
                    wallpaperEl.className = `wallpaper-${currentWallpaper}`;
                    
                    console.log(`🎨 Initial wallpaper applied: wallpaper-${currentWallpaper}`);
                    console.log(`Element classes:`, wallpaperEl.className);
                    
                    // Force style recalculation
                    wallpaperEl.offsetHeight;
                    
                    // Log computed styles for debugging
                    const computedStyle = getComputedStyle(wallpaperEl);
                    console.log(`Computed background:`, computedStyle.background);
                    
                    // Initialize Matrix Rain if needed
                    if (currentWallpaper === 'rain' && window.matrixRain) {
                        setTimeout(() => window.matrixRain.init(), 200);
                    }
                } else {
                    console.warn('⚠️  Wallpaper element not found during initialization');
                }
                
                updateShieldGradient();
            } else {
                // Apply default theme if no persisted theme
                const wallpaperEl = document.getElementById('wallpaper');
                if (wallpaperEl) {
                    wallpaperEl.className = 'wallpaper-nebula';
                    console.log('🎨 Applied default wallpaper: wallpaper-nebula');
                }
            }
            
            // Add welcome message
            showWelcomeMessage();
            
            // Set up error handling
            setupErrorHandling();
            
            // Initialize performance monitoring
            setupPerformanceMonitoring();
        } else {
            console.error('❌ Failed to initialize SudoShield OS desktop');
        }
    }, 100);
});

function showWelcomeMessage() {
    // Create welcome notification
    const notification = document.createElement('div');
    notification.className = 'welcome-notification';
    // Force glassy transparent container to override CSS variables that set solid backgrounds
    notification.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))';
    notification.style.border = '1px solid rgba(255,255,255,0.06)';
    notification.style.boxShadow = '0 8px 30px rgba(8,10,14,0.6)';
    notification.style.backdropFilter = 'blur(8px) saturate(110%)';
    notification.style.WebkitBackdropFilter = 'blur(8px) saturate(110%)';
    notification.innerHTML = `
        <div class="welcome-content" style="background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border:1px solid rgba(255,255,255,0.06); border-radius:10px; box-shadow:0 8px 24px rgba(8,10,14,0.6); backdrop-filter: blur(8px) saturate(110%); -webkit-backdrop-filter: blur(8px) saturate(110%);">
            <h3>
                <span class="welcome-shield-wrapper" style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;margin-right:8px;">
                    <svg id="welcome-shield" width="42" height="42" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="welcomeShieldGradient" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="var(--accent)" />
                                <stop offset="55%" stop-color="var(--accent-secondary)" />
                                <stop offset="100%" stop-color="var(--accent-tertiary)" />
                            </linearGradient>
                            <filter id="welcomeShieldGlow" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 0.5  0 0 0 0.55 0" result="glow" />
                                <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                        </defs>
                        <path d="M32 4 10 12v18c0 16.2 9.6 24.9 22 30 12.4-5.1 22-13.8 22-30V12L32 4Z" fill="url(#welcomeShieldGradient)" stroke="rgba(255,255,255,0.25)" stroke-width="2" filter="url(#welcomeShieldGlow)"/>
                        <path d="M32 14 18 19v11c0 10.2 6 16.1 14 19.6 8-3.5 14-9.4 14-19.6V19L32 14Z" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
                        <path d="M32 24c4.4 0 8 3.6 8 8 0 4.4-3.6 8-8 8s-8-3.6-8-8c0-1.4.4-2.8 1.1-4h5.9l-4 4.2c.6 2 2.4 3.8 5 3.8 2.8 0 5-2.2 5-5 0-.9-.3-1.8-.7-2.5H32v-4.5Z" fill="white" fill-opacity="0.92"/>
                    </svg>
                </span>
                Welcome to SudoShield OS!
            </h3>
            <p>Sudoshield desktop environment is ready.</p>
            <div class="welcome-actions">
                <button onclick="window.desktop.openApplication('terminal')" class="welcome-btn">
                    <i class="fas fa-terminal"></i> Open Terminal
                </button>
                <button onclick="window.desktop.openApplication('browser')" class="welcome-btn">
                    <i class="fas fa-globe"></i> Browse Web
                </button>
                <button onclick="closeWelcome()" class="welcome-btn secondary">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeWelcome();
        }
    }, 10000);
}

function closeWelcome() {
    const notification = document.querySelector('.welcome-notification');
    if (notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('🔥 Application Error:', e.error);
        
        // Show user-friendly error message
        showErrorNotification('An unexpected error occurred. The system is still functional.');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('🔥 Unhandled Promise Rejection:', e.reason);
        
        // Show user-friendly error message
        showErrorNotification('A background process encountered an error.');
    });
}

function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="error-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
}

// Play notification sound
function playNotificationSound() {
    try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant notification sound (two-tone)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Silently fail if audio not supported
        console.warn('Notification sound failed:', e);
    }
}

function setupPerformanceMonitoring() {
    // Monitor window count
    const originalCreateWindow = window.WindowManager?.prototype?.createWindow;
    if (originalCreateWindow) {
        window.WindowManager.prototype.createWindow = function(...args) {
            const result = originalCreateWindow.apply(this, args);
            
            // Warn if too many windows are open
            const windowCount = document.querySelectorAll('.window').length;
            if (windowCount > 5) {
                console.warn('⚠️  Performance warning: Many windows are open');
            }
            
            return result;
        };
    }
    
    // Monitor memory usage (if available)
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('⚠️  Memory usage is high');
            }
        }, 30000); // Check every 30 seconds
    }
}

// Extend webOS if it exists, otherwise create it
if (!window.webOS) {
    window.webOS = { version: '1.0.0' };
}

// Add utility functions to webOS
Object.assign(window.webOS, {
    
    // Utility function to safely execute code
    safeExecute: (fn, errorMessage = 'Operation failed') => {
        try {
            return fn();
        } catch (error) {
            console.error(errorMessage, error);
            showErrorNotification(errorMessage);
            return null;
        }
    },
    
    // Utility function to show notifications
    notify: (message, type = 'info') => {
        // Play notification sound if enabled
        if (window.webOS?.settings?.notificationSounds !== false) {
            playNotificationSound();
        }
        
        const notification = document.createElement('div');
        notification.className = `system-notification ${type}`;
        
        // Icon based on type
        const iconMap = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Position notifications in bottom-right corner
        const notifications = document.querySelectorAll('.system-notification');
        notifications.forEach((notif, index) => {
            notif.style.bottom = (20 + index * 80) + 'px';
        });
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                
                // Remove after animation
                setTimeout(() => {
                    notification.remove();
                    
                    // Reposition remaining notifications
                    const remaining = document.querySelectorAll('.system-notification');
                    remaining.forEach((notif, index) => {
                        notif.style.bottom = (20 + index * 80) + 'px';
                    });
                }, 300);
            }
        }, 5000);
    },
    
    // Get system information
    getSystemInfo: () => ({
        version: window.webOS.version,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        windowCount: document.querySelectorAll('.window').length,
        uptime: Date.now() - window.startTime
    })
});

// Store start time for uptime calculation
window.startTime = Date.now();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Global shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Alt': // Ctrl+Alt (for Linux-like shortcuts)
                if (e.altKey) {
                    switch (e.code) {
                        case 'KeyT':
                            e.preventDefault();
                            window.desktop?.openApplication('terminal');
                            break;
                        case 'KeyF':
                            e.preventDefault();
                            window.desktop?.openApplication('file-manager');
                            break;
                    }
                }
                break;
        }
    }
    
    // Function keys
    switch (e.key) {
        case 'F11':
            e.preventDefault();
            toggleFullscreen();
            break;
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported or denied');
        });
    } else {
        document.exitFullscreen();
    }
}

// Update shield gradient stops to reflect current accent variables
function updateShieldGradient() {
    const svg = document.getElementById('shield-logo');
    if (!svg) return;
    const gradient = svg.querySelector('#shieldGradient');
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const accent2 = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim();
    const accent3 = getComputedStyle(document.documentElement).getPropertyValue('--accent-tertiary').trim();
    if (gradient) {
        const stops = gradient.querySelectorAll('stop');
        if (stops.length >= 3) {
            stops[0].setAttribute('stop-color', accent);
            stops[1].setAttribute('stop-color', accent2);
            stops[2].setAttribute('stop-color', accent3);
        }
    }
    const welcomeGradient = document.querySelector('#welcome-shield #welcomeShieldGradient');
    if (welcomeGradient) {
        const wStops = welcomeGradient.querySelectorAll('stop');
        if (wStops.length >= 3) {
            wStops[0].setAttribute('stop-color', accent);
            wStops[1].setAttribute('stop-color', accent2);
            wStops[2].setAttribute('stop-color', accent3);
        }
    }
}

// Listen for accent changes via Settings app events
window.webOS?.bus?.addEventListener('theme:accent', () => {
    requestAnimationFrame(updateShieldGradient);
});

// Console welcome message
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                      SudoShield OS v1.0                      ║
║         Hardened Linux-inspired Desktop Environment          ║
║                    Built with Web Technologies               ║
╠══════════════════════════════════════════════════════════════╣
║  Features:                                                   ║
║  • Window Management System                                  ║
║  • File Manager & Terminal                                   ║
║  • Shielded Web Browser with Navigation                      ║
║  • YouTube & Social Media Apps                              ║
║  • Games Collection                                          ║
║  • Drag & Drop, Resize, Minimize/Maximize                    ║
║                                                              ║
║  Shortcuts:                                                  ║
║  • Ctrl+Alt+T: Open Terminal                                 ║
║  • Ctrl+Alt+F: Open File Manager                             ║
║  • F11: Toggle Fullscreen                                    ║
║  • Right-click: Context Menu                                 ║
║                                                              ║
║  Try typing 'help' in the terminal or exploring the apps!    ║
╚══════════════════════════════════════════════════════════════╝
`);

// Expose system information for debugging
window.debug = {
    desktop: () => window.desktop,
    apps: () => ({
        browser: window.browserApp,
        youtube: window.youtubeApp,
        facebook: window.facebookApp,
        games: window.gamesApp,
        terminal: window.terminalApp,
        fileManager: window.fileManagerApp,
        settings: window.settingsApp
    }),
    windows: () => document.querySelectorAll('.window'),
    systemInfo: () => window.webOS.getSystemInfo()
};

// Check if maintenance mode was disabled and reload is needed
function checkMaintenanceReload() {
    const reloadFlag = localStorage.getItem('sudoshield.maintenance.reload');
    
    if (reloadFlag === 'true') {
        // Clear the reload flag
        localStorage.removeItem('sudoshield.maintenance.reload');
        
        // Show notification that site is back online
        console.log('✅ Maintenance mode disabled - System back online');
        
        // If we're on maintenance page, redirect to main site
        if (window.location.pathname.includes('maintenance.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Listen for maintenance mode changes in real-time (for open tabs)
setInterval(() => {
    const maintenance = JSON.parse(localStorage.getItem('sudoshield.maintenance') || '{}');
    const reloadFlag = localStorage.getItem('sudoshield.maintenance.reload');
    
    // If maintenance was just disabled
    if (reloadFlag === 'true' && !maintenance.enabled) {
        localStorage.removeItem('sudoshield.maintenance.reload');
        
        // Reload the page if on maintenance
        if (window.location.pathname.includes('maintenance.html')) {
            console.log('🔄 Auto-reloading: Maintenance mode disabled');
            window.location.href = 'index.html';
        }
    }
    
    // Check for widget/app settings changes
    const osReloadFlag = localStorage.getItem('sudoshield.os.reload');
    if (osReloadFlag === 'true') {
        localStorage.removeItem('sudoshield.os.reload');
        
        // Only reload if we're on the main OS page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/os/')) {
            console.log('🔄 Auto-reloading: Widget/App settings changed');
            location.reload();
        }
    }
}, 2000); // Check every 2 seconds

// ==================== Admin Panel Auto-Refresh System ====================

// Initialize admin change listener for auto-refresh
function initAdminChangeListener() {
    console.log('🎧 Initializing admin change listener...');
    
    // Method 1: BroadcastChannel (modern browsers, instant communication)
    if (typeof BroadcastChannel !== 'undefined') {
        const adminChannel = new BroadcastChannel('sudoshield-admin');
        
        adminChannel.onmessage = (event) => {
            if (event.data.action === 'refresh') {
                const changeType = event.data.data.type;
                console.log('📡 Received refresh signal from admin panel via BroadcastChannel:', changeType);
                handleAdminRefresh(changeType);
            }
        };
        
        console.log('✅ BroadcastChannel listener initialized');
    }
    
    // Method 2: localStorage event (fallback, cross-browser)
    window.addEventListener('storage', (e) => {
        if (e.key === 'sudoshield.admin.change' && e.newValue) {
            try {
                const changeData = JSON.parse(e.newValue);
                console.log('📡 Received refresh signal from admin panel via localStorage:', changeData.type);
                handleAdminRefresh(changeData.type);
            } catch (error) {
                console.error('Error parsing admin change data:', error);
            }
        }
    });
    
    // Method 3: Polling (backup for same-tab changes)
    let lastChangeCheck = Date.now();
    setInterval(() => {
        const changeData = localStorage.getItem('sudoshield.admin.change');
        if (changeData) {
            try {
                const data = JSON.parse(changeData);
                if (data.timestamp > lastChangeCheck) {
                    lastChangeCheck = data.timestamp;
                    console.log('📡 Detected admin change via polling:', data.type);
                    handleAdminRefresh(data.type);
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }
    }, 1000);
    
    console.log('✅ Admin change listener fully initialized');
}

// Handle refresh based on change type
function handleAdminRefresh(changeType) {
    console.log('🔄 Processing admin change:', changeType);
    
    // Create user-friendly messages based on change type
    const messages = {
        'accent-color': '🎨 Accent color updated!',
        'wallpaper': '🖼️ Wallpaper changed!',
        'theme-preset': '🎨 Theme preset applied!',
        'maintenance-enabled': '🔧 Maintenance mode enabled',
        'maintenance-disabled': '✅ Maintenance mode disabled',
        'settings': '⚙️ Settings updated!'
    };
    
    // Check if it's an effect change
    let message = messages[changeType] || '✨ Admin settings updated!';
    if (changeType.startsWith('effect-')) {
        const effectName = changeType.replace('effect-', '').replace('-', ' ');
        message = `✨ ${effectName.charAt(0).toUpperCase() + effectName.slice(1)} effect updated!`;
    }
    
    // Show notification to user
    if (window.webOS && window.webOS.notify) {
        window.webOS.notify(message + ' Refreshing in 2 seconds...', 'success');
    }
    
    // Wait 2 seconds to show notification, then reload
    setTimeout(() => {
        console.log('🔄 Reloading page due to admin panel changes...');
        location.reload();
    }, 2000);
}