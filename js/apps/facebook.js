// Facebook Application
class FacebookApp {
    constructor() {
        this.currentView = 'home';
        // Initial post seed; avatars are generated dynamically to avoid broken external images.
        this.posts = [
            {
                id: 1,
                author: 'Linux Community',
                content: 'Welcome to SudoShield OS! This is a demo Facebook-like interface built with HTML, CSS, and JavaScript.',
                image: null,
                likes: 42,
                comments: 8,
                shares: 3,
                timestamp: '2 hours ago'
            },
            {
                id: 2,
                author: 'Tech News',
                content: 'Amazing new developments in web technology! Modern browsers are becoming incredibly powerful platforms. 💻',
                image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60',
                likes: 89,
                comments: 15,
                shares: 12,
                timestamp: '3 hours ago'
            },
            {
                id: 3,
                author: 'Web Developer',
                content: 'Just finished building this awesome web-based operating system. The window management system is pretty cool! 🚀',
                image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
                likes: 156,
                comments: 24,
                shares: 15,
                timestamp: '6 hours ago'
            },
            {
                id: 4,
                author: 'Design Studio',
                content: 'Beautiful workspace setup for maximum productivity! Clean desk, clean mind ✨',
                image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=60',
                likes: 234,
                comments: 45,
                shares: 28,
                timestamp: '8 hours ago'
            },
            {
                id: 5,
                author: 'Photography Hub',
                content: 'Sunset coding session by the beach. Sometimes the best ideas come in the most beautiful places 🌅',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=60',
                likes: 178,
                comments: 32,
                shares: 19,
                timestamp: '12 hours ago'
            },
            {
                id: 6,
                author: 'Coffee & Code',
                content: 'Perfect morning setup! Nothing beats fresh coffee and clean code. What\'s your favorite coding beverage? ☕',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60',
                likes: 92,
                comments: 18,
                shares: 7,
                timestamp: '1 day ago'
            }
        ];
        
        // Video content for Watch page
        this.videos = [
            {
                id: 1,
                title: 'Building Modern Web Applications',
                author: 'CodeMaster Pro',
                thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=60',
                duration: '15:32',
                views: '1.2M views',
                timestamp: '2 days ago',
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            },
            {
                id: 2,
                title: 'React Tutorial for Beginners',
                author: 'Frontend Academy',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=60',
                duration: '22:18',
                views: '856K views',
                timestamp: '1 week ago',
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
            },
            {
                id: 3,
                title: 'CSS Animations & Transitions',
                author: 'Design Studio',
                thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
                duration: '8:45',
                views: '432K views',
                timestamp: '3 days ago',
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            },
            {
                id: 4,
                title: 'JavaScript ES6+ Features',
                author: 'JS Ninja',
                thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=400&q=60',
                duration: '18:30',
                views: '2.1M views',
                timestamp: '5 days ago',
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
            },
            {
                id: 5,
                title: 'Node.js Backend Development',
                author: 'Backend Bytes',
                thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=60',
                duration: '25:14',
                views: '678K views',
                timestamp: '1 week ago',
                url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
            }
        ];
        this.loading = true;
        this.likedPosts = new Set();
        this.nextId = 4;
        // Additional demo posts will be injected after initial load
        this.friends = [
            { name: 'Linux Torvalds', status: 'online' },
            { name: 'Tim Berners-Lee', status: 'online' },
            { name: 'Ada Lovelace', status: 'away' },
            { name: 'Alan Turing', status: 'offline' },
            { name: 'Grace Hopper', status: 'online' }
        ];
    }
    
