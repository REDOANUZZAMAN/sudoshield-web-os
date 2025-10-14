// Browser Application
class BrowserApp {
    constructor() {
    this.history = [];
    this.currentIndex = -1;
        this.bookmarks = [
            { title: 'Wikipedia', url: 'https://en.wikipedia.org', icon: 'fab fa-wikipedia-w' },
            { title: 'Simple Wikipedia', url: 'https://simple.wikipedia.org', icon: 'fas fa-book-reader' },
            { title: 'Wiktionary', url: 'https://en.wiktionary.org', icon: 'fas fa-language' },
            { title: 'Wikiquote', url: 'https://en.wikiquote.org', icon: 'fas fa-quote-right' },
            { title: 'Wikibooks', url: 'https://en.wikibooks.org', icon: 'fas fa-book-open' },
            { title: 'Wikisource', url: 'https://en.wikisource.org', icon: 'fas fa-scroll' },
            { title: 'Wikimedia Commons', url: 'https://commons.wikimedia.org', icon: 'fas fa-images' },
            { title: 'Internet Archive', url: 'https://archive.org', icon: 'fas fa-archive' },
            { title: 'Wayback Machine', url: 'https://web.archive.org', icon: 'fas fa-history' },
            { title: 'Archive Movies', url: 'https://archive.org/details/movies', icon: 'fas fa-film' },
            { title: 'Archive Music', url: 'https://archive.org/details/audio', icon: 'fas fa-music' },
            { title: 'Archive Books', url: 'https://archive.org/details/books', icon: 'fas fa-book' },
            { title: 'Archive Software', url: 'https://archive.org/details/software', icon: 'fas fa-compact-disc' },
            { title: 'Project Gutenberg', url: 'https://www.gutenberg.org', icon: 'fas fa-book' },
            { title: 'OpenLibrary', url: 'https://openlibrary.org', icon: 'fas fa-book-reader' },
            { title: 'Standard Ebooks', url: 'https://standardebooks.org', icon: 'fas fa-book-open' },
            { title: 'ManyBooks', url: 'https://manybooks.net', icon: 'fas fa-books' },
            { title: 'ArXiv Papers', url: 'https://arxiv.org', icon: 'fas fa-graduation-cap' },
            { title: 'First Website', url: 'http://info.cern.ch', icon: 'fas fa-globe' },
            { title: 'Example.com', url: 'https://example.com', icon: 'fas fa-code' },
            { title: 'MF Website', url: 'https://motherfuckingwebsite.com', icon: 'fas fa-laptop-code' }
        ];
        this.defaultPages = [
            { title: 'SudoShield', url: 'https://sudoshield.top', icon: 'fas fa-shield-alt' },
            { title: 'Redoan Dev', url: 'https://redoan.dev', icon: 'fas fa-code' },
            { title: 'Wikipedia', url: 'https://en.wikipedia.org', icon: 'fab fa-wikipedia-w' },
            { title: 'Internet Archive', url: 'https://archive.org', icon: 'fas fa-archive' },
            { title: 'Wayback Machine', url: 'https://web.archive.org', icon: 'fas fa-history' },
            { title: 'Project Gutenberg', url: 'https://www.gutenberg.org', icon: 'fas fa-book' },
            { title: 'OpenLibrary', url: 'https://openlibrary.org', icon: 'fas fa-book-reader' },
            { title: 'Wiktionary', url: 'https://en.wiktionary.org', icon: 'fas fa-language' },
            { title: 'Wikiquote', url: 'https://en.wikiquote.org', icon: 'fas fa-quote-right' },
            { title: 'Archive Movies', url: 'https://archive.org/details/movies', icon: 'fas fa-film' },
            { title: 'Archive Music', url: 'https://archive.org/details/audio', icon: 'fas fa-music' },
            { title: 'Standard Ebooks', url: 'https://standardebooks.org', icon: 'fas fa-book-open' },
            { title: 'ArXiv Research', url: 'https://arxiv.org', icon: 'fas fa-graduation-cap' }
        ];

        this.suggestionTimers = {};
        this.currentSuggestions = {
            address: [],
            home: []
        };
    }
    
    render() {
        return `
            <div class="browser-app">
                <div class="browser-toolbar">
                    <div class="browser-toolbar-left">
                        <div class="browser-nav-buttons">
                            <button class="browser-nav-btn" id="browser-back" disabled title="Back">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <button class="browser-nav-btn" id="browser-forward" disabled title="Forward">
                                <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="browser-nav-btn" id="browser-refresh" title="Reload">
                                <i class="fas fa-redo"></i>
                            </button>
                            <button class="browser-nav-btn" id="browser-home" title="Home">
                                <i class="fas fa-home"></i>
                            </button>
                        </div>
                    </div>
                    <div class="browser-toolbar-center">
                        <div class="browser-address-wrapper">
                            <span class="browser-address-icon" title="Secure connection">
                                <i class="fas fa-shield-alt"></i>
                            </span>
                            <input type="text" class="browser-address-bar" id="browser-address" 
                                   placeholder="Search or enter URL">
                            <div class="browser-address-actions">
                                <button class="browser-address-btn" id="browser-voice" title="Voice search">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button class="browser-address-btn primary" id="browser-go" title="Go">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="browser-toolbar-right">
                        <button class="browser-action-btn" id="browser-history" title="History">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="browser-action-btn" id="browser-bookmarks" title="Bookmarks">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="browser-action-btn" id="browser-open-external" title="Open in new tab">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                        <button class="browser-action-btn" id="browser-menu" title="More options">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                </div>
                <div class="browser-suggestions hidden" id="browser-address-suggestions"></div>
                <div class="browser-content" id="browser-content">
                    ${this.renderHomePage()}
                </div>
            </div>
            <style>
                .browser-app {
                    position: relative;
                }

                .browser-suggestions {
                    position: absolute;
                    top: 84px;
                    left: 32px;
                    right: 32px;
                    max-height: 240px;
                    overflow-y: auto;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(14px);
                    border-radius: 12px;
                    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    z-index: 5000;
                    padding: 8px 0;
                }

                .browser-suggestions.hidden {
                    display: none;
                }

                .browser-suggestion-item {
                    padding: 10px 20px;
                    color: var(--text-primary);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .browser-suggestion-item i {
                    color: var(--accent);
                    opacity: 0.8;
                }

                .browser-suggestion-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                }

                @media (max-width: 768px) {
                    .browser-suggestions {
                        top: 78px;
                        left: 16px;
                        right: 16px;
                        max-height: 200px;
                        border-radius: 10px;
                    }

                    .browser-suggestion-item {
                        padding: 8px 16px;
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 600px) {
                    .browser-suggestions {
                        top: 68px;
                        left: 12px;
                        right: 12px;
                        max-height: 180px;
                    }

                    .browser-suggestion-item {
                        padding: 8px 14px;
                        font-size: 0.85rem;
                        gap: 8px;
                    }

                    .browser-suggestion-item i {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    .browser-suggestions {
                        top: 64px;
                        left: 10px;
                        right: 10px;
                        max-height: 160px;
                        border-radius: 8px;
                    }

                    .browser-suggestion-item {
                        padding: 6px 12px;
                        font-size: 0.8rem;
                    }
                }
            </style>
        `;
    }
    
