// Premium YouTube Application - Enhanced Edition
class YouTubeApp {
    constructor() {
        this.currentVideo = null;
        this.currentView = 'home';
        this.searchQuery = '';
        this.playerState = {
            isPlaying: false,
            volume: 80,
            quality: 'auto'
        };
        
        // Use external data source
        this.data = window.youtubeDemoData || {};
        this.videos = this.data.videos || [];
        this.collections = this.data.collections || [];
        this.sections = this.data.sections || {};
        
        this.windowContainer = null;
        this.contentElement = null;
        
        // Animation and interaction state
        this.animationTimeouts = [];
        this.intersectionObserver = null;
    }

    render() {
        return `
            <div class="youtube-premium-app">
                ${this.renderNavigation()}
                <main class="youtube-main" id="youtube-content">
                    ${this.renderHome()}
                </main>
                ${this.renderMiniPlayer()}
                ${this.renderStyles()}
            </div>
        `;
    }

    renderNavigation() {
        return `
            <header class="youtube-nav">
                <div class="youtube-nav-left">
                    <div class="youtube-logo">
                        <div class="youtube-logo-icon">
                            <i class="fab fa-youtube"></i>
                        </div>
                        <span class="youtube-logo-text">YouTube<span class="premium-badge">Premium</span></span>
                    </div>
                </div>
                
                <div class="youtube-nav-center">
                    <div class="youtube-search-container">
                        <div class="youtube-search-box">
                            <input type="text" 
                                   id="youtube-search-input" 
                                   placeholder="Search YouTube..." 
                                   value="${this.searchQuery}">
                            <button class="youtube-search-btn" id="youtube-search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <div class="youtube-voice-search">
                            <button class="youtube-voice-btn">
                                <i class="fas fa-microphone"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="youtube-nav-right">
                    <button class="youtube-nav-btn">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="youtube-nav-btn">
                        <i class="fas fa-bell"></i>
                    </button>
                    <div class="youtube-profile">
                        <div class="youtube-avatar">U</div>
                    </div>
                </div>
            </header>
        `;
    }

    renderHome() {
        if (this.currentView === 'player' && this.currentVideo) {
            return this.renderPlayerPage();
        }
        
        return `
            <div class="youtube-home">
                ${this.renderHeroSection()}
                ${this.renderCollections()}
                ${this.renderVideoSections()}
            </div>
        `;
    }