    render() {
        return `
            <div class="facebook-app">
                <div class="facebook-header">
                    <div class="facebook-logo animated-logo">
                        <div class="logo-icon">
                            <i class="fab fa-facebook-f"></i>
                        </div>
                        <span class="logo-text">Facebook</span>
                        <div class="logo-pulse"></div>
                    </div>
                    
                    <div class="facebook-search-container">
                        <div class="facebook-search">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" placeholder="Search Facebook..." class="facebook-search-input" id="facebook-search-input">
                            <button class="facebook-search-clear" id="search-clear-btn" style="display: none;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="search-suggestions" id="search-suggestions" style="display: none;">
                            <div class="search-suggestion-item">
                                <i class="fas fa-user"></i>
                                <span>People</span>
                            </div>
                            <div class="search-suggestion-item">
                                <i class="fas fa-users"></i>
                                <span>Groups</span>
                            </div>
                            <div class="search-suggestion-item">
                                <i class="fas fa-flag"></i>
                                <span>Pages</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="facebook-nav">
                        <button class="facebook-nav-btn active" onclick="window.facebookApp.showHome()" data-tooltip="Home">
                            <i class="fas fa-home"></i>
                            <span class="nav-label">Home</span>
                        </button>
                        <button class="facebook-nav-btn" onclick="window.facebookApp.showFriends()" data-tooltip="Friends">
                            <i class="fas fa-users"></i>
                            <span class="nav-label">Friends</span>
                            <div class="notification-badge" id="friends-badge">3</div>
                        </button>
                        <button class="facebook-nav-btn" onclick="window.facebookApp.showMessages()" data-tooltip="Messages">
                            <i class="fas fa-envelope"></i>
                            <span class="nav-label">Messages</span>
                            <div class="notification-badge pulse" id="messages-badge">2</div>
                        </button>
                        <button class="facebook-nav-btn" onclick="window.facebookApp.showNotifications()" data-tooltip="Notifications">
                            <i class="fas fa-bell"></i>
                            <span class="nav-label">Notifications</span>
                            <div class="notification-badge" id="notifications-badge">7</div>
                        </button>
                        
                        <div class="facebook-profile-menu">
                            <button class="facebook-profile-btn" id="profile-menu-btn">
                                <img src="${this.generateAvatar('SudoShield User', 32)}" alt="Profile" class="profile-avatar">
                                <i class="fas fa-chevron-down profile-arrow"></i>
                            </button>
                            <div class="profile-dropdown" id="profile-dropdown" style="display: none;">
                                <div class="profile-dropdown-item">
                                    <i class="fas fa-user"></i>
                                    <span>Profile</span>
                                </div>
                                <div class="profile-dropdown-item">
                                    <i class="fas fa-cog"></i>
                                    <span>Settings</span>
                                </div>
                                <div class="profile-dropdown-divider"></div>
                                <div class="profile-dropdown-item">
                                    <i class="fas fa-sign-out-alt"></i>
                                    <span>Log Out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="facebook-content" id="facebook-content">
                    ${this.renderHome()}
                </div>
            </div>
            
            <style>
                /* Facebook App Base Styles */
                .facebook-app {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #18191a;
                    position: relative;
                    overflow: visible;
                }
                
                /* Enhanced Dynamic Facebook Header Styles */
                .facebook-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    position: relative;
                    overflow: visible;
                    min-height: 60px;
                    z-index: 10000;
                }
                
                .facebook-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shimmer 3s infinite;
                }
                
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                /* Animated Logo */
                .animated-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    transition: transform 0.3s ease;
                }
                
                .animated-logo:hover {
                    transform: scale(1.05);
                }
                
                .logo-icon {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .logo-icon i {
                    color: white;
                    font-size: 20px;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .logo-text {
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    animation: glow 3s ease-in-out infinite alternate;
                }
                
                @keyframes glow {
                    from { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.2); }
                    to { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.4); }
                }
                
                .logo-pulse {
                    position: absolute;
                    top: 50%;
                    left: 20px;
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: ripple 2s infinite;
                }
                
                @keyframes ripple {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
                
                /* Enhanced Search */
                .facebook-search-container {
                    position: relative;
                    z-index: 10;
                    flex: 1;
                    max-width: 350px;
                    margin: 0 20px;
                }
                
                .facebook-search {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.15);
                    border-radius: 25px;
                    padding: 8px 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s ease;
                    width: 100%;
                }
                
                .facebook-search:focus-within {
                    background: rgba(255,255,255,0.25);
                    box-shadow: 0 0 20px rgba(255,255,255,0.2);
                    transform: scale(1.02);
                }
                
                .search-icon {
                    color: rgba(255,255,255,0.8);
                    margin-right: 12px;
                    transition: color 0.3s ease;
                }
                
                .facebook-search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 16px;
                    outline: none;
                    font-weight: 500;
                }
                
                .facebook-search-input::placeholder {
                    color: rgba(255,255,255,0.7);
                }
                
                .facebook-search-clear {
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.8);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    margin-left: 8px;
                }
                
                .facebook-search-clear:hover {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }
                
                .search-suggestions {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    margin-top: 8px;
                    overflow: hidden;
                    animation: slideDown 0.3s ease;
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .search-suggestion-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    color: #1c1e21;
                }
                
                .search-suggestion-item:hover {
                    background: #f0f2f5;
                }
                
                .search-suggestion-item i {
                    color: #65676b;
                    width: 16px;
                }
                
                /* Enhanced Navigation */
                .facebook-nav {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    z-index: 2;
                    position: relative;
                }
                
                .facebook-nav-btn {
                    position: relative;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.8);
                    padding: 12px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                    min-width: 60px;
                }
                
                .facebook-nav-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .facebook-nav-btn:hover::before {
                    opacity: 1;
                }
                
                .facebook-nav-btn:hover {
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .facebook-nav-btn.active {
                    color: white;
                    background: rgba(255,255,255,0.2);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                
                .facebook-nav-btn i {
                    font-size: 20px;
                    transition: transform 0.3s ease;
                }
                
                .facebook-nav-btn:hover i {
                    transform: scale(1.1);
                }
                
                .nav-label {
                    font-size: 12px;
                    font-weight: 600;
                    opacity: 0.9;
                }
                
                /* Notification Badges */
                .notification-badge {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    background: #ff3040;
                    color: white;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 2px 6px;
                    border-radius: 10px;
                    min-width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    animation: bounce 0.6s ease;
                }
                
                @keyframes bounce {
                    0%, 20%, 60%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-4px); }
                    80% { transform: translateY(-2px); }
                }
                
                .notification-badge.pulse {
                    animation: badgePulse 1s infinite;
                }
                
                @keyframes badgePulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                /* Profile Menu */
                .facebook-profile-menu {
                    position: relative;
                    margin-left: 12px;
                }
                
                .facebook-profile-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.15);
                    border: none;
                    border-radius: 20px;
                    padding: 6px 12px 6px 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .facebook-profile-btn:hover {
                    background: rgba(255,255,255,0.25);
                    transform: scale(1.05);
                }
                
                .profile-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.5);
                }
                
                .profile-arrow {
                    color: rgba(255,255,255,0.8);
                    font-size: 12px;
                    transition: transform 0.3s ease;
                }
                
                .facebook-profile-btn.active .profile-arrow {
                    transform: rotate(180deg);
                }
                
                .profile-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    min-width: 200px;
                    overflow: hidden;
                    animation: slideDown 0.3s ease;
                    z-index: 1000;
                }
                
                .profile-dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    color: #1c1e21;
                }
                
                .profile-dropdown-item:hover {
                    background: #f0f2f5;
                }
                
                .profile-dropdown-item i {
                    color: #65676b;
                    width: 16px;
                }
                
                .profile-dropdown-divider {
                    height: 1px;
                    background: #e4e6ea;
                    margin: 4px 0;
                }
                
                /* Tooltip */
                .facebook-nav-btn[data-tooltip]:hover::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: -35px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                }

                /* Content Area */
                .facebook-content {
                    flex: 1;
                    overflow: hidden;
                }
                
                /* Z-index fixes for dropdowns */
                .facebook-profile-menu {
                    z-index: 999999 !important;
                    position: relative;
                }
                
                .facebook-profile-menu .profile-dropdown {
                    z-index: 999999 !important;
                    border: 1px solid rgba(0,0,0,0.1);
                    position: fixed !important;
                    top: 60px !important;
                    right: 16px !important;
                }
                
                .facebook-search-container .search-suggestions {
                    z-index: 999998 !important;
                    position: fixed !important;
                }
                
                /* Ensure header and nav elements stay above content */
                .facebook-header {
                    z-index: 10000 !important;
                    position: relative;
                }
                
                .facebook-nav {
                    z-index: 10001 !important;
                    position: relative;
                }
                
                /* Override any potential window z-index issues */
                .facebook-app {
                    z-index: auto !important;
                }
                
                .facebook-content {
                    z-index: 1 !important;
                    position: relative;
                }
            </style>
        `;
    }
    
    init(container) {
        this.container = container;
        this.setupEventListeners();
        this.setupDynamicHeader();
        this.startNotificationUpdates();
        
        // Simulate async loading for skeleton effect
        setTimeout(() => {
            this.loading = false;
            const content = document.getElementById('facebook-content');
            if (content && this.currentView === 'home') {
                content.innerHTML = this.renderHome();
                this.attachFeedEvents();
                this.observeLazyImages();
                this.injectDemoPosts();
            }
        }, 600);
    }
    
    setupEventListeners() {
        // Event listeners would be set up here
    }

