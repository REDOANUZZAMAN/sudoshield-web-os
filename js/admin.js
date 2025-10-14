// Admin Dashboard JavaScript
(function() {
    'use strict';

    // Default credentials
    const DEFAULT_CREDENTIALS = {
        username: 'sudoshield',
        password: 'sudoshield@@##!'
    };

    // Storage keys
    const STORAGE_KEYS = {
        AUTH: 'sudoshield.admin.auth',
        SETTINGS: 'sudoshield.admin.settings',
        MAINTENANCE: 'sudoshield.maintenance',
        ADMIN_CHANGE: 'sudoshield.admin.change'
    };

    // BroadcastChannel for cross-tab communication
    let adminChannel = null;
    
    // Initialize BroadcastChannel if supported
    function initBroadcastChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            adminChannel = new BroadcastChannel('sudoshield-admin');
            console.log('✅ BroadcastChannel initialized for admin communication');
        } else {
            console.warn('⚠️  BroadcastChannel not supported, using localStorage fallback');
        }
    }

    // Notify main OS to refresh
    function notifyMainOSRefresh(changeType = 'settings') {
        const changeData = {
            type: changeType,
            timestamp: Date.now(),
            source: 'admin-panel'
        };
        
        // Method 1: BroadcastChannel (modern browsers)
        if (adminChannel) {
            adminChannel.postMessage({
                action: 'refresh',
                data: changeData
            });
            console.log('📡 Sent refresh signal via BroadcastChannel:', changeType);
        }
        
        // Method 2: localStorage event (fallback for all browsers)
        localStorage.setItem(STORAGE_KEYS.ADMIN_CHANGE, JSON.stringify(changeData));
        
        // Clear the change marker after a short delay to allow detection
        setTimeout(() => {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_CHANGE);
        }, 500);
        
        console.log('🔄 Main OS refresh triggered:', changeType);
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initBroadcastChannel();
        checkAuth();
        setupEventListeners();
        updateDashboard();
    }

    // Check authentication
    function checkAuth() {
        const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
        if (auth) {
            const authData = JSON.parse(auth);
            const now = Date.now();
            
            // Check if session is still valid (30 minutes by default)
            const timeout = getSetting('sessionTimeout', 30) * 60 * 1000;
            if (now - authData.timestamp < timeout) {
                showDashboard();
                return;
            }
        }
        showLogin();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        
        // Theme toggle
        document.getElementById('theme-checkbox').addEventListener('change', toggleTheme);
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', handleNavigation);
        });
        
        // Maintenance toggle
        document.getElementById('maintenance-toggle').addEventListener('change', toggleMaintenanceSettings);
        document.getElementById('save-maintenance').addEventListener('click', saveMaintenanceSettings);
        document.getElementById('test-maintenance').addEventListener('click', testMaintenancePage);
        
        // Settings
        document.getElementById('save-settings').addEventListener('click', saveSystemSettings);
        
        // Widget toggles
        document.querySelectorAll('.widget-toggle').forEach(toggle => {
            toggle.addEventListener('change', handleWidgetToggle);
        });
        
        // Widget lock buttons
        document.querySelectorAll('.btn-lock').forEach(button => {
            button.addEventListener('click', handleWidgetLock);
        });
        
        // App toggles
        document.querySelectorAll('.app-toggle').forEach(toggle => {
            toggle.addEventListener('change', handleAppToggle);
        });
        
        // App visibility toggles
        document.querySelectorAll('.app-visibility-toggle').forEach(toggle => {
            toggle.addEventListener('change', handleAppVisibilityToggle);
        });
        
        // Security
        document.getElementById('change-password').addEventListener('click', changePassword);
        document.getElementById('save-security').addEventListener('click', saveSecuritySettings);
        
        // System actions
        document.getElementById('clear-cache').addEventListener('click', clearCache);
        document.getElementById('reset-widgets').addEventListener('click', resetWidgetPositions);
        document.getElementById('clear-all-data').addEventListener('click', clearAllData);
        document.getElementById('export-data').addEventListener('click', exportSystemData);
        document.getElementById('import-file').addEventListener('change', importSystemData);
        
        // Load maintenance state
        loadMaintenanceState();
        loadWidgetStates();
        loadEffectStates();
        loadThemeLockStates();
        loadAppStates();
        loadTheme();
    }

    // Handle login
    function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');
        
        // Get stored credentials or use defaults
        const storedCreds = getCredentials();
        
        if (username === storedCreds.username && password === storedCreds.password) {
            // Save auth state
            localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
                username: username,
                timestamp: Date.now()
            }));
            
            errorMsg.textContent = '';
            showDashboard();
        } else {
            errorMsg.textContent = 'Invalid username or password';
        }
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        showLogin();
    }

    // Show login screen
    function showLogin() {
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('admin-dashboard').classList.remove('active');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    // Show dashboard
    function showDashboard() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('admin-dashboard').classList.add('active');
        updateDashboard();
    }

    // Handle navigation
    function handleNavigation(e) {
        e.preventDefault();
        
        const section = this.dataset.section;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
        
        // Show corresponding section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section + '-section').classList.add('active');
    }

    // Update dashboard stats
    function updateDashboard() {
        // Update uptime
        setInterval(() => {
            const bootTime = window.webOS?.bootTime || Date.now();
            const uptime = Date.now() - bootTime;
            const hours = Math.floor(uptime / 3600000);
            const minutes = Math.floor((uptime % 3600000) / 60000);
            document.getElementById('uptime-stat').textContent = `${hours}h ${minutes}m`;
        }, 1000);
        
        // Update last login
        const auth = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || '{}');
        if (auth.timestamp) {
            const date = new Date(auth.timestamp);
            document.getElementById('last-login').textContent = date.toLocaleString();
        }
        
        // Update last updated
        document.getElementById('last-updated').textContent = new Date().toLocaleString();
        
        // Check maintenance mode
        const maintenance = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE) || '{}');
        if (maintenance.enabled) {
            document.getElementById('system-status').textContent = 'Maintenance';
            document.getElementById('system-status').style.color = '#f5576c';
        }
    }

    // Maintenance mode functions
    function toggleMaintenanceSettings() {
        const enabled = document.getElementById('maintenance-toggle').checked;
        const settings = document.getElementById('maintenance-settings');
        settings.style.display = enabled ? 'block' : 'none';
        
        // Auto-save when toggling off (disabling maintenance)
        if (!enabled) {
            const maintenance = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE) || '{}');
            maintenance.enabled = false;
            maintenance.disabledAt = Date.now();
            localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenance));
            
            // Trigger reload notification for main site
            localStorage.setItem('sudoshield.maintenance.reload', 'true');
            
            // Notify main OS to refresh
            notifyMainOSRefresh('maintenance-disabled');
            
            showSuccessMessage('✅ Maintenance mode disabled! Users can now access the OS. Main OS will refresh automatically.');
            document.getElementById('system-status').textContent = 'Online';
            document.getElementById('system-status').style.color = '#43e97b';
        } else {
            // Remind user to click save when enabling
            showNotification('ℹ️ Remember to click "Save Changes" to enable maintenance mode', 'success');
        }
    }

    function loadMaintenanceState() {
        const maintenance = JSON.parse(localStorage.getItem(STORAGE_KEYS.MAINTENANCE) || '{}');
        document.getElementById('maintenance-toggle').checked = maintenance.enabled || false;
        document.getElementById('maintenance-settings').style.display = maintenance.enabled ? 'block' : 'none';
        document.getElementById('maintenance-message').value = maintenance.message || '';
        document.getElementById('maintenance-time').value = maintenance.time || '';
    }

    function testMaintenancePage() {
        // Temporarily save current message for preview
        const message = document.getElementById('maintenance-message').value;
        const time = document.getElementById('maintenance-time').value;
        
        const tempMaintenance = {
            enabled: false, // Don't actually enable it
            message: message || 'We are currently performing scheduled maintenance. Please check back soon!',
            time: time,
            timestamp: Date.now()
        };
        
        localStorage.setItem('sudoshield.maintenance.preview', JSON.stringify(tempMaintenance));
        
        // Open maintenance page in new tab
        window.open('maintenance.html?preview=true', '_blank');
    }

    function saveMaintenanceSettings() {
        const enabled = document.getElementById('maintenance-toggle').checked;
        const message = document.getElementById('maintenance-message').value;
        const time = document.getElementById('maintenance-time').value;
        
        // Validate message if maintenance is enabled
        if (enabled && !message.trim()) {
            showErrorMessage('Please enter a maintenance message');
            return;
        }
        
        const maintenance = {
            enabled: enabled,
            message: message || 'We are currently performing scheduled maintenance. Please check back soon!',
            time: time,
            timestamp: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenance));
        
        // Notify main OS to refresh
        notifyMainOSRefresh(enabled ? 'maintenance-enabled' : 'maintenance-disabled');
        
        // Show success message with warning
        if (enabled) {
            showSuccessMessage('Maintenance mode enabled! Users will see the maintenance page. Main OS will refresh automatically.');
            document.getElementById('system-status').textContent = 'Maintenance';
            document.getElementById('system-status').style.color = '#f5576c';
        } else {
            // Trigger reload notification for main site
            localStorage.setItem('sudoshield.maintenance.reload', 'true');
            
            showSuccessMessage('Maintenance mode disabled! Users can access the OS.');
            document.getElementById('system-status').textContent = 'Online';
            document.getElementById('system-status').style.color = '#43e97b';
        }
    }

    // System settings
    function saveSystemSettings() {
        const settings = {
            systemName: document.getElementById('system-name').value,
            defaultTheme: document.getElementById('default-theme').value,
            bootAnimation: document.getElementById('boot-animation').checked,
            timestamp: Date.now()
        };
        
        // Also update webOS settings
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.settings) webOSSettings.settings = {};
            
            webOSSettings.settings.systemName = settings.systemName;
            webOSSettings.settings.theme = settings.defaultTheme;
            webOSSettings.settings.bootAnimation = settings.bootAnimation;
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            
            showSuccessMessage('System settings saved successfully!');
        } catch(e) {
            showErrorMessage('Failed to save system settings');
            console.error(e);
        }
    }

    // Widget management
    function loadWidgetStates() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const settings = webOSSettings.settings || {};
            const adminLocked = webOSSettings.adminLocked || {};
            
            // Set toggle states
            const widgets = ['clock', 'weather', 'stats', 'visualizer', 'tanjiro'];
            const widgetMap = {
                'clock': 'widgetsClock',
                'weather': 'widgetsWeather',
                'stats': 'widgetsStats',
                'visualizer': 'widgetsVisualizer',
                'tanjiro': 'widgetsTanjiro'
            };
            
            widgets.forEach(widget => {
                const toggle = document.querySelector(`[data-widget="${widget}"].widget-toggle`);
                const lockBtn = document.querySelector(`[data-widget="${widget}"].btn-lock`);
                const settingKey = widgetMap[widget];
                
                // Set toggle state
                if (toggle) {
                    toggle.checked = settings[settingKey] !== false;
                }
                
                // Set lock button state
                if (lockBtn) {
                    const isLocked = adminLocked[settingKey] === true;
                    if (isLocked) {
                        lockBtn.classList.add('locked');
                        const icon = lockBtn.querySelector('i');
                        if (icon) icon.className = 'fas fa-lock';
                    } else {
                        lockBtn.classList.remove('locked');
                        const icon = lockBtn.querySelector('i');
                        if (icon) icon.className = 'fas fa-lock-open';
                    }
                }
            });
        } catch(e) {
            console.error('Error loading widget states:', e);
        }
    }
    
    function loadEffectStates() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const settings = webOSSettings.settings || {};
            const adminLocked = webOSSettings.adminLocked || {};
            
            // Set effect states
            const effects = ['animations', 'transparency', 'blur', 'accentPulse', 'particles'];
            const effectMap = {
                'animations': 'animationsEnabled',
                'transparency': 'transparencyEnabled',
                'blur': 'blurEnabled',
                'accentPulse': 'accentPulseEnabled',
                'particles': 'particlesEnabled'
            };
            
            effects.forEach(effect => {
                const toggle = document.querySelector(`[data-effect="${effect}"].effect-toggle`);
                const lockBtn = document.querySelector(`[data-effect="${effect}"].btn-lock`);
                const settingKey = effectMap[effect];
                
                // Set toggle state
                if (toggle) {
                    toggle.checked = settings[settingKey] !== false;
                }
                
                // Set lock button state
                if (lockBtn) {
                    const isLocked = adminLocked[settingKey] === true;
                    if (isLocked) {
                        lockBtn.classList.add('locked');
                        const icon = lockBtn.querySelector('i');
                        if (icon) icon.className = 'fas fa-lock';
                    } else {
                        lockBtn.classList.remove('locked');
                        const icon = lockBtn.querySelector('i');
                        if (icon) icon.className = 'fas fa-lock-open';
                    }
                }
            });
        } catch(e) {
            console.error('Error loading effect states:', e);
        }
    }

    // Load theme lock states (accent color and wallpaper)
    function loadThemeLockStates() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const adminLocked = webOSSettings.adminLocked || {};
            
            // Load accent color lock state
            const accentLockBtn = document.getElementById('lock-accent-color');
            if (accentLockBtn) {
                const isLocked = adminLocked.accentColorLocked === true;
                if (isLocked) {
                    accentLockBtn.classList.add('locked');
                    const icon = accentLockBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-lock';
                } else {
                    accentLockBtn.classList.remove('locked');
                    const icon = accentLockBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-lock-open';
                }
            }
            
            // Load wallpaper lock state
            const wallpaperLockBtn = document.getElementById('lock-wallpaper');
            if (wallpaperLockBtn) {
                const isLocked = adminLocked.wallpaperLocked === true;
                if (isLocked) {
                    wallpaperLockBtn.classList.add('locked');
                    const icon = wallpaperLockBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-lock';
                } else {
                    wallpaperLockBtn.classList.remove('locked');
                    const icon = wallpaperLockBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-lock-open';
                }
            }
            
            // Load theme preset lock state
            const themePresetLockBtn = document.getElementById('lock-theme-preset');
            if (themePresetLockBtn) {
                const isLocked = adminLocked.themePresetLocked === true;
                if (isLocked) {
                    themePresetLockBtn.classList.add('locked');
                    const icon = themePresetLockBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-lock';
                } else {
                    themePresetLockBtn.classList.remove('locked');
                    const icon = themePresetLockBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-lock-open';
                }
            }
        } catch(e) {
            console.error('Error loading theme lock states:', e);
        }
    }

    function handleWidgetToggle(e) {
        const widget = this.dataset.widget;
        const enabled = this.checked;
        
        try {
            // Update webOS settings
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.settings) webOSSettings.settings = {};
            
            // Map widget names to webOS settings
            const widgetMap = {
                'clock': 'widgetsClock',
                'weather': 'widgetsWeather',
                'stats': 'widgetsStats',
                'visualizer': 'widgetsVisualizer',
                'tanjiro': 'widgetsTanjiro'
            };
            
            // Set widget state (users can still control this)
            webOSSettings.settings[widgetMap[widget]] = enabled;
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Update widget count
            updateWidgetCount();
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `${widget.charAt(0).toUpperCase() + widget.slice(1)} widget ${enabled ? 'enabled' : 'disabled'}. Users can still control this.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error toggling widget:', e);
            showErrorMessage('Failed to update widget settings');
        }
    }
    
    function handleWidgetLock(e) {
        const widget = this.dataset.widget;
        
        try {
            // Update webOS settings
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.settings) webOSSettings.settings = {};
            if (!webOSSettings.adminLocked) webOSSettings.adminLocked = {};
            
            // Map widget names to webOS settings
            const widgetMap = {
                'clock': 'widgetsClock',
                'weather': 'widgetsWeather',
                'stats': 'widgetsStats',
                'visualizer': 'widgetsVisualizer',
                'tanjiro': 'widgetsTanjiro'
            };
            
            const settingKey = widgetMap[widget];
            const isCurrentlyLocked = webOSSettings.adminLocked[settingKey];
            
            // Toggle lock state
            webOSSettings.adminLocked[settingKey] = !isCurrentlyLocked;
            
            // If locking, also disable the widget
            if (!isCurrentlyLocked) {
                webOSSettings.settings[settingKey] = false;
                // Update the toggle switch
                const toggle = document.querySelector(`[data-widget="${widget}"].widget-toggle`);
                if (toggle) toggle.checked = false;
            }
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Update button appearance
            this.classList.toggle('locked');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = webOSSettings.adminLocked[settingKey] ? 'fas fa-lock' : 'fas fa-lock-open';
            }
            
            // Update widget count
            updateWidgetCount();
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `${widget.charAt(0).toUpperCase() + widget.slice(1)} widget ${webOSSettings.adminLocked[settingKey] ? 'FORCE LOCKED - users cannot enable' : 'unlocked - users can control'}. Main OS will auto-refresh.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error locking widget:', e);
            showErrorMessage('Failed to lock widget');
        }
    }
    
    // Handle effect toggle (normal enable/disable)
    function handleEffectToggle(e) {
        const effect = this.dataset.effect;
        const enabled = this.checked;
        
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.settings) webOSSettings.settings = {};
            
            // Map effect names to webOS settings
            const effectMap = {
                'animations': 'animationsEnabled',
                'transparency': 'transparencyEnabled',
                'blur': 'blurEnabled',
                'accentPulse': 'accentPulseEnabled',
                'particles': 'particlesEnabled'
            };
            
            // Set effect state (users can still control this)
            webOSSettings.settings[effectMap[effect]] = enabled;
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `${effect} ${enabled ? 'enabled' : 'disabled'}. Users can still control this.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error toggling effect:', e);
            showErrorMessage('Failed to update effect settings');
        }
    }
    
    // Handle effect lock (force lock/unlock)
    function handleEffectLock(e) {
        const effect = this.dataset.effect;
        
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.settings) webOSSettings.settings = {};
            if (!webOSSettings.adminLocked) webOSSettings.adminLocked = {};
            
            // Map effect names to webOS settings
            const effectMap = {
                'animations': 'animationsEnabled',
                'transparency': 'transparencyEnabled',
                'blur': 'blurEnabled',
                'accentPulse': 'accentPulseEnabled',
                'particles': 'particlesEnabled'
            };
            
            const settingKey = effectMap[effect];
            const isCurrentlyLocked = webOSSettings.adminLocked[settingKey];
            
            // Toggle lock state
            webOSSettings.adminLocked[settingKey] = !isCurrentlyLocked;
            
            // If locking, also disable the effect
            if (!isCurrentlyLocked) {
                webOSSettings.settings[settingKey] = false;
                // Update the toggle switch
                const toggle = document.querySelector(`[data-effect="${effect}"].effect-toggle`);
                if (toggle) toggle.checked = false;
            }
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Update button appearance
            this.classList.toggle('locked');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = webOSSettings.adminLocked[settingKey] ? 'fas fa-lock' : 'fas fa-lock-open';
            }
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `${effect} ${webOSSettings.adminLocked[settingKey] ? 'FORCE LOCKED - users cannot enable' : 'unlocked - users can control'}. Main OS will auto-refresh.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error locking effect:', e);
            showErrorMessage('Failed to lock effect');
        }
    }
    
    // Handle accent color lock
    function handleAccentColorLock(e) {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.adminLocked) webOSSettings.adminLocked = {};
            
            const isCurrentlyLocked = webOSSettings.adminLocked.accentColorLocked;
            webOSSettings.adminLocked.accentColorLocked = !isCurrentlyLocked;
            
            // If locking, store current accent color as enforced
            if (!isCurrentlyLocked) {
                const colorInput = document.getElementById('admin-accent-color');
                if (colorInput) {
                    if (!webOSSettings.theme) webOSSettings.theme = {};
                    webOSSettings.theme.accentColor = colorInput.value;
                }
            }
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Update button appearance
            this.classList.toggle('locked');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = webOSSettings.adminLocked.accentColorLocked ? 'fas fa-lock' : 'fas fa-lock-open';
            }
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `Accent color ${webOSSettings.adminLocked.accentColorLocked ? 'FORCE LOCKED - users cannot change' : 'unlocked - users can change'}. Main OS will auto-refresh.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error locking accent color:', e);
            showErrorMessage('Failed to lock accent color');
        }
    }
    
    // Handle wallpaper lock
    function handleWallpaperLock(e) {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.adminLocked) webOSSettings.adminLocked = {};
            
            const isCurrentlyLocked = webOSSettings.adminLocked.wallpaperLocked;
            webOSSettings.adminLocked.wallpaperLocked = !isCurrentlyLocked;
            
            // If locking, store current wallpaper as enforced
            if (!isCurrentlyLocked) {
                if (!webOSSettings.theme) webOSSettings.theme = {};
                // Current wallpaper should already be in theme.wallpaper
                // No need to change it, just lock it
            }
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Update button appearance
            this.classList.toggle('locked');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = webOSSettings.adminLocked.wallpaperLocked ? 'fas fa-lock' : 'fas fa-lock-open';
            }
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `Wallpaper ${webOSSettings.adminLocked.wallpaperLocked ? 'FORCE LOCKED - users cannot change' : 'unlocked - users can change'}. Main OS will auto-refresh.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error locking wallpaper:', e);
            showErrorMessage('Failed to lock wallpaper');
        }
    }
    
    // Handle theme preset lock
    function handleThemePresetLock(e) {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.adminLocked) webOSSettings.adminLocked = {};
            
            const isCurrentlyLocked = webOSSettings.adminLocked.themePresetLocked;
            webOSSettings.adminLocked.themePresetLocked = !isCurrentlyLocked;
            
            // If locking, store current theme preset configuration
            if (!isCurrentlyLocked) {
                if (!webOSSettings.theme) webOSSettings.theme = {};
                // Current theme should already be in theme (accentColor and wallpaper)
                // No need to change it, just lock it
            }
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Update button appearance
            this.classList.toggle('locked');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = webOSSettings.adminLocked.themePresetLocked ? 'fas fa-lock' : 'fas fa-lock-open';
            }
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            const message = `Theme preset ${webOSSettings.adminLocked.themePresetLocked ? 'FORCE LOCKED - users cannot change theme' : 'unlocked - users can change theme'}. Main OS will auto-refresh.`;
            showSuccessMessage(message);
            // Also use webOS notification system for sound
            if (window.parent?.webOS?.notify) {
                window.parent.webOS.notify(message, 'success');
            }
        } catch(e) {
            console.error('Error locking theme preset:', e);
            showErrorMessage('Failed to lock theme preset');
        }
    }
    
    // Update widget count
    function updateWidgetCount() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const settings = webOSSettings.settings || {};
            
            let count = 0;
            if (settings.widgetsClock !== false) count++;
            if (settings.widgetsWeather !== false) count++;
            if (settings.widgetsStats !== false) count++;
            if (settings.widgetsVisualizer !== false) count++;
            if (settings.widgetsTanjiro !== false) count++;
            
            document.getElementById('widget-count').textContent = count;
        } catch(e) {
            console.error('Error updating widget count:', e);
        }
    }

    // Helper function to trigger main OS reload
    function triggerMainOSReload() {
        localStorage.setItem('sudoshield.os.reload', 'true');
        console.log('🔄 Main OS reload triggered');
    }

    // Security functions
    function changePassword() {
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;
        
        // Validate inputs
        if (!current || !newPass || !confirm) {
            showErrorMessage('Please fill in all password fields');
            return;
        }
        
        const creds = getCredentials();
        
        if (current !== creds.password) {
            showErrorMessage('Current password is incorrect');
            return;
        }
        
        if (newPass.length < 8) {
            showErrorMessage('New password must be at least 8 characters');
            return;
        }
        
        if (newPass !== confirm) {
            showErrorMessage('New password and confirmation do not match');
            return;
        }
        
        // Save new password with timestamp
        localStorage.setItem('sudoshield.admin.credentials', JSON.stringify({
            username: creds.username,
            password: newPass,
            changedAt: Date.now()
        }));
        
        showSuccessMessage('Password changed successfully! You will be logged out.');
        
        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Logout after 2 seconds
        setTimeout(() => {
            handleLogout();
        }, 2000);
    }

    function saveSecuritySettings() {
        const timeout = document.getElementById('session-timeout').value;
        
        if (!timeout || timeout < 5 || timeout > 1440) {
            showErrorMessage('Session timeout must be between 5 and 1440 minutes');
            return;
        }
        
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
        settings.sessionTimeout = parseInt(timeout);
        settings.lastUpdated = Date.now();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        
        showSuccessMessage('Security settings saved successfully!');
    }

    // Helper functions
    function getCredentials() {
        const stored = localStorage.getItem('sudoshield.admin.credentials');
        if (stored) {
            return JSON.parse(stored);
        }
        return DEFAULT_CREDENTIALS;
    }

    function getSetting(key, defaultValue) {
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    // Show success message
    function showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    // Show error message
    function showErrorMessage(message) {
        showNotification(message, 'error');
    }

    // Show notification
    function showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Load system settings
    function loadSystemSettings() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const settings = webOSSettings.settings || {};
            
            if (settings.systemName) {
                document.getElementById('system-name').value = settings.systemName;
            }
            if (settings.theme) {
                document.getElementById('default-theme').value = settings.theme;
            }
            if (settings.bootAnimation !== undefined) {
                document.getElementById('boot-animation').checked = settings.bootAnimation;
            }
        } catch(e) {
            console.error('Error loading system settings:', e);
        }
    }

    // Load security settings
    function loadSecuritySettings() {
        const timeout = getSetting('sessionTimeout', 30);
        document.getElementById('session-timeout').value = timeout;
    }

    // System action functions
    function clearCache() {
        if (confirm('Are you sure you want to clear the cache? This will remove temporary data but keep your settings.')) {
            try {
                // Clear specific cache items
                const keysToKeep = [
                    STORAGE_KEYS.AUTH,
                    STORAGE_KEYS.SETTINGS,
                    STORAGE_KEYS.MAINTENANCE,
                    'sudoshield.admin.credentials',
                    'webos.settings.v1'
                ];
                
                // Get all keys
                const allKeys = Object.keys(localStorage);
                
                // Remove keys that are not in keepsToKeep
                allKeys.forEach(key => {
                    if (!keysToKeep.includes(key)) {
                        localStorage.removeItem(key);
                    }
                });
                
                showSuccessMessage('Cache cleared successfully!');
            } catch(e) {
                showErrorMessage('Failed to clear cache');
                console.error(e);
            }
        }
    }

    function resetWidgetPositions() {
        if (confirm('Are you sure you want to reset all widget positions to default?')) {
            try {
                const widgetData = JSON.parse(localStorage.getItem('webos.widgets.v2') || '{}');
                if (widgetData.positions) {
                    delete widgetData.positions;
                    localStorage.setItem('webos.widgets.v2', JSON.stringify(widgetData));
                }
                showSuccessMessage('Widget positions reset! Refresh the OS to see changes.');
            } catch(e) {
                showErrorMessage('Failed to reset widget positions');
                console.error(e);
            }
        }
    }

    function clearAllData() {
        if (confirm('⚠️ WARNING: This will clear ALL data including settings, credentials, and user data. Are you absolutely sure?')) {
            if (confirm('This action cannot be undone. Click OK to proceed.')) {
                try {
                    localStorage.clear();
                    showSuccessMessage('All data cleared! Redirecting to login...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } catch(e) {
                    showErrorMessage('Failed to clear data');
                    console.error(e);
                }
            }
        }
    }

    // Export system data
    function exportSystemData() {
        try {
            const data = {
                settings: localStorage.getItem(STORAGE_KEYS.SETTINGS),
                maintenance: localStorage.getItem(STORAGE_KEYS.MAINTENANCE),
                webosSettings: localStorage.getItem('webos.settings.v1'),
                widgetData: localStorage.getItem('webos.widgets.v2'),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `sudoshield-backup-${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            showSuccessMessage('System data exported successfully!');
        } catch(e) {
            showErrorMessage('Failed to export data');
            console.error(e);
        }
    }

    // Import system data
    function importSystemData(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                
                // Verify it's a valid backup
                if (!data.version || !data.exportDate) {
                    showErrorMessage('Invalid backup file');
                    return;
                }
                
                if (confirm('This will restore settings from the backup file. Current settings will be overwritten. Continue?')) {
                    // Restore data
                    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, data.settings);
                    if (data.maintenance) localStorage.setItem(STORAGE_KEYS.MAINTENANCE, data.maintenance);
                    if (data.webosSettings) localStorage.setItem('webos.settings.v1', data.webosSettings);
                    if (data.widgetData) localStorage.setItem('webos.widgets.v2', data.widgetData);
                    
                    showSuccessMessage('Settings imported successfully! Reloading...');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } catch(error) {
                showErrorMessage('Failed to import data. File may be corrupted.');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        e.target.value = '';
    }

    // Theme functions
    function toggleTheme() {
        const body = document.body;
        const checkbox = document.getElementById('theme-checkbox');
        const isDark = checkbox.checked;
        const themeText = document.getElementById('current-theme');
        const toggleText = document.querySelector('.theme-text');
        const toggleIcon = document.querySelector('.theme-icon');
        
        // Toggle dark mode class
        if (isDark) {
            body.classList.add('dark-mode');
            if (themeText) themeText.textContent = 'Dark Mode';
            if (toggleText) toggleText.textContent = 'DARK MODE';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeText) themeText.textContent = 'Light Mode';
            if (toggleText) toggleText.textContent = 'LIGHT MODE';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
        }
        
        // Save preference
        localStorage.setItem('sudoshield.admin.theme', isDark ? 'dark' : 'light');
        
        // Show notification
        showSuccessMessage(`${isDark ? 'Dark' : 'Light'} mode activated!`);
    }
    
    function loadTheme() {
        const savedTheme = localStorage.getItem('sudoshield.admin.theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const checkbox = document.getElementById('theme-checkbox');
        const themeText = document.getElementById('current-theme');
        const toggleText = document.querySelector('.theme-text');
        const toggleIcon = document.querySelector('.theme-icon');
        
        // Determine if should be dark
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        
        // Apply theme
        if (shouldBeDark) {
            document.body.classList.add('dark-mode');
            if (checkbox) checkbox.checked = true;
            if (themeText) themeText.textContent = 'Dark Mode';
            if (toggleText) toggleText.textContent = 'DARK MODE';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (checkbox) checkbox.checked = false;
            if (themeText) themeText.textContent = 'Light Mode';
            if (toggleText) toggleText.textContent = 'LIGHT MODE';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
        }
    }

    // App Management Functions
    function loadAppStates() {
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const apps = webOSSettings.apps || {};
            
            // Load app enabled states
            document.querySelectorAll('.app-toggle').forEach(toggle => {
                const appName = toggle.dataset.app;
                const isEnabled = apps[appName]?.enabled !== false;
                toggle.checked = isEnabled;
            });
            
            // Load app visibility states
            document.querySelectorAll('.app-visibility-toggle').forEach(toggle => {
                const appName = toggle.dataset.app;
                const isVisible = apps[appName]?.visible !== false;
                toggle.checked = isVisible;
            });
        } catch(e) {
            console.error('Error loading app states:', e);
        }
    }

    function handleAppToggle(e) {
        const appName = this.dataset.app;
        const enabled = this.checked;
        
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.apps) webOSSettings.apps = {};
            if (!webOSSettings.apps[appName]) webOSSettings.apps[appName] = {};
            
            webOSSettings.apps[appName].enabled = enabled;
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // If disabling app, also update visibility toggle
            if (!enabled) {
                const visToggle = document.querySelector(`.app-visibility-toggle[data-app="${appName}"]`);
                if (visToggle) {
                    visToggle.disabled = true;
                    visToggle.parentElement.style.opacity = '0.5';
                }
            } else {
                const visToggle = document.querySelector(`.app-visibility-toggle[data-app="${appName}"]`);
                if (visToggle) {
                    visToggle.disabled = false;
                    visToggle.parentElement.style.opacity = '1';
                }
            }
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            showSuccessMessage(`${getAppDisplayName(appName)} ${enabled ? 'enabled' : 'disabled'}. Main OS will auto-refresh.`);
        } catch(e) {
            console.error('Error toggling app:', e);
            showErrorMessage('Failed to update app settings');
        }
    }

    function handleAppVisibilityToggle(e) {
        const appName = this.dataset.app;
        const visible = this.checked;
        
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!webOSSettings.apps) webOSSettings.apps = {};
            if (!webOSSettings.apps[appName]) webOSSettings.apps[appName] = {};
            
            webOSSettings.apps[appName].visible = visible;
            localStorage.setItem('webos.settings.v1', JSON.stringify(webOSSettings));
            
            // Trigger main OS reload
            triggerMainOSReload();
            
            showSuccessMessage(`${getAppDisplayName(appName)} ${visible ? 'shown in' : 'hidden from'} start menu. Main OS will auto-refresh.`);
        } catch(e) {
            console.error('Error toggling app visibility:', e);
            showErrorMessage('Failed to update app visibility');
        }
    }

    function getAppDisplayName(appName) {
        const names = {
            'filemanager': 'File Manager',
            'settings': 'Settings',
            'terminal': 'Terminal',
            'browser': 'Browser',
            'premiumbrowser': 'Premium Browser',
            'youtube': 'YouTube',
            'youtubepremium': 'YouTube Premium',
            'facebook': 'Facebook',
            'slides': 'Slides',
            'games': 'Games'
        };
        return names[appName] || appName;
    }

    // ==================== Display Customization Functions ====================
    
    // Load display settings from localStorage
    function loadDisplaySettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const theme = settings.theme || {};
            
            // Load accent color
            const accentColor = theme.accentColor || '#ff6ec7';
            document.getElementById('admin-accent-color').value = accentColor;
            document.getElementById('accent-color-value').textContent = accentColor;
            updateColorPresetActive(accentColor);
            
            // Load wallpaper
            const wallpaper = theme.wallpaper || 'nebula';
            updateWallpaperActive(wallpaper);
            
            // Load effects
            document.getElementById('admin-animations').checked = settings.settings?.animationsEnabled !== false;
            document.getElementById('admin-transparency').checked = settings.settings?.transparencyEnabled !== false;
            document.getElementById('admin-blur').checked = settings.settings?.blurEnabled !== false;
            document.getElementById('admin-accent-pulse').checked = settings.settings?.accentPulseEnabled || false;
            document.getElementById('admin-particles').checked = settings.settings?.particlesEnabled || false;
            
        } catch (e) {
            console.error('Error loading display settings:', e);
        }
    }
    
    // Setup display customization event listeners
    function setupDisplayListeners() {
        // Accent color picker
        const accentColorInput = document.getElementById('admin-accent-color');
        if (accentColorInput) {
            accentColorInput.addEventListener('input', (e) => {
                document.getElementById('accent-color-value').textContent = e.target.value;
                updateColorPresetActive(e.target.value);
            });
        }
        
        // Color preset items
        document.querySelectorAll('.color-preset-item').forEach(item => {
            item.addEventListener('click', () => {
                const color = item.dataset.color;
                document.getElementById('admin-accent-color').value = color;
                document.getElementById('accent-color-value').textContent = color;
                updateColorPresetActive(color);
            });
        });
        
        // Apply accent color button
        const applyAccentBtn = document.getElementById('apply-accent-color');
        if (applyAccentBtn) {
            applyAccentBtn.addEventListener('click', applyAccentColor);
        }
        
        // Accent color lock button
        const lockAccentBtn = document.getElementById('lock-accent-color');
        if (lockAccentBtn) {
            lockAccentBtn.addEventListener('click', handleAccentColorLock);
        }
        
        // Wallpaper items
        document.querySelectorAll('.wallpaper-admin-item').forEach(item => {
            item.addEventListener('click', () => {
                const wallpaper = item.dataset.wallpaper;
                updateWallpaperActive(wallpaper);
                applyWallpaper(wallpaper);
            });
        });
        
        // Wallpaper lock button
        const lockWallpaperBtn = document.getElementById('lock-wallpaper');
        if (lockWallpaperBtn) {
            lockWallpaperBtn.addEventListener('click', handleWallpaperLock);
        }
        
        // Effect toggles
        // Effect toggles (normal enable/disable)
        document.querySelectorAll('.effect-toggle').forEach(toggle => {
            toggle.addEventListener('change', handleEffectToggle);
        });
        
        // Effect lock buttons (force lock/unlock)
        document.querySelectorAll('.btn-lock[data-effect]').forEach(button => {
            button.addEventListener('click', handleEffectLock);
        });
        
        // Theme presets
        document.querySelectorAll('.theme-preset-admin').forEach(item => {
            item.addEventListener('click', () => {
                const preset = item.dataset.preset;
                applyThemePreset(preset);
            });
        });
        
        // Theme preset lock button
        const lockThemePresetBtn = document.getElementById('lock-theme-preset');
        if (lockThemePresetBtn) {
            lockThemePresetBtn.addEventListener('click', handleThemePresetLock);
        }
        
        // Quick actions
        document.getElementById('reset-display')?.addEventListener('click', resetDisplaySettings);
        document.getElementById('preview-display')?.addEventListener('click', previewDisplaySettings);
        document.getElementById('save-display')?.addEventListener('click', saveAllDisplaySettings);
    }
    
    // Update color preset active state
    function updateColorPresetActive(color) {
        document.querySelectorAll('.color-preset-item').forEach(item => {
            if (item.dataset.color === color) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Update wallpaper active state
    function updateWallpaperActive(wallpaper) {
        document.querySelectorAll('.wallpaper-admin-item').forEach(item => {
            if (item.dataset.wallpaper === wallpaper) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Apply accent color
    function applyAccentColor() {
        try {
            const color = document.getElementById('admin-accent-color').value;
            
            // Update localStorage
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!settings.theme) settings.theme = {};
            settings.theme.accentColor = color;
            localStorage.setItem('webos.settings.v1', JSON.stringify(settings));
            
            // Notify main OS to refresh
            notifyMainOSRefresh('accent-color');
            
            showSuccessMessage('Accent color applied successfully! Main OS will refresh automatically.');
        } catch (e) {
            console.error('Error applying accent color:', e);
            showErrorMessage('Failed to apply accent color');
        }
    }
    
    // Apply wallpaper
    function applyWallpaper(wallpaper) {
        try {
            // Update localStorage
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!settings.theme) settings.theme = {};
            settings.theme.wallpaper = wallpaper;
            localStorage.setItem('webos.settings.v1', JSON.stringify(settings));
            
            // Notify main OS to refresh
            notifyMainOSRefresh('wallpaper');
            
            showSuccessMessage(`Wallpaper "${wallpaper}" applied successfully! Main OS will refresh automatically.`);
        } catch (e) {
            console.error('Error applying wallpaper:', e);
            showErrorMessage('Failed to apply wallpaper');
        }
    }
    
    // Apply effects
    function applyEffect(effectName, enabled) {
        try {
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!settings.settings) settings.settings = {};
            
            switch(effectName) {
                case 'animations':
                    settings.settings.animationsEnabled = enabled;
                    break;
                case 'transparency':
                    settings.settings.transparencyEnabled = enabled;
                    break;
                case 'blur':
                    settings.settings.blurEnabled = enabled;
                    break;
                case 'accentPulse':
                    settings.settings.accentPulseEnabled = enabled;
                    break;
                case 'particles':
                    settings.settings.particlesEnabled = enabled;
                    break;
            }
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(settings));
            
            // Notify main OS to refresh
            notifyMainOSRefresh('effect-' + effectName);
            
            showSuccessMessage(`${effectName} ${enabled ? 'enabled' : 'disabled'} successfully! Main OS will refresh automatically.`);
        } catch (e) {
            console.error('Error applying effect:', e);
            showErrorMessage('Failed to apply effect');
        }
    }
    
    // Apply theme preset
    function applyThemePreset(presetId) {
        const presets = {
            'garuda-neon': { accent: '#ff6ec7', wallpaper: 'nebula' },
            'violet-dream': { accent: '#8c7bff', wallpaper: 'edge' },
            'cyber-aqua': { accent: '#4dd0e1', wallpaper: 'horizon' },
            'sunset-core': { accent: '#ffb74d', wallpaper: 'edge' },
            'matrix-field': { accent: '#5efc82', wallpaper: 'circuit' },
            'aurora-drift': { accent: '#8c7bff', wallpaper: 'aurora' },
            'cyber-matrix': { accent: '#5efc82', wallpaper: 'matrix' },
            'neon-pulse': { accent: '#ff6ec7', wallpaper: 'pulse' },
            'dms-black': { accent: '#c41e3a', wallpaper: 'demonslayer' }
        };
        
        const preset = presets[presetId];
        if (!preset) return;
        
        try {
            // Update UI
            document.getElementById('admin-accent-color').value = preset.accent;
            document.getElementById('accent-color-value').textContent = preset.accent;
            updateColorPresetActive(preset.accent);
            updateWallpaperActive(preset.wallpaper);
            
            // Update localStorage
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            if (!settings.theme) settings.theme = {};
            settings.theme.accentColor = preset.accent;
            settings.theme.wallpaper = preset.wallpaper;
            localStorage.setItem('webos.settings.v1', JSON.stringify(settings));
            
            // Update theme preset active state
            document.querySelectorAll('.theme-preset-admin').forEach(item => {
                if (item.dataset.preset === presetId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // Notify main OS to refresh
            notifyMainOSRefresh('theme-preset');
            
            showSuccessMessage(`Theme preset "${presetId}" applied successfully! Main OS will refresh automatically.`);
        } catch (e) {
            console.error('Error applying theme preset:', e);
            showErrorMessage('Failed to apply theme preset');
        }
    }
    
    // Reset display settings
    function resetDisplaySettings() {
        if (!confirm('Are you sure you want to reset all display settings to defaults?')) {
            return;
        }
        
        try {
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            
            // Reset theme
            settings.theme = {
                accentColor: '#ff6ec7',
                wallpaper: 'nebula'
            };
            
            // Reset effects
            if (!settings.settings) settings.settings = {};
            settings.settings.animationsEnabled = true;
            settings.settings.transparencyEnabled = true;
            settings.settings.blurEnabled = true;
            settings.settings.accentPulseEnabled = false;
            settings.settings.particlesEnabled = false;
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(settings));
            loadDisplaySettings();
            
            showSuccessMessage('Display settings reset to defaults successfully!');
        } catch (e) {
            console.error('Error resetting display settings:', e);
            showErrorMessage('Failed to reset display settings');
        }
    }
    
    // Preview display settings
    function previewDisplaySettings() {
        const mainURL = window.location.origin + window.location.pathname.replace('shieldadmin.html', 'index.html');
        window.open(mainURL, '_blank');
        showInfoMessage('Opening main OS in new tab to preview changes...');
    }
    
    // Save all display settings
    function saveAllDisplaySettings() {
        try {
            const color = document.getElementById('admin-accent-color').value;
            const settings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            
            if (!settings.theme) settings.theme = {};
            settings.theme.accentColor = color;
            
            localStorage.setItem('webos.settings.v1', JSON.stringify(settings));
            showSuccessMessage('All display settings saved successfully!');
        } catch (e) {
            console.error('Error saving display settings:', e);
            showErrorMessage('Failed to save display settings');
        }
    }
    
    // Show info message
    function showInfoMessage(message) {
        showNotification(message, 'info');
    }

    // Initialize settings on load
    setTimeout(() => {
        loadSystemSettings();
        loadSecuritySettings();
        updateWidgetCount();
        loadDisplaySettings();
        setupDisplayListeners();
    }, 500);

})();