    renderHeroSection() {
        const heroVideo = this.videos.find(v => v.id === this.data.heroPlaylist?.[0]) || this.videos[0];
        if (!heroVideo) return '';

        return `
            <section class="youtube-hero" style="--accent-color: ${heroVideo.accentColor}">
                <div class="youtube-hero-content">
                    <div class="youtube-hero-info">
                        <div class="youtube-hero-category">${heroVideo.category}</div>
                        <h1 class="youtube-hero-title">${heroVideo.title}</h1>
                        <p class="youtube-hero-description">${heroVideo.description}</p>
                        <div class="youtube-hero-meta">
                            <span class="youtube-hero-channel">${heroVideo.channel}</span>
                            <span class="youtube-hero-views">${heroVideo.views} views</span>
                        </div>
                        <div class="youtube-hero-actions">
                            <button class="youtube-hero-play" data-video-id="${heroVideo.id}">
                                <i class="fas fa-play"></i>
                                <span>Play Now</span>
                            </button>
                            <button class="youtube-hero-later">
                                <i class="fas fa-plus"></i>
                                <span>Watch Later</span>
                            </button>
                        </div>
                    </div>
                    <div class="youtube-hero-visual">
                        <div class="youtube-hero-thumbnail" data-video-id="${heroVideo.id}">
                            <img src="${heroVideo.thumbnail}" alt="${heroVideo.title}">
                            <div class="youtube-hero-overlay">
                                <div class="youtube-play-icon">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderCollections() {
        return `
            <section class="youtube-collections">
                <div class="youtube-section-header">
                    <h2>Curated Collections</h2>
                    <p>Hand-picked playlists for every mood</p>
                </div>
                <div class="youtube-collections-grid">
                    ${this.collections.map(collection => `
                        <div class="youtube-collection-card" style="--accent: ${collection.accentColor}">
                            <div class="youtube-collection-preview">
                                ${collection.videoIds.slice(0, 4).map((videoId, index) => {
                                    const video = this.videos.find(v => v.id === videoId);
                                    return video ? `
                                        <div class="youtube-collection-thumb" style="--delay: ${index * 0.1}s">
                                            <img src="${video.thumbnail}" alt="${video.title}">
                                        </div>
                                    ` : '';
                                }).join('')}
                                <div class="youtube-collection-overlay">
                                    <div class="youtube-collection-play" data-collection-id="${collection.id}">
                                        <i class="fas fa-play"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="youtube-collection-info">
                                <h3>${collection.title}</h3>
                                <p>${collection.description}</p>
                                <div class="youtube-collection-count">${collection.videoIds.length} videos</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    renderVideoSections() {
        return Object.entries(this.sections).map(([sectionKey, videoIds]) => {
            const sectionTitles = {
                trendingNow: 'Trending Now',
                freshDrops: 'Fresh Drops',
                focusBeats: 'Focus Beats'
            };
            
            return `
                <section class="youtube-video-section">
                    <div class="youtube-section-header">
                        <h2>${sectionTitles[sectionKey] || sectionKey}</h2>
                        <button class="youtube-section-more">View All</button>
                    </div>
                    <div class="youtube-video-grid">
                        ${videoIds.map(videoId => {
                            const video = this.videos.find(v => v.id === videoId);
                            return video ? this.renderVideoCard(video) : '';
                        }).join('')}
                    </div>
                </section>
            `;
        }).join('');
    }

    renderVideoCard(video) {
        return `
            <div class="youtube-video-card premium-card" data-video-id="${video.id}">
                <div class="youtube-video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="youtube-video-overlay">
                        <div class="youtube-video-play">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="youtube-video-duration">${video.duration}</div>
                    </div>
                    <div class="youtube-video-hover-actions">
                        <button class="youtube-hover-action" title="Add to queue">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="youtube-hover-action" title="Watch later">
                            <i class="fas fa-clock"></i>
                        </button>
                    </div>
                </div>
                <div class="youtube-video-info">
                    <h3 class="youtube-video-title">${video.title}</h3>
                    <div class="youtube-video-meta">
                        <span class="youtube-video-channel">${video.channel}</span>
                        <div class="youtube-video-stats">
                            <span class="youtube-video-views">${video.views} views</span>
                            <span class="youtube-video-date">${this.formatDate(video.published)}</span>
                        </div>
                    </div>
                    <div class="youtube-video-mood-tag" style="--accent: ${video.accentColor}">
                        ${video.mood}
                    </div>
                </div>
            </div>
        `;
    }

    renderPlayerPage() {
        const video = this.videos.find(v => v.id === this.currentVideo);
        if (!video) return this.renderHome();

        return `
            <div class="youtube-player-page">
                <div class="youtube-player-main">
                    <div class="youtube-player-container">
                        <div class="youtube-player-wrapper">
                            <iframe
                                src="${this.buildEmbedUrl(video.id)}"
                                title="${video.title}"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </div>
                        <div class="youtube-player-controls-overlay">
                            <button class="youtube-control-btn back-btn" id="youtube-back-home">
                                <i class="fas fa-arrow-left"></i>
                                Back to Home
                            </button>
                            <div class="youtube-player-actions">
                                <button class="youtube-action-btn" title="Like">
                                    <i class="fas fa-thumbs-up"></i>
                                </button>
                                <button class="youtube-action-btn" title="Share">
                                    <i class="fas fa-share"></i>
                                </button>
                                <button class="youtube-action-btn" id="youtube-open-external" title="Open in YouTube">
                                    <i class="fas fa-external-link-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="youtube-player-info">
                        <h1 class="youtube-player-title">${video.title}</h1>
                        <div class="youtube-player-meta">
                            <div class="youtube-player-channel">
                                <div class="youtube-channel-avatar">${video.channel.charAt(0)}</div>
                                <div class="youtube-channel-info">
                                    <div class="youtube-channel-name">${video.channel}</div>
                                    <div class="youtube-channel-subs">1.2M subscribers</div>
                                </div>
                            </div>
                            <div class="youtube-player-stats">
                                <span>${video.views} views</span>
                                <span>${this.formatDate(video.published)}</span>
                            </div>
                        </div>
                        <div class="youtube-player-description">
                            <p>${video.description}</p>
                        </div>
                    </div>
                </div>
                
                <div class="youtube-player-sidebar">
                    <div class="youtube-up-next">
                        <h3>Up Next</h3>
                        ${this.renderRelatedVideos()}
                    </div>
                </div>
            </div>
        `;
    }

    renderRelatedVideos() {
        const related = this.videos.filter(v => v.id !== this.currentVideo).slice(0, 6);
        return related.map(video => `
            <div class="youtube-related-video" data-video-id="${video.id}">
                <div class="youtube-related-thumb">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="youtube-related-duration">${video.duration}</div>
                </div>
                <div class="youtube-related-info">
                    <h4>${video.title}</h4>
                    <p>${video.channel}</p>
                    <span>${video.views} views</span>
                </div>
            </div>
        `).join('');
    }

    renderMiniPlayer() {
        if (!this.currentVideo) return '';
        
        const video = this.videos.find(v => v.id === this.currentVideo);
        if (!video) return '';

        return `
            <div class="youtube-mini-player hidden">
                <div class="youtube-mini-content">
                    <div class="youtube-mini-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}">
                    </div>
                    <div class="youtube-mini-info">
                        <div class="youtube-mini-title">${video.title}</div>
                        <div class="youtube-mini-channel">${video.channel}</div>
                    </div>
                    <div class="youtube-mini-controls">
                        <button class="youtube-mini-play">
                            <i class="fas fa-${this.playerState.isPlaying ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="youtube-mini-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStyles() {
        return `
            <style>
                .youtube-premium-app {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background: linear-gradient(135deg, #0f1419 0%, #1a202c 50%, #2d3748 100%);
                    color: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    overflow: hidden;
                }

                .youtube-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 24px;
                    background: rgba(15, 20, 25, 0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 100;
                }

                .youtube-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.4rem;
                    font-weight: 700;
                }

                .youtube-logo-icon {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(45deg, #ff0000, #ff4444);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                }

                .premium-badge {
                    background: linear-gradient(45deg, #ffd700, #ffed4e);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 0.8rem;
                    margin-left: 4px;
                }

                .youtube-search-container {
                    display: flex;
                    gap: 12px;
                    max-width: 600px;
                    width: 100%;
                }

                .youtube-search-box {
                    display: flex;
                    flex: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid transparent;
                    border-radius: 24px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .youtube-search-box:focus-within {
                    border-color: #ff4444;
                    background: rgba(255, 255, 255, 0.15);
                }

                .youtube-search-box input {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    background: transparent;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                }

                .youtube-search-box input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }

                .youtube-search-btn {
                    padding: 12px 20px;
                    border: none;
                    background: rgba(255, 68, 68, 0.2);
                    color: #ff4444;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .youtube-search-btn:hover {
                    background: rgba(255, 68, 68, 0.3);
                }

                .youtube-voice-btn {
                    width: 48px;
                    height: 48px;
                    border: none;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .youtube-voice-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }

                .youtube-nav-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .youtube-nav-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .youtube-nav-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .youtube-avatar {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .youtube-avatar:hover {
                    transform: scale(1.1);
                }

                .youtube-main {
                    flex: 1;
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .youtube-hero {
                    position: relative;
                    padding: 60px 24px;
                    background: linear-gradient(135deg, var(--accent-color, #ff4444) 0%, rgba(15, 20, 25, 0.8) 100%);
                    overflow: hidden;
                }

                .youtube-hero::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
                    opacity: 0.3;
                }

                .youtube-hero-content {
                    position: relative;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 48px;
                    align-items: center;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .youtube-hero-category {
                    display: inline-block;
                    padding: 6px 16px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                    backdrop-filter: blur(8px);
                }

                .youtube-hero-title {
                    font-size: 3rem;
                    font-weight: 800;
                    margin: 0 0 16px;
                    line-height: 1.2;
                    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                }

                .youtube-hero-description {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    margin: 0 0 24px;
                    opacity: 0.9;
                    max-width: 500px;
                }

                .youtube-hero-meta {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 32px;
                    font-size: 0.95rem;
                    opacity: 0.8;
                }

                .youtube-hero-actions {
                    display: flex;
                    gap: 16px;
                }

                .youtube-hero-play {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 32px;
                    background: rgba(255, 255, 255, 0.9);
                    color: #000;
                    border: none;
                    border-radius: 28px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                }

                .youtube-hero-play:hover {
                    background: white;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }

                .youtube-hero-later {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 32px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 28px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                }

                .youtube-hero-later:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .youtube-hero-thumbnail {
                    position: relative;
                    width: 400px;
                    height: 225px;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
                }

                .youtube-hero-thumbnail:hover {
                    transform: scale(1.05);
                }

                .youtube-hero-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .youtube-hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .youtube-hero-thumbnail:hover .youtube-hero-overlay {
                    opacity: 1;
                }

                .youtube-play-icon {
                    width: 64px;
                    height: 64px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-size: 1.5rem;
                    transform: scale(0.8);
                    transition: transform 0.3s ease;
                }

                .youtube-hero-thumbnail:hover .youtube-play-icon {
                    transform: scale(1);
                }

                .youtube-collections {
                    padding: 48px 24px;
                    background: rgba(26, 32, 44, 0.5);
                }

                .youtube-section-header {
                    max-width: 1400px;
                    margin: 0 auto 32px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .youtube-section-header h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0 0 8px;
                }

                .youtube-section-header p {
                    margin: 0;
                    opacity: 0.7;
                    font-size: 1.1rem;
                }

                .youtube-section-more {
                    padding: 8px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 20px;
                    color: white;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .youtube-section-more:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .youtube-collections-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .youtube-collection-card {
                    background: rgba(45, 55, 72, 0.6);
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .youtube-collection-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    border-color: var(--accent, #ff4444);
                }

                .youtube-collection-preview {
                    position: relative;
                    height: 180px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: 1fr 1fr;
                    gap: 2px;
                }

                .youtube-collection-thumb {
                    overflow: hidden;
                    animation: fadeInScale 0.6s ease forwards;
                    animation-delay: var(--delay, 0s);
                    opacity: 0;
                }

                .youtube-collection-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .youtube-collection-card:hover .youtube-collection-thumb img {
                    transform: scale(1.1);
                }

                .youtube-collection-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .youtube-collection-card:hover .youtube-collection-overlay {
                    opacity: 1;
                }

                .youtube-collection-play {
                    width: 56px;
                    height: 56px;
                    background: var(--accent, #ff4444);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.2rem;
                    transform: scale(0.8);
                    transition: transform 0.3s ease;
                }

                .youtube-collection-card:hover .youtube-collection-play {
                    transform: scale(1);
                }

                .youtube-collection-info {
                    padding: 20px;
                }

                .youtube-collection-info h3 {
                    margin: 0 0 8px;
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .youtube-collection-info p {
                    margin: 0 0 12px;
                    opacity: 0.8;
                    line-height: 1.5;
                }

                .youtube-collection-count {
                    font-size: 0.85rem;
                    opacity: 0.6;
                }

                .youtube-video-section {
                    padding: 48px 24px;
                }

                .youtube-video-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .youtube-video-card {
                    background: rgba(45, 55, 72, 0.4);
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(4px);
                    border: 1px solid transparent;
                }

                .youtube-video-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .youtube-video-thumbnail {
                    position: relative;
                    aspect-ratio: 16 / 9;
                    overflow: hidden;
                }

                .youtube-video-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .youtube-video-card:hover .youtube-video-thumbnail img {
                    transform: scale(1.05);
                }

                .youtube-video-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .youtube-video-card:hover .youtube-video-overlay {
                    opacity: 1;
                }

                .youtube-video-play {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-size: 1rem;
                    transform: scale(0.8);
                    transition: transform 0.3s ease;
                }

                .youtube-video-card:hover .youtube-video-play {
                    transform: scale(1);
                }

                .youtube-video-duration {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    padding: 4px 8px;
                    background: rgba(0, 0, 0, 0.8);
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .youtube-video-hover-actions {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    display: flex;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .youtube-video-card:hover .youtube-video-hover-actions {
                    opacity: 1;
                }

                .youtube-hover-action {
                    width: 32px;
                    height: 32px;
                    background: rgba(0, 0, 0, 0.8);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .youtube-hover-action:hover {
                    background: rgba(255, 68, 68, 0.9);
                    transform: scale(1.1);
                }

                .youtube-video-info {
                    padding: 16px;
                }

                .youtube-video-title {
                    margin: 0 0 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .youtube-video-meta {
                    margin-bottom: 12px;
                }

                .youtube-video-channel {
                    color: #ff6b6b;
                    font-weight: 500;
                    margin-bottom: 4px;
                }

                .youtube-video-stats {
                    display: flex;
                    gap: 8px;
                    font-size: 0.85rem;
                    opacity: 0.7;
                }

                .youtube-video-mood-tag {
                    display: inline-block;
                    padding: 4px 12px;
                    background: var(--accent, #ff4444);
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: white;
                }

                .youtube-player-page {
                    display: grid;
                    grid-template-columns: 1fr 360px;
                    gap: 24px;
                    padding: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .youtube-player-container {
                    position: relative;
                    background: #000;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .youtube-player-wrapper {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                }

                .youtube-player-wrapper iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .youtube-player-controls-overlay {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    right: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    pointer-events: none;
                }

                .back-btn,
                .youtube-player-actions {
                    pointer-events: auto;
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    border: none;
                    border-radius: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                }

                .back-btn:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: translateY(-2px);
                }

                .youtube-player-actions {
                    display: flex;
                    gap: 8px;
                }

                .youtube-action-btn {
                    width: 40px;
                    height: 40px;
                    background: rgba(0, 0, 0, 0.8);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                }

                .youtube-action-btn:hover {
                    background: rgba(255, 68, 68, 0.9);
                    transform: scale(1.1);
                }

                .youtube-player-info {
                    margin-top: 24px;
                }

                .youtube-player-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0 0 16px;
                    line-height: 1.3;
                }

                .youtube-player-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .youtube-player-channel {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .youtube-channel-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }

                .youtube-channel-name {
                    font-weight: 600;
                    margin-bottom: 2px;
                }

                .youtube-channel-subs {
                    font-size: 0.85rem;
                    opacity: 0.7;
                }

                .youtube-player-stats {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .youtube-player-description {
                    background: rgba(45, 55, 72, 0.4);
                    padding: 20px;
                    border-radius: 12px;
                    line-height: 1.6;
                }

                .youtube-up-next {
                    background: rgba(45, 55, 72, 0.4);
                    border-radius: 12px;
                    padding: 20px;
                    backdrop-filter: blur(8px);
                }

                .youtube-up-next h3 {
                    margin: 0 0 20px;
                    font-size: 1.2rem;
                    font-weight: 600;
                }

                .youtube-related-video {
                    display: flex;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .youtube-related-video:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .youtube-related-thumb {
                    position: relative;
                    width: 120px;
                    height: 68px;
                    border-radius: 6px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .youtube-related-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .youtube-related-duration {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    padding: 2px 6px;
                    background: rgba(0, 0, 0, 0.8);
                    border-radius: 3px;
                    font-size: 0.7rem;
                }

                .youtube-related-info h4 {
                    margin: 0 0 4px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .youtube-related-info p {
                    margin: 0 0 4px;
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .youtube-related-info span {
                    font-size: 0.75rem;
                    opacity: 0.6;
                }

                @keyframes fadeInScale {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .youtube-hero-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    
                    .youtube-hero-title {
                        font-size: 2rem;
                    }
                    
                    .youtube-player-page {
                        grid-template-columns: 1fr;
                    }
                    
                    .youtube-nav-center {
                        display: none;
                    }
                }
            </style>
        `;
    }

    init(container) {
        this.windowContainer = container?.querySelector('.youtube-premium-app') || null;
        this.contentElement = this.windowContainer?.querySelector('#youtube-content') || container?.querySelector('#youtube-content') || null;

        this.setupEventListeners();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = this.windowContainer?.querySelector('#youtube-search-btn');
        const searchInput = this.windowContainer?.querySelector('#youtube-search-input');

        searchBtn?.addEventListener('click', () => this.handleSearch());
        searchInput?.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Hero section play button
        const heroPlayBtn = this.windowContainer?.querySelector('.youtube-hero-play');
        const heroThumbnail = this.windowContainer?.querySelector('.youtube-hero-thumbnail');
        
        heroPlayBtn?.addEventListener('click', (e) => {
            const videoId = e.target.closest('[data-video-id]')?.dataset.videoId;
            if (videoId) this.playVideo(videoId);
        });
        
        heroThumbnail?.addEventListener('click', (e) => {
            const videoId = e.target.closest('[data-video-id]')?.dataset.videoId;
            if (videoId) this.playVideo(videoId);
        });

        // Video cards
        const videoCards = this.windowContainer?.querySelectorAll('.youtube-video-card');
        videoCards?.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.dataset.videoId;
                if (videoId) this.playVideo(videoId);
            });
        });