    setupDynamicHeader() {
        // Search functionality
        setTimeout(() => {
            const searchInput = document.getElementById('facebook-search-input');
            const searchClear = document.getElementById('search-clear-btn');
            const searchSuggestions = document.getElementById('search-suggestions');
            
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (value.length > 0) {
                        searchClear.style.display = 'block';
                        searchSuggestions.style.display = 'block';
                        this.updateSearchSuggestions(value);
                    } else {
                        searchClear.style.display = 'none';
                        searchSuggestions.style.display = 'none';
                    }
                });

                searchInput.addEventListener('focus', () => {
                    if (searchInput.value.length > 0) {
                        searchSuggestions.style.display = 'block';
                    }
                });

                // Hide suggestions when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.facebook-search-container')) {
                        searchSuggestions.style.display = 'none';
                    }
                });
            }

            if (searchClear) {
                searchClear.addEventListener('click', () => {
                    searchInput.value = '';
                    searchClear.style.display = 'none';
                    searchSuggestions.style.display = 'none';
                    searchInput.focus();
                });
            }

            // Profile dropdown functionality
            const profileBtn = document.getElementById('profile-menu-btn');
            const profileDropdown = document.getElementById('profile-dropdown');
            
            if (profileBtn && profileDropdown) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = profileDropdown.style.display !== 'none';
                    
                    if (isVisible) {
                        profileDropdown.style.display = 'none';
                        profileBtn.classList.remove('active');
                    } else {
                        // Calculate position relative to viewport
                        const rect = profileBtn.getBoundingClientRect();
                        profileDropdown.style.position = 'fixed';
                        profileDropdown.style.top = (rect.bottom + 8) + 'px';
                        profileDropdown.style.right = (window.innerWidth - rect.right) + 'px';
                        profileDropdown.style.left = 'auto';
                        profileDropdown.style.zIndex = '999999';
                        
                        profileDropdown.style.display = 'block';
                        profileBtn.classList.add('active');
                    }
                });

                // Hide dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.facebook-profile-menu')) {
                        profileDropdown.style.display = 'none';
                        profileBtn.classList.remove('active');
                    }
                });

                // Profile dropdown item clicks
                profileDropdown.addEventListener('click', (e) => {
                    const item = e.target.closest('.profile-dropdown-item');
                    if (item) {
                        const text = item.querySelector('span').textContent;
                        console.log(`Profile menu: ${text} clicked`);
                        
                        // Add click animation
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.transform = '';
                            profileDropdown.style.display = 'none';
                            profileBtn.classList.remove('active');
                        }, 150);
                    }
                });
            }
        }, 100);
    }

    addProfileGlow() {
        // Add a subtle glow effect to profile when notifications are active
        const profileBtn = document.getElementById('profile-menu-btn');
        if (profileBtn) {
            profileBtn.style.boxShadow = '0 0 15px rgba(24, 119, 242, 0.5)';
            setTimeout(() => {
                profileBtn.style.boxShadow = '';
            }, 2000);
        }
    }



    renderFeaturedVideo(video) {
        return `
            <div class="featured-video-container" onclick="window.facebookApp.playFeaturedVideo('${video.url}')">
                <div class="featured-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="featured-play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="featured-duration">${video.duration}</div>
                </div>
                <video class="featured-video-element" style="display: none;" controls>
                    <source src="${video.url}" type="video/mp4">
                </video>
                <div class="featured-video-info">
                    <h4>${video.title}</h4>
                    <p>${video.author} • ${video.views} • ${video.timestamp}</p>
                </div>
            </div>
        `;
    }

    renderVideoCard(video) {
        return `
            <div class="video-card" onclick="window.facebookApp.playVideoCard('${video.url}', ${video.id})">
                <div class="video-card-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-card-play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-card-duration">${video.duration}</div>
                </div>
                <div class="video-card-info">
                    <h4>${video.title}</h4>
                    <p class="video-card-author">${video.author}</p>
                    <p class="video-card-stats">${video.views} • ${video.timestamp}</p>
                </div>
            </div>
        `;
    }

    playVideo(url, postId) {
        console.log(`Playing video for post ${postId}: ${url}`);
        const player = document.querySelector(`[data-post-id="${postId}"] .facebook-video-player`);
        
        if (player) {
            const thumbnail = player.querySelector('.video-thumbnail');
            const video = player.querySelector('.video-element');
            
            if (thumbnail && video) {
                // Hide thumbnail and show video
                thumbnail.style.display = 'none';
                video.style.display = 'block';
                
                // Set video source if not already set
                const source = video.querySelector('source');
                if (source && source.src !== url) {
                    source.src = url;
                    video.load(); // Reload the video with new source
                }
                
                // Play video with error handling
                const playPromise = video.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Video started playing successfully');
                    }).catch(error => {
                        console.log('Error playing video:', error);
                        // If video fails to play, show thumbnail again
                        thumbnail.style.display = 'block';
                        video.style.display = 'none';
                        
                        // Show error message
                        this.showVideoError(player);
                    });
                }
                
                // Add event listener for when video ends
                video.addEventListener('ended', () => {
                    thumbnail.style.display = 'block';
                    video.style.display = 'none';
                });
            }
        } else {
            console.log(`Video player not found for post ${postId}`);
        }
    }

    showVideoError(player) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'video-error';
        errorDiv.innerHTML = `
            <div class="video-error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Video temporarily unavailable</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        player.appendChild(errorDiv);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 3000);
    }

    playFeaturedVideo(url) {
        const container = document.querySelector('.featured-video-container');
        if (container) {
            const thumbnail = container.querySelector('.featured-thumbnail');
            const video = container.querySelector('.featured-video-element');
            
            thumbnail.style.display = 'none';
            video.style.display = 'block';
            video.play();
        }
    }

    playVideoCard(url, videoId) {
        console.log(`Playing video ${videoId}: ${url}`);
        // In a real implementation, this would open a video modal or navigate to video page
    }

    renderWatchStyles() {
        return `
            <style>
                /* Watch Page Styles */
                .facebook-watch-page {
                    padding: 20px;
                    color: #e4e6ea;
                    background: #18191a;
                    height: 100%;
                    overflow-y: auto;
                }
                
                .watch-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #3e4042;
                }
                
                .watch-header h2 {
                    font-size: 2em;
                    color: #e4e6ea;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .watch-categories {
                    display: flex;
                    gap: 10px;
                }
                
                .category-btn {
                    padding: 8px 16px;
                    background: #3a3b3c;
                    color: #b0b3b8;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                }
                
                .category-btn.active,
                .category-btn:hover {
                    background: #1877f2;
                    color: white;
                }
                
                .watch-content {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 30px;
                }
                
                .featured-video h3,
                .video-grid h3 {
                    font-size: 1.3em;
                    margin-bottom: 15px;
                    color: #e4e6ea;
                }
                
                /* Featured Video */
                .featured-video-container {
                    background: #242526;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                
                .featured-video-container:hover {
                    transform: scale(1.02);
                }
                
                .featured-thumbnail {
                    position: relative;
                    width: 100%;
                    height: 400px;
                    overflow: hidden;
                }
                
                .featured-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .featured-play-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 30px;
                    transition: all 0.3s ease;
                }
                
                .featured-play-button:hover {
                    background: rgba(24, 119, 242, 0.9);
                    transform: translate(-50%, -50%) scale(1.1);
                }
                
                .featured-duration {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .featured-video-element {
                    width: 100%;
                    height: 400px;
                }
                
                .featured-video-info {
                    padding: 15px;
                }
                
                .featured-video-info h4 {
                    font-size: 1.4em;
                    color: #e4e6ea;
                    margin-bottom: 5px;
                }
                
                .featured-video-info p {
                    color: #b0b3b8;
                    font-size: 14px;
                }
                
                /* Video Grid */
                .video-grid-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .video-card {
                    display: flex;
                    background: #242526;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .video-card:hover {
                    background: #3a3b3c;
                    transform: translateX(5px);
                }
                
                .video-card-thumbnail {
                    position: relative;
                    width: 150px;
                    height: 85px;
                    flex-shrink: 0;
                }
                
                .video-card-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .video-card-play-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .video-card-play-button:hover {
                    background: rgba(24, 119, 242, 0.9);
                }
                
                .video-card-duration {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-weight: 600;
                }
                
                .video-card-info {
                    padding: 10px;
                    flex: 1;
                }
                
                .video-card-info h4 {
                    font-size: 14px;
                    color: #e4e6ea;
                    margin-bottom: 5px;
                    line-height: 1.3;
                }
                
                .video-card-author {
                    color: #b0b3b8;
                    font-size: 12px;
                    margin-bottom: 3px;
                }
                
                .video-card-stats {
                    color: #65676b;
                    font-size: 11px;
                }
                
                /* Video Player in Posts */
                .facebook-video-player {
                    margin-top: 15px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .video-thumbnail {
                    position: relative;
                    cursor: pointer;
                }
                
                .video-thumb-img {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                }
                
                .video-play-button {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    transition: all 0.3s ease;
                }
                
                .video-play-button:hover {
                    background: rgba(24, 119, 242, 0.9);
                    transform: translate(-50%, -50%) scale(1.1);
                }
                
                .video-duration {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .video-element {
                    width: 100%;
                    height: 300px;
                    border-radius: 8px;
                }
                
                /* Video Error Styling */
                .video-error {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    z-index: 10;
                }
                
                .video-error-content {
                    text-align: center;
                    color: white;
                }
                
                .video-error-content i {
                    font-size: 24px;
                    color: #f39c12;
                    margin-bottom: 10px;
                }
                
                .video-error-content p {
                    margin-bottom: 15px;
                    font-size: 14px;
                }
                
                .video-error-content button {
                    background: #1877f2;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                }
                
                @media (max-width: 1024px) {
                    .watch-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .video-grid-container {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                    }
                    
                    .video-card {
                        flex-direction: column;
                    }
                    
                    .video-card-thumbnail {
                        width: 100%;
                        height: 180px;
                    }
                }
            </style>
        `;
    }

    updateSearchSuggestions(query) {
        const suggestions = document.getElementById('search-suggestions');
        if (!suggestions) return;

        // Mock search suggestions based on query
        const mockResults = [
            { type: 'user', icon: 'fas fa-user', text: `${query} - People` },
            { type: 'group', icon: 'fas fa-users', text: `Groups matching "${query}"` },
            { type: 'page', icon: 'fas fa-flag', text: `Pages about ${query}` },
            { type: 'post', icon: 'fas fa-file-text', text: `Posts containing "${query}"` }
        ];

        suggestions.innerHTML = mockResults.map(result => `
            <div class="search-suggestion-item">
                <i class="${result.icon}"></i>
                <span>${result.text}</span>
            </div>
        `).join('');
    }

    startNotificationUpdates() {
        // Simulate dynamic notification updates
        setInterval(() => {
            this.updateNotificationBadges();
        }, 15000); // Update every 15 seconds
    }

    updateNotificationBadges() {
        const badges = {
            'friends-badge': Math.floor(Math.random() * 5) + 1,
            'messages-badge': Math.floor(Math.random() * 3) + 1,
            'notifications-badge': Math.floor(Math.random() * 10) + 1
        };

        Object.entries(badges).forEach(([id, count]) => {
            const badge = document.getElementById(id);
            if (badge) {
                badge.textContent = count;
                badge.style.animation = 'none';
                setTimeout(() => {
                    badge.style.animation = 'bounce 0.6s ease';
                }, 10);
            }
        });
    }
    
    renderHome() {
        return `
            <div class="facebook-home">
                <div class="facebook-sidebar">
                    <div class="facebook-user-profile">
                        <img src="${this.generateAvatar('SudoShield User')}" alt="User" loading="lazy">
                        <span>SudoShield User</span>
                    </div>
                    
                    <div class="facebook-quick-links">
                        <div class="facebook-link" onclick="window.facebookApp.showFriends()">
                            <i class="fas fa-users"></i>
                            <span>Friends</span>
                        </div>
                        <div class="facebook-link" onclick="window.facebookApp.showPages()">
                            <i class="fas fa-flag"></i>
                            <span>Pages</span>
                        </div>
                        <div class="facebook-link" onclick="window.facebookApp.showGroups()">
                            <i class="fas fa-layer-group"></i>
                            <span>Groups</span>
                        </div>
                        <div class="facebook-link" onclick="window.facebookApp.showMarketplace()">
                            <i class="fas fa-shopping-bag"></i>
                            <span>Marketplace</span>
                        </div>
                        <div class="facebook-link" onclick="window.facebookApp.showWatch()">
                            <i class="fas fa-tv"></i>
                            <span>Watch</span>
                        </div>
                    </div>
                    
                    <div class="facebook-online-friends">
                        <h4>Online Friends</h4>
                        ${this.friends.filter(f => f.status === 'online').map(friend => `
                            <div class="facebook-friend-item">
                                <div class="facebook-friend-avatar">
                                    <img src="${this.generateAvatar(friend.name, 40)}" alt="${friend.name}" loading="lazy">
                                    <div class="facebook-online-indicator"></div>
                                </div>
                                <span>${friend.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="facebook-main-content">
                    <div class="facebook-status-composer" id="facebook-composer">
                        <div class="facebook-composer-header">
                            <img src="${this.generateAvatar('SudoShield User')}" alt="User" loading="lazy">
                            <textarea rows="2" placeholder="What's on your mind?" class="facebook-status-input" id="composer-text"></textarea>
                        </div>
                        <div class="facebook-composer-attach">
                            <input type="text" placeholder="Optional image URL" id="composer-image" class="facebook-image-input" />
                        </div>
                        <div class="facebook-composer-actions">
                            <button class="facebook-composer-btn" id="composer-post-btn">
                                <i class="fas fa-paper-plane" style="color: #1877f2;"></i>
                                Post
                            </button>
                            <button class="facebook-composer-btn" id="composer-clear-btn">
                                <i class="fas fa-times" style="color:#f02849"></i>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div class="facebook-posts" id="facebook-posts">
                        ${this.loading ? this.renderSkeletons(3) : this.posts.map(p=>this.renderPost(p)).join('')}
                    </div>
                </div>
                
                <div class="facebook-right-sidebar">
                    <div class="facebook-sponsored">
                        <h4>Sponsored</h4>
                        <div class="facebook-ad">
                            <img src="${this.generateAdImage()}" alt="Ad" loading="lazy">
                            <div class="facebook-ad-content">
                                <h5>Web Development Course</h5>
                                <p>Learn to build amazing web applications</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="facebook-contacts">
                        <h4>Contacts</h4>
                        ${this.friends.map(friend => `
                            <div class="facebook-contact-item">
                                <div class="facebook-contact-avatar">
                                    <img src="${this.generateAvatar(friend.name, 40)}" alt="${friend.name}" loading="lazy">
                                    <div class="facebook-status-indicator facebook-status-${friend.status}"></div>
                                </div>
                                <span>${friend.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <style>
                /* Enhanced Dynamic Facebook Header Styles */
                .facebook-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    position: relative;
                    overflow: hidden;
                }
                
                .facebook-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: shimmer 3s infinite;
                }
                
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                /* Animated Logo */
                .animated-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    transition: transform 0.3s ease;
                }
                
                .animated-logo:hover {
                    transform: scale(1.05);
                }
                
                .logo-icon {
                    position: relative;
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                
                .logo-icon i {
                    color: white;
                    font-size: 20px;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .logo-text {
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    animation: glow 3s ease-in-out infinite alternate;
                }
                
                @keyframes glow {
                    from { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.2); }
                    to { text-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.4); }
                }
                
                .logo-pulse {
                    position: absolute;
                    top: 50%;
                    left: 20px;
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: ripple 2s infinite;
                }
                
                @keyframes ripple {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
                
                /* Enhanced Search */
                .facebook-search-container {
                    position: relative;
                    z-index: 10;
                }
                
                .facebook-search {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.15);
                    border-radius: 25px;
                    padding: 8px 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s ease;
                    width: 300px;
                }
                
                .facebook-search:focus-within {
                    background: rgba(255,255,255,0.25);
                    box-shadow: 0 0 20px rgba(255,255,255,0.2);
                    transform: scale(1.02);
                }
                
                .search-icon {
                    color: rgba(255,255,255,0.8);
                    margin-right: 12px;
                    transition: color 0.3s ease;
                }
                
                .facebook-search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 16px;
                    outline: none;
                    font-weight: 500;
                }
                
                .facebook-search-input::placeholder {
                    color: rgba(255,255,255,0.7);
                }
                
                .facebook-search-clear {
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.8);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    margin-left: 8px;
                }
                
                .facebook-search-clear:hover {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }
                
                .search-suggestions {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    margin-top: 8px;
                    overflow: hidden;
                    animation: slideDown 0.3s ease;
                }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .search-suggestion-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    color: #1c1e21;
                }
                
                .search-suggestion-item:hover {
                    background: #f0f2f5;
                }
                
                .search-suggestion-item i {
                    color: #65676b;
                    width: 16px;
                }
                
                /* Enhanced Navigation */
                .facebook-nav {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    z-index: 2;
                    position: relative;
                }
                
                .facebook-nav-btn {
                    position: relative;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.8);
                    padding: 12px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .facebook-nav-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .facebook-nav-btn:hover::before {
                    opacity: 1;
                }
                
                .facebook-nav-btn:hover {
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .facebook-nav-btn.active {
                    color: white;
                    background: rgba(255,255,255,0.2);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                
                .facebook-nav-btn i {
                    font-size: 20px;
                    transition: transform 0.3s ease;
                }
                
                .facebook-nav-btn:hover i {
                    transform: scale(1.1);
                }
                
                .nav-label {
                    font-size: 12px;
                    font-weight: 600;
                    opacity: 0.9;
                }
                
                /* Notification Badges */
                .notification-badge {
                    position: absolute;
                    top: 8px;
                    right: 12px;
                    background: #ff3040;
                    color: white;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 2px 6px;
                    border-radius: 10px;
                    min-width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    animation: bounce 0.6s ease;
                }
                
                @keyframes bounce {
                    0%, 20%, 60%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-4px); }
                    80% { transform: translateY(-2px); }
                }
                
                .notification-badge.pulse {
                    animation: badgePulse 1s infinite;
                }
                
                @keyframes badgePulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                /* Profile Menu */
                .facebook-profile-menu {
                    position: relative;
                    margin-left: 12px;
                }
                
                .facebook-profile-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.15);
                    border: none;
                    border-radius: 20px;
                    padding: 6px 12px 6px 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .facebook-profile-btn:hover {
                    background: rgba(255,255,255,0.25);
                    transform: scale(1.05);
                }
                
                .profile-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.5);
                }
                
                .profile-arrow {
                    color: rgba(255,255,255,0.8);
                    font-size: 12px;
                    transition: transform 0.3s ease;
                }
                
                .facebook-profile-btn.active .profile-arrow {
                    transform: rotate(180deg);
                }
                
                .profile-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    min-width: 200px;
                    overflow: hidden;
                    animation: slideDown 0.3s ease;
                    z-index: 1000;
                }
                
                .profile-dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    color: #1c1e21;
                }
                
                .profile-dropdown-item:hover {
                    background: #f0f2f5;
                }
                
                .profile-dropdown-item i {
                    color: #65676b;
                    width: 16px;
                }
                
                .profile-dropdown-divider {
                    height: 1px;
                    background: #e4e6ea;
                    margin: 4px 0;
                }
                
                /* Tooltip */
                .facebook-nav-btn[data-tooltip]:hover::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: -35px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    z-index: 1000;
                }

                .facebook-home {
                    display: flex;
                    height: 100%;
                    background: #18191a;
                }
                
                .facebook-sidebar {
                    width: 250px;
                    padding: 20px 15px;
                    background: #242526;
                    overflow-y: auto;
                }
                
                .facebook-user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .facebook-user-profile:hover {
                    background: #3a3b3c;
                }
                
                .facebook-user-profile img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                
                .facebook-user-profile span {
                    color: #e4e6ea;
                    font-weight: 600;
                }
                
                .facebook-quick-links {
                    margin-bottom: 30px;
                }
                
                .facebook-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-bottom: 5px;
                }
                
                .facebook-link:hover {
                    background: #3a3b3c;
                }
                
                .facebook-link i {
                    width: 20px;
                    color: #1877f2;
                    font-size: 20px;
                }
                
                .facebook-link span {
                    color: #e4e6ea;
                    font-weight: 500;
                }
                
                .facebook-online-friends h4 {
                    color: #b0b3b8;
                    font-size: 14px;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                
                .facebook-friend-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-bottom: 5px;
                }
                
                .facebook-friend-item:hover {
                    background: #3a3b3c;
                }
                
                .facebook-friend-avatar {
                    position: relative;
                }
                
                .facebook-friend-avatar img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }
                
                .facebook-online-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: #42b883;
                    border: 2px solid #242526;
                    border-radius: 50%;
                }
                
                .facebook-main-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                
                .facebook-status-composer {
                    background: #242526;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                
                .facebook-composer-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .facebook-composer-header img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                
                .facebook-status-input {
                    flex: 1;
                    background: #3a3b3c;
                    border: none;
                    border-radius: 25px;
                    padding: 12px 16px;
                    color: #e4e6ea;
                    font-size: 16px;
                    outline: none;
                    resize: vertical;
                }
                
                .facebook-status-input::placeholder {
                    color: #b0b3b8;
                }
                
                .facebook-composer-actions {
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #3e4042;
                    padding-top: 15px;
                }
                
                .facebook-composer-btn {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #b0b3b8;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                
                .facebook-composer-btn:hover {
                    background: #3a3b3c;
                }
                
                .facebook-right-sidebar {
                    width: 250px;
                    padding: 20px 15px;
                    background: #242526;
                    overflow-y: auto;
                }
                
                .facebook-sponsored, .facebook-contacts {
                    margin-bottom: 30px;
                }
                
                .facebook-sponsored h4, .facebook-contacts h4 {
                    color: #b0b3b8;
                    font-size: 14px;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                
                .facebook-ad {
                    display: flex;
                    gap: 10px;
                    padding: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .facebook-ad:hover {
                    background: #3a3b3c;
                }
                
                .facebook-ad img {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                }
                
                .facebook-ad-content h5 {
                    color: #e4e6ea;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                
                .facebook-ad-content p {
                    color: #b0b3b8;
                    font-size: 12px;
                }
                
                .facebook-contact-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin-bottom: 5px;
                }
                
                .facebook-contact-item:hover {
                    background: #3a3b3c;
                }
                
                .facebook-contact-avatar {
                    position: relative;
                }
                
                .facebook-contact-avatar img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }
                
                .facebook-status-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    border: 2px solid #242526;
                    border-radius: 50%;
                }
                
                .facebook-status-online {
                    background: #42b883;
                }
                
                .facebook-status-away {
                    background: #f39c12;
                }
                
                .facebook-status-offline {
                    background: #7f8c8d;
                }
                
                .facebook-contact-item span {
                    color: #e4e6ea;
                    font-size: 14px;
                }
                .facebook-image-input {
                    width: 100%;
                    margin-bottom: 10px;
                    padding: 10px 12px;
                    background:#3a3b3c;
                    border: 1px solid #3e4042;
                    border-radius: 8px;
                    color:#e4e6ea;
                    outline:none;
                }
                .facebook-image-input::placeholder { color:#8d8f91; }

                .facebook-post.skeleton {
                    position: relative;
                    overflow: hidden;
                }
                .skeleton-box {
                    background: #333537;
                    border-radius: 6px;
                    width: 100%;
                    height: 14px;
                    margin-bottom: 8px;
                    position: relative;
                    overflow: hidden;
                }
                .skeleton-box::after {
                    content: '';
                    position: absolute;
                    top:0;left:-60%;
                    width:60%;height:100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
                    animation: shimmer 1.2s infinite;
                }
                @keyframes shimmer { 100% { transform: translateX(160%);} }
            </style>
        `;
    }
    
    renderVideoPlayer(video, postId) {
        return `
            <div class="facebook-video-player" data-post-id="${postId}">
                <div class="video-thumbnail" onclick="window.facebookApp.playVideo('${video.url}', ${postId})">
                    <img src="${video.thumbnail}" alt="Video thumbnail" class="video-thumb-img">
                    <div class="video-play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-duration">${video.duration}</div>
                </div>
                <video class="video-element" style="display: none;" controls>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
    }

    renderPost(post) {
        const liked = this.likedPosts.has(post.id);
        return `
            <div class="facebook-post">
                <div class="facebook-post-header">
                    <img src="${this.generateAvatar(post.author)}" alt="${post.author}" loading="lazy">
                    <div class="facebook-post-info">
                        <h4>${post.author}</h4>
                        <p>${post.timestamp}</p>
                    </div>
                    <div class="facebook-post-options">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                
                <div class="facebook-post-content">
                    <p>${post.content}</p>
                    ${post.image ? `<img data-src="${post.image}" alt="Post image" class="facebook-post-image lazy-img" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,${encodeURIComponent(this.imageFallbackSvg())}';">` : ''}
                </div>
                
                <div class="facebook-post-stats">
                    <div class="facebook-post-reactions">
                        <div class="facebook-reaction-icons">
                            <i class="fas fa-heart" style="color: #f02849;"></i>
                            <i class="fas fa-thumbs-up" style="color: #1877f2;"></i>
                        </div>
                        <span>${post.likes}</span>
                    </div>
                    <div class="facebook-post-counts">
                        <span>${post.comments} comments</span>
                        <span>${post.shares} shares</span>
                    </div>
                </div>
                
                <div class="facebook-post-actions" data-post-id="${post.id}">
                    <button class="facebook-action-btn like-btn ${liked ? 'liked':''}" data-action="like">
                        <i class="fas fa-thumbs-up"></i>
                        ${liked ? 'Liked' : 'Like'}
                    </button>
                    <button class="facebook-action-btn" data-action="comment">
                        <i class="fas fa-comment"></i>
                        Comment
                    </button>
                    <button class="facebook-action-btn" data-action="share">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
            
            <style>
                .facebook-post {
                    background: #242526;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                
                .facebook-post-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px 20px 0;
                }
                
                .facebook-post-header img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                
                .facebook-post-info {
                    flex: 1;
                }
                
                .facebook-post-info h4 {
                    color: #e4e6ea;
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                
                .facebook-post-info p {
                    color: #b0b3b8;
                    font-size: 13px;
                }
                
                .facebook-post-options {
                    color: #b0b3b8;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                
                .facebook-post-options:hover {
                    background: #3a3b3c;
                }
                
                .facebook-post-content {
                    padding: 15px 20px;
                }
                
                .facebook-post-content p {
                    color: #e4e6ea;
                    font-size: 15px;
                    line-height: 1.4;
                    margin-bottom: 15px;
                }
                
                .facebook-post-image {
                    width: 100%;
                    border-radius: 8px;
                }
                
                .facebook-post-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px 15px;
                    border-bottom: 1px solid #3e4042;
                }
                
                .facebook-post-reactions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .facebook-reaction-icons {
                    display: flex;
                    gap: 2px;
                }
                
                .facebook-post-reactions span {
                    color: #b0b3b8;
                    font-size: 14px;
                }
                
                .facebook-post-counts {
                    display: flex;
                    gap: 15px;
                }
                
                .facebook-post-counts span {
                    color: #b0b3b8;
                    font-size: 14px;
                    cursor: pointer;
                }
                
                .facebook-post-counts span:hover {
                    text-decoration: underline;
                }
                
                .facebook-post-actions {
                    display: flex;
                    padding: 8px;
                }
                
                .facebook-action-btn {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #b0b3b8;
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                
                .facebook-action-btn:hover {
                    background: #3a3b3c;
                }
                
                .facebook-action-btn.liked {
                    color: #1877f2;
                }
            </style>
        `;
    }
    
    showHome() {
        this.currentView = 'home';
        this.updateNavigation();
        const content = document.getElementById('facebook-content');
        if (content) {
            content.innerHTML = this.renderHome();
        }
    }
    
    showFriends() {
        this.currentView = 'friends';
        this.updateNavigation();
        const content = document.getElementById('facebook-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="facebook-friends-page">
                <div class="facebook-friends-header">
                    <h2>Friends</h2>
                    <button class="facebook-friends-btn">
                        <i class="fas fa-user-plus"></i> Add Friends
                    </button>
                </div>
                
                <div class="facebook-friends-grid">
                    ${this.friends.map(friend => `
                        <div class="facebook-friend-card">
                            <img src="${this.generateAvatar(friend.name, 120)}" alt="${friend.name}" loading="lazy">
                            <h3>${friend.name}</h3>
                            <p class="facebook-friend-status facebook-friend-${friend.status}">${friend.status}</p>
                            <div class="facebook-friend-actions">
                                <button class="facebook-friend-btn primary">Message</button>
                                <button class="facebook-friend-btn secondary">Remove</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <style>
                .facebook-friends-page {
                    padding: 30px;
                    color: #e4e6ea;
                }
                
                .facebook-friends-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                
                .facebook-friends-header h2 {
                    font-size: 2em;
                    color: #e4e6ea;
                }
                
                .facebook-friends-btn {
                    background: #1877f2;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .facebook-friends-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .facebook-friend-card {
                    background: #242526;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    transition: transform 0.2s;
                }
                
                .facebook-friend-card:hover {
                    transform: translateY(-2px);
                }
                
                .facebook-friend-card img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin-bottom: 15px;
                }
                
                .facebook-friend-card h3 {
                    color: #e4e6ea;
                    margin-bottom: 5px;
                    font-size: 1.1em;
                }
                
                .facebook-friend-status {
                    font-size: 0.9em;
                    margin-bottom: 15px;
                    text-transform: capitalize;
                }
                
                .facebook-friend-online { color: #42b883; }
                .facebook-friend-away { color: #f39c12; }
                .facebook-friend-offline { color: #7f8c8d; }
                
                .facebook-friend-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .facebook-friend-btn {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9em;
                }
                
                .facebook-friend-btn.primary {
                    background: #1877f2;
                    color: white;
                }
                
                .facebook-friend-btn.secondary {
                    background: #3a3b3c;
                    color: #b0b3b8;
                }
            </style>
        `;
    }
    
    showMessages() {
        this.showFeaturePage('Messages', 'fas fa-envelope', 'Chat with your friends and family');
    }
    
    showNotifications() {
        this.showFeaturePage('Notifications', 'fas fa-bell', 'Stay updated with the latest activities');
    }
    
    showPages() {
        this.showFeaturePage('Pages', 'fas fa-flag', 'Discover and follow pages you love');
    }
    
    showGroups() {
        this.showFeaturePage('Groups', 'fas fa-layer-group', 'Connect with communities and groups');
    }
    
    showMarketplace() {
        this.showFeaturePage('Marketplace', 'fas fa-shopping-bag', 'Buy and sell in your local community');
    }
    
    showWatch() {
        this.currentView = 'watch';
        this.updateNavigation();
        const content = document.getElementById('facebook-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="facebook-watch-page">
                <div class="watch-header">
                    <h2><i class="fas fa-tv"></i> Watch</h2>
                    <div class="watch-categories">
                        <button class="category-btn active" data-category="all">All</button>
                        <button class="category-btn" data-category="tech">Tech</button>
                        <button class="category-btn" data-category="gaming">Gaming</button>
                        <button class="category-btn" data-category="tutorials">Tutorials</button>
                    </div>
                </div>
                
                <div class="watch-content">
                    <div class="featured-video">
                        <h3>Featured Video</h3>
                        <div class="featured-video-player">
                            ${this.renderFeaturedVideo(this.videos[0])}
                        </div>
                    </div>
                    
                    <div class="video-grid">
                        <h3>Recommended for You</h3>
                        <div class="video-grid-container">
                            ${this.videos.slice(1).map(video => this.renderVideoCard(video)).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            ${this.renderWatchStyles()}
        `;
    }
    
    showFeaturePage(title, icon, description) {
        this.updateNavigation();
        const content = document.getElementById('facebook-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="facebook-feature-page">
                <div class="facebook-feature-header">
                    <i class="${icon}"></i>
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
                
                <div class="facebook-feature-content">
                    <div class="facebook-coming-soon">
                        <i class="fas fa-tools"></i>
                        <h3>Coming Soon</h3>
                        <p>This feature is under development in our SudoShield OS demo.</p>
                        <button onclick="window.facebookApp.showHome()" class="facebook-back-btn">
                            <i class="fas fa-arrow-left"></i> Back to Home
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .facebook-feature-page {
                    padding: 40px;
                    text-align: center;
                    color: #e4e6ea;
                }
                
                .facebook-feature-header i {
                    font-size: 4em;
                    color: #1877f2;
                    margin-bottom: 20px;
                }
                
                .facebook-feature-header h2 {
                    font-size: 2.5em;
                    margin-bottom: 10px;
                }
                
                .facebook-feature-header p {
                    font-size: 1.2em;
                    color: #b0b3b8;
                    margin-bottom: 40px;
                }
                
                .facebook-coming-soon {
                    background: #242526;
                    padding: 40px;
                    border-radius: 12px;
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .facebook-coming-soon i {
                    font-size: 3em;
                    color: #f39c12;
                    margin-bottom: 20px;
                }
                
                .facebook-coming-soon h3 {
                    font-size: 1.5em;
                    margin-bottom: 15px;
                }
                
                .facebook-coming-soon p {
                    color: #b0b3b8;
                    margin-bottom: 25px;
                }
                
                .facebook-back-btn {
                    background: #1877f2;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
            </style>
        `;
    }
    
    updateNavigation() {
        const navBtns = document.querySelectorAll('.facebook-nav-btn');
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            // Add smooth transition animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
        
        // Add active state to current view button
        setTimeout(() => {
            const activeBtn = this.getActiveNavButton();
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    activeBtn.style.transform = '';
                }, 200);
            }
        }, 100);
    }

    getActiveNavButton() {
        const viewMap = {
            'home': 0,
            'friends': 1, 
            'messages': 2,
            'notifications': 3
        };
        
        const navBtns = document.querySelectorAll('.facebook-nav-btn');
        const index = viewMap[this.currentView];
        return navBtns[index] || null;
    }
    
    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        if (this.likedPosts.has(postId)) {
            this.likedPosts.delete(postId);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            this.likedPosts.add(postId);
            post.likes += 1;
        }
        this.refreshPost(postId);
    }
    
    commentPost(postId) {
        // Placeholder – could open a comment panel
        console.log('Open comments for post', postId);
    }
    
    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        post.shares += 1;
        this.refreshPost(postId);
    }

    addPost(content, imageUrl) {
        if (!content.trim()) return;
        this.posts.unshift({
            id: this.nextId++,
            author: 'SudoShield User',
            content: content.trim(),
            image: imageUrl?.trim() ? imageUrl.trim() : null,
            likes: 0,
            comments: 0,
            shares: 0,
            timestamp: 'Just now'
        });
        this.rerenderFeed();
    }

    refreshPost(postId) {
        const container = document.getElementById('facebook-posts');
        if (!container) return;
        const idx = this.posts.findIndex(p=>p.id===postId);
        if (idx === -1) return;
        const nodes = container.querySelectorAll('.facebook-post');
        // Simple full rerender for reliability (small dataset)
        this.rerenderFeed();
    }

    rerenderFeed() {
        const container = document.getElementById('facebook-posts');
        if (!container) return;
        container.innerHTML = this.posts.map(p=>this.renderPost(p)).join('');
        this.observeLazyImages();
    }

    renderSkeletons(count=3) {
        return Array.from({length:count}).map(()=>`
            <div class="facebook-post skeleton">
                <div class="facebook-post-header">
                    <div style="width:40px;height:40px;border-radius:50%;background:#333537;"></div>
                    <div style="flex:1;">
                        <div class="skeleton-box" style="width:140px;height:14px;"></div>
                        <div class="skeleton-box" style="width:80px;height:12px;"></div>
                    </div>
                </div>
                <div class="facebook-post-content" style="padding:15px 20px;">
                    <div class="skeleton-box" style="height:14px;width:90%;"></div>
                    <div class="skeleton-box" style="height:14px;width:70%;"></div>
                    <div class="skeleton-box" style="height:180px;width:100%;margin-top:12px;"></div>
                </div>
            </div>
        `).join('');
    }

    generateAvatar(name, size=64) {
        const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
        const hue = Math.abs(hashCode(name)) % 360;
        const fontSize = Math.round(size * 0.42);
        const radius = Math.round(size * 0.18);
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>`+
            `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='hsl(${hue},70%,45%)'/><stop offset='1' stop-color='hsl(${(hue+40)%360},70%,55%)'/></linearGradient></defs>`+
            `<rect rx='${radius}' ry='${radius}' width='${size}' height='${size}' fill='url(#g)'/>`+
            `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='${fontSize}' font-family='Arial,Helvetica,sans-serif' fill='white' font-weight='600'>${initials}</text>`+
            `</svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        function hashCode(str){let h=0,i=0;while(i<str.length){h=(h<<5)-h+str.charCodeAt(i++)|0;}return h;}
    }

    imageFallbackSvg() {
        return `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='800' height='400' fill='%23333'/><text x='50%' y='50%' fill='white' font-size='42' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>Image unavailable</text></svg>`;
    }

    generateAdImage() {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>`+
            `<defs><linearGradient id='adg' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#6366f1'/><stop offset='1' stop-color='#8b5cf6'/></linearGradient></defs>`+
            `<rect rx='14' ry='14' width='80' height='80' fill='url(#adg)'/>`+
            `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='22' font-family='Arial' fill='white' font-weight='600'>AD</text>`+
            `</svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    attachFeedEvents() {
        const postsContainer = document.getElementById('facebook-posts');
        const postBtn = document.getElementById('composer-post-btn');
        const clearBtn = document.getElementById('composer-clear-btn');
        if (postBtn) {
            postBtn.onclick = () => {
                const text = document.getElementById('composer-text');
                const img = document.getElementById('composer-image');
                if (!text) return;
                this.addPost(text.value, img?.value);
                text.value=''; if (img) img.value='';
            };
        }
        if (clearBtn) {
            clearBtn.onclick = () => {
                const text = document.getElementById('composer-text');
                const img = document.getElementById('composer-image');
                if (text) text.value=''; if (img) img.value='';
            };
        }
        if (postsContainer) {
            postsContainer.onclick = (e) => {
                const btn = e.target.closest('button.facebook-action-btn');
                if (!btn) return;
                const action = btn.getAttribute('data-action');
                const wrapper = btn.closest('.facebook-post-actions');
                if (!wrapper) return;
                const postId = parseInt(wrapper.getAttribute('data-post-id')); 
                switch(action){
                    case 'like': this.likePost(postId); break;
                    case 'comment': this.commentPost(postId); break;
                    case 'share': this.sharePost(postId); break;
                }
            };
        }
    }

    observeLazyImages() {
        const imgs = document.querySelectorAll('img.lazy-img[data-src]');
        if (!('IntersectionObserver' in window)) {
            imgs.forEach(img=>{ img.src = img.dataset.src; });
            return;
        }
        const io = new IntersectionObserver(entries => {
            entries.forEach(ent => {
                if (ent.isIntersecting) {
                    const img = ent.target;
                    img.src = img.dataset.src;
                    io.unobserve(img);
                }
            });
        }, { rootMargin: '100px 0px' });
        imgs.forEach(img => io.observe(img));
    }

    injectDemoPosts() {
        // Skip if we've already injected
        if (this.posts.some(p => p._injected)) return;
        const extra = [
            {
                content: 'Exploring new features in the OS window manager. Multi-window drag feels smooth! 🖥️',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: '� Beautiful night sky from my balcony! Sometimes you need to look up and appreciate the beauty around us.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: 'Performance tip: batch DOM writes & reads with requestAnimationFrame to avoid layout thrash. Small optimizations make a huge difference! 💡',
                image: null
            },
            {
                content: '� Mobile development is evolving so fast! Cross-platform frameworks are getting better every year.',
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: 'Added lazy loading to images. Scroll down & watch them pop in efficiently. User experience matters! 🚀',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: '🎨 Amazing street art I discovered today! Art and technology inspire each other in beautiful ways.',
                image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: 'Just deployed a new feature! There\'s nothing quite like the satisfaction of seeing your code work perfectly in production. 🎉',
                image: null
            },
            {
                content: '�️ Weekend hiking trip! Nature is the best way to recharge and get fresh perspective on challenging problems.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: 'Learning never stops in tech! Just finished reading about the latest JavaScript features. ES2024 looks promising! 📚',
                image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=60'
            },
            {
                content: '☕ Perfect coding companion! Good coffee + clean code = productive day. What\'s your favorite productivity setup?',
                image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=800&q=60'
            }
        ];
        extra.forEach(obj => {
            this.posts.push({
                id: this.nextId++,
                author: 'System Update',
                content: obj.content,
                image: obj.image,
                likes: Math.floor(Math.random()*50),
                comments: Math.floor(Math.random()*10),
                shares: Math.floor(Math.random()*6),
                timestamp: 'Just now',
                _injected: true
            });
        });
        // Re-render feed with new posts appended at end (simulate older timeline)
        this.rerenderFeed();
    }
}

// Initialize Facebook app
window.facebookApp = new FacebookApp();