(function initialiseWebOS() {
    if (window.webOS) {
        return;
    }

    const initialFileTree = {
        'home': {
            type: 'directory',
            contents: {
                'user': {
                    type: 'directory',
                    contents: {
                        'Desktop': { type: 'directory', contents: {} },
                        'Documents': {
                            type: 'directory',
                            contents: {
                                'welcome.md': {
                                    type: 'file',
                                    content: '# Welcome to SudoShield OS\n\n- Try the new SudoShield Browser for curated docs.\n- Launch Settings to personalise wallpaper and neon accents.\n- Open Shield Monitor to watch live stats.',
                                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
                                },
                                'roadmap.txt': {
                                    type: 'file',
                                    content: 'SudoShield OS Roadmap\n-----------------------\n1. Adaptive shielded workspaces\n2. Multi-user privilege profiles\n3. Extension security reviews\n',
                                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
                                }
                            }
                        },
                        'Downloads': {
                            type: 'directory',
                            contents: {
                                'garuda-theme-pack.zip': {
                                    type: 'file',
                                    content: '[binary]',
                                    createdAt: Date.now() - 1000 * 60 * 60 * 8
                                }
                            }
                        },
                        'Music': {
                            type: 'directory',
                            contents: {
                                'nebula-lofi.mp3': { type: 'file', content: 'audio:nebula-lofi' }
                            }
                        },
                        'Pictures': {
                            type: 'directory',
                            contents: {
                                'aurora.jpg': { type: 'file', content: 'image:aurora' },
                                'wallpaper.png': { type: 'file', content: 'image:default' }
                            }
                        }
                    }
                }
            }
        },
        'etc': { type: 'directory', contents: {} },
        'var': { type: 'directory', contents: {} },
        'tmp': { type: 'directory', contents: {} }
    };

    const fileSystem = new VirtualFileSystem(initialFileTree);

    const eventBus = new EventTarget();

    const themeState = {
        accentColor: '#ff6ec7',
        accentPalette: ['#ff6ec7', '#8c7bff', '#4dd0e1', '#ffb74d', '#5efc82'],
        wallpaper: 'nebula',
        wallpaperOptions: ['nebula', 'edge', 'horizon', 'circuit', 'aurora', 'matrix', 'pulse', 'wave', 'cosmic', 'neon', 'synthwave', 'vortex', 'glitch', 'rain'],
    title: 'SudoShield OS'
    };

    const settingsState = {
        soundEnabled: true,
        notificationsEnabled: true,
        notificationSounds: true,
        widgetsEnabled: true,
        widgetsCompact: false,
        widgetsStats: true,  // Enable system stats widget by default
        widgetsTanjiro: false  // Disable Tanjiro widget autostart by default
    };

    window.webOS = {
        version: '1.0.0',
        bootTime: Date.now(),
        bus: eventBus,
        fileSystem,
        theme: themeState,
        settings: settingsState,
        apps: new Map(),
        registerApp(name, definition) {
            this.apps.set(name, definition);
        },
        getApp(name) {
            return this.apps.get(name);
        },
        launchApp(name, options = {}) {
            if (!window.desktop) {
                console.warn('Desktop not ready yet');
                return;
            }
            if (options.forceInstance && typeof window.desktop.spawnApplication === 'function') {
                window.desktop.spawnApplication(name, options);
            } else {
                window.desktop.openApplication(name, options);
            }
        },
        notify(message, type = 'info') {
            window.webOS.bus.dispatchEvent(new CustomEvent('notification', { detail: { message, type } }));
        }
    };

    // Load persisted settings if available (defer heavy logic to settings app, but hydrate basics)
    try {
        const raw = localStorage.getItem('webos.settings.v1');
        if (raw) {
            const data = JSON.parse(raw);
            if (data.theme) Object.assign(themeState, data.theme);
            if (data.settings) Object.assign(settingsState, data.settings);
        }
    } catch (e) {
        console.warn('Failed to hydrate persisted settings early', e);
    }
})();
