// Settings Application
class SettingsApp {
    constructor() {
        this.currentTab = 'appearance';
        this.tabs = {
            'appearance': {
                name: 'Appearance',
                icon: 'fas fa-palette'
            },
            'system': {
                name: 'System',
                icon: 'fas fa-cog'
            },
            'user': {
                name: 'User',
                icon: 'fas fa-user-shield'
            },
            'apps': {
                name: 'Settings',
                icon: 'fas fa-th-large'
            },
            'about': {
                name: 'About',
                icon: 'fas fa-info-circle'
            }
        };
        this.persistKey = 'webos.settings.v1';
        this.loadPersisted();
        // Built-in theme presets
        this.themePresets = [
            { id: 'garuda-neon', name: 'Garuda Neon', accentColor: '#ff6ec7', wallpaper: 'nebula' },
            { id: 'violet-dream', name: 'Violet Dream', accentColor: '#8c7bff', wallpaper: 'edge' },
            { id: 'cyber-aqua', name: 'Cyber Aqua', accentColor: '#4dd0e1', wallpaper: 'horizon' },
            { id: 'sunset-core', name: 'Sunset Core', accentColor: '#ffb74d', wallpaper: 'edge' },
            { id: 'matrix-field', name: 'Matrix Field', accentColor: '#5efc82', wallpaper: 'circuit' },
            { id: 'aurora-drift', name: 'Aurora Drift', accentColor: '#8c7bff', wallpaper: 'aurora', animated: true },
            { id: 'cyber-matrix', name: 'Cyber Matrix', accentColor: '#5efc82', wallpaper: 'matrix', animated: true },
            { id: 'neon-pulse', name: 'Neon Pulse', accentColor: '#ff6ec7', wallpaper: 'pulse', animated: true },
            { id: 'ocean-wave', name: 'Ocean Wave', accentColor: '#4facfe', wallpaper: 'wave', animated: true },
            { id: 'cosmic-journey', name: 'Cosmic Journey', accentColor: '#6366f1', wallpaper: 'cosmic', animated: true },
            { id: 'neon-city', name: 'Neon City', accentColor: '#ff006e', wallpaper: 'neon', animated: true },
            { id: 'synthwave-80s', name: 'Synthwave 80s', accentColor: '#ff0080', wallpaper: 'synthwave', animated: true },
            { id: 'rainbow-vortex', name: 'Rainbow Vortex', accentColor: '#ff9ff3', wallpaper: 'vortex', animated: true },
            { id: 'digital-glitch', name: 'Digital Glitch', accentColor: '#00ff41', wallpaper: 'glitch', animated: true },
            { id: 'matrix-rain', name: 'Matrix Rain', accentColor: '#00ff41', wallpaper: 'rain', animated: true },
            { id: 'demon-slayer', name: 'Demon Slayer: Tanjiro', accentColor: '#c41e3a', wallpaper: 'demonslayer', animated: true, special: true }
        ];
        this.previousTheme = this.previousTheme || null;
    }

    get theme() {
        return window.webOS?.theme;
    }

    get settings() {
        return window.webOS?.settings;
    }
    
    render() {
        return `
            <div class="settings-app" id="settings-app">
                <div class="settings-header">
                    <h2><i class="fas fa-cog"></i> System Settings</h2>
                </div>
                
                <div class="settings-container">
                    <div class="settings-sidebar">
                        ${Object.entries(this.tabs).map(([key, tab]) => `
                            <div class="settings-tab ${this.currentTab === key ? 'active' : ''}" 
                                 data-tab="${key}" 
                                 onclick="window.settingsApp.switchTab('${key}')">
                                <i class="${tab.icon}"></i>
                                <span>${tab.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="settings-content" id="settings-content">
                        ${this.renderTabContent()}
                    </div>
                </div>
            </div>
        `;
    }
    
    init(container) {
        this.container = container;
        this.setupEventListeners();
        // Merge any missing animated wallpapers into theme options
        if (this.theme && Array.isArray(this.theme.wallpaperOptions)) {
            const needed = ['aurora','matrix','pulse','wave','cosmic','neon','synthwave','vortex','glitch','rain'];
            needed.forEach(w => { if (!this.theme.wallpaperOptions.includes(w)) this.theme.wallpaperOptions.push(w); });
        }
        this.applyTheme();
        this.applyWallpaper(this.theme?.wallpaper || 'nebula');
        this.bindDynamicToggles();
        this.bindPresetHandlers();
    }
    
    setupEventListeners() {
        // Color picker events will be set up after render
        setTimeout(() => {
            this.bindColorPickers();
            this.bindDynamicToggles();
        }, 100);
    }

    bindColorPickers() {
        const colorInputs = document.querySelectorAll('.color-input');
        colorInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const property = e.target.dataset.property;
                if (property === 'accent') {
                    this.updateAccentColor(e.target.value);
                }
            });
        });

        const wallpaperButtons = document.querySelectorAll('.wallpaper-option');
        wallpaperButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const wallpaper = e.target.dataset.wallpaper;
                this.updateWallpaper(wallpaper);
            });
        });
    }
    
    switchTab(tabKey) {
        this.currentTab = tabKey;
        
        // Update active tab
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabKey}"]`).classList.add('active');
        
        // Update content
        const content = document.getElementById('settings-content');
        if (content) {
            content.innerHTML = this.renderTabContent();
            this.bindColorPickers();
            this.bindDynamicToggles();
            this.bindPresetHandlers();
            if (this.currentTab === 'about') this.populateAboutDynamic();
        }
    }
    
    renderTabContent() {
        switch (this.currentTab) {
            case 'appearance':
                return this.renderAppearanceTab();
            case 'system':
                return this.renderSystemTab();
            case 'user':
                return this.renderUserTab();
            case 'apps':
                return this.renderAppsTab();
            case 'about':
                return this.renderAboutTab();
            default:
                return '<div>Tab not found</div>';
        }
    }
    
    renderAppearanceTab() {
        const theme = this.theme || {};
        const currentAccent = theme.accentColor || '#ff6ec7';
        const currentWallpaper = theme.wallpaper || 'nebula';
        const wallpapers = (theme.wallpaperOptions || ['nebula', 'edge', 'horizon', 'circuit', 'aurora', 'matrix', 'pulse', 'wave', 'cosmic', 'neon', 'synthwave', 'vortex', 'glitch', 'rain']).filter(w => w && typeof w === 'string');
        const hasPrevious = !!this.previousTheme;
        
        // Load admin lock state
        let adminLocked = {};
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            adminLocked = webOSSettings.adminLocked || {};
        } catch (e) {
            console.error('Error loading admin lock state:', e);
        }
        
