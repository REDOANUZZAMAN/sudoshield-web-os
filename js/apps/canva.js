// Canva Application
class CanvaApp {
    constructor() {
        this.presentationUrl = 'https://www.canva.com/design/DAG0P8hqNUc/GlsCSpFaxTvr-75mYzKT_g/view?embed';
        this.embedUrl = 'https://www.canva.com/design/DAG0P8hqNUc/GlsCSpFaxTvr-75mYzKT_g/view?utm_content=DAG0P8hqNUc&utm_campaign=designshare&utm_medium=embeds&utm_source=link';
    }

    render() {
        return `
            <div class="canva-app">
                <div class="canva-header">
                    <div class="canva-controls">
                        <button class="canva-btn" id="reload-presentation">
                            <i class="fas fa-sync-alt"></i> Reload
                        </button>
                        <button class="canva-btn" id="fullscreen-presentation">
                            <i class="fas fa-expand"></i> Fullscreen
                        </button>
                        <button class="canva-btn" id="open-external">
                            <i class="fas fa-external-link-alt"></i> Open in New Tab
                        </button>
                    </div>
                </div>
                <div class="canva-content">
                    <div class="canva-embed-container">
                        <iframe 
                            id="canva-frame"
                            loading="lazy"
                            src="${this.presentationUrl}"
                            allowfullscreen="allowfullscreen" 
                            allow="fullscreen">
                        </iframe>
                    </div>
                    <div class="canva-loading" id="canva-loading">
                        <div class="loading-spinner"></div>
                        <p>Slides is loading...</p>
                    </div>
                    <div class="canva-attribution">
                        <a href="${this.embedUrl}" target="_blank" rel="noopener">
                            Copy of presentation OS ppt
                        </a> by SudoShiled
                    </div>
                </div>
            </div>

            <style>
                .canva-app {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f5f5f5;
                }

                .canva-header {
                    background: linear-gradient(135deg, #00c4cc 0%, #7b68ee 100%);
                    padding: 10px 15px;
                    border-radius: 8px 8px 0 0;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }

                .canva-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .canva-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .canva-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .canva-btn:active {
                    transform: translateY(0);
                }

                .canva-content {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .canva-embed-container {
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 56.25%;
                    padding-bottom: 0;
                    box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16);
                    margin: 1.6em 1em 0.9em 1em;
                    overflow: hidden;
                    border-radius: 8px;
                    will-change: transform;
                    flex: 1;
                    background: white;
                }

                #canva-frame {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    border: none;
                    padding: 0;
                    margin: 0;
                }

                .canva-attribution {
                    padding: 10px 15px;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.05);
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }

                .canva-attribution a {
                    color: #00c4cc;
                    text-decoration: none;
                    font-size: 12px;
                    font-weight: 500;
                }

                .canva-attribution a:hover {
                    text-decoration: underline;
                }

                .canva-loading {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    z-index: 10;
                    transition: opacity 0.5s ease;
                }

                .canva-loading.hidden {
                    opacity: 0;
                    pointer-events: none;
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-left: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .canva-loading p {
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .canva-controls {
                        flex-wrap: wrap;
                        gap: 8px;
                    }

                    .canva-btn {
                        padding: 6px 10px;
                        font-size: 11px;
                    }
                }
            </style>
        `;
    }

    init(container) {
        this.container = container;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const reloadBtn = document.getElementById('reload-presentation');
        const fullscreenBtn = document.getElementById('fullscreen-presentation');
        const externalBtn = document.getElementById('open-external');
        const canvaFrame = document.getElementById('canva-frame');
        const loadingDiv = document.getElementById('canva-loading');

        // Reload presentation
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                loadingDiv.classList.remove('hidden');
                canvaFrame.src = canvaFrame.src;
            });
        }

        // Fullscreen mode
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (canvaFrame.requestFullscreen) {
                    canvaFrame.requestFullscreen();
                } else if (canvaFrame.webkitRequestFullscreen) {
                    canvaFrame.webkitRequestFullscreen();
                } else if (canvaFrame.mozRequestFullScreen) {
                    canvaFrame.mozRequestFullScreen();
                }
            });
        }

        // Open in external tab
        if (externalBtn) {
            externalBtn.addEventListener('click', () => {
                window.open(this.embedUrl, '_blank');
            });
        }

        // Hide loading screen when iframe loads
        if (canvaFrame) {
            canvaFrame.addEventListener('load', () => {
                setTimeout(() => {
                    loadingDiv.classList.add('hidden');
                }, 1000);
            });

            // Show loading if iframe fails to load
            canvaFrame.addEventListener('error', () => {
                loadingDiv.innerHTML = `
                    <div class="loading-spinner" style="border-left-color: #ff6b6b;"></div>
                    <p>Failed to load Canva presentation</p>
                    <button class="canva-btn" onclick="location.reload()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                `;
            });
        }
    }
}

// Initialize the app
window.canvaApp = new CanvaApp();
