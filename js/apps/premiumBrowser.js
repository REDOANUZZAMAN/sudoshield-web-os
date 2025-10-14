class PremiumBrowserApp {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.home = 'https://duckduckgo.com/';
        this.searchEngine = 'https://duckduckgo.com/?q='; // privacy-friendly and often embeddable
    }

    render() {
        return `
        <div class="premium-browser app" id="premium-browser">
            <div class="premium-browser-toolbar">
                <div class="pb-left">
                    <button class="pb-btn" id="pb-back" title="Back">◀</button>
                    <button class="pb-btn" id="pb-forward" title="Forward">▶</button>
                    <button class="pb-btn" id="pb-reload" title="Reload">⟳</button>
                </div>
                <div class="pb-center">
                    <div class="pb-address-wrapper">
                        <input id="pb-address" class="pb-address-bar" type="text" autocomplete="off" spellcheck="false" placeholder="Search or enter address">
                        <button id="pb-go" class="pb-address-go">Search</button>
                    </div>
                </div>
                <div class="pb-right">
                    <button class="pb-btn" id="pb-home" title="Home">🏠</button>
                    <button class="pb-btn" id="pb-open-new" title="Open in new tab">⤢</button>
                </div>
            </div>

            <div class="premium-browser-content">
                <iframe id="premium-browser-iframe" class="premium-browser-iframe" sandbox="allow-scripts allow-forms allow-same-origin"></iframe>
                <div id="pb-overlay" class="pb-overlay" style="display:none"></div>
            </div>
        </div>
        `;
    }

    init(container) {
        this.container = container;
        // inject rendered markup
        container.innerHTML = this.render();
        this.bindElements();
        this.navigate(this.home, true);
    }

    bindElements() {
        this.iframe = document.getElementById('premium-browser-iframe');
        this.address = document.getElementById('pb-address');
        document.getElementById('pb-go').addEventListener('click', () => this.onGo());
        document.getElementById('pb-back').addEventListener('click', () => this.goBack());
        document.getElementById('pb-forward').addEventListener('click', () => this.goForward());
        document.getElementById('pb-reload').addEventListener('click', () => this.reload());
        document.getElementById('pb-home').addEventListener('click', () => this.navigate(this.home));
        document.getElementById('pb-open-new').addEventListener('click', () => this.openInNewTab());
        this.address.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.onGo();
        });

        // try to detect iframe load failures (X-Frame-Options) and fallback
        this.iframe.addEventListener('load', () => {
            // update address to reflect iframe src
            try {
                const src = this.iframe.src;
                if (src) this.address.value = src;
            } catch (e) {}
            // hide overlay
            const overlay = document.getElementById('pb-overlay');
            if (overlay) overlay.style.display = 'none';
        });

        // local navigation from links inside iframe may be blocked by cross-origin; we rely on top-level navigation where needed
    }

    isValidUrl(value) {
        try {
            const u = new URL(value);
            return !!u.protocol;
        } catch (e) {
            return false;
        }
    }

    normalizeUrl(value) {
        if (this.isValidUrl(value)) return value;
        // allow bare hostnames without scheme
        if (/^[\w\-]+\.[\w\-]+/.test(value)) return 'https://' + value;
        return null;
    }

    onGo() {
        const v = this.address.value.trim();
        if (!v) return;
        const normalized = this.normalizeUrl(v);
        if (normalized) {
            this.navigate(normalized);
        } else {
            this.performSearch(v);
        }
    }

    performSearch(query) {
        const url = this.searchEngine + encodeURIComponent(query);
        // attempt to load search results in iframe; if the site blocks embedding user can use 'Open in new tab' automatically
        this.navigate(url);
    }

    navigate(url, replace = false) {
        // try to set iframe src
        try {
            this.iframe.src = url;
            this.address.value = url;
            // push history
            if (replace) {
                this.history = [url];
                this.historyIndex = 0;
            } else {
                // if navigating from mid-history, truncate forward
                if (this.historyIndex < this.history.length - 1) {
                    this.history = this.history.slice(0, this.historyIndex + 1);
                }
                this.history.push(url);
                this.historyIndex = this.history.length - 1;
            }
            // optimistic: hide overlay
            const overlay = document.getElementById('pb-overlay');
            if (overlay) overlay.style.display = 'none';
        } catch (e) {
            // fallback: open in new tab
            window.open(url, '_blank');
        }
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const url = this.history[this.historyIndex];
            this.iframe.src = url;
            this.address.value = url;
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const url = this.history[this.historyIndex];
            this.iframe.src = url;
            this.address.value = url;
        }
    }

    reload() {
        try {
            // show overlay while reloading if site blocks embedding
            const overlay = document.getElementById('pb-overlay');
            if (overlay) overlay.style.display = 'block';
            this.iframe.contentWindow.location.reload();
        } catch (e) {
            // if cross-origin prevents reload, replace src to force reload
            const url = this.iframe.src || this.address.value;
            this.iframe.src = url;
        } finally {
            const overlay = document.getElementById('pb-overlay');
            if (overlay) overlay.style.display = 'none';
        }
    }

    openInNewTab() {
        const url = this.address.value.trim() || this.iframe.src || this.home;
        window.open(url, '_blank');
    }
}

// register globally if your app loader expects window.apps
window.PremiumBrowserApp = PremiumBrowserApp;