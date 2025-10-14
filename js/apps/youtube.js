// Simple YouTube application (original lightweight version)
class YouTubeApp {
    constructor() {
        this.currentVideo = null;
        this.featuredVideos = [
            {
                id: '8A2t_tAjMz8',
                title: 'Cartoon - On & On (feat. Daniel Levi)',
                channel: 'NoCopyrightSounds',
                description: 'A classic uplifting track from NCS.',
                thumbnail: 'https://img.youtube.com/vi/8A2t_tAjMz8/mqdefault.jpg',
                watchUrl: 'https://www.youtube.com/watch?v=8A2t_tAjMz8'
            },
            {
                id: '3nQNiWdeH2Q',
                title: 'Janji - Heroes Tonight (feat. Johnning)',
                channel: 'NoCopyrightSounds',
                description: 'An epic and heroic track.',
                thumbnail: 'https://img.youtube.com/vi/3nQNiWdeH2Q/mqdefault.jpg',
                watchUrl: 'https://www.youtube.com/watch?v=3nQNiWdeH2Q'
            },
            {
                id: 'J2X5mJ3HDYE',
                title: 'DEAF KEV - Invincible',
                channel: 'NoCopyrightSounds',
                description: 'A powerful and energetic electronic song.',
                thumbnail: 'https://img.youtube.com/vi/J2X5mJ3HDYE/mqdefault.jpg',
                watchUrl: 'https://www.youtube.com/watch?v=J2X5mJ3HDYE'
            },
            {
                id: 'aqz-KE-bpKQ',
                title: 'Big Buck Bunny',
                channel: 'Blender Foundation',
                description: 'A classic open-source animated short film.',
                thumbnail: 'https://img.youtube.com/vi/aqz-KE-bpKQ/mqdefault.jpg',
                watchUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
            }
        ];

        this.windowContainer = null;
        this.contentElement = null;
    }

    render() {
        return `
            <div class="youtube-app">
                <header class="youtube-topbar">
                    <div class="youtube-brand">
                        <i class="fab fa-youtube"></i>
                        <span>YouTube</span>
                    </div>
                    <div class="youtube-search">
                        <input type="text" id="youtube-search" placeholder="Search YouTube..." />
                        <button id="youtube-search-btn"><i class="fas fa-search"></i></button>
                    </div>
                </header>
                <main id="youtube-content">
                    ${this.renderHome()}
                </main>
            </div>
        `;
    }

    init(container) {
        this.windowContainer = container?.querySelector('.youtube-app') || null;
        this.contentElement = this.windowContainer?.querySelector('#youtube-content') || container?.querySelector('#youtube-content') || null;

        this.bindShellEvents();
        this.bindHome();
    }