        return `
            <div class="settings-section">
                <h3><i class="fas fa-palette"></i> Theme & Appearance</h3>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-paint-brush"></i>
                        Accent Color ${adminLocked.accentColorLocked ? '🔒' : ''}
                    </label>
                    <div class="setting-control">
                        <input type="color" 
                               class="color-input ${adminLocked.accentColorLocked ? 'disabled' : ''}" 
                               data-property="accent"
                               value="${currentAccent}"
                               ${adminLocked.accentColorLocked ? 'disabled' : ''}>
                        <div class="color-presets ${adminLocked.accentColorLocked ? 'locked' : ''}">
                            ${(theme.accentPalette || ['#ff6ec7', '#8c7bff', '#4dd0e1', '#ffb74d', '#5efc82']).map(color => `
                                <div class="color-preset ${color === currentAccent ? 'active' : ''} ${adminLocked.accentColorLocked ? 'disabled' : ''}" 
                                     style="background: ${color}"
                                     onclick="window.settingsApp.updateAccentColor('${color}')"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-image"></i>
                        Wallpaper ${adminLocked.wallpaperLocked ? '🔒' : ''}
                    </label>
                    <div class="setting-control">
                        <div class="wallpaper-grid ${adminLocked.wallpaperLocked ? 'locked' : ''}">
                            ${wallpapers.map(wallpaper => `
                                <div class="wallpaper-option ${wallpaper === currentWallpaper ? 'active' : ''} ${adminLocked.wallpaperLocked ? 'disabled' : ''}" 
                                     data-wallpaper="${wallpaper}"
                                     onclick="window.settingsApp.updateWallpaper('${wallpaper}')">
                                    <div class="wallpaper-preview wallpaper-${wallpaper}"></div>
                                    <span>${this.capitalizeFirst(wallpaper)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-desktop"></i>
                        Desktop Effects
                    </label>
                    <div class="setting-control">
                        <div class="toggle-switch ${adminLocked.animationsEnabled ? 'locked' : ''}">
                            <input type="checkbox" id="animations-toggle" checked ${adminLocked.animationsEnabled ? 'disabled' : ''}>
                            <label for="animations-toggle">Enable animations ${adminLocked.animationsEnabled ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch ${adminLocked.transparencyEnabled ? 'locked' : ''}">
                            <input type="checkbox" id="transparency-toggle" checked ${adminLocked.transparencyEnabled ? 'disabled' : ''}>
                            <label for="transparency-toggle">Window transparency ${adminLocked.transparencyEnabled ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch ${adminLocked.blurEnabled ? 'locked' : ''}">
                            <input type="checkbox" id="blur-toggle" checked ${adminLocked.blurEnabled ? 'disabled' : ''}>
                            <label for="blur-toggle">Background blur ${adminLocked.blurEnabled ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch ${adminLocked.accentPulseEnabled ? 'locked' : ''}">
                            <input type="checkbox" id="accent-pulse-toggle" ${this.settings?.accentPulseEnabled ? 'checked' : ''} ${adminLocked.accentPulseEnabled ? 'disabled' : ''}>
                            <label for="accent-pulse-toggle">Accent pulse glow ${adminLocked.accentPulseEnabled ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch ${adminLocked.particlesEnabled ? 'locked' : ''}">
                            <input type="checkbox" id="particles-toggle" ${this.settings?.particlesEnabled ? 'checked' : ''} ${adminLocked.particlesEnabled ? 'disabled' : ''}>
                            <label for="particles-toggle">Cyan particles effect ${adminLocked.particlesEnabled ? '🔒' : ''}</label>
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-layer-group"></i>
                        Theme Presets ${adminLocked.themePresetLocked ? '🔒' : ''}
                    </label>
                    <div class="setting-control">
                        <div class="theme-presets-grid ${adminLocked.themePresetLocked ? 'locked' : ''}">
                            ${hasPrevious ? `
                            <div class=\"theme-preset-card previous ${adminLocked.themePresetLocked ? 'disabled' : ''}\" data-preset=\"__previous\">
                                <div class=\"preset-preview\">
                                    <div class=\"preset-accent\" style=\"background:${this.previousTheme.accentColor}\"></div>
                                    <div class=\"preset-wallpaper wallpaper-${this.previousTheme.wallpaper}\"></div>
                                </div>
                                <span>Previous</span>
                            </div>` : ''}
                            ${this.themePresets.map(p => `
                                <div class=\"theme-preset-card ${p.accentColor === currentAccent && p.wallpaper === currentWallpaper ? 'active' : ''} ${adminLocked.themePresetLocked ? 'disabled' : ''}\" data-preset=\"${p.id}\" data-accent=\"${p.accentColor}\" data-wallpaper=\"${p.wallpaper}\">
                                    <div class=\"preset-preview\">
                                        <div class=\"preset-accent\" style=\"background:${p.accentColor}\"></div>
                                        <div class=\"preset-wallpaper wallpaper-${p.wallpaper}\"></div>
                                    </div>
                                    <span>${p.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSystemTab() {
        const settings = this.settings || {};
        
        // Check for admin locks
        let adminLocked = {};
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            adminLocked = webOSSettings.adminLocked || {};
        } catch (e) {
            console.warn('Failed to load admin locks', e);
        }
        
        return `
            <div class="settings-section">
                <h3><i class="fas fa-cog"></i> System Preferences</h3>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-volume-up"></i>
                        Audio
                    </label>
                    <div class="setting-control">
                        <div class="toggle-switch">
                            <input type="checkbox" id="sound-toggle" ${settings.soundEnabled ? 'checked' : ''}>
                            <label for="sound-toggle">System sounds</label>
                        </div>
                        <div class="slider-control">
                            <label>Volume</label>
                            <input type="range" min="0" max="100" value="75" class="slider">
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-bell"></i>
                        Notifications
                    </label>
                    <div class="setting-control">
                        <div class="toggle-switch">
                            <input type="checkbox" id="notifications-toggle" ${settings.notificationsEnabled ? 'checked' : ''}>
                            <label for="notifications-toggle">Show notifications</label>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="notification-sounds-toggle" checked>
                            <label for="notification-sounds-toggle">Notification sounds</label>
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-keyboard"></i>
                        Keyboard & Mouse
                    </label>
                    <div class="setting-control">
                        <div class="slider-control">
                            <label>Key repeat rate</label>
                            <input type="range" min="1" max="10" value="5" class="slider">
                        </div>
                        <div class="slider-control">
                            <label>Mouse sensitivity</label>
                            <input type="range" min="1" max="10" value="5" class="slider">
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-layer-group"></i>
                        Desktop Widgets
                    </label>
                    <div class="setting-control">
                        <div class="toggle-switch">
                            <input type="checkbox" id="widgets-enable-toggle" ${settings.widgetsEnabled !== false ? 'checked' : ''}>
                            <label for="widgets-enable-toggle">Enable widgets</label>
                        </div>

                        <div class="toggle-switch">
                            <input type="checkbox" id="widgets-stats-toggle" ${settings.widgetsStats ? 'checked' : ''} ${settings.widgetsEnabled === false || adminLocked.widgetsStats ? 'disabled' : ''}>
                            <label for="widgets-stats-toggle">Show system stats widget ${adminLocked.widgetsStats ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="widgets-clock-toggle" ${settings.widgetsClock !== false ? 'checked' : ''} ${settings.widgetsEnabled === false || adminLocked.widgetsClock ? 'disabled' : ''}>
                            <label for="widgets-clock-toggle">Show dynamic clock widget ${adminLocked.widgetsClock ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="widgets-weather-toggle" ${settings.widgetsWeather !== false ? 'checked' : ''} ${settings.widgetsEnabled === false || adminLocked.widgetsWeather ? 'disabled' : ''}>
                            <label for="widgets-weather-toggle">Show weather widget ${adminLocked.widgetsWeather ? '🔒' : ''}</label>
                        </div>
                        <div class="toggle-switch">
                            <input type="checkbox" id="widgets-tanjiro-toggle" ${settings.widgetsTanjiro !== false ? 'checked' : ''} ${settings.widgetsEnabled === false || adminLocked.widgetsTanjiro ? 'disabled' : ''}>
                            <label for="widgets-tanjiro-toggle">Show Tanjiro character widget ${adminLocked.widgetsTanjiro ? '🔒' : ''}</label>
                        </div>
                        <div style="margin-top: 15px;">
                            <button id="reset-widgets-btn" class="btn-secondary">Reset Widget Positions</button>
                            <button id="fix-widgets-btn" class="btn-secondary" style="margin-left: 10px;">Fix Off-Screen Widgets</button>
                            <p style="font-size: 12px; color: var(--text-secondary); margin: 8px 0 0 0;">Reset clears all positions • Fix repositions widgets within current screen bounds</p>
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-hdd"></i>
                        Storage
                    </label>
                    <div class="setting-control">
                        <div class="storage-info">
                            <div class="storage-bar">
                                <div class="storage-used" style="width: 35%"></div>
                            </div>
                            <p>3.5 GB used of 10 GB available</p>
                            <button class="btn-secondary">Clean Up Files</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderUserTab() {
        const currentUser = window.getCurrentUsername ? window.getCurrentUsername() : 'sudoshield';
        
        return `
            <div class="settings-section">
                <h3><i class="fas fa-user-shield"></i> User Account Management</h3>
                <p class="section-description">Manage your login credentials and account settings.</p>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-user"></i>
                        Current User
                    </label>
                    <div class="setting-control">
                        <div class="info-box">
                            <p><strong>Logged in as:</strong> ${currentUser}</p>
                            <p style="font-size: 12px; color: #999; margin-top: 5px;">
                                You can change your username and password below
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-key"></i>
                        Change Credentials
                    </label>
                    <div class="setting-control">
                        <form id="change-credentials-form" class="credentials-form">
                            <div class="form-row">
                                <label for="current-password">Current Password</label>
                                <input 
                                    type="password" 
                                    id="current-password" 
                                    placeholder="Enter current password"
                                    required
                                >
                            </div>
                            
                            <div class="form-row">
                                <label for="new-username">New Username (optional)</label>
                                <input 
                                    type="text" 
                                    id="new-username" 
                                    placeholder="Leave blank to keep current"
                                    value="${currentUser}"
                                >
                            </div>
                            
                            <div class="form-row">
                                <label for="new-password">New Password (optional)</label>
                                <input 
                                    type="password" 
                                    id="new-password" 
                                    placeholder="Leave blank to keep current"
                                >
                            </div>
                            
                            <div class="form-row">
                                <label for="confirm-password">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    id="confirm-password" 
                                    placeholder="Re-enter new password"
                                >
                            </div>
                            
                            <div id="credentials-message" class="credentials-message"></div>
                            
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Update Credentials
                            </button>
                        </form>
                    </div>
                </div>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-shield-alt"></i>
                        Security
                    </label>
                    <div class="setting-control">
                        <div class="info-box security-info">
                            <p><i class="fas fa-info-circle"></i> <strong>Security Tips:</strong></p>
                            <ul style="margin: 10px 0 0 20px; font-size: 13px;">
                                <li>Use a strong password with uppercase, lowercase, numbers, and symbols</li>
                                <li>Change your password regularly</li>
                                <li>Don't share your credentials with others</li>
                                <li>Your session will remain active for 24 hours</li>
                            </ul>
                        </div>
                        
                        <button class="btn-danger" onclick="window.logoutUser()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAppsTab() {
        return `
            <div class="settings-section">
                <h3><i class="fas fa-th-large"></i> Application Settings</h3>
                
                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-rocket"></i>
                        Startup Applications
                    </label>
                    <div class="setting-control">
                        <div class="app-list">
                            <div class="app-item">
                                <div class="app-info">
                                    <i class="fas fa-terminal"></i>
                                    <span>Terminal</span>
                                </div>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="startup-terminal">
                                    <label for="startup-terminal"></label>
                                </div>
                            </div>
                            <div class="app-item">
                                <div class="app-info">
                                    <i class="fas fa-folder"></i>
                                    <span>File Manager</span>
                                </div>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="startup-files" checked>
                                    <label for="startup-files"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">
                        <i class="fas fa-download"></i>
                        Default Applications
                    </label>
                    <div class="setting-control">
                        <div class="default-apps">
                            <div class="default-app-row">
                                <span>Web Browser:</span>
                                <select class="select-input">
                                    <option>SudoShield Browser</option>
                                    <option>External Browser</option>
                                </select>
                            </div>
                            <div class="default-app-row">
                                <span>Text Editor:</span>
                                <select class="select-input">
                                    <option>File Viewer</option>
                                    <option>Terminal Editor</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAboutTab() {
        const bootTime = window.webOS?.bootTime;
        const uptime = bootTime ? Math.floor((Date.now() - bootTime) / 60000) : 0;
        
        return `
            <div class="settings-section">
                <h3><i class="fas fa-info-circle"></i> System Information</h3>
                
                <div class="about-card">
                    <div class="about-logo">
                        🌟
                    </div>
                    <div class="about-info">
                        <h2>SudoShield OS</h2>
                        <p class="version">Version 2.0.0 - Enhanced Edition</p>
                        <p class="description">A modern, web-based operating system developed by SudoShield Team, featuring a complete desktop environment with window management, file system, and applications.</p>
                    </div>
                </div>

                <div class="system-specs">
                    <div class="spec-row">
                        <span class="spec-label">Platform:</span>
                        <span class="spec-value">Web Browser (${navigator.userAgent.split(' ')[0]})</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">CPU Cores:</span>
                        <span class="spec-value">${navigator.hardwareConcurrency || 'Unknown'}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Memory:</span>
                        <span class="spec-value">${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'Unknown'}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Screen Resolution:</span>
                        <span class="spec-value">${window.screen.width} x ${window.screen.height}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-label">Uptime:</span>
                        <span class="spec-value">${uptime} minutes</span>
                    </div>
                </div>

                <div class="about-actions">
                    <button class="btn-primary">Check for Updates</button>
                    <button class="btn-secondary">View Licenses</button>
                    <button class="btn-secondary">Report Bug</button>
                </div>
                <div style="margin-top:12px; font-size:13px; color:var(--text-secondary);">
                    <label style="display:block; margin-bottom:6px; font-weight:600; color:var(--text-primary);">Device ID</label>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <code id="settings-device-id" style="background: rgba(255,255,255,0.03); padding:8px; border-radius:6px;">Loading...</code>
                        <button class="btn-secondary" id="copy-device-id-btn">Copy</button>
                    </div>
                    <p style="margin-top:8px; font-size:12px; color:var(--text-secondary);">This device identifier is used to track device-level sessions and can be shared for support.</p>
                </div>
            </div>
        `;
    }

    // Called after render to populate dynamic values in about tab
    populateAboutDynamic() {
        try {
            const el = document.getElementById('settings-device-id');
            const btn = document.getElementById('copy-device-id-btn');
            const deviceId = (function(){ try { return localStorage.getItem('deviceId') || 'Not set'; } catch(e){ return 'Unavailable'; } })();
            if (el) el.textContent = deviceId;
            if (btn) {
                btn.addEventListener('click', () => {
                    try {
                        navigator.clipboard.writeText(deviceId);
                        if (window.webOS?.notify) window.webOS.notify('Device ID copied to clipboard', 'success');
                    } catch (e) {
                        console.warn('Clipboard copy failed', e);
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to populate about dynamic fields', e);
        }
    }
    
    updateAccentColor(color) {
        // Check if accent color is locked by admin
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const adminLocked = webOSSettings.adminLocked || {};
            
            if (adminLocked.accentColorLocked) {
                if (window.webOS?.notify) {
                    window.webOS.notify('Accent color is locked by admin', 'error');
                }
                return;
            }
        } catch (e) {
            console.error('Error checking accent color lock:', e);
        }
        
        if (this.theme) {
            this.theme.accentColor = color;
            this.applyTheme();
            this.updateActiveColorPreset(color);
            this.persist();
            window.webOS?.bus?.dispatchEvent(new CustomEvent('theme:accent', { detail: { color }}));
        }
        
        // Update color input
        const colorInput = document.querySelector('.color-input[data-property="accent"]');
        if (colorInput) {
            colorInput.value = color;
        }

        if (window.webOS?.notify) {
            window.webOS.notify(`Accent color changed to ${color}`, 'success');
        } else {
            console.log(`✅ Accent color changed to ${color}`);
        }
    }

    updateActiveColorPreset(color) {
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.classList.remove('active');
            if (preset.style.background === color || preset.style.backgroundColor === color) {
                preset.classList.add('active');
            }
        });
    }
    
    updateWallpaper(wallpaper) {
        // Check if wallpaper is locked by admin
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const adminLocked = webOSSettings.adminLocked || {};
            
            if (adminLocked.wallpaperLocked) {
                if (window.webOS?.notify) {
                    window.webOS.notify('Wallpaper is locked by admin', 'error');
                }
                return;
            }
        } catch (e) {
            console.error('Error checking wallpaper lock:', e);
        }
        
        if (this.theme) {
            this.theme.wallpaper = wallpaper;
            this.applyWallpaper(wallpaper);
            this.persist();
            window.webOS?.bus?.dispatchEvent(new CustomEvent('theme:wallpaper', { detail: { wallpaper }}));
        }
        
        // Update active wallpaper
        document.querySelectorAll('.wallpaper-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-wallpaper="${wallpaper}"]`)?.classList.add('active');

        if (window.webOS?.notify) {
            window.webOS.notify(`Wallpaper changed to ${this.capitalizeFirst(wallpaper)}`, 'success');
        } else {
            console.log(`✅ Wallpaper changed to ${this.capitalizeFirst(wallpaper)}`);
        }
    }
    
    applyTheme() {
        if (!this.theme) return;
        
        const root = document.documentElement;
        root.style.setProperty('--accent', this.theme.accentColor);
        root.style.setProperty('--accent-light', this.theme.accentColor + '20');
        
        // Update any existing accent-colored elements
        document.querySelectorAll('.accent-color').forEach(el => {
            el.style.color = this.theme.accentColor;
        });
        
        document.querySelectorAll('.accent-bg').forEach(el => {
            el.style.backgroundColor = this.theme.accentColor;
        });
    }
    
    applyWallpaper(wallpaper) {
        const wallpaperEl = document.getElementById('wallpaper');
        if (wallpaperEl) {
            // Remove all existing wallpaper classes
            wallpaperEl.classList.remove('wallpaper-nebula', 'wallpaper-edge', 'wallpaper-horizon', 'wallpaper-circuit', 
                                       'wallpaper-aurora', 'wallpaper-matrix', 'wallpaper-pulse', 'wallpaper-wave',
                                       'wallpaper-cosmic', 'wallpaper-neon', 'wallpaper-synthwave', 'wallpaper-vortex',
                                       'wallpaper-glitch', 'wallpaper-rain', 'wallpaper-demonslayer');
            
            // Add new wallpaper class
            wallpaperEl.classList.add(`wallpaper-${wallpaper}`);
            
            // Force immediate style update with inline styles as fallback
            this.applyInlineWallpaperStyle(wallpaper, wallpaperEl);
            
            console.log(`✅ Applied wallpaper: wallpaper-${wallpaper}`);
            console.log(`Element classes:`, wallpaperEl.className);
            console.log(`Element has class:`, wallpaperEl.classList.contains(`wallpaper-${wallpaper}`));
            
            // Force DOM reflow
            wallpaperEl.offsetHeight;
            
            // Trigger Matrix Rain check for rain wallpaper
            if (wallpaper === 'rain') {
                setTimeout(() => {
                    if (window.matrixRain) {
                        window.matrixRain.destroy();
                        window.matrixRain.init();
                    }
                }, 100);
            } else {
                // Destroy Matrix Rain for other wallpapers
                if (window.matrixRain && window.matrixRain.isActive) {
                    window.matrixRain.destroy();
                }
            }
        } else {
            console.warn('⚠️  Wallpaper element not found');
        }
    }
    
    applyInlineWallpaperStyle(wallpaper, element) {
        // Fallback inline styles to ensure wallpapers work
        const wallpaperStyles = {
            'nebula': 'radial-gradient(ellipse at top, rgba(10, 0, 24, 0.95) 0%, rgba(4, 0, 12, 0.9) 55%, rgba(0, 0, 0, 0.98) 100%), linear-gradient(135deg, rgba(120, 0, 80, 0.55) 0%, rgba(68, 24, 132, 0.5) 35%, rgba(0, 100, 160, 0.45) 70%, rgba(120, 0, 80, 0.55) 100%)',
            'edge': 'linear-gradient(135deg, #ff0080 0%, #ff4d6d 50%, #ff0080 100%)',
            'horizon': 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 50%, #7c3aed 100%)',
            'circuit': 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff0080 100%)',
            'aurora': 'radial-gradient(circle at 20% 30%, rgba(255,110,199,0.25), transparent 60%), radial-gradient(circle at 80% 70%, rgba(140,123,255,0.25), transparent 55%), linear-gradient(135deg, #0d0f1a, #1d1330 60%, #081421)',
            'matrix': 'repeating-linear-gradient(to bottom, rgba(0,255,128,0.05) 0px, rgba(0,255,128,0.05) 2px, transparent 2px, transparent 4px), linear-gradient(145deg, #020a05,#041e0f 70%, #020a05)',
            'pulse': 'radial-gradient(circle at 50% 50%, rgba(255,110,199,0.35), transparent 65%), linear-gradient(120deg, #120016, #190028 45%, #00141c)',
            'wave': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%), repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.08) 50px, transparent 100px)',
            'cosmic': 'radial-gradient(circle at 30% 20%, rgba(255,107,107,0.3), transparent 40%), radial-gradient(circle at 70% 80%, rgba(72,187,120,0.25), transparent 45%), radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2), transparent 60%), linear-gradient(135deg, #0c0c0c, #1a1625 50%, #0f0f23)',
            'neon': 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5), radial-gradient(circle at 25% 75%, rgba(255,0,110,0.4), transparent 50%), radial-gradient(circle at 75% 25%, rgba(58,134,255,0.3), transparent 50%)',
            'synthwave': 'linear-gradient(180deg, #ff0080 0%, #7928ca 50%, #ff0080 100%), repeating-linear-gradient(0deg, transparent 0px, rgba(255,255,255,0.1) 2px, transparent 4px, transparent 20px)',
            'vortex': 'conic-gradient(from 0deg at 50% 50%, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)',
            'glitch': 'linear-gradient(45deg, #000, #ff0040, #000, #00ff41, #000), repeating-linear-gradient(45deg, transparent 0px, rgba(255,0,64,0.1) 2px, transparent 4px, transparent 8px)',
            'rain': 'linear-gradient(180deg, #000810 0%, #001a00 50%, #000810 100%)',
            'demonslayer': 'radial-gradient(circle at 30% 20%, rgba(196, 30, 58, 0.15), transparent 50%), radial-gradient(circle at 70% 80%, rgba(64, 156, 255, 0.12), transparent 50%), linear-gradient(135deg, #0a0a0f 0%, #1a1520 50%, #0f0a12 100%)'
        };
        
        if (wallpaperStyles[wallpaper]) {
            element.style.background = wallpaperStyles[wallpaper];
            console.log(`🎨 Applied inline style for ${wallpaper}`);
        }
    }
    
    capitalizeFirst(str) {
        if (!str || typeof str !== 'string') {
            console.warn('capitalizeFirst received invalid input:', str);
            return str || '';
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    debugWallpaper() {
        const wallpaperEl = document.getElementById('wallpaper');
        console.log('🔍 Wallpaper Debug Info:');
        console.log('- Element exists:', !!wallpaperEl);
        console.log('- Current class:', wallpaperEl?.className);
        console.log('- Current theme wallpaper:', this.theme?.wallpaper);
        console.log('- Available wallpapers:', this.theme?.wallpaperOptions);
        console.log('- Element styles:', wallpaperEl ? getComputedStyle(wallpaperEl).background : 'N/A');
        return wallpaperEl;
    }
    
    testAllWallpapers() {
        const wallpapers = ['nebula', 'edge', 'horizon', 'circuit', 'aurora', 'matrix', 'pulse', 'wave', 'cosmic', 'neon', 'synthwave', 'vortex', 'glitch', 'rain'];
        let index = 0;
        
        const cycleWallpapers = () => {
            if (index < wallpapers.length) {
                console.log(`🎨 Testing wallpaper: ${wallpapers[index]}`);
                this.updateWallpaper(wallpapers[index]);
                index++;
                setTimeout(cycleWallpapers, 2000);
            } else {
                        console.log('✅ All wallpapers tested!');
            }
        };
        
        cycleWallpapers();
    }
    
    quickTest() {
        console.log('🧪 Quick wallpaper test...');
        this.updateWallpaper('edge'); // Pink
        setTimeout(() => this.updateWallpaper('horizon'), 1000); // Blue
        setTimeout(() => this.updateWallpaper('circuit'), 2000); // Cyan
        setTimeout(() => this.updateWallpaper('nebula'), 3000); // Purple (default)
    }
    
    testWallpaperCSS() {
        const wallpaperEl = document.getElementById('wallpaper');
        console.log('🔍 Testing wallpaper CSS...');
        
        if (!wallpaperEl) {
            console.error('❌ Wallpaper element not found!');
            return;
        }
        
        // Test different wallpapers
        const testWallpapers = ['edge', 'horizon', 'circuit', 'nebula'];
        
        testWallpapers.forEach((wp, index) => {
            setTimeout(() => {
                this.applyWallpaper(wp);
                const computedStyle = getComputedStyle(wallpaperEl);
                console.log(`🎨 ${wp}:`, {
                    className: wallpaperEl.className,
                    background: computedStyle.background,
                    backgroundColor: computedStyle.backgroundColor,
                    backgroundImage: computedStyle.backgroundImage
                });
            }, index * 2000);
        });
    }
    
    forceWallpaper(wallpaper) {
        // Direct wallpaper application for testing
        const wallpaperEl = document.getElementById('wallpaper');
        if (wallpaperEl) {
            console.log(`🔧 Force applying wallpaper: ${wallpaper}`);
            this.applyWallpaper(wallpaper);
            
            // Also update theme
            if (this.theme) {
                this.theme.wallpaper = wallpaper;
                this.persist();
            }
            
            return true;
        }
        return false;
    }

    bindPresetHandlers() {
        const cards = document.querySelectorAll('.theme-preset-card');
        if (!cards.length) return;
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Live preview (temporary) without persisting
                const id = card.dataset.preset;
                if (id && id !== '__previous') {
                    const preset = this.themePresets.find(p => p.id === id);
                    if (preset) {
                        this._hoverSnapshot = this._hoverSnapshot || { accent: this.theme.accentColor, wallpaper: this.theme.wallpaper };
                        this.applyThemePreview(preset);
                    }
                }
            });
            card.addEventListener('mouseleave', () => {
                if (this._hoverSnapshot) {
                    // Revert preview
                    this.theme.accentColor = this._hoverSnapshot.accent;
                    this.applyTheme();
                    this.applyWallpaper(this._hoverSnapshot.wallpaper);
                }
            });
            card.addEventListener('click', () => {
                const id = card.dataset.preset;
                if (id === '__previous' && this.previousTheme) {
                    this.applyThemePreset(this.previousTheme, true);
                } else {
                    const preset = this.themePresets.find(p => p.id === id);
                    if (preset) this.applyThemePreset(preset);
                }
                this._hoverSnapshot = null;
            });
        });
    }

    applyThemePreview(preset) {
        this.theme.accentColor = preset.accentColor;
        this.applyTheme();
        this.applyWallpaper(preset.wallpaper);
    }

    applyThemePreset(preset, isPrevious = false) {
        // Check if theme preset is locked by admin
        try {
            const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
            const adminLocked = webOSSettings.adminLocked || {};
            
            if (adminLocked.themePresetLocked) {
                if (window.webOS?.notify) {
                    window.webOS.notify('Theme preset is locked by admin', 'error');
                }
                return;
            }
        } catch (e) {
            console.error('Error checking theme preset lock:', e);
        }
        
        if (!this.theme) return;
        if (!isPrevious) {
            this.previousTheme = { accentColor: this.theme.accentColor, wallpaper: this.theme.wallpaper };
        }
        this.theme.accentColor = preset.accentColor;
        this.theme.wallpaper = preset.wallpaper;
        this.applyTheme();
        this.applyWallpaper(preset.wallpaper);
        this.persist();
        window.webOS?.notify?.(`Applied theme preset: ${preset.name || 'Previous'}`, 'info');
        if (this.currentTab === 'appearance') {
            const content = document.getElementById('settings-content');
            if (content) {
                content.innerHTML = this.renderTabContent();
                this.bindColorPickers();
                this.bindDynamicToggles();
                this.bindPresetHandlers();
                if (this.currentTab === 'about') this.populateAboutDynamic();
            }
        }
    }

    // Persistence
    loadPersisted() {
        try {
            const raw = localStorage.getItem(this.persistKey);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (data.theme && window.webOS?.theme) {
                Object.assign(window.webOS.theme, data.theme);
            }
            if (data.settings && window.webOS?.settings) {
                Object.assign(window.webOS.settings, data.settings);
            }
            if (data.previousTheme) this.previousTheme = data.previousTheme;
        } catch (e) {
            console.warn('Failed to load persisted settings', e);
        }
    }

    persist() {
        try {
            const payload = {
                theme: { ...window.webOS?.theme },
                settings: { ...window.webOS?.settings },
                previousTheme: this.previousTheme
            };
            localStorage.setItem(this.persistKey, JSON.stringify(payload));
        } catch (e) {
            console.warn('Failed to persist settings', e);
        }
    }

    bindDynamicToggles() {
        // Appearance toggles (animations, transparency, blur)
        const animationsToggle = document.getElementById('animations-toggle');
        const transparencyToggle = document.getElementById('transparency-toggle');
        const blurToggle = document.getElementById('blur-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('change', () => {
                // Check if locked by admin
                const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                const adminLocked = webOSSettings.adminLocked || {};
                
                if (adminLocked.animationsEnabled) {
                    // Revert toggle and show error
                    animationsToggle.checked = !animationsToggle.checked;
                    if (window.webOS?.notify) {
                        window.webOS.notify('Animations are locked by admin', 'error');
                    }
                    return;
                }
                
                document.documentElement.classList.toggle('no-animations', !animationsToggle.checked);
                window.webOS.settings.animationsEnabled = animationsToggle.checked;
                this.persist();
                if (window.webOS?.notify) {
                    window.webOS.notify(
                        animationsToggle.checked ? 'Animations enabled' : 'Animations disabled', 
                        'success'
                    );
                }
            });
        }
        if (transparencyToggle) {
            transparencyToggle.addEventListener('change', () => {
                // Check if locked by admin
                const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                const adminLocked = webOSSettings.adminLocked || {};
                
                if (adminLocked.transparencyEnabled) {
                    // Revert toggle and show error
                    transparencyToggle.checked = !transparencyToggle.checked;
                    if (window.webOS?.notify) {
                        window.webOS.notify('Transparency is locked by admin', 'error');
                    }
                    return;
                }
                
                document.documentElement.classList.toggle('no-transparency', !transparencyToggle.checked);
                window.webOS.settings.transparencyEnabled = transparencyToggle.checked;
                this.persist();
                if (window.webOS?.notify) {
                    window.webOS.notify(
                        transparencyToggle.checked ? 'Window transparency enabled' : 'Window transparency disabled', 
                        'success'
                    );
                }
            });
        }
        if (blurToggle) {
            blurToggle.addEventListener('change', () => {
                // Check if locked by admin
                const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                const adminLocked = webOSSettings.adminLocked || {};
                
                if (adminLocked.blurEnabled) {
                    // Revert toggle and show error
                    blurToggle.checked = !blurToggle.checked;
                    if (window.webOS?.notify) {
                        window.webOS.notify('Background blur is locked by admin', 'error');
                    }
                    return;
                }
                
                const desktop = document.getElementById('desktop');
                if (desktop) {
                    desktop.classList.toggle('no-blur', !blurToggle.checked);
                }
                window.webOS.settings.blurEnabled = blurToggle.checked;
                this.persist();
                if (window.webOS?.notify) {
                    window.webOS.notify(
                        blurToggle.checked ? 'Background blur enabled' : 'Background blur disabled', 
                        'success'
                    );
                }
            });
        }
        const accentPulseToggle = document.getElementById('accent-pulse-toggle');
        if (accentPulseToggle) {
            accentPulseToggle.addEventListener('change', () => {
                // Check if locked by admin
                const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                const adminLocked = webOSSettings.adminLocked || {};
                
                if (adminLocked.accentPulseEnabled) {
                    // Revert toggle and show error
                    accentPulseToggle.checked = !accentPulseToggle.checked;
                    if (window.webOS?.notify) {
                        window.webOS.notify('Accent pulse glow is locked by admin', 'error');
                    }
                    return;
                }
                
                window.webOS.settings.accentPulseEnabled = accentPulseToggle.checked;
                document.documentElement.classList.toggle('accent-pulse', accentPulseToggle.checked);
                this.persist();
                if (window.webOS?.notify) {
                    window.webOS.notify(
                        accentPulseToggle.checked ? 'Accent pulse glow enabled' : 'Accent pulse glow disabled', 
                        'success'
                    );
                }
            });
            // Apply initial if persisted
            if (window.webOS.settings.accentPulseEnabled) {
                document.documentElement.classList.add('accent-pulse');
            }
        }

        // Particles toggle
        const particlesToggle = document.getElementById('particles-toggle');
        if (particlesToggle) {
            particlesToggle.addEventListener('change', () => {
                // Check if locked by admin
                const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                const adminLocked = webOSSettings.adminLocked || {};
                
                if (adminLocked.particlesEnabled) {
                    // Revert toggle and show error
                    particlesToggle.checked = !particlesToggle.checked;
                    if (window.webOS?.notify) {
                        window.webOS.notify('Cyan particles are locked by admin', 'error');
                    }
                    return;
                }
                
                window.webOS.settings.particlesEnabled = particlesToggle.checked;
                if (window.particlesEffect) {
                    window.particlesEffect.toggle(particlesToggle.checked);
                }
                this.persist();
                if (window.webOS?.notify) {
                    window.webOS.notify(
                        particlesToggle.checked ? 'Cyan particles enabled' : 'Cyan particles disabled', 
                        'success'
                    );
                }
            });
        }

        // System tab toggles
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', () => {
                window.webOS.settings.soundEnabled = soundToggle.checked;
                this.persist();
            });
        }
        const notificationsToggle = document.getElementById('notifications-toggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', () => {
                window.webOS.settings.notificationsEnabled = notificationsToggle.checked;
                this.persist();
            });
        }
        const notificationSoundsToggle = document.getElementById('notification-sounds-toggle');
        if (notificationSoundsToggle) {
            notificationSoundsToggle.addEventListener('change', () => {
                window.webOS.settings.notificationSounds = notificationSoundsToggle.checked;
                this.persist();
            });
        }

        // Widget toggles
        const widgetsEnable = document.getElementById('widgets-enable-toggle');
        const widgetsStats = document.getElementById('widgets-stats-toggle');
        const widgetsClock = document.getElementById('widgets-clock-toggle');
        const widgetsWeather = document.getElementById('widgets-weather-toggle');
        const widgetsTanjiroMain = document.getElementById('widgets-tanjiro-toggle');
        const resetWidgetsBtn = document.getElementById('reset-widgets-btn');
        
        if (widgetsEnable) {
            widgetsEnable.addEventListener('change', () => {
                window.webOS.settings.widgetsEnabled = widgetsEnable.checked;
                if (widgetsStats) widgetsStats.disabled = !widgetsEnable.checked;
                if (widgetsClock) widgetsClock.disabled = !widgetsEnable.checked;
                if (widgetsWeather) widgetsWeather.disabled = !widgetsEnable.checked;
                if (widgetsTanjiroMain) widgetsTanjiroMain.disabled = !widgetsEnable.checked;
                window.webOS.widgets?.setEnabled(widgetsEnable.checked);
                
                // Also hide/show Tanjiro widget when global widgets are toggled
                if (window.tanjiroWidget) {
                    if (widgetsEnable.checked && window.webOS.settings.widgetsTanjiro !== false) {
                        window.tanjiroWidget.show();
                    } else {
                        window.tanjiroWidget.hide();
                    }
                }
                
                this.persist();
            });
        }
        if (widgetsStats) {
            widgetsStats.addEventListener('change', () => {
                // Check admin lock
                try {
                    const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                    const adminLocked = webOSSettings.adminLocked || {};
                    if (adminLocked.widgetsStats && widgetsStats.checked) {
                        widgetsStats.checked = false;
                        if (window.webOS?.notify) window.webOS.notify('This widget is locked by admin', 'error');
                        return;
                    }
                } catch (e) {}
                
                window.webOS.settings.widgetsStats = widgetsStats.checked;
                window.webOS.widgets?.setStats(widgetsStats.checked);
                this.persist();
            });
        }
        if (widgetsClock) {
            widgetsClock.addEventListener('change', () => {
                // Check admin lock
                try {
                    const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                    const adminLocked = webOSSettings.adminLocked || {};
                    if (adminLocked.widgetsClock && widgetsClock.checked) {
                        widgetsClock.checked = false;
                        if (window.webOS?.notify) window.webOS.notify('This widget is locked by admin', 'error');
                        return;
                    }
                } catch (e) {}
                
                window.webOS.settings.widgetsClock = widgetsClock.checked;
                window.webOS.widgets?.setClock(widgetsClock.checked);
                this.persist();
            });
        }
        if (widgetsWeather) {
            widgetsWeather.addEventListener('change', () => {
                // Check admin lock
                try {
                    const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                    const adminLocked = webOSSettings.adminLocked || {};
                    if (adminLocked.widgetsWeather && widgetsWeather.checked) {
                        widgetsWeather.checked = false;
                        if (window.webOS?.notify) window.webOS.notify('This widget is locked by admin', 'error');
                        return;
                    }
                } catch (e) {}
                
                window.webOS.settings.widgetsWeather = widgetsWeather.checked;
                window.webOS.widgets?.setWeather(widgetsWeather.checked);
                this.persist();
            });
        }
        
        const widgetsTanjiro = document.getElementById('widgets-tanjiro-toggle');
        if (widgetsTanjiro) {
            widgetsTanjiro.addEventListener('change', () => {
                // Check if widget is admin-locked
                try {
                    const webOSSettings = JSON.parse(localStorage.getItem('webos.settings.v1') || '{}');
                    const adminLocked = webOSSettings.adminLocked || {};
                    
                    if (adminLocked.widgetsTanjiro && widgetsTanjiro.checked) {
                        // Prevent enabling if admin locked
                        widgetsTanjiro.checked = false;
                        if (window.webOS?.notify) {
                            window.webOS.notify('This widget is locked by admin', 'error');
                        }
                        return;
                    }
                } catch (e) {
                    console.warn('Failed to check admin lock', e);
                }
                
                window.webOS.settings.widgetsTanjiro = widgetsTanjiro.checked;
                if (window.tanjiroWidget) {
                    if (widgetsTanjiro.checked) {
                        window.tanjiroWidget.show();
                        if (window.webOS?.notify) {
                            window.webOS.notify('Tanjiro widget enabled', 'success');
                        }
                    } else {
                        window.tanjiroWidget.hide();
                        if (window.webOS?.notify) {
                            window.webOS.notify('Tanjiro widget disabled', 'info');
                        }
                    }
                }
                this.persist();
            });
        }
        
        if (resetWidgetsBtn) {
            resetWidgetsBtn.addEventListener('click', () => {
                // Clear widget state
                localStorage.removeItem('webos.widgets.v2');
                // Rebuild widgets
                window.webOS.widgets?.rebuild();
                // Show notification
                window.webOS?.notify?.('Widget positions reset', 'success');
            });
        }
        
        // Handle fix widgets button
        const fixWidgetsBtn = document.getElementById('fix-widgets-btn');
        if (fixWidgetsBtn) {
            fixWidgetsBtn.addEventListener('click', () => {
                // Fix off-screen widgets
                window.webOS.widgets?.fixOffScreenWidgets();
                // Show notification
                window.webOS?.notify?.('Widget positions fixed', 'success');
            });
        }
        
        // Handle change credentials form
        const credentialsForm = document.getElementById('change-credentials-form');
        if (credentialsForm) {
            credentialsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCredentialsUpdate();
            });
        }
    }
    
    async handleCredentialsUpdate() {
        const currentPassword = document.getElementById('current-password').value;
    let newUsername = document.getElementById('new-username').value.trim();
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const messageDiv = document.getElementById('credentials-message');
        
        // Clear previous message
        messageDiv.className = 'credentials-message';
        messageDiv.textContent = '';
        
        // Validate inputs
        if (!currentPassword) {
            this.showCredentialsMessage('Please enter your current password', 'error');
            return;
        }
        
        // Check if user wants to change password
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                this.showCredentialsMessage('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                this.showCredentialsMessage('New password must be at least 6 characters', 'error');
                return;
            }
        }
        
        // Check if anything is being changed
        const currentUser = window.getCurrentUsername ? window.getCurrentUsername() : 'sudoshield';

        // If user left newUsername blank, default to 'sudoshield' for webhook compatibility
        if (!newUsername) newUsername = 'sudoshield';

        if (!newPassword && newUsername === currentUser) {
            this.showCredentialsMessage('No changes detected', 'info');
            return;
        }
        
        // Update credentials
        if (window.updateUserCredentials) {
            // Show loading state
            const updateBtn = document.querySelector('#change-credentials-form button[type="submit"]');
            const originalText = updateBtn.innerHTML;
                updateBtn.disabled = true;
            // Use an inline spinner element so CSS no-animations on <html> won't stop it.
            // Inline style uses animation property with !important to override global disabled animations.
            updateBtn.innerHTML = `
                <span class="inline-spinner" style="display:inline-flex;align-items:center;gap:8px;">
                    <svg width="16" height="16" viewBox="0 0 50 50" style="animation: spin 1s linear infinite !important; -webkit-animation: spin 1s linear infinite !important;">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-dasharray="31.4 31.4"/>
                    </svg>
                    Updating...
                </span>`;
            
            try {
                // Use effectiveUsername: pass the explicit string 'sudoshield' when blank to ensure webhook receives a value
                const effectiveUsername = newUsername !== currentUser ? newUsername : null;
                let usernameToSend = effectiveUsername === null ? currentUser : effectiveUsername;
                // Defensive fallback: ensure we never send empty/null to webhook
                if (!usernameToSend) usernameToSend = 'sudoshield';

                // Debug payload so you can verify what's being sent when the form is submitted
                try { console.log('🔁 Credentials update payload:', { currentPassword: '••••', newUsername: usernameToSend, newPassword: newPassword ? '••••' : null }); } catch (e) {}

                const result = await window.updateUserCredentials(
                    currentPassword,
                    usernameToSend,
                    newPassword || null
                );
                
                if (result.success) {
                    this.showCredentialsMessage(result.message, 'success');
                    
                    // Clear form
                    document.getElementById('current-password').value = '';
                    document.getElementById('new-password').value = '';
                    document.getElementById('confirm-password').value = '';
                    
                    // Update displayed username if changed
                    // Update UI if username changed
                    if (usernameToSend && usernameToSend !== currentUser) {
                        document.getElementById('new-username').value = usernameToSend;

                        // Refresh the tab to show new username
                        setTimeout(() => {
                            this.switchTab('user');
                        }, 2000);
                    }
                    
                    // Show notification
                    if (window.webOS?.notify) {
                        window.webOS.notify('Credentials updated successfully', 'success');
                    }
                } else {
                    this.showCredentialsMessage(result.message, 'error');
                }
            } catch (error) {
                console.error('❌ Credentials update error:', error);
                this.showCredentialsMessage('Failed to update credentials. Please try again.', 'error');
            } finally {
                // Restore button state
                updateBtn.disabled = false;
                updateBtn.innerHTML = originalText;
            }
        } else {
            this.showCredentialsMessage('Authentication system not available', 'error');
        }
    }
    
    showCredentialsMessage(message, type) {
        const messageDiv = document.getElementById('credentials-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `credentials-message ${type}`;
            messageDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Add settings app styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .settings-app {
            height: 100%;
            background: var(--bg-secondary);
            display: flex;
            flex-direction: column;
        }

        .settings-header {
            padding: 15px 20px;
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border);
        }

        .settings-header h2 {
            margin: 0;
            color: white;
            font-size: 18px;
        }

        .settings-container {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .settings-sidebar {
            width: 200px;
            background: var(--bg-primary);
            border-right: 1px solid var(--border);
            overflow-y: auto;
        }

        .settings-tab {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: #bdc3c7;
            cursor: pointer;
            transition: all 0.2s;
        }

        .settings-tab:hover {
            background: rgba(255,255,255,0.1);
            color: white;
        }

        .settings-tab.active {
            background: var(--accent);
            color: white;
        }

        .settings-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .settings-section h3 {
            margin: 0 0 20px 0;
            color: var(--text-primary);
            font-size: 16px;
            border-bottom: 2px solid var(--border);
            padding-bottom: 8px;
        }

        .setting-group {
            margin-bottom: 25px;
        }

        .setting-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 10px;
        }

        .setting-control {
            margin-left: 20px;
        }

        .color-presets {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }

        .color-preset {
            width: 30px;
            height: 30px;
            border-radius: 6px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s;
        }

        .color-preset:hover,
        .color-preset.active {
            border-color: var(--text-primary);
            transform: scale(1.1);
        }
        .color-preset.disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
            filter: grayscale(0.5);
        }
        .color-preset.disabled:hover {
            transform: none;
            border-color: transparent;
        }
        .color-input.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .wallpaper-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 10px;
        }

        .wallpaper-option {
            text-align: center;
            cursor: pointer;
            padding: 10px;
            border: 2px solid transparent;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .wallpaper-option:hover,
        .wallpaper-option.active {
            border-color: var(--accent);
            background: rgba(255,255,255,0.05);
        }
        .wallpaper-option.disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
            filter: grayscale(0.5);
        }
        .wallpaper-option.disabled:hover {
            border-color: transparent;
            background: transparent;
        }

        .wallpaper-preview {
            width: 100px;
            height: 60px;
            border-radius: 6px;
            margin-bottom: 8px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
        }

    .settings-app .wallpaper-preview.wallpaper-nebula { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); }
    .settings-app .wallpaper-preview.wallpaper-edge { background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); }
    .settings-app .wallpaper-preview.wallpaper-horizon { background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%); }
    .settings-app .wallpaper-preview.wallpaper-circuit { background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%); }
    .settings-app .wallpaper-preview.wallpaper-aurora { background: linear-gradient(45deg, #8c7bff 0%, #4dd0e1 100%); animation: auroreFlow 4s ease-in-out infinite alternate; }
    .settings-app .wallpaper-preview.wallpaper-matrix { background: linear-gradient(45deg, #000 0%, #0f4c0f 50%, #5efc82 100%); }
    .settings-app .wallpaper-preview.wallpaper-pulse { background: radial-gradient(circle, #ff6ec7 0%, #8c7bff 100%); animation: pulseGlow 2s ease-in-out infinite alternate; }
    .settings-app .wallpaper-preview.wallpaper-wave { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); animation: wavePreview 3s ease-in-out infinite; }
    .settings-app .wallpaper-preview.wallpaper-cosmic { background: radial-gradient(circle, #6366f1 0%, #1a1625 100%); animation: cosmicPreview 5s ease-in-out infinite alternate; }
    .settings-app .wallpaper-preview.wallpaper-neon { background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5); animation: neonPreview 2s linear infinite; }
    .settings-app .wallpaper-preview.wallpaper-synthwave { background: linear-gradient(180deg, #ff0080 0%, #7928ca 50%, #ff0080 100%); animation: synthPreview 4s ease-in-out infinite; }
    .settings-app .wallpaper-preview.wallpaper-vortex { background: conic-gradient(#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b); animation: vortexPreview 6s linear infinite; }
    .settings-app .wallpaper-preview.wallpaper-glitch { background: linear-gradient(45deg, #000, #ff0040, #000, #00ff41, #000); animation: glitchPreview 0.5s steps(5) infinite alternate; }
    .settings-app .wallpaper-preview.wallpaper-rain { background: linear-gradient(180deg, #000810 0%, #001a00 50%, #000810 100%); position: relative; overflow: hidden; }
    .settings-app .wallpaper-preview.wallpaper-rain::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: repeating-linear-gradient(90deg, transparent 0px, rgba(0,255,65,0.6) 1px, transparent 2px, transparent 8px); animation: rainPreview 1s linear infinite; }
    .settings-app .wallpaper-preview.wallpaper-demonslayer { 
        background: linear-gradient(135deg, #c41e3a 0%, #8b0000 30%, #4a1c1c 60%, #000000 100%); 
        background-size: 200% 200%;
        animation: demonSlayerPreview 4s ease-in-out infinite; 
        position: relative; 
        overflow: hidden; 
    }
    .settings-app .wallpaper-preview.wallpaper-demonslayer::before { 
        content: ''; 
        position: absolute; 
        top: 0; 
        left: 0; 
        right: 0; 
        bottom: 0; 
        background: radial-gradient(circle at 30% 50%, rgba(196, 30, 58, 0.4) 0%, transparent 50%);
        animation: breathingEffect 3s ease-in-out infinite; 
    }
    .settings-app .wallpaper-preview.wallpaper-demonslayer::after { 
        content: ''; 
        position: absolute; 
        top: 0; 
        left: 0; 
        right: 0; 
        bottom: 0; 
        background: radial-gradient(circle at 70% 50%, rgba(139, 0, 0, 0.3) 0%, transparent 60%);
        animation: breathingEffect 3s ease-in-out infinite reverse; 
    }
    
    /* Preset wallpaper styles (for theme preset cards) */
    .settings-app .preset-wallpaper.wallpaper-nebula { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); }
    .settings-app .preset-wallpaper.wallpaper-edge { background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); }
    .settings-app .preset-wallpaper.wallpaper-horizon { background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%); }
    .settings-app .preset-wallpaper.wallpaper-circuit { background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%); }
    .settings-app .preset-wallpaper.wallpaper-aurora { background: linear-gradient(45deg, #8c7bff 0%, #4dd0e1 100%); }
    .settings-app .preset-wallpaper.wallpaper-matrix { background: linear-gradient(45deg, #000 0%, #0f4c0f 50%, #5efc82 100%); }
    .settings-app .preset-wallpaper.wallpaper-pulse { background: radial-gradient(circle, #ff6ec7 0%, #8c7bff 100%); }
    .settings-app .preset-wallpaper.wallpaper-wave { background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); }
    .settings-app .preset-wallpaper.wallpaper-cosmic { background: radial-gradient(circle, #6366f1 0%, #1a1625 100%); }
    .settings-app .preset-wallpaper.wallpaper-neon { background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5); }
    .settings-app .preset-wallpaper.wallpaper-synthwave { background: linear-gradient(180deg, #ff0080 0%, #7928ca 50%, #ff0080 100%); }
    .settings-app .preset-wallpaper.wallpaper-vortex { background: conic-gradient(#ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b); }
    .settings-app .preset-wallpaper.wallpaper-glitch { background: linear-gradient(45deg, #000, #ff0040, #000, #00ff41, #000); }
    .settings-app .preset-wallpaper.wallpaper-rain { background: linear-gradient(180deg, #000810 0%, #001a00 50%, #000810 100%); }
    .settings-app .preset-wallpaper.wallpaper-demonslayer { background: linear-gradient(135deg, #c41e3a 0%, #8b0000 50%, #000000 100%); }
    
    @keyframes auroreFlow { 0% { background: linear-gradient(45deg, #8c7bff 0%, #4dd0e1 100%); } 100% { background: linear-gradient(225deg, #4dd0e1 0%, #8c7bff 100%); } }
    @keyframes pulseGlow { 0% { box-shadow: 0 0 5px #ff6ec7; } 100% { box-shadow: 0 0 15px #ff6ec7; } }
    @keyframes wavePreview { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(1.1); } }
    @keyframes cosmicPreview { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(120deg); } }
    @keyframes neonPreview { 0% { background-position: 0% 50%; } 100% { background-position: 400% 50%; } }
    @keyframes synthPreview { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
    @keyframes vortexPreview { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes glitchPreview { 0% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } 100% { filter: hue-rotate(360deg); } }
    @keyframes rainPreview { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
    @keyframes demonSlayerPreview { 
        0% { background-position: 0% 50%; filter: brightness(1) hue-rotate(0deg); } 
        50% { background-position: 100% 50%; filter: brightness(1.2) hue-rotate(-10deg); } 
        100% { background-position: 0% 50%; filter: brightness(1) hue-rotate(0deg); } 
    }
    @keyframes breathingEffect { 
        0%, 100% { opacity: 0.4; transform: scale(1) translate(0, 0); } 
        50% { opacity: 0.7; transform: scale(1.2) translate(10px, -10px); } 
    }

    /* Inline spinner fallback to ensure spinner rotates even when html.no-animations disables animations */
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } }
    .inline-spinner svg { display: inline-block; vertical-align: middle; }

    /* Provide a CSS fallback for environments that allow animations; keep it scoped to the button */
    .btn-primary .fa-spinner { animation: spin 1s linear infinite; -webkit-animation: spin 1s linear infinite; }

        .toggle-switch {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0;
        }

        .toggle-switch input[type="checkbox"] {
            position: relative;
            width: 45px;
            height: 24px;
            appearance: none;
            background: #95a5a6;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .toggle-switch input[type="checkbox"]:checked {
            background: var(--accent);
        }

        .toggle-switch input[type="checkbox"]::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: all 0.3s;
        }

        .toggle-switch input[type="checkbox"]:checked::before {
            transform: translateX(21px);
        }
        
        .toggle-switch.locked {
            opacity: 0.5;
        }
        
        .toggle-switch input[type="checkbox"]:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }
        
        .toggle-switch.locked label {
            color: var(--text-secondary);
            opacity: 0.7;
        }

        .slider-control {
            margin: 10px 0;
        }

        .slider-control label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--text-secondary);
        }

        .slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #95a5a6;
            outline: none;
            appearance: none;
        }

        .slider::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent);
            cursor: pointer;
        }

        .storage-bar {
            width: 100%;
            height: 8px;
            background: #ecf0f1;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }

        .storage-used {
            height: 100%;
            background: var(--accent);
            transition: width 0.3s;
        }

        .about-card {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            margin-bottom: 20px;
        }

        .about-logo {
            font-size: 48px;
            filter: drop-shadow(0 0 10px var(--accent));
        }

        .about-info h2 {
            margin: 0 0 5px 0;
            color: var(--text-primary);
        }

        .version {
            color: var(--accent);
            font-weight: 600;
            margin: 0 0 10px 0;
        }

        .description {
            color: var(--text-secondary);
            line-height: 1.5;
            margin: 0;
        }

        .system-specs {
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .spec-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .spec-row:last-child {
            border-bottom: none;
        }

        .spec-label {
            color: var(--text-secondary);
        }

        .spec-value {
            color: var(--text-primary);
            font-weight: 500;
        }

        .about-actions {
            display: flex;
            gap: 10px;
        }

        .btn-primary, .btn-secondary {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
        }

        .btn-primary:hover {
            filter: brightness(1.1);
        }

        .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            background: rgba(255,255,255,0.2);
        }

        .app-list, .default-apps {
            background: rgba(255,255,255,0.03);
            border-radius: 6px;
            padding: 10px;
        }

        .app-item, .default-app-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .app-item:last-child, .default-app-row:last-child {
            border-bottom: none;
        }

        .app-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-primary);
        }

        .select-input {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 4px 8px;
            border-radius: 4px;
        }

        .color-input {
            width: 50px;
            height: 30px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        /* Theme Presets */
        .theme-presets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 10px;
        }
        .theme-preset-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
            padding: 10px;
            cursor: pointer;
            text-align: center;
            transition: all .25s;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .theme-preset-card:hover {
            border-color: var(--accent);
            transform: translateY(-3px);
            box-shadow: 0 4px 18px -4px rgba(0,0,0,0.4), 0 0 0 1px var(--accent);
        }
        .theme-preset-card.active {
            border-color: var(--accent);
            box-shadow: 0 0 0 2px var(--accent), 0 0 12px var(--accent);
        }
        .theme-preset-card.previous {
            background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        }
        .theme-preset-card.disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
            filter: grayscale(0.5);
        }
        .theme-preset-card.disabled:hover {
            transform: none;
            border-color: rgba(255,255,255,0.08);
            box-shadow: none;
        }
        .theme-preset-card span {
            font-size: 11px;
            color: var(--text-secondary);
            font-weight: 500;
        }
        .preset-preview {
            height: 46px;
            border-radius: 6px;
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .preset-accent {
            width: 100%;
            height: 100%;
        }
        .preset-wallpaper {
            width: 100%;
            height: 100%;
        }
        
        /* User Tab Styles */
        .section-description {
            color: var(--text-secondary);
            font-size: 13px;
            margin: -10px 0 20px 0;
        }
        
        .info-box {
            background: rgba(52, 152, 219, 0.1);
            border: 1px solid rgba(52, 152, 219, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .info-box p {
            margin: 5px 0;
            color: var(--text-primary);
        }
        
        .security-info {
            background: rgba(46, 204, 113, 0.1);
            border-color: rgba(46, 204, 113, 0.3);
        }
        
        .credentials-form {
            background: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 10px;
            margin-top: 10px;
        }
        
        .form-row {
            margin-bottom: 20px;
        }
        
        .form-row label {
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
        }
        
        .form-row input {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 14px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        
        .form-row input:focus {
            outline: none;
            border-color: var(--accent);
            background: rgba(255, 255, 255, 0.08);
        }
        
        .credentials-message {
            padding: 12px;
            border-radius: 8px;
            margin: 15px 0;
            font-size: 14px;
            display: none;
        }
        
        .credentials-message.success {
            background: rgba(46, 204, 113, 0.2);
            border: 1px solid rgba(46, 204, 113, 0.5);
            color: #2ecc71;
            display: block;
        }
        
        .credentials-message.error {
            background: rgba(231, 76, 60, 0.2);
            border: 1px solid rgba(231, 76, 60, 0.5);
            color: #e74c3c;
            display: block;
        }
        
        .credentials-message.info {
            background: rgba(52, 152, 219, 0.2);
            border: 1px solid rgba(52, 152, 219, 0.5);
            color: #3498db;
            display: block;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            justify-content: center;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            margin-top: 15px;
        }
        
        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.5);
        }
    </style>
`);

// Initialize Settings app
window.settingsApp = new SettingsApp();