        // Related videos
        const relatedVideos = this.windowContainer?.querySelectorAll('.youtube-related-video');
        relatedVideos?.forEach(video => {
            video.addEventListener('click', () => {
                const videoId = video.dataset.videoId;
                if (videoId) this.playVideo(videoId);
            });
        });

        // Collection cards
        const collectionCards = this.windowContainer?.querySelectorAll('.youtube-collection-play');
        collectionCards?.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const collectionId = card.dataset.collectionId;
                if (collectionId) this.playCollection(collectionId);
            });
        });

        // Back button
        const backBtn = this.windowContainer?.querySelector('#youtube-back-home');
        backBtn?.addEventListener('click', () => this.showHome());

        // External link
        const externalBtn = this.windowContainer?.querySelector('#youtube-open-external');
        externalBtn?.addEventListener('click', () => {
            if (this.currentVideo) {
                const video = this.videos.find(v => v.id === this.currentVideo);
                if (video) window.open(video.watchUrl, '_blank');
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInScale 0.6s ease forwards';
                    }
                });
            }, { threshold: 0.1 });

            // Observe video cards
            const videoCards = this.windowContainer?.querySelectorAll('.youtube-video-card');
            videoCards?.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                this.intersectionObserver.observe(card);
            });
        }
    }

    handleSearch() {
        const searchInput = this.windowContainer?.querySelector('#youtube-search-input');
        const query = searchInput?.value.trim();
        
        if (!query) return;
        
        this.searchQuery = query;
        this.currentView = 'search';
        this.updateContent();
    }

    playVideo(videoId) {
        this.currentVideo = videoId;
        this.currentView = 'player';
        this.updateContent();
    }

    playCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (collection && collection.videoIds.length > 0) {
            this.playVideo(collection.videoIds[0]);
        }
    }

    showHome() {
        this.currentView = 'home';
        this.currentVideo = null;
        this.updateContent();
    }

    updateContent() {
        if (!this.contentElement) return;
        
        this.contentElement.innerHTML = this.renderHome();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    }

    buildEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    cleanup() {
        // Clear animation timeouts
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts = [];
        
        // Disconnect intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }
}

// Initialize YouTube app
window.youtubeApp = new YouTubeApp();