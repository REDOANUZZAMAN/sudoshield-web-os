// Games Application
class GamesApp {
    constructor() {
        this.currentGame = null;
        this.games = [
            {
                id: 'snake',
                title: 'Snake Game',
                description: 'Classic snake game',
                longDescription: 'Navigate the snake to eat food and grow longer. Avoid hitting walls or yourself!',
                category: 'action',
                icon: 'fas fa-gamepad'
            },
            {
                id: 'tictactoe',
                title: 'Tic Tac Toe',
                description: 'Play against computer',
                longDescription: 'Classic 3x3 grid game. Get three in a row to win against the AI opponent.',
                category: 'puzzle',
                icon: 'fas fa-th'
            },
            {
                id: 'pong',
                title: 'Pong',
                description: 'Classic arcade game',
                longDescription: 'Retro paddle game. Control your paddle with the mouse and score points against the computer.',
                category: 'action',
                icon: 'fas fa-circle'
            },
            {
                id: 'memory',
                title: 'Memory Game',
                description: 'Match the cards',
                longDescription: 'Test your memory by matching pairs of cards. Multiple difficulty levels and themes available.',
                category: 'puzzle',
                icon: 'fas fa-brain'
            }
        ];
        
        // Snake game state
        this.snake = {
            board: null,
            ctx: null,
            snake: [],
            food: {},
            direction: { x: 0, y: 0 },
            score: 0,
            gameRunning: false,
            gridSize: 20,
            lastTime: 0,
            // dynamic speed: start slower and increase over time
            baseSpeed: 200, // starting milliseconds between moves
            gameSpeed: 200, // current milliseconds between moves
            minSpeed: 50, // fastest interval (lower is faster)
            speedStep: 8, // ms to decrease per speed-up
            movesSinceSpeedup: 0, // count moves to trigger speed-up
            movesPerSpeedup: 6, // every N moves speed increases
            particles: [],
            scoreElement: null,
            startButton: null,
            pauseButton: null,
            boardWidth: 400,
            boardHeight: 400,
            snakeSet: new Set() // For fast collision detection
        };
        
        // Tic Tac Toe state
        this.tictactoe = {
            board: Array(9).fill(''),
            currentPlayer: 'X',
            gameOver: false,
            winner: null
        };
        
        // Pong game state
        this.pong = {
            canvas: null,
            ctx: null,
            ball: { x: 400, y: 200, dx: 4, dy: 4, radius: 8 },
            paddle1: { x: 10, y: 150, width: 10, height: 80, dy: 0 },
            paddle2: { x: 780, y: 150, width: 10, height: 80, dy: 0 },
            score1: 0,
            score2: 0,
            gameRunning: false,
            // Performance optimizations
            score1Element: null,
            score2Element: null,
            startButton: null,
            pauseButton: null,
            lastTime: 0,
            accumulator: 0,
            gameSpeed: 16.67 // ~60 FPS
            ,
            trail: []
        };
        
        // Memory game state
        this.memory = {
            cards: [],
            flippedCards: [],
            matchedCards: [],
            moves: 0,
            gameComplete: false,
            gridSize: 4, // 4x4 grid
            difficulty: 'easy', // easy, medium, hard
            theme: 'emojis', // emojis, numbers, colors, shapes
            timeLimit: 120, // seconds
            timeLeft: 120,
            timer: null,
            score: 0,
            bestScores: JSON.parse(localStorage.getItem('memoryBestScores') || '{}'),
            cardSymbols: {
                emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐔', '🐧', '🐦', '🐙', '🦋', '🐝', '🐞', '🦄', '🐷', '🐮', '🐗', '🦓'],
                numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
                colors: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔶', '🔷', '💎', '🎨', '🌈', '✨', '💫'],
                shapes: ['▲', '▼', '◀', '▶', '◆', '◇', '■', '□', '●', '○', '★', '☆', '◆', '◇', '■', '□', '●', '○', '★', '☆', '△', '▽', '◁', '▷', '◆']
            }
        };
    }

    // Return small inline SVG for each game id to avoid external icon dependency
    getGameSVG(gameId) {
        switch (gameId) {
            case 'snake':
                return `
                    <svg class="game-svg game-svg-snake" width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                            <linearGradient id="snake-grad" x1="0" x2="1">
                                <stop offset="0%" stop-color="#4CAF50" />
                                <stop offset="50%" stop-color="#8BC34A" />
                                <stop offset="100%" stop-color="#CDDC39" />
                            </linearGradient>
                        </defs>
                        <g fill="none" stroke="url(#snake-grad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
                            <path class="snake-body" d="M12 56c10-12 22-16 36-16s28 2 40 16" />
                        </g>
                        <g>
                            <circle class="snake-eye" cx="64" cy="24" r="5" fill="#1B5E20" />
                        </g>
                    </svg>
                `;
            case 'tictactoe':
                return `
                    <svg class="game-svg game-svg-tictactoe" width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                            <linearGradient id="ttt-grad" x1="0" x2="1">
                                <stop offset="0%" stop-color="#2196F3" />
                                <stop offset="100%" stop-color="#3F51B5" />
                            </linearGradient>
                        </defs>
                        <rect x="10" y="10" width="64" height="64" rx="8" fill="url(#ttt-grad)" opacity="0.95" />
                        <g class="ttt-lines" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round">
                            <path d="M34 10v64M50 10v64M10 34h64M10 50h64" />
                        </g>
                        <g class="ttt-animate">
                            <circle class="ttt-o" cx="26" cy="26" r="8" stroke="#FFF" stroke-width="3" fill="rgba(255,255,255,0.06)" />
                            <path class="ttt-x" d="M58 58 L70 70 M70 58 L58 70" stroke="#FFF" stroke-width="4" stroke-linecap="round" />
                        </g>
                    </svg>
                `;
            case 'pong':
                return `
                    <svg class="game-svg game-svg-pong" width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                            <linearGradient id="pong-grad" x1="0" x2="1">
                                <stop offset="0%" stop-color="#FF7043" />
                                <stop offset="100%" stop-color="#FFCA28" />
                            </linearGradient>
                        </defs>
                        <rect x="10" y="22" width="12" height="40" rx="4" fill="url(#pong-grad)" class="paddle-left" />
                        <rect x="62" y="22" width="12" height="40" rx="4" fill="url(#pong-grad)" class="paddle-right" />
                        <circle class="pong-ball" cx="42" cy="42" r="7" fill="#FFFFFF" />
                    </svg>
                `;
            case 'memory':
                return `
                    <svg class="game-svg game-svg-memory" width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <defs>
                            <linearGradient id="mem-grad" x1="0" x2="1">
                                <stop offset="0%" stop-color="#9C27B0" />
                                <stop offset="100%" stop-color="#E91E63" />
                            </linearGradient>
                        </defs>
                        <rect x="12" y="16" width="60" height="52" rx="8" fill="url(#mem-grad)" />
                        <g class="mem-dots" fill="#FFF" opacity="0.95">
                            <circle cx="28" cy="34" r="5" />
                            <circle cx="42" cy="46" r="5" />
                            <circle cx="56" cy="34" r="5" />
                        </g>
                    </svg>
                `;
            default:
                return `
                    <svg class="game-svg" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect x="12" y="12" width="40" height="40" rx="6" fill="currentColor" />
                    </svg>
                `;
        }
    }
    
    render() {
        return `
            <div class="games-app">
                <div class="games-header">
                    <h1><i class="fas fa-gamepad"></i> Games Center</h1>
                    <p>Choose a game to play</p>
                </div>
                <div class="games-content" id="games-content">
                    ${this.renderGameMenu()}
                </div>
            </div>
        `;
    }
    
    init(container) {
        this.container = container;
        this.setupEventListeners();
        // Attach UI listeners for dynamic menu items (cards)
        this.attachMenuListeners();
        // Ensure menu spacing accounts for OS taskbar / home indicator
        this.adjustMenuBottomSpacing();
        // Recalculate when viewport changes
        window.addEventListener('resize', () => this.adjustMenuBottomSpacing());
        window.addEventListener('orientationchange', () => this.adjustMenuBottomSpacing());
    }
    
    setupEventListeners() {
        // Global game event listeners would be set up here
        document.addEventListener('keydown', (e) => {
            if (this.currentGame === 'snake' && this.snake.gameRunning) {
                this.handleSnakeKeyPress(e);
            }
        });
    }

