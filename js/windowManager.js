// Window Management System
class WindowManager {
    constructor() {
        this.dragState = {
            isDragging: false,
            isResizing: false,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
            startLeft: 0,
            startTop: 0,
            resizeDirection: null,
            rafId: null,
            lastTranslateX: 0,
            lastTranslateY: 0,
            targetWindow: null
        };

        this._zIndexCounter = 100;
    }
    
    createWindow(appName) {
        const startTime = performance.now();
        const windowsContainer = document.getElementById('windows-container');
        const windowElement = document.createElement('div');
        windowElement.className = 'window focused';
        windowElement.dataset.app = appName;

        // Set initial position and size
        const rect = this.getInitialWindowRect();
        
        // Use left/top for consistency with maximize/restore
        windowElement.style.left = rect.left + 'px';
        windowElement.style.top = rect.top + 'px';
        windowElement.style.width = rect.width + 'px';
        windowElement.style.height = rect.height + 'px';
        windowElement.style.zIndex = this.allocateZIndex();

        // Create window structure
        windowElement.innerHTML = this.createWindowHTML(appName);

        // Add to DOM first (single reflow)
        windowsContainer.appendChild(windowElement);

        // Batch DOM operations using requestAnimationFrame
        requestAnimationFrame(() => {
            // Add event listeners
            this.setupWindowEvents(windowElement);

            // Add resize handles
            this.addResizeHandles(windowElement);

            // Load app content after render
            requestAnimationFrame(() => {
                this.loadAppContent(windowElement, appName);
                
                // Track performance
                if (window.perfOptimizer) {
                    window.perfOptimizer.trackAppLaunch(appName, startTime);
                }
            });
        });

        return windowElement;
    }
    
    createWindowHTML(appName) {
        const title = this.getAppTitle(appName);
        const icon = this.getAppIcon(appName);
        
        return `
            <div class="window-header">
                <div class="window-title">
                    <i class="${icon}"></i>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize">
                        <i class="fas fa-minus"></i>
                    </div>
                    <div class="window-control maximize">
                        <i class="fas fa-expand-alt"></i>
                    </div>
                    <div class="window-control close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
            <div class="window-content">
                <div class="window-loading">
                    <i class="fas fa-spinner"></i>
                    <p>Loading ${title}...</p>
                </div>
            </div>
        `;
    }
    