    init(container) {
        this.container = container;
        this.setupEventListeners();
        this.loadHomePage();
    }
    
    setupEventListeners() {
        const backBtn = document.getElementById('browser-back');
        const forwardBtn = document.getElementById('browser-forward');
        const refreshBtn = document.getElementById('browser-refresh');
        const homeBtn = document.getElementById('browser-home');
        const addressBar = document.getElementById('browser-address');
    const goBtn = document.getElementById('browser-go');
    const voiceBtn = document.getElementById('browser-voice');
    const historyBtn = document.getElementById('browser-history');
    const bookmarksBtn = document.getElementById('browser-bookmarks');
    const menuBtn = document.getElementById('browser-menu');
    const externalBtn = document.getElementById('browser-open-external');
        
        backBtn?.addEventListener('click', () => this.goBack());
        forwardBtn?.addEventListener('click', () => this.goForward());
        refreshBtn?.addEventListener('click', () => this.refresh());
        homeBtn?.addEventListener('click', () => this.goHome());
        goBtn?.addEventListener('click', () => this.navigate());
        voiceBtn?.addEventListener('click', () => {
            window.webOS?.notify?.('Voice search is coming soon.', 'info');
        });
        bookmarksBtn?.addEventListener('click', () => {
            this.goHome();
            setTimeout(() => {
                document.querySelector('[data-browser-section="bookmarks"]')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 200);
        });
        historyBtn?.addEventListener('click', () => {
            this.showHistory();
        });
        menuBtn?.addEventListener('click', () => {
            window.webOS?.notify?.('More browser options arriving soon.', 'info');
        });
        externalBtn?.addEventListener('click', () => {
            const currentUrl = this.history[this.currentIndex];
            if (currentUrl && !currentUrl.startsWith('about:')) {
                this.openExternal(encodeURIComponent(currentUrl));
            } else {
                window.webOS?.notify?.('Open a page first to launch it externally.', 'info');
            }
        });
        
        addressBar?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigate();
            }
        });

        addressBar?.addEventListener('input', (e) => {
            this.handleLiveSearch(e.target.value, { context: 'address' });
        });

        addressBar?.addEventListener('focus', (e) => {
            if (e.target.value.trim()) {
                this.handleLiveSearch(e.target.value, { context: 'address', immediate: true });
            }
        });

        addressBar?.addEventListener('blur', () => {
            this.deferHideSuggestions('browser-address-suggestions', 'address');
        });
    }

    setupHomeSearchListeners() {
        const homeInput = document.getElementById('home-search');
        const containerId = 'home-search-suggestions';
        if (!homeInput) return;

        if (!homeInput.dataset.liveSearchBound) {
            homeInput.addEventListener('input', (e) => {
                this.handleLiveSearch(e.target.value, { context: 'home' });
            });

            homeInput.addEventListener('focus', (e) => {
                if (e.target.value.trim()) {
                    this.handleLiveSearch(e.target.value, { context: 'home', immediate: true });
                }
            });

            homeInput.addEventListener('blur', () => {
                this.deferHideSuggestions(containerId, 'home');
            });

            homeInput.dataset.liveSearchBound = 'true';
        }
    }
    
    renderHomePage() {
        return `
            <div class="browser-home">
                <div class="browser-home-hero">
                    <span class="browser-hero-badge">
                        <i class="fas fa-compass"></i>
                        SudoShield Browser
                    </span>
                    <h1>Explore the web in style</h1>
                    <p>Instant search, curated shortcuts, and a design that fits the desktop.</p>
                </div>

                <div class="browser-search-section">
                    <div class="browser-search-box elevated">
                        <i class="fas fa-search browser-search-leading"></i>
                        <input type="text" placeholder="Search DuckDuckGo or enter a URL" 
                               id="home-search" class="browser-home-search"
                               onkeypress="if(event.key==='Enter') window.browserApp.searchFromHome()">
                        <button class="browser-search-action" onclick="window.browserApp.searchFromHome()" title="Search">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    <div class="browser-live-suggestions hidden" id="home-search-suggestions"></div>
                </div>

                <div class="browser-section" data-browser-section="quick-access">
                    <div class="browser-section-heading">
                        <h3><i class="fas fa-bolt"></i> Quick Launch</h3>
                        <span>Go straight to your favorite services.</span>
                    </div>
                    <div class="bookmark-grid">
                        ${this.defaultPages.map(page => `
                            <div class="bookmark-item" onclick="window.browserApp.navigateToUrl('${page.url}')">
                                <div class="bookmark-icon">
                                    <i class="${page.icon || 'fas fa-globe'}"></i>
                                </div>
                                <div class="bookmark-details">
                                    <span class="bookmark-title">${page.title}</span>
                                    <span class="bookmark-url">${this.formatHostname(page.url)}</span>
                                </div>
                                <i class="fas fa-external-link-alt bookmark-open"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="browser-section" data-browser-section="bookmarks">
                    <div class="browser-section-heading">
                        <h3><i class="fas fa-bookmark"></i> Bookmarks</h3>
                        <span>Hand-picked destinations for fast browsing.</span>
                    </div>
                    <div class="bookmark-grid">
                        ${this.bookmarks.map(bookmark => `
                            <div class="bookmark-item" onclick="window.browserApp.navigateToUrl('${bookmark.url}')">
                                <div class="bookmark-icon">
                                    <i class="${bookmark.icon || 'fas fa-star'}"></i>
                                </div>
                                <div class="bookmark-details">
                                    <span class="bookmark-title">${bookmark.title}</span>
                                    <span class="bookmark-url">${this.formatHostname(bookmark.url)}</span>
                                </div>
                                <i class="fas fa-external-link-alt bookmark-open"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <style>
                .browser-home {
                    position: relative;
                    padding: 48px clamp(24px, 6vw, 64px);
                    background: radial-gradient(120% 120% at 50% 0%, rgba(124, 58, 237, 0.45) 0%, rgba(15, 23, 42, 0.95) 55%, rgba(15, 23, 42, 1) 100%);
                    min-height: 100%;
                    height: 100%;
                    color: #f8fafc;
                    overflow-y: auto;
                    overflow-x: hidden;
                    container-type: inline-size;
                    container-name: browser-home;
                }

                .browser-home-hero {
                    text-align: center;
                    margin-bottom: 48px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    align-items: center;
                }

                .browser-hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 999px;
                    background: rgba(15, 23, 42, 0.45);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    font-size: 13px;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }

                .browser-home-hero h1 {
                    font-size: clamp(2.2rem, 3vw, 2.8rem);
                    font-weight: 700;
                    margin: 0;
                }

                .browser-home-hero p {
                    max-width: 520px;
                    opacity: 0.8;
                    font-size: 1rem;
                }

                .browser-search-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 56px;
                }

                .browser-search-box {
                    width: 100%;
                    max-width: 620px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 18px;
                    border-radius: 18px;
                    background: rgba(15, 23, 42, 0.65);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(12px);
                    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.3);
                }

                .browser-search-box.elevated {
                    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.45);
                }

                .browser-search-leading {
                    color: var(--accent);
                    font-size: 1.1rem;
                    opacity: 0.85;
                }

                .browser-home-search {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: inherit;
                    font-size: 15px;
                    outline: none;
                }

                .browser-home-search::placeholder {
                    color: rgba(226, 232, 240, 0.6);
                }

                .browser-search-action {
                    background: var(--accent);
                    border: none;
                    color: white;
                    width: 42px;
                    height: 42px;
                    border-radius: 14px;
                    display: grid;
                    place-items: center;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .browser-search-action:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 24px rgba(255, 0, 128, 0.35);
                }

                .browser-search-section:focus-within .browser-search-box {
                    border-color: rgba(255, 0, 128, 0.28);
                    box-shadow: 0 0 0 3px rgba(255, 0, 128, 0.15), 0 24px 60px rgba(15, 23, 42, 0.45);
                }

                .browser-live-suggestions {
                    width: 100%;
                    max-width: 620px;
                    margin-top: 6px;
                    background: rgba(15, 23, 42, 0.92);
                    border-radius: 14px;
                    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    overflow: hidden;
                    backdrop-filter: blur(14px);
                }

                .browser-live-suggestions.hidden {
                    display: none;
                }

                .browser-live-suggestions .browser-suggestion-item {
                    padding: 13px 20px;
                }

                .browser-section {
                    margin-bottom: 42px;
                    position: relative;
                    width: 100%;
                }

                .browser-section-heading {
                    display: flex;
                    align-items: baseline;
                    gap: 14px;
                    margin-bottom: 18px;
                }

                .browser-section-heading h3 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.15rem;
                    margin: 0;
                }

                .browser-section-heading span {
                    font-size: 0.9rem;
                    color: rgba(226, 232, 240, 0.75);
                }

                .bookmark-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(max(180px, 30%), 100%), 1fr));
                    gap: 18px;
                    width: 100%;
                    max-width: 100%;
                }

                .bookmark-item {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 18px;
                    padding: 18px 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    cursor: pointer;
                    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
                    backdrop-filter: blur(12px);
                    min-width: 0;
                }

                .bookmark-item:hover {
                    transform: translateY(-3px);
                    border-color: rgba(255, 255, 255, 0.22);
                    background: rgba(15, 23, 42, 0.75);
                }

                .bookmark-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 14px;
                    display: grid;
                    place-items: center;
                    background: rgba(255, 255, 255, 0.12);
                    color: var(--accent);
                    font-size: 1.1rem;
                }

                .bookmark-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                    flex: 1;
                    overflow: hidden;
                }

                .bookmark-title {
                    font-weight: 600;
                    font-size: 1rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .bookmark-url {
                    font-size: 0.82rem;
                    color: rgba(226, 232, 240, 0.65);
                    text-transform: lowercase;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .bookmark-open {
                    margin-left: auto;
                    color: rgba(226, 232, 240, 0.45);
                    font-size: 0.95rem;
                }

                @container browser-home (max-width: 1024px) {
                    .browser-home {
                        padding: 36px 24px 42px;
                    }

                    .browser-home-hero h1 {
                        font-size: clamp(2rem, 4vw, 2.4rem);
                    }

                    .bookmark-grid {
                        grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
                        gap: 16px;
                    }
                }

                @container browser-home (max-width: 850px) {
                    .bookmark-grid {
                        grid-template-columns: repeat(auto-fit, minmax(min(170px, 100%), 1fr));
                        gap: 14px;
                    }

                    .bookmark-item {
                        padding: 16px 18px;
                        gap: 14px;
                    }

                    .bookmark-icon {
                        width: 42px;
                        height: 42px;
                    }
                }

                /* Fallback for browsers without container query support */
                @supports not (container-type: inline-size) {
                    @media (max-width: 1024px) {
                        .browser-home {
                            padding: 36px 24px 42px;
                        }

                        .browser-home-hero h1 {
                            font-size: clamp(2rem, 4vw, 2.4rem);
                        }

                        .bookmark-grid {
                            grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
                            gap: 16px;
                        }
                    }
                }

                @container browser-home (max-width: 768px) {
                    .browser-home {
                        padding: 28px 16px 40px;
                    }

                    .browser-home-hero {
                        margin-bottom: 36px;
                        gap: 12px;
                    }

                    .browser-home-hero h1 {
                        font-size: clamp(1.8rem, 5vw, 2.2rem);
                    }

                    .browser-home-hero p {
                        font-size: 0.9rem;
                    }

                    .browser-search-box {
                        padding: 10px 14px;
                        gap: 10px;
                    }

                    .browser-home-search {
                        font-size: 14px;
                    }

                    .browser-search-action {
                        width: 38px;
                        height: 38px;
                    }

                    .browser-section {
                        margin-bottom: 36px;
                    }

                    .browser-section-heading {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 16px;
                    }

                    .browser-section-heading h3 {
                        font-size: 1.05rem;
                    }

                    .browser-section-heading span {
                        font-size: 0.85rem;
                    }

                    .bookmark-grid {
                        grid-template-columns: repeat(auto-fill, minmax(min(160px, 100%), 1fr));
                        gap: 14px;
                    }

                    .bookmark-item {
                        padding: 14px 16px;
                        gap: 12px;
                    }

                    .bookmark-icon {
                        width: 38px;
                        height: 38px;
                        font-size: 1rem;
                    }

                    .bookmark-title {
                        font-size: 0.95rem;
                    }

                    .bookmark-url {
                        font-size: 0.78rem;
                    }
                }

                @container browser-home (max-width: 600px) {
                    .browser-home {
                        padding: 24px 14px 36px;
                    }

                    .browser-home-hero {
                        margin-bottom: 32px;
                        gap: 10px;
                    }

                    .browser-hero-badge {
                        padding: 6px 12px;
                        font-size: 11px;
                        gap: 6px;
                    }

                    .browser-home-hero h1 {
                        font-size: clamp(1.6rem, 6vw, 2rem);
                    }

                    .browser-home-hero p {
                        font-size: 0.85rem;
                    }

                    .browser-search-section {
                        margin-bottom: 48px;
                    }

                    .browser-search-box {
                        padding: 8px 12px;
                        gap: 8px;
                        border-radius: 14px;
                    }

                    .browser-search-leading {
                        font-size: 1rem;
                    }

                    .browser-home-search {
                        font-size: 13px;
                    }

                    .browser-search-action {
                        width: 36px;
                        height: 36px;
                        border-radius: 12px;
                    }

                    .browser-section {
                        margin-bottom: 32px;
                    }

                    .browser-section-heading h3 {
                        font-size: 1rem;
                        gap: 8px;
                    }

                    .browser-section-heading span {
                        font-size: 0.8rem;
                    }

                    /* Horizontal scrollable grid for narrow windows */
                    .bookmark-grid {
                        display: flex;
                        overflow-x: auto;
                        overflow-y: hidden;
                        gap: 12px;
                        padding-bottom: 10px;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                        scroll-padding-left: 14px;
                    }

                    .bookmark-grid::-webkit-scrollbar {
                        height: 6px;
                    }

                    .bookmark-grid::-webkit-scrollbar-track {
                        background: rgba(15, 23, 42, 0.3);
                        border-radius: 3px;
                    }

                    .bookmark-grid::-webkit-scrollbar-thumb {
                        background: var(--accent);
                        border-radius: 3px;
                    }



                    .bookmark-item {
                        padding: 12px 14px;
                        gap: 10px;
                        min-width: 280px;
                        flex-shrink: 0;
                        scroll-snap-align: start;
                    }

                    .bookmark-icon {
                        width: 36px;
                        height: 36px;
                        font-size: 0.95rem;
                        border-radius: 12px;
                    }

                    .bookmark-title {
                        font-size: 0.9rem;
                    }

                    .bookmark-url {
                        font-size: 0.75rem;
                    }

                    .bookmark-open {
                        font-size: 0.85rem;
                    }
                }

                @container browser-home (max-width: 480px) {
                    .browser-home {
                        padding: 20px 12px 32px;
                    }

                    .browser-home-hero {
                        margin-bottom: 28px;
                        gap: 8px;
                    }

                    .browser-hero-badge {
                        padding: 5px 10px;
                        font-size: 10px;
                    }

                    .browser-home-hero h1 {
                        font-size: clamp(1.4rem, 7vw, 1.8rem);
                    }

                    .browser-home-hero p {
                        font-size: 0.8rem;
                    }

                    .browser-search-section {
                        margin-bottom: 42px;
                    }

                    .browser-search-box {
                        padding: 8px 10px;
                        gap: 6px;
                        border-radius: 12px;
                    }

                    .browser-search-leading {
                        font-size: 0.95rem;
                    }

                    .browser-home-search {
                        font-size: 12px;
                    }

                    .browser-search-action {
                        width: 32px;
                        height: 32px;
                        border-radius: 10px;
                    }

                    .bookmark-item {
                        padding: 10px 12px;
                        min-width: 260px;
                    }
                }
            </style>
        `;
    }
    
    loadHomePage({ pushHistory = true } = {}) {
        const content = document.getElementById('browser-content');
        if (!content) return;

        this.hideSuggestions('browser-address-suggestions', 'address');
        this.hideSuggestions('home-search-suggestions', 'home');

        content.innerHTML = this.renderHomePage();

        if (pushHistory && this.history[this.currentIndex] !== 'about:home') {
            this.addToHistory('about:home');
        }

        this.updateAddressBar('about:home');
        this.updateNavigationButtons();

        requestAnimationFrame(() => this.setupHomeSearchListeners());
    }
    
    navigate() {
        const addressBar = document.getElementById('browser-address');
        const url = addressBar?.value.trim();
        
        if (!url) return;
        
        this.navigateToUrl(url);
    }
    
    navigateToUrl(url) {
        // Handle special URLs
        if (url === 'about:home') {
            this.loadHomePage();
            return;
        }

    this.hideSuggestions('browser-address-suggestions', 'address');
    this.hideSuggestions('home-search-suggestions', 'home');
        
        // Clean and process URL
        const originalInput = url.trim();
        let finalUrl = originalInput;
        let searchQuery = null;
        
        // Check for search engine shortcuts
        const lowerInput = originalInput.toLowerCase();
        if (lowerInput.startsWith('g ') || lowerInput.startsWith('google ')) {
            searchQuery = originalInput.replace(/^(g |google )/i, '');
        } else if (lowerInput.startsWith('yt ') || lowerInput.startsWith('youtube ')) {
            finalUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(originalInput.replace(/^(yt |youtube )/i, ''));
        } else if (lowerInput.startsWith('w ') || lowerInput.startsWith('wiki ')) {
            finalUrl = 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(originalInput.replace(/^(w |wiki )/i, ''));
        } else if (!this.looksLikeUrl(originalInput)) {
            searchQuery = originalInput;
        } else if (!originalInput.startsWith('http://') && !originalInput.startsWith('https://')) {
            // If it contains a dot and no spaces, treat as domain
            if (this.looksLikeDomain(originalInput)) {
                finalUrl = 'https://' + originalInput;
            } else {
                searchQuery = originalInput;
            }
        }

        if (searchQuery !== null) {
            this.loadSearchResults(searchQuery);
            return;
        }

        // Handle direct Google search links gracefully
        try {
            const targetUrl = new URL(finalUrl);
            if (this.isGoogleDomain(targetUrl.hostname)) {
                const query = targetUrl.searchParams.get('q');
                if (query) {
                    this.loadSearchResults(query);
                    return;
                }
            }

            if (this.isDuckDuckGoDomain(targetUrl.hostname)) {
                const query = targetUrl.searchParams.get('q');
                if (query) {
                    this.loadSearchResults(query);
                } else {
                    this.addToHistory(targetUrl.href);
                    this.showDuckDuckGoInfo();
                }
                return;
            }
        } catch (e) {
            // Ignore parsing errors and continue
        }
        
        this.loadUrl(finalUrl);
    }
    
    loadUrl(url, { pushHistory = true } = {}) {
        const content = document.getElementById('browser-content');
        if (!content) return;

        this.hideSuggestions('browser-address-suggestions', 'address');
        this.hideSuggestions('home-search-suggestions', 'home');

        try {
            const targetUrl = new URL(url);
            if (this.isDuckDuckGoDomain(targetUrl.hostname)) {
                const query = targetUrl.searchParams.get('q');
                if (query) {
                    this.loadSearchResults(query, { pushHistory });
                } else {
                    if (pushHistory) {
                        this.addToHistory(url);
                    }
                    this.showDuckDuckGoInfo();
                }
                return;
            }
        } catch (e) {
            // If URL parsing fails we'll attempt to load normally
        }

        if (url.startsWith('about:search')) {
            const params = new URLSearchParams(url.replace('about:search', ''));
            const q = params.get('q') || '';
            this.loadSearchResults(q, { pushHistory: false });
            return;
        }
        
        // Add to history if requested
        if (pushHistory) {
            this.addToHistory(url);
        }
        this.updateAddressBar(url);
        this.updateNavigationButtons();
        
        // Show loading
        content.innerHTML = `
            <div class="browser-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${url}...</p>
                <small>Note: Some sites may block embedding due to security policies</small>
            </div>
        `;
        
        // Try to load in iframe with timeout
        setTimeout(() => {
            try {
                const iframe = document.createElement('iframe');
                iframe.className = 'browser-iframe';
                iframe.src = url;
                iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-modals allow-downloads';
                
                // Grant camera, microphone, and geolocation permissions
                iframe.allow = 'camera *; microphone *; geolocation *; fullscreen *; display-capture *; autoplay *';
                
                // Set up load handlers
                iframe.onload = () => {
                    iframe.style.opacity = '1';
                };
                
                iframe.onerror = () => {
                    this.handleError(url);
                };
                
                // Timeout fallback
                setTimeout(() => {
                    if (iframe.style.opacity !== '1') {
                        this.handleError(url);
                    }
                }, 10000);
                
                content.innerHTML = '';
                content.appendChild(iframe);
                
            } catch (error) {
                this.handleError(url);
            }
        }, 800);
    }
    
    handleLiveSearch(value, { context, immediate = false } = {}) {
        const query = (value || '').trim();
        const containerId = context === 'home' ? 'home-search-suggestions' : 'browser-address-suggestions';

        if (this.suggestionTimers[context]) {
            clearTimeout(this.suggestionTimers[context]);
        }

        if (!query) {
            this.hideSuggestions(containerId, context);
            return;
        }

        const triggerFetch = () => {
            this.fetchSuggestions(query, { context, containerId });
        };

        if (immediate) {
            triggerFetch();
        } else {
            this.suggestionTimers[context] = setTimeout(triggerFetch, 250);
        }
    }

    fetchSuggestions(query, { context, containerId }) {
        const endpoint = `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                const suggestions = Array.isArray(data)
                    ? data.map(item => item.phrase).filter(Boolean)
                    : [];
                this.currentSuggestions[context] = suggestions;
                this.renderSuggestions(suggestions, { context, containerId });
            })
            .catch(() => this.hideSuggestions(containerId, context));
    }

    renderSuggestions(suggestions, { context, containerId }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!suggestions.length) {
            this.hideSuggestions(containerId, context);
            return;
        }

        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        suggestions.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'browser-suggestion-item';
            wrapper.dataset.query = encodeURIComponent(item);
            wrapper.dataset.context = context;

            const icon = document.createElement('i');
            icon.className = 'fas fa-search';

            const label = document.createElement('span');
            label.textContent = item;

            wrapper.appendChild(icon);
            wrapper.appendChild(label);

            wrapper.addEventListener('mousedown', (event) => {
                event.preventDefault();
                const encoded = event.currentTarget.dataset.query;
                const itemContext = event.currentTarget.dataset.context;
                this.onSuggestionSelected(encoded, itemContext);
            });

            fragment.appendChild(wrapper);
        });

        container.appendChild(fragment);
        container.classList.remove('hidden');
    }

    hideSuggestions(containerId, context) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('hidden');
            container.innerHTML = '';
        }

        if (context) {
            this.currentSuggestions[context] = [];
        }
    }

    deferHideSuggestions(containerId, context) {
        setTimeout(() => this.hideSuggestions(containerId, context), 160);
    }

    onSuggestionSelected(encodedQuery, context) {
        const query = decodeURIComponent(encodedQuery || '');
        if (!query) return;

        if (context === 'home') {
            const homeInput = document.getElementById('home-search');
            if (homeInput) {
                homeInput.value = query;
            }
            this.hideSuggestions('home-search-suggestions', 'home');
            this.navigateToUrl(query);
        } else {
            const addressBar = document.getElementById('browser-address');
            if (addressBar) {
                addressBar.value = query;
            }
            this.hideSuggestions('browser-address-suggestions', 'address');
            this.loadSearchResults(query);
        }
    }

    looksLikeUrl(input) {
        if (!input) return false;
        const trimmed = input.trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
        return this.looksLikeDomain(trimmed);
    }

    looksLikeDomain(input) {
        if (!input || input.includes(' ')) return false;
        const domainPattern = /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i;
        return domainPattern.test(input);
    }

    isGoogleDomain(hostname) {
        if (!hostname) return false;
        return /(\.google\.|^google\.)/i.test(hostname);
    }

    isDuckDuckGoDomain(hostname) {
        if (!hostname) return false;
        return /(\.duckduckgo\.|^duckduckgo\.)/i.test(hostname);
    }

    formatHostname(url) {
        if (!url) return '';
        if (url.startsWith('about:home')) {
            return 'home';
        }
        if (url.startsWith('about:search')) {
            const params = new URLSearchParams(url.replace('about:search', ''));
            const term = params.get('q') || '';
            return term ? `search: ${term}` : 'search';
        }

        try {
            const { hostname } = new URL(url);
            return (hostname || '').replace(/^www\./i, '');
        } catch (error) {
            return url.replace(/^https?:\/\//i, '').split('/')[0];
        }
    }

    showDuckDuckGoInfo() {
        const content = document.getElementById('browser-content');
        if (!content) return;

        this.hideSuggestions('browser-address-suggestions', 'address');
        this.hideSuggestions('home-search-suggestions', 'home');

        this.updateAddressBar('https://duckduckgo.com');
        this.updateNavigationButtons();

        content.innerHTML = `
            <div class="browser-error">
                <i class="fas fa-info-circle"></i>
                <h2>DuckDuckGo can’t be embedded here</h2>
                <p>DuckDuckGo blocks loading inside other browser windows.
                You can still search the web using the built-in instant results, or open DuckDuckGo in a new tab.</p>
                <div>
                    <button class="browser-error-btn" onclick="window.browserApp.goHome()">
                        Go Home
                    </button>
                    <button class="browser-error-btn secondary" onclick="window.browserApp.openExternal('${encodeURIComponent('https://duckduckgo.com')}')">
                        Open DuckDuckGo
                    </button>
                </div>
            </div>
            <style>
                .browser-error {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 40px;
                    text-align: center;
                    background: #f8f9fa;
                }

                .browser-error i {
                    font-size: 4em;
                    color: #3498db;
                    margin-bottom: 20px;
                }

                .browser-error h2 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                }

                .browser-error p {
                    color: #7f8c8d;
                    margin-bottom: 10px;
                    max-width: 500px;
                }

                .browser-error button {
                    margin: 10px;
                }

                .browser-error-btn {
                    padding: 10px 20px;
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .browser-error-btn.secondary {
                    background: rgba(0,0,0,0.15);
                    color: var(--accent);
                }

                @media (max-width: 768px) {
                    .browser-error {
                        padding: 30px 20px;
                    }

                    .browser-error i {
                        font-size: 3em;
                    }

                    .browser-error h2 {
                        font-size: 1.3rem;
                    }

                    .browser-error p {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    .browser-error {
                        padding: 20px 15px;
                    }

                    .browser-error i {
                        font-size: 2.5em;
                        margin-bottom: 15px;
                    }

                    .browser-error h2 {
                        font-size: 1.1rem;
                        margin-bottom: 12px;
                    }

                    .browser-error p {
                        font-size: 0.85rem;
                    }

                    .browser-error-btn {
                        padding: 8px 16px;
                        font-size: 13px;
                        margin: 8px;
                    }
                }
            </style>
        `;
    }

    handleError(url) {
        const content = document.getElementById('browser-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="browser-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Unable to load page</h2>
                <p>The page at <strong>${url}</strong> could not be displayed inside the embedded browser.</p>
                <p>This is usually because the site blocks embedding for security reasons.</p>
                <button onclick="window.browserApp.goHome()" class="browser-error-btn">
                    Go Home
                </button>
                <button onclick="window.browserApp.openExternal('${encodeURIComponent(url)}')" class="browser-error-btn secondary">
                    Open in new tab
                </button>
            </div>
            
            <style>
                .browser-error {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 40px;
                    text-align: center;
                    background: #f8f9fa;
                }
                
                .browser-error i {
                    font-size: 4em;
                    color: #e74c3c;
                    margin-bottom: 20px;
                }
                
                .browser-error h2 {
                    color: #2c3e50;
                    margin-bottom: 15px;
                }
                
                .browser-error p {
                    color: #7f8c8d;
                    margin-bottom: 10px;
                    max-width: 500px;
                }
                
                .browser-error-btn {
                    margin: 10px;
                    padding: 10px 20px;
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .browser-error-btn.secondary {
                    background: rgba(0,0,0,0.15);
                    color: var(--accent);
                }
                
                .browser-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #7f8c8d;
                    background: var(--bg-primary);
                }
                
                .browser-loading i {
                    font-size: 2em;
                    margin-bottom: 15px;
                    color: var(--accent);
                }
                
                .browser-loading small {
                    margin-top: 10px;
                    opacity: 0.7;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .browser-error {
                        padding: 30px 20px;
                    }

                    .browser-error i {
                        font-size: 3em;
                    }

                    .browser-error h2 {
                        font-size: 1.3rem;
                    }

                    .browser-error p {
                        font-size: 0.9rem;
                    }

                    .browser-loading {
                        padding: 30px 20px;
                    }

                    .browser-loading i {
                        font-size: 1.8em;
                    }

                    .browser-loading p {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    .browser-error {
                        padding: 20px 15px;
                    }

                    .browser-error i {
                        font-size: 2.5em;
                        margin-bottom: 15px;
                    }

                    .browser-error h2 {
                        font-size: 1.1rem;
                        margin-bottom: 12px;
                    }

                    .browser-error p {
                        font-size: 0.85rem;
                    }

                    .browser-error-btn {
                        padding: 8px 16px;
                        font-size: 13px;
                        margin: 8px;
                    }

                    .browser-loading {
                        padding: 20px 15px;
                    }

                    .browser-loading i {
                        font-size: 1.5em;
                        margin-bottom: 12px;
                    }

                    .browser-loading p {
                        font-size: 0.85rem;
                    }

                    .browser-loading small {
                        font-size: 0.8rem;
                    }
                }
            </style>
        `;
    }
    
    loadSearchResults(query, { pushHistory = true, focusAddressBar = true } = {}) {
        const content = document.getElementById('browser-content');
        if (!content) return;

        this.hideSuggestions('browser-address-suggestions', 'address');
        this.hideSuggestions('home-search-suggestions', 'home');

        const normalizedQuery = query.trim();
        if (!normalizedQuery) {
            this.goHome();
            return;
        }

        if (pushHistory) {
            const historyToken = `about:search?q=${encodeURIComponent(normalizedQuery)}`;
            this.addToHistory(historyToken);
        }

        if (focusAddressBar) {
            this.updateAddressBar(`Search: ${normalizedQuery}`);
        }

        this.updateNavigationButtons();

        content.innerHTML = `
            <div class="browser-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Searching the web for "${normalizedQuery}"...</p>
            </div>
        `;

        const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(normalizedQuery)}&format=json&no_redirect=1&no_html=1`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                const results = this.transformSearchResults(data, normalizedQuery).slice(0, 12);

                if (results.length === 0) {
                    content.innerHTML = `
                        <div class="browser-search-results empty">
                            <h2>No instant results for "${normalizedQuery}"</h2>
                            <p>Try refining your search or open the results in a full browser tab.</p>
                            <button class="browser-error-btn" onclick="window.browserApp.openExternal('https://duckduckgo.com/?q=${encodeURIComponent(normalizedQuery)}')">
                                View full results
                            </button>
                        </div>
                    `;
                    return;
                }

                content.innerHTML = `
                    <div class="browser-search-results">
                        <h2>Results for "${normalizedQuery}"</h2>
                        <div class="search-result-list">
                            ${results.map(result => `
                                <div class="search-result-item">
                                    <a href="#" onclick="window.browserApp.navigateToEncodedUrl('${encodeURIComponent(result.url)}')" class="result-title">${result.title}</a>
                                    <div class="result-url">${result.displayUrl}</div>
                                    ${result.description ? `<p>${result.description}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                        <div class="search-result-footer">
                            <button class="browser-error-btn secondary" onclick="window.browserApp.openExternal('https://duckduckgo.com/?q=${encodeURIComponent(normalizedQuery)}')">
                                Open full results
                            </button>
                        </div>
                    </div>
                    <style>
                        .browser-search-results {
                            padding: 30px;
                            background: var(--bg-primary);
                            color: var(--text-primary);
                            min-height: 100%;
                        }
                        .browser-search-results h2 {
                            margin-bottom: 20px;
                        }
                        .browser-search-results.empty {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            gap: 15px;
                        }
                        .search-result-list {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }
                        .search-result-item {
                            padding: 15px;
                            border-radius: 12px;
                            background: rgba(255, 255, 255, 0.04);
                            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
                            transition: transform 0.2s ease, box-shadow 0.2s ease;
                        }
                        .search-result-item:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 14px 35px rgba(15, 23, 42, 0.2);
                        }
                        .result-title {
                            font-size: 1.1em;
                            color: var(--accent);
                            text-decoration: none;
                            font-weight: 600;
                        }
                        .result-title:hover {
                            text-decoration: underline;
                        }
                        .result-url {
                            font-size: 0.9em;
                            color: var(--text-muted);
                            margin: 5px 0 10px;
                        }
                        .search-result-footer {
                            margin-top: 30px;
                            text-align: center;
                        }

                        @media (max-width: 768px) {
                            .browser-search-results {
                                padding: 24px 20px;
                            }

                            .browser-search-results h2 {
                                font-size: 1.3rem;
                                margin-bottom: 18px;
                            }

                            .search-result-list {
                                gap: 16px;
                            }

                            .search-result-item {
                                padding: 12px;
                            }

                            .result-title {
                                font-size: 1rem;
                            }

                            .result-url {
                                font-size: 0.85em;
                            }

                            .search-result-footer {
                                margin-top: 24px;
                            }
                        }

                        @media (max-width: 600px) {
                            .browser-search-results {
                                padding: 20px 16px;
                            }

                            .browser-search-results h2 {
                                font-size: 1.2rem;
                                margin-bottom: 16px;
                            }

                            .search-result-item {
                                padding: 10px;
                            }

                            .result-title {
                                font-size: 0.95rem;
                            }

                            .result-url {
                                font-size: 0.8em;
                                margin: 4px 0 8px;
                            }
                        }

                        @media (max-width: 480px) {
                            .browser-search-results {
                                padding: 16px 12px;
                            }

                            .browser-search-results h2 {
                                font-size: 1.1rem;
                                margin-bottom: 14px;
                            }

                            .search-result-list {
                                gap: 12px;
                            }

                            .search-result-item {
                                padding: 10px;
                            }

                            .result-title {
                                font-size: 0.9rem;
                            }

                            .result-url {
                                font-size: 0.75em;
                            }

                            .search-result-footer {
                                margin-top: 20px;
                            }
                        }
                    </style>
                `;
            })
            .catch(() => {
                content.innerHTML = `
                    <div class="browser-search-results empty">
                        <h2>Search temporarily unavailable</h2>
                        <p>We couldn't reach the search service. Please check your connection or try again later.</p>
                        <button class="browser-error-btn" onclick="window.browserApp.openExternal('https://duckduckgo.com/?q=${encodeURIComponent(normalizedQuery)}')">
                            Open DuckDuckGo
                        </button>
                    </div>
                `;
            });
    }

    transformSearchResults(data, query) {
        const results = [];

        if (!data) {
            return results;
        }

        if (data.AbstractText) {
            results.push({
                title: data.Heading || `About ${query}`,
                url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
                displayUrl: data.AbstractURL || 'duckduckgo.com',
                description: data.AbstractText
            });
        }

        if (Array.isArray(data.Results)) {
            data.Results.forEach(item => {
                if (item && item.Text && item.FirstURL) {
                    results.push({
                        title: item.Text,
                        url: item.FirstURL,
                        displayUrl: this.formatDisplayUrl(item.FirstURL),
                        description: item.Text
                    });
                }
            });
        }

        const collectTopics = (topics) => {
            topics.forEach(topic => {
                if (topic.Topics) {
                    collectTopics(topic.Topics);
                } else if (topic && topic.Text && topic.FirstURL) {
                    results.push({
                        title: topic.Text,
                        url: topic.FirstURL,
                        displayUrl: this.formatDisplayUrl(topic.FirstURL),
                        description: topic.Text
                    });
                }
            });
        };

        if (Array.isArray(data.RelatedTopics)) {
            collectTopics(data.RelatedTopics);
        }

        const unique = [];
        const seen = new Set();
        results.forEach(result => {
            const key = result.url;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(result);
            }
        });

        return unique;
    }

    formatDisplayUrl(url) {
        try {
            const parsed = new URL(url);
            return `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;
        } catch (e) {
            return url;
        }
    }

    openExternal(encodedUrl) {
        const decoded = decodeURIComponent(encodedUrl);
        window.open(decoded, '_blank', 'noopener');
    }

    navigateToEncodedUrl(encodedUrl) {
        const decoded = decodeURIComponent(encodedUrl);
        this.navigateToUrl(decoded);
    }

    searchFromHome() {
        const searchInput = document.getElementById('home-search');
        const query = searchInput?.value.trim();
        if (query) {
            this.navigateToUrl(query);
            // Clear the home search box
            if (searchInput) searchInput.value = '';
        }
    }
    
    goBack() {
        console.log('🔙 Back button clicked. Current index:', this.currentIndex, 'History length:', this.history.length);
        console.log('📜 History:', this.history);
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
            const url = this.history[this.currentIndex];
            console.log('⬅️ Going back to:', url);
            
            // Handle different URL types
            if (url === 'about:home') {
                this.loadHomePage({ pushHistory: false });
            } else if (url.startsWith('about:search')) {
                const params = new URLSearchParams(url.replace('about:search', ''));
                const q = params.get('q') || '';
                this.loadSearchResults(q, { pushHistory: false, focusAddressBar: false });
            } else {
                this.loadUrl(url, { pushHistory: false });
            }
            
            this.updateNavigationButtons();
        } else {
            console.log('⚠️ Already at the first page, cannot go back');
        }
    }
    
    goForward() {
        console.log('🔜 Forward button clicked. Current index:', this.currentIndex, 'History length:', this.history.length);
        
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            const url = this.history[this.currentIndex];
            console.log('➡️ Going forward to:', url);
            
            // Handle different URL types
            if (url === 'about:home') {
                this.loadHomePage({ pushHistory: false });
            } else if (url.startsWith('about:search')) {
                const params = new URLSearchParams(url.replace('about:search', ''));
                const q = params.get('q') || '';
                this.loadSearchResults(q, { pushHistory: false, focusAddressBar: false });
            } else {
                this.loadUrl(url, { pushHistory: false });
            }
            
            this.updateNavigationButtons();
        } else {
            console.log('⚠️ Already at the latest page, cannot go forward');
        }
    }
    
    refresh() {
        if (this.history.length > 0) {
            const currentUrl = this.history[this.currentIndex];
            if (currentUrl.startsWith('about:search')) {
                const params = new URLSearchParams(currentUrl.replace('about:search', ''));
                const q = params.get('q') || '';
                this.loadSearchResults(q, { pushHistory: false, focusAddressBar: false });
            } else {
                this.loadUrl(currentUrl, { pushHistory: false });
            }
        }
    }
    
    goHome() {
        this.loadHomePage();
    }
    
    addToHistory(url) {
        // Remove any forward history
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push(url);
        this.currentIndex = this.history.length - 1;
        console.log('📝 Added to history:', url, '| Index:', this.currentIndex, '| Total:', this.history.length);
        this.updateNavigationButtons();
    }
    
    updateAddressBar(url) {
        const addressBar = document.getElementById('browser-address');
        if (addressBar) {
            addressBar.value = url === 'about:home' ? '' : url;
        }
    }
    
    updateNavigationButtons() {
        const backBtn = document.getElementById('browser-back');
        const forwardBtn = document.getElementById('browser-forward');
        
        if (backBtn) {
            backBtn.disabled = this.currentIndex <= 0;
        }
        if (forwardBtn) {
            forwardBtn.disabled = this.currentIndex >= this.history.length - 1;
        }
    }
    
    showHistory() {
        const content = document.getElementById('browser-content');
        if (!content) return;
        
        const historyItems = this.history
            .map((url, index) => {
                let title = url;
                let icon = 'fas fa-globe';
                
                if (url === 'about:home') {
                    title = 'Browser Home';
                    icon = 'fas fa-home';
                } else if (url.startsWith('about:search')) {
                    const params = new URLSearchParams(url.replace('about:search', ''));
                    const query = params.get('q') || '';
                    title = `Search: ${query}`;
                    icon = 'fas fa-search';
                } else {
                    title = this.formatHostname(url);
                    icon = 'fas fa-external-link-alt';
                }
                
                const isCurrent = index === this.currentIndex;
                
                return `
                    <div class="history-item ${isCurrent ? 'current' : ''}" onclick="window.browserApp.navigateToHistoryIndex(${index})">
                        <div class="history-icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="history-details">
                            <span class="history-title">${title}</span>
                            <span class="history-url">${url.length > 60 ? url.substring(0, 60) + '...' : url}</span>
                        </div>
                        ${isCurrent ? '<span class="history-current-badge">Current</span>' : ''}
                    </div>
                `;
            })
            .reverse()
            .join('');
        
        content.innerHTML = `
            <div class="browser-history-view">
                <div class="history-header">
                    <h2><i class="fas fa-history"></i> Browsing History</h2>
                    <p>Click any item to navigate to that page</p>
                    <button class="browser-close-history" onclick="window.browserApp.goHome()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
                <div class="history-list">
                    ${historyItems.length > 0 ? historyItems : '<p class="history-empty">No history yet. Start browsing!</p>'}
                </div>
            </div>
            <style>
                .browser-history-view {
                    padding: 32px;
                    background: var(--bg-secondary);
                    min-height: 100%;
                }
                .history-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .history-header h2 {
                    font-size: 2rem;
                    margin-bottom: 8px;
                    color: var(--text-primary);
                }
                .history-header p {
                    color: var(--text-muted);
                    margin-bottom: 16px;
                }
                .browser-close-history {
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .browser-close-history:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 0, 128, 0.3);
                }
                .history-list {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .history-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    margin-bottom: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 2px solid transparent;
                }
                .history-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(4px);
                }
                .history-item.current {
                    border-color: var(--accent);
                    background: rgba(255, 0, 128, 0.1);
                }
                .history-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--accent);
                    border-radius: 12px;
                    display: grid;
                    place-items: center;
                    color: white;
                    font-size: 1.2rem;
                }
                .history-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .history-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    font-size: 1rem;
                }
                .history-url {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .history-current-badge {
                    background: var(--accent);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .history-empty {
                    text-align: center;
                    color: var(--text-muted);
                    padding: 48px;
                    font-size: 1.1rem;
                }
            </style>
        `;
    }
    
    navigateToHistoryIndex(index) {
        if (index >= 0 && index < this.history.length) {
            this.currentIndex = index;
            const url = this.history[index];
            
            console.log('📍 Navigating to history index:', index, 'URL:', url);
            
            if (url === 'about:home') {
                this.loadHomePage({ pushHistory: false });
            } else if (url.startsWith('about:search')) {
                const params = new URLSearchParams(url.replace('about:search', ''));
                const q = params.get('q') || '';
                this.loadSearchResults(q, { pushHistory: false, focusAddressBar: false });
            } else {
                this.loadUrl(url, { pushHistory: false });
            }
            
            this.updateNavigationButtons();
        }
    }
}

// Initialize browser app immediately
console.log('Browser.js loading...');
window.browserApp = new BrowserApp();
console.log('Browser app initialized:', window.browserApp);