    // Bind click handlers to menu cards after render
    attachMenuListeners() {
        // Use event delegation: listen on document for clicks on elements with data-game
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-game]');
            if (!target) return;
            const gameId = target.getAttribute('data-game');
            if (gameId) {
                // Stop propagation so other handlers don't interfere
                e.stopPropagation();
                try {
                    this.startGame(gameId);
                } catch (err) {
                    console.error('Failed to start game', gameId, err);
                }
            }
        });

        // Note: play buttons now exist on both front and back faces and flip with the card.
        // We removed the previous hover-based "no-flip" behavior so the card can flip
        // while allowing the back-face play button to be clickable.
    }

    // Adjust bottom padding so the last card stays above OS taskbars / home indicators
    adjustMenuBottomSpacing() {
        try {
            const menu = document.querySelector('.games-menu');
            if (!menu) return;

            // buffer for safe area / taskbar (px)
            const defaultBuffer = 180;

            // find the last visible card in the grid or featured card
            const lastCard = menu.querySelector('.games-grid .game-card:last-of-type') || menu.querySelector('.featured-card');
            if (!lastCard) {
                menu.style.paddingBottom = '';
                return;
            }

            const rect = lastCard.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // If the bottom of the last card is within `buffer` px of the viewport bottom, increase padding
            const overlap = rect.bottom - (viewportHeight - defaultBuffer);
            // Try to detect any fixed-position overlay at the very bottom of the viewport
            let overlayHeight = 0;
            try {
                const bottomEl = document.elementFromPoint((window.innerWidth || document.documentElement.clientWidth) / 2, window.innerHeight - 1);
                let el = bottomEl;
                while (el && el !== document.body) {
                    const s = window.getComputedStyle(el);
                    if (s.position === 'fixed' && (s.bottom === '0px' || parseFloat(s.bottom) >= 0)) {
                        // Found a fixed-bottom overlay
                        overlayHeight = el.getBoundingClientRect().height || 0;
                        break;
                    }
                    el = el.parentElement;
                }
            } catch (err) {
                // elementFromPoint may fail in some contexts; ignore
                overlayHeight = 0;
            }

            const spacer = document.querySelector('.safe-bottom-spacer');
            const targetHeight = Math.max(defaultBuffer, overlayHeight + 24);
            if (spacer) {
                spacer.style.height = targetHeight + 'px';
            } else {
                // fallback: set menu padding
                menu.style.paddingBottom = targetHeight + 'px';
            }

            // Debug info to help diagnose layout issues
            console.debug('adjustMenuBottomSpacing applied spacer height:', targetHeight + 'px');
            console.debug('adjustMenuBottomSpacing', {
                lastCardRect: rect,
                viewportHeight,
                overlap,
                overlayHeight,
                targetHeight,
                spacerExists: !!spacer
            });
        } catch (err) {
            console.error('adjustMenuBottomSpacing error', err);
        }
    }
    
    renderGameMenu() {
        return `
            <div class="games-menu">
                <!-- Overall layout wrapper to avoid right-column overlap -->
                <div class="games-layout">
                    <!-- Featured Game Spotlight -->
                <div class="featured-section">
                    <div class="featured-header">
                        <h2><i class="fas fa-star"></i> Featured Game</h2>
                        <div class="featured-badge">HOT</div>
                    </div>
                    <div class="featured-card" data-game="memory">
                        <div class="featured-content">
                            <div class="featured-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <div class="featured-info">
                                <h3>Memory Challenge</h3>
                                <p>Dynamic difficulty levels, multiple themes, and competitive scoring!</p>
                                <div class="featured-stats">
                                    <span><i class="fas fa-trophy"></i> High Scores</span>
                                    <span><i class="fas fa-clock"></i> Timer Mode</span>
                                    <span><i class="fas fa-palette"></i> 4 Themes</span>
                                </div>
                            </div>
                        </div>
                        <div class="featured-play">
                                <button class="featured-play-btn" data-game="memory">
                                    <i class="fas fa-play"></i> Play Now
                                </button>
                            </div>
                    </div>
                </div>

                <!-- Game Categories -->
                <div class="games-categories">
                    <!-- Render categories dynamically: Action and Puzzle separated -->
                    ${['action','puzzle'].map(cat => `
                        <div class="category-section">
                            <h2><i class="fas fa-gamepad"></i> ${cat === 'action' ? 'Action Games' : 'Puzzle Games'}</h2>
                            <div class="games-grid">
                                ${this.games
                                    .filter(g => g.category === cat)
                                    .map((game, idx) => `
                                        <div class="game-card ${game.category}-card" data-game="${game.id}" style="animation-delay: ${idx * 0.12}s;">
                                            <div class="card-inner">
                                                <div class="card-front">
                                                    <div class="card-media">
                                                        <div class="game-icon">
                                                            ${this.getGameSVG(game.id)}
                                                        </div>
                                                    </div>
                                                    <h3>${game.title}</h3>
                                                    <p>${game.description}</p>
                                                    <button class="play-btn" data-game="${game.id}"><i class="fas fa-play"></i> Play</button>
                                                </div>
                                                <div class="card-back">
                                                    <h4>${game.title}</h4>
                                                    <p>${game.longDescription || game.description}</p>
                                                    <button class="back-play" data-game="${game.id}"><i class="fas fa-play"></i> Play Now</button>
                                                </div>
                                            </div>
                                            <div class="card-glow"></div>
                                        </div>
                                    `).join('')}
                            </div>
                        </div>
                    `).join('')}
                    <!-- Quick Stats -->
                    <div class="games-stats">
                    <div class="stat-item">
                        <i class="fas fa-gamepad"></i>
                        <span class="stat-number">${this.games.length}</span>
                        <span class="stat-label">Games</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-trophy"></i>
                        <span class="stat-number">∞</span>
                        <span class="stat-label">Fun</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <span class="stat-number">24/7</span>
                        <span class="stat-label">Available</span>
                    </div>
                    </div>
                </div>
                <div class="safe-bottom-spacer" aria-hidden="true"></div>

            </div>

            <style>
                /* Ensure games app respects device safe areas and keeps content above taskbars */
                .games-app {
                    padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 28px);
                }

                /* Extra bottom spacing for the main menu so cards don't end up under taskbars */
                .games-menu {
                    padding-bottom: 0; /* spacer handles bottom spacing now */
                }

                /* Allow the games content to scroll and reserve a large bottom padding so
                   OS taskbars / in-page docks don't cover the last row */
                .games-content {
                    max-height: calc(100vh - 100px);
                    overflow-y: auto;
                    padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 260px);
                    box-sizing: border-box;
                }
                .games-menu {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* Two-column layout: left featured, center content (games + stats) */
                .games-layout {
                    display: grid;
                    grid-template-columns: 360px 1fr;
                    gap: 30px;
                    align-items: start;
                }

                /* Ensure featured stays full height of left column */
                .featured-section {
                    grid-column: 1 / 2;
                    width: 100%;
                }

                /* Center area for categories and games. Use flex to place games and stats side-by-side */
                .games-categories {
                    grid-column: 2 / 3;
                    display: flex;
                    gap: 28px;
                    align-items: flex-start;
                }

                /* Stats area placed beside games inside the center column */
                .games-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    width: 260px;
                    flex-shrink: 0;
                    align-items: stretch;
                }

                /* Individual stat cards - tall thin panels like screenshot */
                .games-stats .stat-item {
                    min-height: 140px;
                    padding: 18px 12px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    width: 100%;
                }

                /* Featured Section */
                .featured-section {
                    margin-bottom: 40px;
                }

                .featured-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .featured-header h2 {
                    font-size: 1.8em;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .featured-badge {
                    background: linear-gradient(45deg, #FF6B6B, #FFA500);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: bold;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .featured-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                    border-radius: 20px;
                    padding: 30px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    border: 1px solid rgba(255,255,255,0.2);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                }

                .featured-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.5s;
                }

                .featured-card:hover::before {
                    left: 100%;
                }

                .featured-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    border-color: rgba(255,255,255,0.4);
                }

                .featured-content {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .featured-icon {
                    font-size: 4em;
                    color: #FFD700;
                    text-shadow: 0 0 20px rgba(255,215,0,0.5);
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .featured-info h3 {
                    font-size: 2.2em;
                    margin: 0 0 10px 0;
                    background: linear-gradient(45deg, #fff, #FFD700);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .featured-info p {
                    font-size: 1.1em;
                    opacity: 0.9;
                    margin-bottom: 15px;
                }

                .featured-stats {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .featured-stats span {
                    background: rgba(255,255,255,0.1);
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 0.9em;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .featured-play {
                    margin-top: 20px;
                    text-align: center;
                }

                .featured-play-btn {
                    background: linear-gradient(45deg, #4CAF50, #66BB6A);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                }

                .featured-play-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
                }

                /* Categories */
                .games-categories {
                    margin-bottom: 40px;
                }

                .category-section {
                    margin-bottom: 30px;
                }

                .category-section h2 {
                    font-size: 1.5em;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .games-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 25px;
                    align-items: start;
                    flex: 1 1 auto;
                    min-width: 0; /* allow flex child to shrink within container */
                }

                /* Let the navy-blue games-app background show through the grid */
                .games-grid {
                    background: transparent !important;
                    padding: 6px 0;
                }

                .game-card {
                    /* create a local stacking context so cards stack independently
                       of other panels (prevents right-column stats from overlaying)
                    */
                    position: relative;
                    isolation: isolate;
                    z-index: 3;
                    /* allow slightly more room so title and play button are visible */
                    min-height: 260px;
                    perspective: 1000px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    will-change: transform;
                    /* Ensure no white outer frame shows — let the games-app navy background show through */
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                }

                /* Enforce box-sizing and prevent visual overflow from icons/text */
                .game-card, .card-inner, .card-front, .card-back {
                    box-sizing: border-box;
                    overflow: hidden;
                }

                /* Outer wrapper padding: keep a small gutter but transparent so navy shows through */
                .games-grid .game-card {
                    padding: 12px;
                    border-radius: 12px;
                    background: transparent !important;
                }

                /* Strong fallback to ensure all card faces are dark on top of any other styles */
                .games-grid .game-card .card-front,
                .games-grid .game-card .card-back,
                .games-grid .game-card .card-front *,
                .games-grid .game-card .card-back * {
                    background-color: transparent !important;
                    color: inherit !important;
                }

                /* Explicitly set the face backgrounds (high specificity) */
                .games-grid .game-card > .card-inner .card-front,
                .games-grid .game-card > .card-inner .card-back,
                .game-card .card-front,
                .game-card .card-back {
                    background: linear-gradient(135deg, #1f1f22 0%, #2b2b2f 100%) !important;
                    border: 1px solid rgba(255,255,255,0.04) !important;
                    color: #fff !important;
                }

                .games-grid .game-card .card-front h3,
                .games-grid .game-card .card-back h4,
                .games-grid .game-card .card-front p,
                .games-grid .game-card .card-back p {
                    color: rgba(255,255,255,0.95) !important;
                }

                .card-inner {
                    /* establish containing block for absolutely positioned faces
                       and preserve 3d transforms for the flip animation */
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(.2,.9,.2,1);
                }

                .game-card:not(.no-flip):hover .card-inner {
                    transform: rotateY(180deg);
                }

                /* Prevent card flip when hovering over play button */
                .game-card.no-flip .card-inner {
                    transform: rotateY(0deg) !important;
                }

                .card-front, .card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 15px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* ensure title and button both remain visible */
                    align-items: center;
                    pointer-events: auto;
                }

                .card-front {
                    /* darker glass surface so white text/icons are visible */
                    background: linear-gradient(135deg, rgba(20,20,20,0.95), rgba(34,34,34,0.9));
                    border: 1px solid rgba(255,255,255,0.06);
                    backdrop-filter: blur(6px);
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.45);
                    z-index: 9999; /* ensure front face sits above overlays */
                    color: #fff;
                    position: relative;
                }

                .card-back {
                    /* slightly lighter but still dark so the back doesn't look like white */
                    background: linear-gradient(135deg, rgba(28,28,28,0.95), rgba(42,42,42,0.92));
                    border: 1px solid rgba(255,255,255,0.05);
                    backdrop-filter: blur(6px);
                    transform: rotateY(180deg);
                    z-index: 1;
                    color: #f0f0f0;
                }

                /* Replace white preview placeholders with a dark media area */
                .card-media {
                    width: calc(100% - 40px);
                    height: 110px;
                    background: linear-gradient(135deg, rgba(40,40,40,0.95), rgba(24,24,24,0.95));
                    border-radius: 10px;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.03);
                    color: rgba(255,255,255,0.85);
                    font-weight: 700;
                    pointer-events: none; /* not interactive, just a preview */
                }

                .card-media .media-text {
                    font-size: 0.95em;
                    opacity: 0.95;
                    text-align: center;
                    padding: 8px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                /* make headings and icons on cards pop */
                .card-front h3, .card-back h4 {
                    color: #fff;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
                }

                .card-front, .card-back {
                    color: rgba(255,255,255,0.85);
                }

                .game-icon {
                    font-size: 3.2rem;
                    margin-bottom: 10px;
                    color: #fff;
                    text-shadow: 0 0 16px rgba(255,255,255,0.55);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    width:100%;
                    position: relative;
                }

                .card-media { z-index: 10000; position: relative; }
                .game-icon i { z-index: 10002; font-size: 3.2rem; position: relative; color: #fff !important; text-shadow: 0 0 16px rgba(255,255,255,0.8); }
                /* no icon fallback text — using inline SVG icons only */

                /* Guarantee titles and icons are visible above overlays */
                .card-front h3 { color: #ffffff !important; z-index: 10003; position: relative; }

                /* Constrain emoji / inline icons so they don't overflow card edges */
                .game-emoji, .game-icon i, .featured-icon i {
                    display: inline-block;
                    max-width: 100%;
                    max-height: 3.2rem;
                    line-height: 1;
                    vertical-align: middle;
                    object-fit: contain;
                }

                /* Specific rule for larger emojis used as icons */
                .game-emoji {
                    font-size: 2.6rem;
                    max-width: 3.2rem;
                    max-height: 3.2rem;
                }

                /* Inline SVGs used as icons */
                .game-svg {
                    width: 72px;
                    height: 72px;
                    display: block;
                    color: #fff;
                    fill: currentColor;
                    stroke: currentColor;
                    z-index: 10005;
                }

                /* Animated SVG icon tweaks */
                .game-svg-snake { overflow: visible; }
                .game-svg-snake .snake-body {
                    stroke-dasharray: 120;
                    stroke-dashoffset: 120;
                    animation: snake-slide 2s linear infinite;
                    filter: drop-shadow(0 6px 8px rgba(0,0,0,0.35));
                }
                .game-svg-snake .snake-eye {
                    transform-origin: center;
                    animation: snake-eye-blink 1.6s ease-in-out infinite;
                }

                @keyframes snake-slide {
                    0% { stroke-dashoffset: 120; }
                    100% { stroke-dashoffset: 0; }
                }

                @keyframes snake-eye-blink {
                    0%, 85%, 100% { transform: scale(1); }
                    90% { transform: scale(0.2); }
                }

                .game-svg-tictactoe .ttt-lines { opacity: 0.95; }
                .game-svg-tictactoe .ttt-animate .ttt-o { transform-origin: center; animation: ttt-pop 2.4s ease-in-out infinite; }
                .game-svg-tictactoe .ttt-animate .ttt-x { transform-origin: center; animation: ttt-tilt 2.4s ease-in-out infinite; opacity: 0.9; }

                @keyframes ttt-pop {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.06); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes ttt-tilt {
                    0% { transform: rotate(0deg); }
                    50% { transform: rotate(6deg); }
                    100% { transform: rotate(0deg); }
                }

                .game-svg-pong .pong-ball { transform-origin: center; animation: pong-bounce 1s cubic-bezier(.2,.9,.2,1) infinite; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.35)); }
                .game-svg-pong .paddle-left, .game-svg-pong .paddle-right { transform-origin: center; animation: paddle-sway 1.4s ease-in-out infinite; }

                @keyframes pong-bounce {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-6px) scale(1.02); }
                    100% { transform: translateY(0) scale(1); }
                }

                @keyframes paddle-sway {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                    100% { transform: translateY(0); }
                }

                .game-svg-memory .mem-dots circle { transform-origin: center; animation: mem-pulse 2s ease-in-out infinite; }

                @keyframes mem-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.12); opacity: 0.95; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .action-card .game-icon {
                    color: #FF6B6B;
                }

                .puzzle-card .game-icon {
                    color: #4CAF50;
                }

                .card-front h3 {
                    font-size: 1.6em;
                    margin: 8px 0 6px 0;
                    color: white;
                    font-weight: 800;
                    letter-spacing: 0.2px;
                }

                .card-front h3, .card-back h4 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    max-width: 100%;
                }

                /* Ensure titles sit above decorative overlays */
                .card-front h3 { position: relative; z-index: 15; }

                /* Defensive: ensure titles are white and visible */
                .card-front h3, .card-back h4 { color: #ffffff !important; }

                .card-front p {
                    opacity: 0.8;
                    font-size: 0.9em;
                }

                .card-front p, .card-back p {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-wrap: break-word;
                    max-width: 100%;
                }

                .play-btn {
                    background: linear-gradient(45deg, #4CAF50, #66BB6A);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.85em;
                    font-weight: bold;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
                    margin-top: 12px;
                    z-index: 999 !important;
                }

                .play-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
                    background: linear-gradient(45deg, #66BB6A, #81C784);
                }

                .play-btn i {
                    font-size: 0.8em;
                }

                /* Back-face play button: positioned and receives clicks when back is visible */
                .back-play {
                    margin-top: 12px;
                    background: linear-gradient(45deg, #FF6B6B, #FF8A65);
                    border-radius: 20px;
                    padding: 8px 14px;
                    color: white;
                    border: none;
                    cursor: pointer;
                    pointer-events: auto;
                    transform: translateZ(1px);
                }

                /* Ensure the back-face button is clickable only when the back is visible (visual fallback) */
                .card-back .back-play { pointer-events: auto; }

                .card-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 15px;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.06), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none; /* don't block clicks */
                    mix-blend-mode: screen; /* make it decorative, not covering */
                    z-index: 3; /* sit under icons/titles */
                }

                .game-card:hover .card-glow {
                    opacity: 1;
                }

                .card-back h4 {
                    font-size: 1.3em;
                    margin-bottom: 10px;
                    color: white;
                }

                .card-back p {
                    font-size: 0.9em;
                    opacity: 0.9;
                    line-height: 1.4;
                    margin-bottom: 15px;
                }

                .game-difficulty {
                    background: rgba(255,255,255,0.2);
                    padding: 5px 15px;
                    border-radius: 15px;
                    font-size: 0.8em;
                    font-weight: bold;
                }

                /* Transparent spacer to ensure bottom content isn't obscured */
                .safe-bottom-spacer {
                    height: calc(env(safe-area-inset-bottom, 20px) + 220px);
                    min-height: 220px;
                    width: 100%;
                    pointer-events: none;
                    display: block;
                    background: transparent;
                }

                /* Strong overrides: if a blue overlay or other page CSS hides icons/titles,
                   these rules force them visible. Keep minimal and scoped to game cards. */
                .games-grid .game-card .card-front,
                .games-grid .game-card .card-front *,
                .games-grid .game-card .card-media,
                .games-grid .game-card .game-icon,
                .games-grid .game-card .game-icon i,
                .games-grid .game-card .icon-fallback,
                .games-grid .game-card .card-front h3 {
                    opacity: 1 !important;
                    visibility: visible !important;
                    color: #fff !important;
                    -webkit-text-fill-color: #fff !important;
                    mix-blend-mode: normal !important;
                    filter: none !important;
                    transform: none !important;
                }

                /* Stats */
                .games-stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    margin-top: 40px;
                    flex-wrap: wrap;
                }

                .stat-item {
                    text-align: center;
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    min-width: 100px;
                }

                .stat-item i {
                    font-size: 2em;
                    color: #FFD700;
                    margin-bottom: 10px;
                    display: block;
                }

                .stat-number {
                    font-size: 1.8em;
                    font-weight: bold;
                    color: white;
                    display: block;
                }

                .stat-label {
                    font-size: 0.9em;
                    opacity: 0.8;
                    color: white;
                }

                /* Responsive */
                @media (max-width: 1000px) {
                    .games-layout {
                        grid-template-columns: 1fr;
                    }

                    .featured-section, .games-categories, .games-stats {
                        grid-column: 1 / -1;
                    }

                    /* Stack games and stats vertically on small screens */
                    .games-categories {
                        display: block;
                    }

                    .games-stats {
                        display: flex;
                        flex-direction: row;
                        overflow-x: auto;
                        gap: 12px;
                        padding-bottom: 10px;
                        width: 100%;
                    }

                    .games-stats .stat-item {
                        min-width: 120px;
                        min-height: 110px;
                        flex: 0 0 auto;
                    }
                    /* On narrow screens increase bottom spacing to avoid mobile home indicator overlap */
                    .games-menu { padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 110px); }
                }

                /* If viewport height is small, nudge the layout up so bottom content remains visible */
                @media (max-height: 700px) {
                    .games-layout { transform: translateY(-28px); }
                    .games-menu { padding-bottom: 120px; }
                }

                /* Entrance animation for game cards */
                .game-card {
                    animation: cardEnter 0.8s ease-out forwards;
                    opacity: 0;
                    transform: translateY(30px) scale(0.9);
                }

                @keyframes cardEnter {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            </style>
            <script>
                // Attach lightweight click handlers to fallback buttons when the menu is rendered
                (function(){
                    document.querySelectorAll('.fallback-play-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const id = btn.getAttribute('data-game');
                            if (window.gamesApp && id) {
                                window.gamesApp.startGame(id);
                            }
                        });
                    });
                })();
            </script>
        `;
    }
    
    startGame(gameId) {
        console.log('GamesApp.startGame called with', gameId);
        this.currentGame = gameId;
        const content = document.getElementById('games-content');
        if (!content) return;
        
        switch (gameId) {
            case 'snake':
                content.innerHTML = this.renderSnakeGame();
                this.initSnakeGame();
                break;
            case 'tictactoe':
                content.innerHTML = this.renderTicTacToe();
                this.initTicTacToe();
                break;
            case 'pong':
                content.innerHTML = this.renderPong();
                this.initPong();
                break;
            case 'memory':
                content.innerHTML = this.renderMemoryGame();
                this.initMemoryGame();
                break;
        }
    }
    
    // Snake Game
    renderSnakeGame() {
        return `
            <div class="snake-game">
                <div class="snake-header">
                    <h2><span class="game-emoji">🐍</span> Snake Game</h2>
                    <div class="snake-score">Score: <span id="snake-score">0</span></div>
                    <button onclick="window.gamesApp.backToMenu()" class="game-back-btn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div class="snake-game-container">
                    <canvas id="snake-canvas" width="400" height="400" class="snake-canvas"></canvas>
                </div>
                
                <div class="snake-controls">
                    <button onclick="window.gamesApp.startSnake()" class="snake-btn" id="snake-start">Start Game</button>
                    <button onclick="window.gamesApp.pauseSnake()" class="snake-btn" id="snake-pause" disabled>Pause</button>
                    <button onclick="window.gamesApp.resetSnake()" class="snake-btn">Reset</button>
                </div>
                
                <div class="snake-instructions">
                    <p><strong>Instructions:</strong> Use arrow keys to control the snake. Eat the red food to grow and increase your score!</p>
                </div>
            </div>
            
            <style>
                .snake-game {
                    text-align: center;
                    padding: 20px;
                }
                
                .snake-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .snake-header h2 {
                    font-size: 1.8em;
                    margin: 0;
                }
                
                .snake-score {
                    font-size: 1.3em;
                    font-weight: bold;
                    background: rgba(255,255,255,0.2);
                    padding: 10px 20px;
                    border-radius: 25px;
                }
                
                .snake-game-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                
                .snake-canvas {
                    border: 3px solid rgba(255,255,255,0.3);
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    max-width: 100%;
                    height: auto;
                }
                
                .snake-controls {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .snake-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.3s;
                }
                
                .snake-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }
                
                .snake-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .snake-instructions {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 10px;
                    max-width: 500px;
                    margin: 0 auto;
                }

                /* Responsive adjustments for Snake Game */
                @media (max-width: 600px) {
                    .snake-game-container {
                        padding: 0 10px;
                    }

                    .snake-canvas {
                        width: 100% !important;
                        max-width: 350px;
                        height: auto !important;
                    }

                    .snake-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .snake-header h2 {
                        font-size: 1.4em;
                    }

                    .snake-score {
                        font-size: 1.1em;
                        padding: 8px 16px;
                    }

                    .snake-btn {
                        padding: 10px 20px;
                        font-size: 14px;
                    }

                    .snake-instructions {
                        font-size: 0.9em;
                    }
                }
                
                .game-back-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: bold;
                }
            </style>
        `;
    }
    
    initSnakeGame() {
        this.snake.board = document.getElementById('snake-canvas');
        this.snake.ctx = this.snake.board.getContext('2d');
        this.snake.scoreElement = document.getElementById('snake-score');
        this.snake.startButton = document.getElementById('snake-start');
        this.snake.pauseButton = document.getElementById('snake-pause');
        this.resetSnake();
    }
    
    startSnake() {
        if (this.snake.gameRunning) return;
        
        this.snake.gameRunning = true;
        this.snake.lastTime = performance.now();
        this.snake.accumulator = 0;
        
        this.snake.startButton.disabled = true;
        this.snake.pauseButton.disabled = false;
        
        this.snakeGameLoop(performance.now());
    }
    
    pauseSnake() {
        this.snake.gameRunning = false;
        this.snake.startButton.disabled = false;
        this.snake.pauseButton.disabled = true;
    }
    
    resetSnake() {
        this.snake.snake = [{ x: 200, y: 200 }];
        this.snake.direction = { x: 1, y: 0 }; // Start moving right
        this.snake.score = 0;
        this.snake.gameRunning = false;
        this.snake.snakeSet = new Set(['200,200']); // Initialize with starting position
        this.snake.lastTime = 0;
        this.snake.accumulator = 0;
        // reset dynamic speed
        this.snake.gameSpeed = this.snake.baseSpeed;
        this.snake.movesSinceSpeedup = 0;
        
        this.snake.scoreElement.textContent = '0';
        this.snake.startButton.disabled = false;
        this.snake.pauseButton.disabled = true;
        
        this.spawnFood();
        this.drawSnake();
    }
    
    snakeGameLoop(currentTime = 0) {
        if (!this.snake.gameRunning) return;
        
        const deltaTime = currentTime - this.snake.lastTime;
        this.snake.lastTime = currentTime;
        
        // Accumulate time for game updates
        this.snake.accumulator += deltaTime;
        
        // Update game at fixed intervals (150ms = 6.67 updates per second)
        while (this.snake.accumulator >= this.snake.gameSpeed) {
            this.moveSnake();
            this.checkCollisions();
            this.snake.accumulator -= this.snake.gameSpeed;
        }
        
        this.drawSnake();
        
        requestAnimationFrame((time) => this.snakeGameLoop(time));
    }
    
    moveSnake() {
        // Don't move if no direction is set
        if (this.snake.direction.x === 0 && this.snake.direction.y === 0) {
            return;
        }
        
        const head = { ...this.snake.snake[0] };
        head.x += this.snake.direction.x * this.snake.gridSize;
        head.y += this.snake.direction.y * this.snake.gridSize;
        
        // Check for collision before moving
        if (this.snake.snakeSet.has(`${head.x},${head.y}`)) {
            this.gameOver();
            return;
        }
        
        this.snake.snake.unshift(head);
        
        // Check if food eaten
        if (head.x === this.snake.food.x && head.y === this.snake.food.y) {
            this.snake.score += 10;
            this.snake.scoreElement.textContent = this.snake.score;
            // emit particles at food position
            const cx = head.x + this.snake.gridSize / 2;
            const cy = head.y + this.snake.gridSize / 2;
            for (let i = 0; i < 12; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 2.5;
                this.snake.particles.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 18 + Math.floor(Math.random() * 12),
                    maxLife: 30,
                    size: 1 + Math.random() * 2.5,
                    color: ['#FFF176','#FFD54F','#FF8A65'][Math.floor(Math.random()*3)]
                });
            }
            this.spawnFood();
        } else {
            // Remove tail and update snakeSet
            const tail = this.snake.snake.pop();
            this.snake.snakeSet.delete(`${tail.x},${tail.y}`);
        }
        
        // Add new head to snakeSet
        this.snake.snakeSet.add(`${head.x},${head.y}`);

        // Increase difficulty: speed up every few moves until minSpeed
        this.snake.movesSinceSpeedup++;
        if (this.snake.movesSinceSpeedup >= this.snake.movesPerSpeedup) {
            this.snake.movesSinceSpeedup = 0;
            // decrease the interval (ms) to speed up, but not below minSpeed
            this.snake.gameSpeed = Math.max(this.snake.minSpeed, this.snake.gameSpeed - this.snake.speedStep);
        }
    }
    
    checkCollisions() {
        const head = this.snake.snake[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
            this.gameOver();
            return;
        }
    }
    
    gameOver() {
        this.snake.gameRunning = false;
        alert(`Game Over! Final Score: ${this.snake.score}`);
        this.resetSnake();
    }
    
    spawnFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * 20) * this.snake.gridSize,
                y: Math.floor(Math.random() * 20) * this.snake.gridSize
            };
        } while (this.snake.snakeSet.has(`${newFood.x},${newFood.y}`));
        
        this.snake.food = newFood;
    }
    
    drawSnake() {
        const ctx = this.snake.ctx;
        ctx.clearRect(0, 0, 400, 400);
        
        // Draw snake
        ctx.fillStyle = '#4CAF50';
        this.snake.snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, this.snake.gridSize - 2, this.snake.gridSize - 2);
        });
        
        // Draw food
        // Draw food as glowing circle
        const foodX = this.snake.food.x + this.snake.gridSize / 2;
        const foodY = this.snake.food.y + this.snake.gridSize / 2;
        const foodRadius = this.snake.gridSize / 2 - 3;
        const grad = ctx.createRadialGradient(foodX, foodY, 1, foodX, foodY, foodRadius * 2);
        grad.addColorStop(0, '#FFF176');
        grad.addColorStop(0.4, '#FFC107');
        grad.addColorStop(1, 'rgba(255,152,0,0.05)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw subtle core
        ctx.fillStyle = '#FF7043';
        ctx.beginPath();
        ctx.arc(foodX, foodY, Math.max(4, foodRadius * 0.45), 0, Math.PI * 2);
        ctx.fill();

        // Update and draw particles
        const pArr = this.snake.particles;
        for (let i = pArr.length - 1; i >= 0; i--) {
            const p = pArr[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            if (p.life <= 0) pArr.splice(i, 1);
        }
    }
    
    handleSnakeKeyPress(e) {
        const { direction } = this.snake;
        
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) {
                    this.snake.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (direction.y === 0) {
                    this.snake.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (direction.x === 0) {
                    this.snake.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (direction.x === 0) {
                    this.snake.direction = { x: 1, y: 0 };
                }
                break;
        }
        e.preventDefault();
    }
    
    // Tic Tac Toe Game
    renderTicTacToe() {
        return `
            <div class="tictactoe-game">
                <div class="tictactoe-header">
                    <h2><i class="fas fa-th"></i> Tic Tac Toe</h2>
                    <div class="tictactoe-status">
                        <span id="tictactoe-status">Player X's turn</span>
                    </div>
                    <button onclick="window.gamesApp.backToMenu()" class="game-back-btn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div class="tictactoe-container">
                    <div class="tictactoe-board" id="tictactoe-board">
                        ${Array(9).fill(0).map((_, i) => `
                            <div class="tictactoe-cell" onclick="window.gamesApp.makeMove(${i})"></div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="tictactoe-controls">
                    <button onclick="window.gamesApp.resetTicTacToe()" class="tictactoe-btn">New Game</button>
                </div>
            </div>
            
            <style>
                .tictactoe-game {
                    text-align: center;
                    padding: 20px;
                }
                
                .tictactoe-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                /* Back button shared styling */
                .game-back-btn {
                    background: rgba(255,255,255,0.12);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.18);
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                .game-back-btn:hover { transform: translateY(-2px); }
                
                .tictactoe-status {
                    font-size: 1.2em;
                    font-weight: bold;
                    background: rgba(255,255,255,0.2);
                    padding: 10px 20px;
                    border-radius: 25px;
                }
                
                .tictactoe-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 30px;
                }

                /* Animated X/O strokes */
                .ttt-svg { width: 100%; height: 100%; }
                .ttt-x-path, .ttt-o-path { stroke-dasharray: 200; stroke-dashoffset: 200; transition: stroke-dashoffset 420ms cubic-bezier(.2,.9,.2,1); filter: drop-shadow(0 6px 8px rgba(0,0,0,0.5)); }
                .tictactoe-cell.taken .ttt-x-path, .tictactoe-cell.taken .ttt-o-path { stroke-dashoffset: 0; }
                /* Color glows for X and O */
                .tictactoe-cell.x .ttt-x-path { filter: drop-shadow(0 6px 14px rgba(255,82,82,0.35)); }
                .tictactoe-cell.o .ttt-o-path { filter: drop-shadow(0 6px 14px rgba(33,150,243,0.28)); }
                
                .tictactoe-board {
                    display: grid;
                    grid-template-columns: repeat(3, 100px);
                    grid-template-rows: repeat(3, 100px);
                    gap: 5px;
                    background: rgba(255,255,255,0.3);
                    padding: 10px;
                    border-radius: 15px;
                }
                
                .tictactoe-cell {
                    background: rgba(255,255,255,0.8);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #333;
                }
                
                .tictactoe-cell:hover {
                    background: rgba(255,255,255,0.9);
                    transform: scale(1.05);
                }
                
                .tictactoe-cell.taken {
                    cursor: not-allowed;
                }
                
                .tictactoe-cell.taken:hover {
                    transform: none;
                }
                
                .tictactoe-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                }

                /* Responsive adjustments for Tic Tac Toe Game */
                @media (max-width: 500px) {
                    .tictactoe-board {
                        grid-template-columns: repeat(3, 80px);
                        grid-template-rows: repeat(3, 80px);
                        gap: 4px;
                        padding: 8px;
                    }

                    .tictactoe-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .tictactoe-header h2 {
                        font-size: 1.4em;
                    }

                    .tictactoe-status {
                        font-size: 1em;
                        padding: 8px 16px;
                    }

                    .tictactoe-cell {
                        font-size: 2em;
                    }

                    .tictactoe-btn {
                        padding: 10px 20px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 380px) {
                    .tictactoe-board {
                        grid-template-columns: repeat(3, 70px);
                        grid-template-rows: repeat(3, 70px);
                    }

                    .tictactoe-cell {
                        font-size: 1.8em;
                    }
                }
            </style>
        `;
    }
    
    initTicTacToe() {
        this.resetTicTacToe();
    }
    
    resetTicTacToe() {
        this.tictactoe.board = Array(9).fill('');
        this.tictactoe.currentPlayer = 'X';
        this.tictactoe.gameOver = false;
        this.tictactoe.winner = null;
        
        document.getElementById('tictactoe-status').textContent = "Player X's turn";
        const cells = document.querySelectorAll('.tictactoe-cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken');
        });
    }
    
    makeMove(index) {
        if (this.tictactoe.board[index] || this.tictactoe.gameOver) return;
        
        this.tictactoe.board[index] = this.tictactoe.currentPlayer;
        const cell = document.querySelectorAll('.tictactoe-cell')[index];
        cell.classList.add('taken');
        // Add a semantic class so we can target styling
        if (this.tictactoe.currentPlayer === 'X') {
            cell.classList.add('x');
            // unique gradient id per cell
            const gid = `x-grad-${index}`;
            cell.innerHTML = `
                <svg class="ttt-svg ttt-x" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="${gid}" x1="0" x2="1">
                            <stop offset="0%" stop-color="#FF8A80" />
                            <stop offset="100%" stop-color="#FF5252" />
                        </linearGradient>
                    </defs>
                    <path class="ttt-x-path" d="M20 20 L80 80 M80 20 L20 80" stroke="url(#${gid})" stroke-width="10" stroke-linecap="round" fill="none" />
                </svg>`;
        } else {
            cell.classList.add('o');
            const gid = `o-grad-${index}`;
            cell.innerHTML = `
                <svg class="ttt-svg ttt-o" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="${gid}" x1="0" x2="1">
                            <stop offset="0%" stop-color="#81D4FA" />
                            <stop offset="100%" stop-color="#29B6F6" />
                        </linearGradient>
                    </defs>
                    <circle class="ttt-o-path" cx="50" cy="50" r="28" stroke="url(#${gid})" stroke-width="10" fill="none" />
                </svg>`;
        }
        
        if (this.checkWinner()) {
            document.getElementById('tictactoe-status').textContent = `Player ${this.tictactoe.currentPlayer} wins!`;
            this.tictactoe.gameOver = true;
            return;
        }
        
        if (this.tictactoe.board.every(cell => cell)) {
            document.getElementById('tictactoe-status').textContent = "It's a tie!";
            this.tictactoe.gameOver = true;
            return;
        }
        
        this.tictactoe.currentPlayer = this.tictactoe.currentPlayer === 'X' ? 'O' : 'X';
        
        if (this.tictactoe.currentPlayer === 'O') {
            document.getElementById('tictactoe-status').textContent = "Computer's turn";
            setTimeout(() => this.computerMove(), 500);
        } else {
            document.getElementById('tictactoe-status').textContent = "Player X's turn";
        }
    }
    
    computerMove() {
        if (this.tictactoe.gameOver) return;
        
        const emptyIndices = this.tictactoe.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (emptyIndices.length === 0) return;
        
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        this.makeMove(randomIndex);
    }
    
    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.tictactoe.board[a] && 
                   this.tictactoe.board[a] === this.tictactoe.board[b] && 
                   this.tictactoe.board[a] === this.tictactoe.board[c];
        });
    }
    
    // Pong Game
    renderPong() {
        return `
            <div class="pong-game">
                <div class="pong-header">
                    <h2><i class="fas fa-circle"></i> Pong</h2>
                    <div class="pong-score">
                        <span id="pong-score1">0</span> - <span id="pong-score2">0</span>
                    </div>
                    <button onclick="window.gamesApp.backToMenu()" class="game-back-btn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div class="pong-game-container">
                    <canvas id="pong-canvas" width="800" height="400" class="pong-canvas"></canvas>
                </div>
                
                <div class="pong-controls">
                    <button onclick="window.gamesApp.startPong()" class="pong-btn" id="pong-start">Start Game</button>
                    <button onclick="window.gamesApp.pausePong()" class="pong-btn" id="pong-pause" disabled>Pause</button>
                    <button onclick="window.gamesApp.resetPong()" class="pong-btn">Reset</button>
                </div>
                
                <div class="pong-instructions">
                    <p><strong>Instructions:</strong> Move your mouse to control the left paddle. First to 5 points wins!</p>
                </div>
            </div>
            
            <style>
                .pong-game {
                    text-align: center;
                    padding: 20px;
                }
                
                .pong-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                /* Back button shared styling (match Snake view) */
                .game-back-btn {
                    background: rgba(255,255,255,0.12);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.18);
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                .game-back-btn:hover { transform: translateY(-2px); }
                
                .pong-header h2 {
                    font-size: 1.8em;
                    margin: 0;
                }
                
                .pong-score {
                    font-size: 1.5em;
                    font-weight: bold;
                    background: rgba(255,255,255,0.2);
                    padding: 10px 20px;
                    border-radius: 25px;
                }
                
                .pong-game-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                
                .pong-canvas {
                    border: 3px solid rgba(255,255,255,0.3);
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    max-width: 100%;
                    height: auto;
                }
                
                .pong-controls {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .pong-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.3s;
                }
                
                .pong-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }
                
                .pong-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .pong-instructions {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 10px;
                    max-width: 500px;
                    margin: 0 auto;
                }

                /* Responsive adjustments for Pong Game */
                @media (max-width: 900px) {
                    .pong-canvas {
                        width: 100% !important;
                        max-width: 600px;
                        height: auto !important;
                    }

                    .pong-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .pong-header h2 {
                        font-size: 1.5em;
                    }

                    .pong-score {
                        font-size: 1.3em;
                        padding: 8px 16px;
                    }
                }

                @media (max-width: 600px) {
                    .pong-game-container {
                        padding: 0 10px;
                    }

                    .pong-canvas {
                        max-width: 100% !important;
                    }

                    .pong-btn {
                        padding: 10px 20px;
                        font-size: 14px;
                    }

                    .pong-instructions {
                        font-size: 0.9em;
                    }
                }
            </style>
        `;
    }
    
    initPong() {
        this.pong.canvas = document.getElementById('pong-canvas');
        this.pong.ctx = this.pong.canvas.getContext('2d');
        this.pong.score1Element = document.getElementById('pong-score1');
        this.pong.score2Element = document.getElementById('pong-score2');
        this.pong.startButton = document.getElementById('pong-start');
        this.pong.pauseButton = document.getElementById('pong-pause');
        this.resetPong();
        
        // Mouse movement for paddle
        this.pong.canvas.addEventListener('mousemove', (e) => {
            const rect = this.pong.canvas.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            this.pong.paddle1.y = Math.max(0, Math.min(320, mouseY - 40));
        });
    }
    
    startPong() {
        if (this.pong.gameRunning) return;
        
        this.pong.gameRunning = true;
        this.pong.lastTime = performance.now();
        this.pong.accumulator = 0;
        
        this.pong.startButton.disabled = true;
        this.pong.pauseButton.disabled = false;
        
        this.pongGameLoop(performance.now());
    }
    
    pausePong() {
        this.pong.gameRunning = false;
        this.pong.startButton.disabled = false;
        this.pong.pauseButton.disabled = true;
    }
    
    resetPong() {
        this.pong.ball = { x: 400, y: 200, dx: 4, dy: 4, radius: 8 };
        this.pong.paddle1 = { x: 10, y: 150, width: 10, height: 80, dy: 0 };
        this.pong.paddle2 = { x: 780, y: 150, width: 10, height: 80, dy: 0 };
        this.pong.score1 = 0;
        this.pong.score2 = 0;
        this.pong.gameRunning = false;
        this.pong.lastTime = 0;
        this.pong.accumulator = 0;
        
        this.pong.score1Element.textContent = '0';
        this.pong.score2Element.textContent = '0';
        this.pong.startButton.disabled = false;
        this.pong.pauseButton.disabled = true;
        
        // clear any existing trail
        this.pong.trail = [];
        this.drawPong();
    }
    
    pongGameLoop(currentTime = 0) {
        if (!this.pong.gameRunning) return;
        
        const deltaTime = currentTime - this.pong.lastTime;
        this.pong.lastTime = currentTime;
        
        // Accumulate time for game updates
        this.pong.accumulator += deltaTime;
        
        // Update game at fixed intervals (~60 FPS)
        while (this.pong.accumulator >= this.pong.gameSpeed) {
            this.updatePong();
            this.pong.accumulator -= this.pong.gameSpeed;
        }
        
        this.drawPong();
        
        requestAnimationFrame((time) => this.pongGameLoop(time));
    }
    
    updatePong() {
        const { ball, paddle1, paddle2 } = this.pong;
        
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Ball collision with top/bottom
        if (ball.y <= 0 || ball.y >= 400) {
            ball.dy = -ball.dy;
        }
        
        // Ball collision with paddles
        if (ball.x <= paddle1.x + paddle1.width && ball.x >= paddle1.x && 
            ball.y >= paddle1.y && ball.y <= paddle1.y + paddle1.height) {
            ball.dx = -ball.dx;
            ball.x = paddle1.x + paddle1.width;
        }
        
        if (ball.x >= paddle2.x && ball.x <= paddle2.x + paddle2.width && 
            ball.y >= paddle2.y && ball.y <= paddle2.y + paddle2.height) {
            ball.dx = -ball.dx;
            ball.x = paddle2.x;
        }
        
        // Score
        if (ball.x < 0) {
            this.pong.score2++;
            this.pong.score2Element.textContent = this.pong.score2;
            this.resetBall();
        }
        
        if (ball.x > 800) {
            this.pong.score1++;
            this.pong.score1Element.textContent = this.pong.score1;
            this.resetBall();
        }
        
        // AI for paddle2 - optimized calculation
        const paddleCenter = paddle2.y + paddle2.height / 2;
        const ballCenter = ball.y;
        const diff = ballCenter - paddleCenter;
        
        if (Math.abs(diff) > 10) {
            const moveSpeed = Math.min(3, Math.abs(diff) * 0.1); // Adaptive speed
            paddle2.y += Math.sign(diff) * moveSpeed;
            paddle2.y = Math.max(0, Math.min(320, paddle2.y));
        }
        
        // Check win condition
        if (this.pong.score1 >= 5 || this.pong.score2 >= 5) {
            this.pong.gameRunning = false;
            const winner = this.pong.score1 >= 5 ? 'Player' : 'Computer';
            alert(`${winner} wins!`);
            this.resetPong();
        }
    }
    
    resetBall() {
        this.pong.ball = { x: 400, y: 200, dx: Math.random() > 0.5 ? 4 : -4, dy: (Math.random() - 0.5) * 8, radius: 8 };
    }
    
    drawPong() {
        const ctx = this.pong.ctx;
        ctx.clearRect(0, 0, 800, 400);
        
        // Draw center line
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(400, 0);
        ctx.lineTo(400, 400);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.pong.paddle1.x, this.pong.paddle1.y, this.pong.paddle1.width, this.pong.paddle1.height);
        ctx.fillRect(this.pong.paddle2.x, this.pong.paddle2.y, this.pong.paddle2.width, this.pong.paddle2.height);
        
        // Draw ball
        // push trail and render fading trail
        this.pong.trail.push({ x: this.pong.ball.x, y: this.pong.ball.y, life: 12 });
        for (let i = this.pong.trail.length - 1; i >= 0; i--) {
            const t = this.pong.trail[i];
            ctx.globalAlpha = Math.max(0, t.life / 12) * 0.7;
            ctx.fillStyle = '#FFCDD2';
            ctx.beginPath();
            ctx.arc(t.x, t.y, Math.max(2, this.pong.ball.radius - (12 - t.life) * 0.4), 0, Math.PI * 2);
            ctx.fill();
            t.life -= 1;
            if (t.life <= 0) this.pong.trail.splice(i, 1);
        }
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(this.pong.ball.x, this.pong.ball.y, this.pong.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#F44336';
        ctx.fill();
    }
    
    renderMemoryGame() {
        const difficulties = [
            { id: 'easy', name: 'Easy', size: '4x4', pairs: 8, time: 120 },
            { id: 'medium', name: 'Medium', size: '6x6', pairs: 18, time: 180 },
            { id: 'hard', name: 'Hard', size: '8x8', pairs: 32, time: 300 }
        ];

        const themes = [
            { id: 'emojis', name: 'Emojis', icon: '😊' },
            { id: 'numbers', name: 'Numbers', icon: '🔢' },
            { id: 'colors', name: 'Colors', icon: '🎨' },
            { id: 'shapes', name: 'Shapes', icon: '🔷' }
        ];

        return `
            <div class="memory-game">
                <div class="memory-header">
                    <h2><i class="fas fa-brain"></i> Memory Game</h2>
                    <div class="memory-stats">
                        <span>Time: <span id="memory-timer">02:00</span></span>
                        <span>Moves: <span id="memory-moves">0</span></span>
                        <span>Score: <span id="memory-score">0</span></span>
                    </div>
                    <button onclick="window.gamesApp.backToMenu()" class="game-back-btn">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>

                <div class="memory-settings">
                    <div class="setting-group">
                        <label>Difficulty:</label>
                        <div class="difficulty-buttons">
                            ${difficulties.map(diff => `
                                <button onclick="window.gamesApp.setMemoryDifficulty('${diff.id}')"
                                        class="difficulty-btn ${this.memory.difficulty === diff.id ? 'active' : ''}"
                                        data-difficulty="${diff.id}">
                                    ${diff.name} (${diff.size})
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="setting-group">
                        <label>Theme:</label>
                        <div class="theme-buttons">
                            ${themes.map(theme => `
                                <button onclick="window.gamesApp.setMemoryTheme('${theme.id}')"
                                        class="theme-btn ${this.memory.theme === theme.id ? 'active' : ''}"
                                        data-theme="${theme.id}">
                                    ${theme.icon} ${theme.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="memory-container">
                    <div class="memory-board" id="memory-board">
                        ${this.createMemoryCards()}
                    </div>
                </div>

                <div class="memory-controls">
                    <button onclick="window.gamesApp.startMemoryGame()" class="memory-btn start-btn" id="memory-start">
                        <i class="fas fa-play"></i> Start Game
                    </button>
                    <button onclick="window.gamesApp.pauseMemoryGame()" class="memory-btn pause-btn" id="memory-pause" disabled>
                        <i class="fas fa-pause"></i> Pause
                    </button>
                    <button onclick="window.gamesApp.resetMemoryGame()" class="memory-btn reset-btn">
                        <i class="fas fa-redo"></i> New Game
                    </button>
                </div>

                <div class="memory-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="memory-progress-fill" style="width: 0%"></div>
                    </div>
                    <span>Matches: <span id="memory-matches">0</span>/<span id="memory-total-matches">${this.memory.gridSize * this.memory.gridSize / 2}</span></span>
                </div>

                <div class="memory-best-scores">
                    <h3>Best Scores</h3>
                    <div class="best-scores-list" id="best-scores-list">
                        ${this.renderBestScores()}
                    </div>
                </div>

                <div class="memory-instructions">
                    <p><strong>How to Play:</strong> Click cards to flip them and find matching pairs. Complete all pairs before time runs out!</p>
                    <p><strong>Scoring:</strong> Higher scores for fewer moves and faster completion. Bonus points for time remaining!</p>
                </div>
            </div>

            <style>
                .memory-game {
                    text-align: center;
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .memory-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .memory-header h2 {
                    font-size: 1.8em;
                    margin: 0;
                }

                .memory-stats {
                    display: flex;
                    gap: 20px;
                    font-size: 1.1em;
                    font-weight: bold;
                    background: rgba(255,255,255,0.2);
                    padding: 10px 20px;
                    border-radius: 25px;
                    flex-wrap: wrap;
                }

                .memory-settings {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                }

                .setting-group {
                    margin-bottom: 15px;
                }

                .setting-group label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: white;
                }

                .difficulty-buttons, .theme-buttons {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .difficulty-btn, .theme-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s;
                }

                .difficulty-btn:hover, .theme-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }

                .difficulty-btn.active, .theme-btn.active {
                    background: rgba(100, 200, 100, 0.8);
                    border-color: #4CAF50;
                }

                .memory-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .memory-board {
                    display: grid;
                    grid-template-columns: repeat(${this.memory.gridSize}, 60px);
                    grid-template-rows: repeat(${this.memory.gridSize}, 60px);
                    gap: 8px;
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    perspective: 1000px;
                }

                .memory-card {
                    background: linear-gradient(145deg, rgba(40,40,40,0.9), rgba(30,30,30,0.85));
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5em;
                    cursor: pointer;
                    transition: all 0.6s;
                    transform-style: preserve-3d;
                    position: relative;
                    box-shadow: inset 0 2px 6px rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.45);
                    border: 1px solid rgba(255,255,255,0.04);
                    min-height: 50px;
                    color: #fff;
                }

                .memory-card .card-front, .memory-card .card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backface-visibility: hidden;
                    border-radius: 6px;
                }

                .memory-card .card-front {
                    background: linear-gradient(145deg, rgba(60, 140, 240, 0.95), rgba(21, 101, 192, 0.9));
                    color: #fff;
                    font-size: 1.8em;
                    font-weight: bold;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
                }

                .memory-card .card-back {
                    background: linear-gradient(145deg, rgba(250,250,250,0.06), rgba(250,250,250,0.04));
                    color: #eaeaea;
                    transform: rotateY(180deg);
                    font-size: 1.4em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .memory-card.flipped .card-front {
                    transform: rotateY(180deg);
                }

                .memory-card.flipped .card-back {
                    transform: rotateY(360deg);
                }

                .memory-card:hover {
                    transform: scale(1.05) rotateY(5deg);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                }

                .memory-card.flipped {
                    transform: rotateY(180deg);
                }

                .memory-card.matched {
                    cursor: default;
                    animation: matchPulse 0.6s ease-out;
                    border-color: #2E7D32;
                }

                .memory-card.matched .card-front {
                    background: linear-gradient(145deg, rgba(46, 125, 50, 0.9), rgba(27, 94, 32, 0.8));
                }

                .memory-card.matched .card-back {
                    background: linear-gradient(145deg, rgba(76, 175, 80, 0.9), rgba(56, 142, 60, 0.8));
                }

                .memory-card.wrong {
                    animation: wrongShake 0.6s ease-out;
                }

                .memory-card.wrong .card-front {
                    background: linear-gradient(145deg, rgba(244, 67, 54, 0.9), rgba(211, 47, 47, 0.8));
                }                @keyframes matchPulse {
                    0% { transform: rotateY(180deg) scale(1); }
                    50% { transform: rotateY(180deg) scale(1.1); }
                    100% { transform: rotateY(180deg) scale(1); }
                }

                @keyframes wrongShake {
                    0%, 100% { transform: rotateY(180deg) translateX(0); }
                    25% { transform: rotateY(180deg) translateX(-5px); }
                    75% { transform: rotateY(180deg) translateX(5px); }
                }

                .memory-controls {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .memory-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .memory-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }

                .memory-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .start-btn {
                    background: rgba(76, 175, 80, 0.8);
                    border-color: #4CAF50;
                }

                .pause-btn {
                    background: rgba(255, 152, 0, 0.8);
                    border-color: #FF9800;
                }

                .reset-btn {
                    background: rgba(244, 67, 54, 0.8);
                    border-color: #F44336;
                }

                .memory-progress {
                    margin-bottom: 20px;
                }

                .progress-bar {
                    width: 100%;
                    height: 20px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #66BB6A);
                    transition: width 0.3s ease;
                    border-radius: 10px;
                }

                .memory-best-scores {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                }

                .memory-best-scores h3 {
                    margin-top: 0;
                    color: white;
                    font-size: 1.2em;
                }

                .best-scores-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }

                .best-score-item {
                    background: rgba(255,255,255,0.1);
                    padding: 10px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .score-difficulty, .score-theme {
                    font-weight: bold;
                    text-transform: capitalize;
                }

                .score-value {
                    color: #FFD700;
                    font-weight: bold;
                }

                .no-scores {
                    text-align: center;
                    color: rgba(255,255,255,0.7);
                    font-style: italic;
                    grid-column: 1 / -1;
                }

                .memory-instructions {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 10px;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .memory-instructions p {
                    margin: 5px 0;
                    font-size: 0.9em;
                    opacity: 0.9;
                }

                .game-back-btn {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: bold;
                }

                /* Timer warning animation */
                .timer-warning #memory-timer {
                    color: #FF9800;
                    animation: timerWarning 1s infinite alternate;
                }

                .timer-critical #memory-timer {
                    color: #F44336;
                    animation: timerCritical 0.5s infinite alternate;
                }

                @keyframes timerWarning {
                    from { opacity: 1; }
                    to { opacity: 0.5; }
                }

                @keyframes timerCritical {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }

                /* Responsive adjustments for Memory Game */
                @media (max-width: 800px) {
                    .memory-board {
                        grid-template-columns: repeat(${this.memory.gridSize}, 50px);
                        grid-template-rows: repeat(${this.memory.gridSize}, 50px);
                        gap: 6px;
                        padding: 15px;
                    }

                    .memory-card {
                        font-size: 1.2em;
                    }

                    .memory-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .memory-stats {
                        flex-direction: column;
                        gap: 8px;
                        font-size: 1em;
                        padding: 8px 16px;
                    }
                }

                @media (max-width: 600px) {
                    .memory-game {
                        padding: 10px;
                    }

                    .memory-header h2 {
                        font-size: 1.4em;
                    }

                    .memory-board {
                        grid-template-columns: repeat(${this.memory.gridSize}, 45px);
                        grid-template-rows: repeat(${this.memory.gridSize}, 45px);
                        gap: 5px;
                        padding: 10px;
                    }

                    .memory-card {
                        font-size: 1em;
                        min-height: 40px;
                    }

                    .memory-card .card-front {
                        font-size: 1.4em;
                    }

                    .memory-card .card-back {
                        font-size: 1.1em;
                    }

                    .memory-btn {
                        padding: 10px 16px;
                        font-size: 14px;
                    }

                    .difficulty-btn, .theme-btn {
                        padding: 6px 12px;
                        font-size: 13px;
                    }

                    .memory-settings {
                        padding: 15px;
                    }

                    .memory-instructions {
                        font-size: 0.85em;
                    }
                }

                @media (max-width: 450px) {
                    .memory-board {
                        grid-template-columns: repeat(${this.memory.gridSize}, 40px);
                        grid-template-rows: repeat(${this.memory.gridSize}, 40px);
                        gap: 4px;
                        padding: 8px;
                    }

                    .memory-card {
                        font-size: 0.9em;
                        min-height: 35px;
                    }

                    .memory-card .card-front {
                        font-size: 1.2em;
                    }

                    .memory-card .card-back {
                        font-size: 1em;
                    }
                }
            </style>
        `;
    }
    
    createMemoryCards() {
        const totalCards = this.memory.gridSize * this.memory.gridSize;
        const pairsNeeded = totalCards / 2;
        const symbols = this.memory.cardSymbols[this.memory.theme].slice(0, pairsNeeded);
        const cards = [...symbols, ...symbols]; // Duplicate for pairs

        // Shuffle cards
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        this.memory.cards = cards;

        return cards.map((symbol, index) => `
            <div class="memory-card" onclick="window.gamesApp.flipMemoryCard(${index})" data-index="${index}">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `).join('');
    }
    
    initMemoryGame() {
        this.resetMemoryGame();
        this.updateMemoryUI();
    }

    resetMemoryGame() {
        this.memory.flippedCards = [];
        this.memory.matchedCards = [];
        this.memory.moves = 0;
        this.memory.gameComplete = false;
        this.memory.score = 0;
        this.memory.timeLeft = this.memory.timeLimit;

        // Clear timer
        if (this.memory.timer) {
            clearInterval(this.memory.timer);
            this.memory.timer = null;
        }

        this.updateMemoryUI();

        const board = document.getElementById('memory-board');
        if (board) {
            board.innerHTML = this.createMemoryCards();
        }
    }

    updateMemoryUI() {
        const timerElement = document.getElementById('memory-timer');
        const movesElement = document.getElementById('memory-moves');
        const scoreElement = document.getElementById('memory-score');
        const matchesElement = document.getElementById('memory-matches');
        const totalMatchesElement = document.getElementById('memory-total-matches');
        const progressFill = document.getElementById('memory-progress-fill');

        if (timerElement) {
            const minutes = Math.floor(this.memory.timeLeft / 60);
            const seconds = this.memory.timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Add warning classes for low time
            const gameElement = document.querySelector('.memory-game');
            gameElement.classList.remove('timer-warning', 'timer-critical');
            if (this.memory.timeLeft <= 30) {
                gameElement.classList.add('timer-critical');
            } else if (this.memory.timeLeft <= 60) {
                gameElement.classList.add('timer-warning');
            }
        }

        if (movesElement) movesElement.textContent = this.memory.moves;
        if (scoreElement) scoreElement.textContent = this.memory.score;
        if (matchesElement) matchesElement.textContent = this.memory.matchedCards.length / 2;
        if (totalMatchesElement) totalMatchesElement.textContent = this.memory.gridSize * this.memory.gridSize / 2;

        if (progressFill) {
            const progress = (this.memory.matchedCards.length / 2) / (this.memory.gridSize * this.memory.gridSize / 2) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    setMemoryDifficulty(difficulty) {
        const difficulties = {
            easy: { gridSize: 4, timeLimit: 120 },
            medium: { gridSize: 6, timeLimit: 180 },
            hard: { gridSize: 8, timeLimit: 300 }
        };

        if (difficulties[difficulty]) {
            this.memory.difficulty = difficulty;
            this.memory.gridSize = difficulties[difficulty].gridSize;
            this.memory.timeLimit = difficulties[difficulty].timeLimit;
            this.memory.timeLeft = difficulties[difficulty].timeLimit;

            // Update active button
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');

            this.resetMemoryGame();
        }
    }

    setMemoryTheme(theme) {
        if (this.memory.cardSymbols[theme]) {
            this.memory.theme = theme;

            // Update active button
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

            this.resetMemoryGame();
        }
    }

    startMemoryGame() {
        if (this.memory.timer) return; // Already running

        this.memory.timer = setInterval(() => {
            this.memory.timeLeft--;
            this.updateMemoryUI();

            if (this.memory.timeLeft <= 0) {
                this.endMemoryGame(false);
            }
        }, 1000);

        document.getElementById('memory-start').disabled = true;
        document.getElementById('memory-pause').disabled = false;
    }

    pauseMemoryGame() {
        if (this.memory.timer) {
            clearInterval(this.memory.timer);
            this.memory.timer = null;
        }

        document.getElementById('memory-start').disabled = false;
        document.getElementById('memory-pause').disabled = true;
    }

    calculateScore() {
        const baseScore = 1000;
        const timeBonus = this.memory.timeLeft * 10;
        const movePenalty = this.memory.moves * 5;
        const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[this.memory.difficulty];

        return Math.max(0, Math.floor((baseScore + timeBonus - movePenalty) * difficultyMultiplier));
    }

    saveBestScore() {
        const key = `${this.memory.difficulty}_${this.memory.theme}`;
        const currentScore = this.calculateScore();

        if (!this.memory.bestScores[key] || currentScore > this.memory.bestScores[key]) {
            this.memory.bestScores[key] = currentScore;
            localStorage.setItem('memoryBestScores', JSON.stringify(this.memory.bestScores));
            this.updateBestScoresDisplay();
        }
    }

    renderBestScores() {
        const entries = Object.entries(this.memory.bestScores);
        if (entries.length === 0) {
            return '<div class="no-scores">No scores yet!</div>';
        }

        return entries.map(([key, score]) => {
            const [difficulty, theme] = key.split('_');
            return `
                <div class="best-score-item">
                    <span class="score-difficulty">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                    <span class="score-theme">${theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                    <span class="score-value">${score}</span>
                </div>
            `;
        }).join('');
    }

    updateBestScoresDisplay() {
        const bestScoresList = document.getElementById('best-scores-list');
        if (bestScoresList) {
            bestScoresList.innerHTML = this.renderBestScores();
        }
    }
    
    flipMemoryCard(index) {
        if (this.memory.gameComplete || this.memory.flippedCards.length >= 2 || !this.memory.timer) return;

        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        this.memory.flippedCards.push(index);

        if (this.memory.flippedCards.length === 2) {
            this.memory.moves++;
            this.updateMemoryUI();

            setTimeout(() => this.checkMemoryMatch(), 1200);
        }
    }

    checkMemoryMatch() {
        const [index1, index2] = this.memory.flippedCards;
        const card1 = document.querySelector(`.memory-card[data-index="${index1}"]`);
        const card2 = document.querySelector(`.memory-card[data-index="${index2}"]`);

        if (this.memory.cards[index1] === this.memory.cards[index2]) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.memory.matchedCards.push(index1, index2);

            const matches = this.memory.matchedCards.length / 2;
            const totalMatches = this.memory.gridSize * this.memory.gridSize / 2;

            if (matches === totalMatches) {
                this.memory.gameComplete = true;
                this.endMemoryGame(true);
            }
        } else {
            // No match - add wrong animation
            card1.classList.add('wrong');
            card2.classList.add('wrong');

            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong');
                card2.classList.remove('flipped', 'wrong');
            }, 600);
        }

        this.memory.flippedCards = [];
        this.updateMemoryUI();
    }
    
    backToMenu() {
        // Clear memory game timer
        if (this.memory.timer) {
            clearInterval(this.memory.timer);
            this.memory.timer = null;
        }

        this.currentGame = null;
        const content = document.getElementById('games-content');
        if (content) {
            content.innerHTML = this.renderGameMenu();
            // re-attach event handlers after re-render
            this.attachMenuListeners();
            this.adjustMenuBottomSpacing();
        }
    }
}

// Add placeholder styling
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .game-placeholder {
            text-align: center;
            padding: 60px 40px;
            color: white;
        }
        
        .game-placeholder h2 {
            font-size: 2em;
            margin-bottom: 15px;
        }
        
        .game-placeholder p {
            font-size: 1.1em;
            opacity: 0.8;
            margin-bottom: 30px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
`);

// Initialize Games app
window.gamesApp = new GamesApp();