    setupWindowEvents(windowElement) {
        const header = windowElement.querySelector('.window-header');
        const controls = windowElement.querySelectorAll('.window-control');
        
        // Window dragging
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            this.startDrag(windowElement, e);
        });
        
        // Window controls
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.classList.contains('minimize') ? 'minimize' :
                              control.classList.contains('maximize') ? 'maximize' : 'close';
                this.handleWindowControl(windowElement, action);
            });
        });
        
        // Window focus
        windowElement.addEventListener('mousedown', () => {
            this.focusWindow(windowElement);
        });
        
        // Global mouse events with RAF optimization
        let rafId = null;
        document.addEventListener('mousemove', (e) => {
            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    this.handleMouseMove(e);
                    rafId = null;
                });
            }
        });
        document.addEventListener('mouseup', () => this.handleMouseUp());
    }
    
    addResizeHandles(windowElement) {
        const directions = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        
        directions.forEach(direction => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${direction}`;
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startResize(windowElement, e, direction);
            });
            windowElement.appendChild(handle);
        });
    }
    
    startDrag(windowElement, e) {
        if (windowElement.classList.contains('maximized')) return;
        
        this.dragState.isDragging = true;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        
        // Get current position (handle both left/top and transform)
        const rect = windowElement.getBoundingClientRect();
        this.dragState.startLeft = parseInt(windowElement.style.left) || rect.left;
        this.dragState.startTop = parseInt(windowElement.style.top) || rect.top;
        this.dragState.targetWindow = windowElement;
        this.dragState.lastTranslateX = 0;
        this.dragState.lastTranslateY = 0;

        // Clear any transform and ensure we're using left/top
        windowElement.style.transform = '';

        // Add light-weight dragging state to reduce visual cost during drag
        windowElement.classList.add('dragging');
        windowElement.style.willChange = 'left, top';
        windowElement.style.transition = 'none';

        document.body.style.cursor = 'move';
        document.body.style.userSelect = 'none';
    }
    
    startResize(windowElement, e, direction) {
        if (windowElement.classList.contains('maximized')) return;
        
        this.dragState.isResizing = true;
        this.dragState.resizeDirection = direction;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        this.dragState.startWidth = windowElement.offsetWidth;
        this.dragState.startHeight = windowElement.offsetHeight;
        this.dragState.startLeft = parseInt(windowElement.style.left) || 0;
        this.dragState.startTop = parseInt(windowElement.style.top) || 0;
        this.dragState.currentWindow = windowElement;
        
        document.body.style.userSelect = 'none';
    }
    
    handleMouseMove(e) {
        if (this.dragState.isDragging) {
            this.dragWindow(e);
        } else if (this.dragState.isResizing) {
            this.resizeWindow(e);
        }
    }
    
    dragWindow(e) {
        const ws = this.dragState;
        const windowElement = ws.targetWindow || document.querySelector('.window.focused');
        if (!windowElement || !ws.isDragging) return;

        const deltaX = e.clientX - ws.startX;
        const deltaY = e.clientY - ws.startY;

        let newLeft = ws.startLeft + deltaX;
        let newTop = ws.startTop + deltaY;

        // Constrain to viewport
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - windowElement.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 80 - windowElement.offsetHeight));

        // Use requestAnimationFrame for smooth updates
        if (ws.rafId) cancelAnimationFrame(ws.rafId);
        ws.rafId = requestAnimationFrame(() => {
            windowElement.style.left = newLeft + 'px';
            windowElement.style.top = newTop + 'px';
            ws.lastTranslateX = newLeft - ws.startLeft;
            ws.lastTranslateY = newTop - ws.startTop;
            ws.rafId = null;
        });
    }
    
    resizeWindow(e) {
        const windowElement = this.dragState.currentWindow;
        if (!windowElement) return;
        
        const deltaX = e.clientX - this.dragState.startX;
        const deltaY = e.clientY - this.dragState.startY;
        const direction = this.dragState.resizeDirection;
        
        let newWidth = this.dragState.startWidth;
        let newHeight = this.dragState.startHeight;
        let newLeft = this.dragState.startLeft;
        let newTop = this.dragState.startTop;
        
        // Calculate new dimensions based on direction
        if (direction.includes('e')) {
            newWidth = Math.max(300, this.dragState.startWidth + deltaX);
        }
        if (direction.includes('w')) {
            newWidth = Math.max(300, this.dragState.startWidth - deltaX);
            newLeft = this.dragState.startLeft + (this.dragState.startWidth - newWidth);
        }
        if (direction.includes('s')) {
            newHeight = Math.max(200, this.dragState.startHeight + deltaY);
        }
        if (direction.includes('n')) {
            newHeight = Math.max(200, this.dragState.startHeight - deltaY);
            newTop = this.dragState.startTop + (this.dragState.startHeight - newHeight);
        }
        
        // Constrain to viewport
        const maxWidth = window.innerWidth - newLeft;
        const maxHeight = window.innerHeight - 40 - newTop;
        
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);
        
        // Apply new dimensions
        windowElement.style.width = newWidth + 'px';
        windowElement.style.height = newHeight + 'px';
        windowElement.style.left = newLeft + 'px';
        windowElement.style.top = newTop + 'px';
    }
    
    handleMouseUp() {
        const ws = this.dragState;
        if (ws.isDragging || ws.isResizing) {
            // If dragging, clean up
            if (ws.isDragging && ws.targetWindow) {
                if (ws.rafId) {
                    cancelAnimationFrame(ws.rafId);
                    ws.rafId = null;
                }

                const win = ws.targetWindow;
                win.style.willChange = '';
                win.style.transition = '';
                win.classList.remove('dragging');

                ws.targetWindow = null;
                ws.lastTranslateX = 0;
                ws.lastTranslateY = 0;
            }

            ws.isDragging = false;
            ws.isResizing = false;
            ws.currentWindow = null;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }
    
    handleWindowControl(windowElement, action) {
        const appName = windowElement.dataset.app;
        
        switch (action) {
            case 'minimize':
                window.desktop?.minimizeWindow(appName);
                break;
            case 'maximize':
                this.toggleMaximize(windowElement);
                break;
            case 'close':
                window.desktop?.closeWindow(appName);
                break;
        }
    }
    
    toggleMaximize(windowElement) {
        if (windowElement.classList.contains('maximized')) {
            // Restore
            windowElement.classList.remove('maximized');
            
            // Clear transform and use stored position/size
            windowElement.style.transform = '';
            windowElement.style.left = windowElement.dataset.restoreLeft || '100px';
            windowElement.style.top = windowElement.dataset.restoreTop || '100px';
            windowElement.style.width = windowElement.dataset.restoreWidth || '800px';
            windowElement.style.height = windowElement.dataset.restoreHeight || '600px';
            
            // Update maximize icon
            const maxIcon = windowElement.querySelector('.window-control.maximize i');
            if (maxIcon) {
                maxIcon.className = 'fas fa-expand-alt';
            }
        } else {
            // Maximize - Save current state first
            // Get actual computed position (handle both transform and left/top)
            const rect = windowElement.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(windowElement);
            
            // Store current state
            windowElement.dataset.restoreLeft = windowElement.style.left || rect.left + 'px';
            windowElement.dataset.restoreTop = windowElement.style.top || rect.top + 'px';
            windowElement.dataset.restoreWidth = computedStyle.width;
            windowElement.dataset.restoreHeight = computedStyle.height;
            
            // Clear transform before maximizing
            windowElement.style.transform = '';
            
            // Apply maximized class (CSS will handle positioning)
            windowElement.classList.add('maximized');
            
            // Update maximize icon to restore icon
            const maxIcon = windowElement.querySelector('.window-control.maximize i');
            if (maxIcon) {
                maxIcon.className = 'fas fa-compress-alt';
            }
        }
    }
    
    focusWindow(windowElement) {
        // Remove focus from all windows
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('focused');
        });
        
        // Focus current window
        windowElement.classList.add('focused');
        windowElement.style.zIndex = this.allocateZIndex();
        
        // Update taskbar
        const appName = windowElement.dataset.app;
        if (window.desktop) {
            window.desktop.updateTaskbarState(appName, true);
        }
    }
    
    loadAppContent(windowElement, appName) {
        const content = windowElement.querySelector('.window-content');
        
        // Simulate loading delay
        setTimeout(() => {
            this.renderAppContent(content, appName);
        }, 500);
    }
    
    renderAppContent(content, appName) {
        switch (appName) {
            case 'browser':
                console.log('WindowManager creating browser window, browserApp exists:', !!window.browserApp);
                content.innerHTML = window.browserApp?.render() || '<p>Browser app not loaded</p>';
                if (window.browserApp) {
                    console.log('Initializing browser app in window');
                    window.browserApp.init(content);
                } else {
                    console.error('Browser app not available');
                }
                break;
            case 'youtube':
                content.innerHTML = window.youtubeApp?.render() || '<p>YouTube app not loaded</p>';
                if (window.youtubeApp) window.youtubeApp.init(content);
                break;
            case 'facebook':
                content.innerHTML = window.facebookApp?.render() || '<p>Facebook app not loaded</p>';
                if (window.facebookApp) window.facebookApp.init(content);
                break;
            case 'games':
                content.innerHTML = window.gamesApp?.render() || '<p>Games app not loaded</p>';
                if (window.gamesApp) window.gamesApp.init(content);
                break;
            case 'terminal':
                content.innerHTML = window.terminalApp?.render() || '<p>Terminal app not loaded</p>';
                if (window.terminalApp) window.terminalApp.init(content);
                break;
            case 'file-manager':
                content.innerHTML = window.fileManagerApp?.render() || '<p>File Manager app not loaded</p>';
                if (window.fileManagerApp) window.fileManagerApp.init(content);
                break;
            case 'settings':
                content.innerHTML = window.settingsApp?.render() || '<p>Settings app not loaded</p>';
                if (window.settingsApp) window.settingsApp.init(content);
                break;
            case 'canva':
                content.innerHTML = window.canvaApp?.render() || '<p>Canva app not loaded</p>';
                if (window.canvaApp) window.canvaApp.init(content);
                break;
            default:
                content.innerHTML = '<p>Application not found</p>';
        }
    }
    
    getInitialWindowRect() {
        const windowCount = document.querySelectorAll('.window').length;
        const offset = windowCount * 24;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const compact = vw < 1100;
        const mobile = vw < 640 || vh < 500;

        // Base sizes scaled to viewport
        let width = Math.min( Math.max( compact ? 640 : 860, Math.floor(vw * 0.72) ), vw - 80 );
        let height = Math.min( Math.max( compact ? 480 : 560, Math.floor(vh * 0.68) ), vh - 140 );
        if (mobile) {
            width = vw; height = vh - 50; // leave room for taskbar
        }

        const left = mobile ? 0 : Math.max(40, 80 + offset);
        const top = mobile ? 0 : Math.max(30, 70 + offset);

        return { left, top, width, height };
    }
    
    getAppIcon(appName) {
        const icons = {
            'browser': 'fas fa-globe',
            'youtube': 'fab fa-youtube',
            'facebook': 'fab fa-facebook',
            'games': 'fas fa-gamepad',
            'terminal': 'fas fa-terminal',
            'file-manager': 'fas fa-folder'
        };
        return icons[appName] || 'fas fa-window-maximize';
    }
    
    getAppTitle(appName) {
        const titles = {
            'browser': 'Web Browser',
            'youtube': 'YouTube',
            'facebook': 'Facebook',
            'games': 'Games',
            'terminal': 'Terminal',
            'file-manager': 'File Manager',
            'settings': 'Settings',
            'canva': 'Slides'
        };
        return titles[appName] || 'Application';
    }

    allocateZIndex() {
        const desktopInstance = window.desktop;
        if (desktopInstance) {
            desktopInstance.zIndexCounter = (desktopInstance.zIndexCounter || 100) + 1;
            return desktopInstance.zIndexCounter;
        }

        this._zIndexCounter = (this._zIndexCounter || 100) + 1;
        return this._zIndexCounter;
    }
}

// Make WindowManager globally available
window.WindowManager = WindowManager;
console.log('✅ WindowManager class loaded and assigned to global scope');