    bindShellEvents() {
        const searchBtn = this.windowContainer?.querySelector('#youtube-search-btn');
        const searchInput = this.windowContainer?.querySelector('#youtube-search');

        searchBtn?.addEventListener('click', () => this.search());
        searchInput?.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.search();
            }
        });
    }

    renderHome() {
        const cards = this.featuredVideos.map((video) => `
            <div class="youtube-video-card" data-video-id="${video.id}">
                <img src="${video.thumbnail}" alt="${video.title}" />
                <div class="youtube-video-info">
                    <h3>${video.title}</h3>
                    <p>${video.channel}</p>
                    <span>${video.description}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="youtube-home">
                <section class="youtube-featured">
                    <h2>Featured videos</h2>
                    <div class="youtube-video-grid">
                        ${cards}
                    </div>
                </section>
                <section class="youtube-note">
                    <p>Select a video to watch it here inside the desktop. Some videos may need to be opened directly on youtube.com.</p>
                </section>
            </div>
            <style>
                .youtube-app {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    color: #e5e7eb;
                    background: rgba(15, 23, 42, 0.9);
                }

                .youtube-topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
                    background: rgba(15, 23, 42, 0.95);
                }

                .youtube-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #f87171;
                }

                .youtube-search {
                    display: flex;
                    gap: 8px;
                }

                .youtube-search input {
                    width: 260px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 1px solid rgba(148, 163, 184, 0.4);
                    background: rgba(15, 23, 42, 0.6);
                    color: inherit;
                }

                .youtube-search button {
                    padding: 8px 14px;
                    border-radius: 6px;
                    border: none;
                    background: #f87171;
                    color: #0f172a;
                    cursor: pointer;
                }

                #youtube-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                }

                .youtube-home {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .youtube-featured h2 {
                    margin: 0 0 12px;
                    font-size: 1.3rem;
                }

                .youtube-video-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;
                }

                .youtube-video-card {
                    background: rgba(30, 41, 59, 0.7);
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .youtube-video-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 30px rgba(15, 23, 42, 0.4);
                }

                .youtube-video-card img {
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    object-fit: cover;
                }

                .youtube-video-info {
                    padding: 12px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    font-size: 0.9rem;
                }

                .youtube-video-info h3 {
                    margin: 0;
                    font-size: 1rem;
                    color: #f8fafc;
                }

                .youtube-video-info p {
                    margin: 0;
                    color: #cbd5f5;
                    font-size: 0.85rem;
                }

                .youtube-video-info span {
                    color: rgba(203, 213, 225, 0.7);
                    font-size: 0.8rem;
                }

                .youtube-note {
                    padding: 16px;
                    border-radius: 10px;
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(148, 163, 184, 0.25);
                    font-size: 0.85rem;
                    color: rgba(203, 213, 225, 0.85);
                }

                .youtube-player-page {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    height: 100%;
                }

                .youtube-player-wrapper {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    background: black;
                }

                .youtube-player-wrapper iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .youtube-player-controls {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .youtube-control-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: none;
                    background: rgba(51, 65, 85, 0.85);
                    color: #f8fafc;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.2s ease;
                }

                .youtube-control-btn.primary {
                    background: #f87171;
                    color: #0f172a;
                }

                .youtube-control-btn:hover {
                    background: rgba(71, 85, 105, 0.95);
                }

                .youtube-player-meta h2 {
                    margin: 0 0 6px;
                    font-size: 1.2rem;
                }

                .youtube-player-meta p {
                    margin: 0;
                    color: rgba(203, 213, 225, 0.8);
                    font-size: 0.9rem;
                }

                .youtube-search-page {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .youtube-search-page h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }

                .youtube-muted {
                    color: rgba(203, 213, 225, 0.7);
                    font-size: 0.85rem;
                }
            </style>
        `;
    }

    bindHome() {
        const cards = this.contentElement?.querySelectorAll('.youtube-video-card');

        cards?.forEach((card) => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video-id');
                if (videoId) {
                    this.playVideo(videoId);
                }
            });
        });
    }

    search() {
        const searchInput = this.windowContainer?.querySelector('#youtube-search');
        const query = searchInput?.value.trim();

        if (!query || !this.contentElement) {
            return;
        }

        this.contentElement.innerHTML = `
            <div class="youtube-search-page">
                <h2>Search results for "${query}"</h2>
                <p class="youtube-muted">This demo does not call the real YouTube API yet.</p>
                <button class="youtube-control-btn" id="youtube-back-home">
                    <i class="fas fa-arrow-left"></i> Back to featured
                </button>
            </div>
        `;

    const backBtn = this.windowContainer?.querySelector('#youtube-back-home') || this.contentElement?.querySelector('#youtube-back-home');
        backBtn?.addEventListener('click', () => this.showHome());
    }

    playVideo(videoId) {
        if (!this.contentElement) {
            return;
        }

        const video = this.featuredVideos.find((item) => item.id === videoId) || {
            id: videoId,
            title: 'YouTube Video',
            channel: 'Unknown channel',
            description: '',
            watchUrl: `https://www.youtube.com/watch?v=${videoId}`
        };

        this.currentVideo = videoId;
        const embedUrl = video.embedUrl || this.buildEmbedUrl(videoId);

        this.contentElement.innerHTML = `
            <div class="youtube-player-page">
                <div class="youtube-player-controls">
                    <button class="youtube-control-btn" id="youtube-back-home">
                        <i class="fas fa-arrow-left"></i> Back to Home
                    </button>
                    <button class="youtube-control-btn primary" id="youtube-open-external">
                        <i class="fas fa-external-link-alt"></i> Open on YouTube
                    </button>
                </div>
                <div class="youtube-player-wrapper">
                    <iframe
                        src="${embedUrl}"
                        title="${video.title}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
                <div class="youtube-player-meta">
                    <h2>${video.title}</h2>
                    <p>By ${video.channel}</p>
                </div>
            </div>
            <style>
                .youtube-player-page {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    height: 100%;
                }

                .youtube-player-wrapper {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    background: black;
                }

                .youtube-player-wrapper iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .youtube-player-controls {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .youtube-control-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: none;
                    background: rgba(51, 65, 85, 0.85);
                    color: #f8fafc;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.2s ease;
                }

                .youtube-control-btn.primary {
                    background: #f87171;
                    color: #0f172a;
                }

                .youtube-control-btn:hover {
                    background: rgba(71, 85, 105, 0.95);
                }

                .youtube-player-meta h2 {
                    margin: 0 0 6px;
                    font-size: 1.2rem;
                }

                .youtube-player-meta p {
                    margin: 0;
                    color: rgba(203, 213, 225, 0.8);
                    font-size: 0.9rem;
                }
            </style>
        `;

        const backBtn = this.windowContainer?.querySelector('#youtube-back-home') || this.contentElement?.querySelector('#youtube-back-home');
        backBtn?.addEventListener('click', () => this.showHome());

        const openExternalBtn = this.windowContainer?.querySelector('#youtube-open-external') || this.contentElement?.querySelector('#youtube-open-external');
        openExternalBtn?.addEventListener('click', () => {
            window.open(video.watchUrl, '_blank');
        });
    }

    showHome() {
        if (!this.contentElement) return;

        this.currentVideo = null;
        this.contentElement.innerHTML = this.renderHome();
        this.bindHome();
    }

    buildEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
}

// Initialize YouTube app
window.youtubeApp = new YouTubeApp();