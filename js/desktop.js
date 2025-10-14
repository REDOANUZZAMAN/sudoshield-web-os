// Desktop Management
class Desktop {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.startMenuOpen = false;
        this.contextMenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateClock();
        this.setupDesktopIcons();
        this.setupTaskbar();
        this.setupStartMenu();
        this.setupContextMenu();
        this.initializeWallpaper();
        this.setupViewportResponsiveness();
        
        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
    }
    
    initializeWallpaper() {
        // Set initial wallpaper based on theme
        const wallpaperEl = document.getElementById('wallpaper');
        if (wallpaperEl) {
            const currentWallpaper = window.webOS?.theme?.wallpaper || 'nebula';
            wallpaperEl.className = '';  // Clear any existing classes
            wallpaperEl.className = `wallpaper-${currentWallpaper}`;
            console.log(`🖼️  Desktop initialized wallpaper: wallpaper-${currentWallpaper}`);
        } else {
            console.warn('⚠️  Wallpaper element not found in desktop initialization');
        }
    }
    
    setupEventListeners() {
        // Desktop click events
        document.getElementById('desktop').addEventListener('click', (e) => {
            if (e.target.id === 'desktop' || e.target.id === 'wallpaper') {
                this.closeStartMenu();
                this.closeContextMenu();
                this.unfocusAllWindows();
            }
        });
        
        // Desktop right-click
        document.getElementById('desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target.id === 'desktop' || e.target.id === 'wallpaper') {
                this.showContextMenu(e.clientX, e.clientY);
            }
        });
        
        // Prevent default drag behavior
        document.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    setupDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const appName = icon.dataset.app;
                this.openApplication(appName);
            });
        });
    }
    
    setupTaskbar() {
        // Start menu button
        document.getElementById('start-menu-button').addEventListener('click', () => {
            this.toggleStartMenu();
        });
    }
    
    setupStartMenu() {
        const startMenuItems = document.querySelectorAll('.start-menu-item');
        startMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                const appName = item.dataset.app;
                this.openApplication(appName);
                this.closeStartMenu();
            });
        });
        
        // Apply app visibility settings from admin panel
        this.applyAppVisibilitySettings();
    }
    
    applyAppVisibilitySettings() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const apps = webOSSettings.apps || {};
            
            // Map of app names from HTML to admin panel app IDs
            const appMapping = {
                'browser': 'browser',
                'premium-browser': 'premiumbrowser',
                'youtube': 'youtube',
                'youtube-premium': 'youtubepremium',
                'facebook': 'facebook',
                'games': 'games',
                'terminal': 'terminal',
                'file-manager': 'filemanager',
                'settings': 'settings',
                'canva': 'canva',
                'slides': 'canva'  // Both map to same admin ID
            };
            
            // Hide/show apps based on admin settings
            document.querySelectorAll('.start-menu-item').forEach(item => {
                const appName = item.dataset.app;
                const adminAppId = appMapping[appName];
                
                if (adminAppId && apps[adminAppId]) {
                    // Only hide if visibility is set to false (not if just disabled)
                    if (apps[adminAppId].visible === false) {
                        item.style.display = 'none';
                        item.classList.add('app-hidden');
                        item.classList.remove('app-disabled');
                    }
                    else {
                        item.style.display = '';
                        item.classList.remove('app-disabled', 'app-hidden');
                        
                        // Add visual indicator if app is disabled (but still visible)
                        if (apps[adminAppId].enabled === false) {
                            item.classList.add('app-disabled');
                            item.style.opacity = '0.5';
                            item.style.cursor = 'not-allowed';
                        } else {
                            item.style.opacity = '';
                            item.style.cursor = '';
                        }
                    }
                }
            });
            
            // Also hide/disable desktop icons based on settings
            document.querySelectorAll('.desktop-icon').forEach(icon => {
                const appName = icon.dataset.app;
                const adminAppId = appMapping[appName];
                
                if (adminAppId && apps[adminAppId]) {
                    // Only hide if visibility is set to false
                    if (apps[adminAppId].visible === false) {
                        icon.style.display = 'none';
                    } else {
                        icon.style.display = '';
                        
                        // Add visual indicator if app is disabled (but still visible)
                        if (apps[adminAppId].enabled === false) {
                            icon.style.opacity = '0.5';
                            icon.style.cursor = 'not-allowed';
                            icon.classList.add('app-disabled');
                        } else {
                            icon.style.opacity = '';
                            icon.style.cursor = '';
                            icon.classList.remove('app-disabled');
                        }
                    }
                }
            });
        } catch(e) {
            console.error('Error applying app visibility settings:', e);
        }
    }
    
    setupContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu) {
            console.error('Context menu element not found during setup');
            return;
        }
        
        const menuItems = contextMenu.querySelectorAll('li');
        
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleContextMenuAction(action);
                this.closeContextMenu();
            });
        });
        
        console.log('Context menu setup complete with', menuItems.length, 'items');
    }

    setupViewportResponsiveness() {
        const apply = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const root = document.documentElement;
            root.classList.toggle('viewport-mobile', w < 640 || h < 500);
            root.classList.toggle('viewport-compact', w < 1100 && w >= 640);
            // Ensure windows stay within bounds
            document.querySelectorAll('.window').forEach(win => {
                if (root.classList.contains('viewport-mobile')) {
                    // Maximize style for mobile
                    win.style.left = '0px';
                    win.style.top = '0px';
                    win.style.width = '100%';
                    win.style.height = `calc(100% - var(--taskbar-height))`;
                } else {
                    // Clamp to viewport
                    const rect = win.getBoundingClientRect();
                    const maxLeft = window.innerWidth - rect.width - 10;
                    const maxTop = window.innerHeight - rect.height - 60;
                    if (parseInt(win.style.left) > maxLeft) win.style.left = Math.max(0, maxLeft) + 'px';
                    if (parseInt(win.style.top) > maxTop) win.style.top = Math.max(0, maxTop) + 'px';
                }
            });
            this.adjustDesktopIcons();
        };
        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(apply, 120);
        });
        apply();
    }

    adjustDesktopIcons() {
        const container = document.getElementById('desktop-icons');
        if (!container) return;
        // Force single horizontal row
        const icons = container.querySelectorAll('.desktop-icon');
        container.classList.remove('responsive-grid');
        container.classList.add('icons-single-row');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        // Calculate required width & scale to viewport if overflow (centered row)
        const baseWidth = 70;
        const gap = 18;
    const padding = 0; // container now has no horizontal padding
        const needed = icons.length * baseWidth + (icons.length - 1) * gap + padding;
        const maxWidth = window.innerWidth - 40; // respect side breathing space
        if (needed > maxWidth) {
            const scale = Math.max(56 / baseWidth, maxWidth / needed);
            const compact = scale < 0.92;
            container.classList.toggle('compact', compact);
            icons.forEach(icon => {
                icon.style.transformOrigin = 'bottom center';
                icon.style.transform = `scale(${scale})`;
            });
        } else {
            container.classList.remove('compact');
            icons.forEach(icon => { icon.style.transform = ''; });
        }
    }
    
    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        const dateString = now.toLocaleDateString([], {
            month: 'short',
            day: 'numeric'
        });
        
        document.getElementById('clock').textContent = `${dateString} ${timeString}`;
    }
    
    openApplication(appName) {
        console.log(`🔍 Attempting to open app: "${appName}"`);
        
        // Check if app is disabled in admin panel
        if (!this.isAppEnabled(appName)) {
            const appTitle = this.getAppTitle(appName);
            console.warn(`⚠️ App "${appTitle}" (${appName}) is disabled by administrator`);
            if (window.webOS?.notify) {
                window.webOS.notify(`${appTitle} is currently disabled`, 'error');
            } else {
                alert(`${appTitle} is currently disabled by the administrator.`);
            }
            return;
        }
        
        console.log(`✅ App "${appName}" is enabled, opening...`);
        
        // Check if app is already open
        if (this.windows.has(appName)) {
            this.focusWindow(appName);
            return;
        }
        
        const WindowManagerClass = window.WindowManager || globalThis.WindowManager;
        
        if (!WindowManagerClass) {
            console.error('❌ WindowManager class is not available');
            window.webOS?.notify?.('Window system unavailable. Please reload.', 'error');
            return;
        }
        
        const windowManager = new WindowManagerClass();
        const appWindow = windowManager.createWindow(appName);
        
        if (appWindow) {
            this.windows.set(appName, appWindow);
            this.addTaskbarApp(appName, appWindow);
        }
    }
    
    isAppEnabled(appName) {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const apps = webOSSettings.apps || {};
            
            // Map of app names to admin panel app IDs
            const appMapping = {
                'browser': 'browser',
                'premium-browser': 'premiumbrowser',
                'youtube': 'youtube',
                'youtube-premium': 'youtubepremium',
                'facebook': 'facebook',
                'games': 'games',
                'terminal': 'terminal',
                'file-manager': 'filemanager',
                'settings': 'settings',
                'canva': 'canva',
                'slides': 'canva'  // Both map to same admin ID
            };
            
            const adminAppId = appMapping[appName];
            
            console.log(`🔍 Checking if "${appName}" is enabled. Admin ID: "${adminAppId}", Settings:`, apps[adminAppId]);
            
            // If app settings exist and app is explicitly disabled, return false
            if (adminAppId && apps[adminAppId] && apps[adminAppId].enabled === false) {
                console.log(`❌ App "${appName}" is DISABLED`);
                return false;
            }
            
            // Default to enabled if no settings found
            console.log(`✅ App "${appName}" is ENABLED (default or explicit)`);
            return true;
        } catch(e) {
            console.error('Error checking app enabled state:', e);
            return true; // Default to enabled on error
        }
    }
    
    addTaskbarApp(appName, window) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.dataset.app = appName;
        
        const icon = this.getAppIcon(appName);
        const title = this.getAppTitle(appName);
        
        taskbarApp.innerHTML = `
            <i class="${icon}"></i>
            <span>${title}</span>
        `;
        
        taskbarApp.addEventListener('click', () => {
            if (window.classList.contains('minimized')) {
                this.restoreWindow(appName);
            } else if (window.classList.contains('focused')) {
                this.minimizeWindow(appName);
            } else {
                this.focusWindow(appName);
            }
        });
        
        taskbarApps.appendChild(taskbarApp);
    }
    
    removeTaskbarApp(appName) {
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
        if (taskbarApp) {
            taskbarApp.remove();
        }
    }
    
    focusWindow(appName) {
        const window = this.windows.get(appName);
        if (window) {
            this.unfocusAllWindows();
            window.classList.add('focused');
            window.classList.remove('minimized');
            window.style.zIndex = ++this.zIndexCounter;
            
            // Update taskbar
            this.updateTaskbarState(appName, true);
        }
    }
    
    minimizeWindow(appName) {
        const window = this.windows.get(appName);
        if (window) {
            window.classList.add('minimized');
            window.classList.remove('focused');
            this.updateTaskbarState(appName, false);
        }
    }
    
    restoreWindow(appName) {
        const window = this.windows.get(appName);
        if (window) {
            window.classList.remove('minimized');
            this.focusWindow(appName);
        }
    }
    
    closeWindow(appName) {
        const window = this.windows.get(appName);
        if (window) {
            window.remove();
            this.windows.delete(appName);
            this.removeTaskbarApp(appName);
        }
    }
    
    unfocusAllWindows() {
        this.windows.forEach(window => {
            window.classList.remove('focused');
        });
        
        // Update taskbar
        document.querySelectorAll('.taskbar-app').forEach(app => {
            app.classList.remove('active');
        });
    }
    
    updateTaskbarState(appName, active) {
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
        if (taskbarApp) {
            if (active) {
                taskbarApp.classList.add('active');
            } else {
                taskbarApp.classList.remove('active');
            }
        }
    }
    
    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        if (this.startMenuOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }
    
    openStartMenu() {
        document.getElementById('start-menu').classList.remove('hidden');
        this.startMenuOpen = true;
    }
    
    closeStartMenu() {
        document.getElementById('start-menu').classList.add('hidden');
        this.startMenuOpen = false;
    }
    
    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        if (!contextMenu) {
            console.error('Context menu element not found');
            return;
        }
        
        // Ensure position is within viewport
        const menuWidth = 150;
        const menuHeight = 120;
        const maxX = window.innerWidth - menuWidth;
        const maxY = window.innerHeight - menuHeight;
        
        contextMenu.style.left = Math.min(x, maxX) + 'px';
        contextMenu.style.top = Math.min(y, maxY) + 'px';
        contextMenu.classList.remove('hidden');
        this.contextMenuOpen = true;
    }
    
    closeContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.classList.add('hidden');
        }
        this.contextMenuOpen = false;
    }
    
    handleContextMenuAction(action) {
        switch (action) {
            case 'refresh':
                location.reload();
                break;
            case 'terminal':
                this.openApplication('terminal');
                break;
            case 'settings':
                this.openApplication('settings');
                break;
        }
    }
    
    getAppIcon(appName) {
        const icons = {
            'browser': 'fas fa-globe',
            'youtube': 'fab fa-youtube',
            'facebook': 'fab fa-facebook',
            'games': 'fas fa-gamepad',
            'terminal': 'fas fa-terminal',
            'file-manager': 'fas fa-folder',
            'settings': 'fas fa-cog',
            'canva': 'fas fa-file-powerpoint'
        };
        return icons[appName] || 'fas fa-window-maximize';
    }
    
    getAppTitle(appName) {
        const titles = {
            'browser': 'Browser',
            'youtube': 'YouTube',
            'facebook': 'Facebook',
            'games': 'Games',
            'terminal': 'Terminal',
            'file-manager': 'Files',
            'settings': 'Settings',
            'canva': 'Slide'
        };
        return titles[appName] || 'Application';
    }
}

// Initialize desktop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new Desktop();
});