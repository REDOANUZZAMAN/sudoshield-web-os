// Terminal Application
class TerminalApp {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.currentDirectory = '/home/user';
        this.commands = {
            'help': this.helpCommand.bind(this),
            'ls': this.lsCommand.bind(this),
            'cd': this.cdCommand.bind(this),
            'pwd': this.pwdCommand.bind(this),
            'mkdir': this.mkdirCommand.bind(this),
            'touch': this.touchCommand.bind(this),
            'cat': this.catCommand.bind(this),
            'echo': this.echoCommand.bind(this),
            'rm': this.rmCommand.bind(this),
            'clear': this.clearCommand.bind(this),
            'date': this.dateCommand.bind(this),
            'whoami': this.whoamiCommand.bind(this),
            'uname': this.unameCommand.bind(this),
            'ps': this.psCommand.bind(this),
            'neofetch': this.neofetchCommand.bind(this),
            'cowsay': this.cowsayCommand.bind(this)
            ,'shldip': this.shldIpCommand?.bind(this)
            ,'shldq': this.aiCommand?.bind(this)
            ,'screen': this.screenCommand?.bind(this)
        };
    }

    get fileSystem() {
        return window.webOS?.fileSystem;
    }
    
    render() {
        return `
            <div class="terminal-app" id="terminal-app">
                <div class="terminal-header">
                    <div class="terminal-title">
                        <i class="fas fa-terminal"></i>
                        Terminal - ${this.currentDirectory}
                    </div>
                </div>
                <div class="terminal-output" id="terminal-output">
                    <div class="terminal-line">
                        <span class="terminal-system">SudoShield OS Terminal v2.0 - Enhanced Edition</span>
                    </div>
                    <div class="terminal-line">
                        <span class="terminal-system">Type 'help' for available commands</span>
                    </div>
                    <div class="terminal-line"></div>
                </div>
                <div class="terminal-input-line">
                        <span class="terminal-prompt-label" id="terminal-prompt">user@sudoshield:${this.currentDirectory}$</span>
                        <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false">
                    </div>
            </div>
        `;
    }
    
    init(container) {
        this.container = container;
        this.setupEventListeners();
        this.focusInput();
        
        // Subscribe to filesystem changes
        if (this.fileSystem) {
            this.fileSystem.subscribe((event) => {
                if (event.type === 'mkdir' || event.type === 'write' || event.type === 'delete') {
                    this.addOutputLine(`[FS] ${event.type}: ${event.path}`, 'system');
                }
            });
        }
    }
    
    setupEventListeners() {
        const input = document.getElementById('terminal-input');
        const terminal = document.getElementById('terminal-app');
        
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.executeCommand(input.value.trim());
                    input.value = '';
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateHistory(-1);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateHistory(1);
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    this.autoComplete(input.value);
                }
            });
        }
        
        if (terminal) {
            terminal.addEventListener('click', () => {
                this.focusInput();
            });
        }
    }
    
    executeCommand(command) {
        if (!command) return;
        
        this.addToHistory(command);
    this.addOutputLine(`user@sudoshield:${this.currentDirectory}$ ${command}`, 'command');
        
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        try {
            if (this.commands[cmd]) {
                this.commands[cmd](args);
            } else {
                this.addOutputLine(`Shield: ${cmd}: command not found`, 'error');
            }
        } catch (error) {
            this.addOutputLine(`Error: ${error.message}`, 'error');
        }
        
        this.updatePrompt();
        this.focusInput();
        this.scrollToBottom();
    }
    
    addToHistory(command) {
        this.history.push(command);
        this.historyIndex = this.history.length;
    }
    
    navigateHistory(direction) {
        const input = document.getElementById('terminal-input');
        if (!input) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            input.value = '';
            return;
        }
        
        input.value = this.history[this.historyIndex] || '';
    }
    
    autoComplete(partial) {
        const commands = Object.keys(this.commands);
        const matches = commands.filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
            const input = document.getElementById('terminal-input');
            if (input) {
                input.value = matches[0];
            }
        } else if (matches.length > 1) {
            this.addOutputLine(matches.join('  '), 'info');
        }
    }
    
    // addOutputLine: can render plain text or pre-rendered HTML (isHtml)
    addOutputLine(text, type = 'normal', isHtml = false) {
        const output = document.getElementById('terminal-output');
        if (!output) return;

        const appendLine = (content, idxIsHtml = false) => {
            const line = document.createElement('div');
            line.className = `terminal-line terminal-${type}`;
            if (idxIsHtml) {
                // Insert as HTML but keep it sandboxed inside the terminal line
                line.innerHTML = content;
            } else {
                line.textContent = content;
            }
            output.appendChild(line);
        };

        if (typeof text === 'string' && text.includes('\n') && !isHtml) {
            const lines = text.split('\n');
            lines.forEach(lineText => appendLine(lineText, false));
        } else {
            appendLine(text, isHtml);
        }

        // Auto-scroll when new content is added
        this.scrollToBottom();
    }

    // Ensure marked.js is available at runtime. Returns a promise that resolves
    // when window.marked is ready or rejects on failure/timeout.
    ensureMarked(timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            if (window.marked) return resolve(window.marked);

            // If document isn't available (non-browser environment), fail fast
            if (typeof document === 'undefined') return reject(new Error('document not available'));

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.async = true;
            let called = false;

            const cleanup = () => {
                script.onerror = null;
                script.onload = null;
                clearTimeout(timer);
            };

            script.onload = () => {
                cleanup();
                called = true;
                if (window.marked) resolve(window.marked);
                else reject(new Error('marked loaded but not available'));
            };

            script.onerror = (e) => {
                cleanup();
                if (!called) reject(new Error('Failed to load marked.js'));
            };

            const timer = setTimeout(() => {
                if (!called) {
                    cleanup();
                    reject(new Error('marked load timeout'));
                }
            }, timeoutMs);

            document.head.appendChild(script);
        });
    }
    
    updatePrompt() {
        const input = document.getElementById('terminal-input');
        const prompt = document.getElementById('terminal-prompt');
        const promptText = `user@sudoshield:${this.currentDirectory}$`;

        if (prompt) {
            prompt.textContent = promptText;
        }
        // Intentionally do not set input.placeholder here so it doesn't reappear
        // after commands. The static prompt label (above) is the visible prompt.
    }
    
    focusInput() {
        const input = document.getElementById('terminal-input');
        if (input) {
            input.focus();
        }
    }
    
    scrollToBottom() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.scrollTop = output.scrollHeight;
            return;
        }
        const terminal = document.getElementById('terminal-app');
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
    }
    
    resolvePath(path) {
        if (!path) return this.currentDirectory;
        
        if (path.startsWith('/')) {
            return path;
        } else if (path === '..') {
            const parts = this.currentDirectory.split('/').filter(p => p);
            parts.pop();
            return parts.length ? '/' + parts.join('/') : '/';
        } else if (path === '.') {
            return this.currentDirectory;
        } else {
            return this.currentDirectory === '/' ? '/' + path : this.currentDirectory + '/' + path;
        }
    }
    
    // Commands using shared filesystem
    helpCommand() {
        const helpText = [
            '🚀 SudoShield OS Terminal Commands:',
            '',
            '📁 File System:',
            '  ls [path]     - List directory contents',
            '  cd [dir]      - Change directory',
            '  pwd           - Print working directory',
            '  mkdir <dir>   - Create directory',
            '  touch <file>  - Create file',
            '  cat <file>    - Display file contents',
            '  rm <path>     - Remove file or directory',
            '  shldip        - Show your public (and local when possible) IP address ',
            '',
            '💻 System:',
            '  help          - Show this help message',
            '  clear         - Clear terminal screen',
            '  date          - Show current date/time',
            '  whoami        - Show current user',
            '  uname         - Show system information',
            '  ps            - Show running processes',
            '  neofetch      - System info with ASCII art',
            '',
            '🎉 Fun:',
            '  echo <text>   - Display message',
            '  cowsay <text> - Make a cow say something',
            '  shldq <query>    - Query Sudoshield AI',
            '',
            '💡 Tips: Use Tab for autocompletion, ↑↓ for history'
        ];
        
        helpText.forEach(line => this.addOutputLine(line, 'info'));
    }

    async shldIpCommand(args = []) {
        // Show a quick informational line
        this.addOutputLine('🔎 Detecting IP addresses...', 'info');

        // If user explicitly requests server-side lookup, prefer that
        const useServer = args && args.includes('--server');

        // Helper: fetch with timeout
        const fetchWithTimeout = (url, ms = 3000) => {
            return new Promise(async (resolve, reject) => {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), ms);
                try {
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(id);
                    resolve(res);
                } catch (err) {
                    clearTimeout(id);
                    reject(err);
                }
            });
        };

        // Server-side webhook fallback (example uses existing n8n webhook from this project)
        const serverWebhook = window.webOS?.n8nPublicIpWebhook || 'https://n8n.bytevia.tech/webhook/cf756a74-e94d-45ca-8977-2a3f7c520636';

        // If server option requested, try webhook first
        if (useServer) {
            try {
                this.addOutputLine('➡️ Using server-side webhook fallback...', 'info');
                const res = await fetchWithTimeout(serverWebhook, 5000);
                if (res.ok) {
                    const text = await res.text();
                    // Try to extract IP-like substring
                    const m = text.match(/((?:\d{1,3}\.){3}\d{1,3})/);
                    if (m) {
                        this.addOutputLine(`🌐 Public IP (server): ${m[0]}`, 'success');
                    } else {
                        this.addOutputLine(`Server webhook responded but no IP found: ${text}`, 'warning');
                    }
                    return;
                } else {
                    this.addOutputLine(`Server webhook responded ${res.status}`, 'warning');
                }
            } catch (err) {
                this.addOutputLine(`Server webhook failed: ${err.message}`, 'warning');
            }
        }

        // Try multiple public IP providers (some may be blocked by regional restrictions or CORS)
        const services = [
            { name: 'api.ipify.org', url: 'https://api.ipify.org?format=json' },
            { name: 'ipinfo.io', url: 'https://ipinfo.io/json' },
            { name: 'ifconfig.co', url: 'https://ifconfig.co/json' },
            { name: 'ident.me', url: 'https://v4.ident.me/.json' },
            { name: 'icanhazip', url: 'https://icanhazip.com/' }
        ];

        let publicFound = false;
        for (const svc of services) {
            try {
                const res = await fetchWithTimeout(svc.url, 3500);
                if (!res.ok) {
                    this.addOutputLine(`${svc.name}: HTTP ${res.status}`, 'warning');
                    continue;
                }

                // Some endpoints return plain text, some JSON
                const text = await res.text();
                // Try to parse JSON first
                let ip = null;
                try {
                    const j = JSON.parse(text);
                    if (j.ip) ip = j.ip;
                    else if (j.query) ip = j.query;
                    else if (j.address) ip = j.address;
                    else if (j.client && j.client.ip) ip = j.client.ip;
                } catch (e) {
                    // not JSON - fallthrough
                }

                if (!ip) {
                    // extract IPv4 from text
                    const m = text.match(/((?:\d{1,3}\.){3}\d{1,3})/);
                    if (m) ip = m[0];
                }

                if (ip) {
                    this.addOutputLine(`🌐 Public IP (${svc.name}): ${ip}`, 'success');
                    publicFound = true;
                    break;
                } else {
                    this.addOutputLine(`${svc.name}: response did not contain IP`, 'warning');
                }
            } catch (err) {
                // Distinguish CORS/network errors vs others
                const msg = (err && err.name === 'AbortError') ? 'timed out' : err.message || String(err);
                this.addOutputLine(`${svc.name}: lookup failed (${msg})`, 'warning');
            }
        }

        if (!publicFound) {
            this.addOutputLine('❗ Public IP lookup failed via public services. This is commonly caused by regional blocking (e.g., Great Firewall of China) or CORS restrictions.', 'error');
            this.addOutputLine("Options:\n  - Run 'shldip --server' to query an n8n webhook (server-side) you control.\n  - Create an n8n webhook that returns the requester's IP and set window.webOS.n8nPublicIpWebhook to it.\n  - On your machine, run 'ipconfig' (Windows) or 'ifconfig' / 'ip addr' (Linux) to see local network IPs.", 'info');
        }

        // Local IP discovery via WebRTC (best-effort)
        try {
            const ips = await new Promise((resolve) => {
                const ipSet = new Set();
                const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
                if (!RTCPeerConnection) return resolve([]);

                const pc = new RTCPeerConnection({iceServers: []});
                pc.createDataChannel('');

                pc.onicecandidate = (evt) => {
                    if (!evt || !evt.candidate) return;
                    const parts = evt.candidate.candidate.split(' ');
                    const addr = parts[4];
                    if (addr && !addr.includes(':')) ipSet.add(addr);
                };

                pc.createOffer().then((sdp) => pc.setLocalDescription(sdp)).catch(() => {});

                setTimeout(() => {
                    pc.close();
                    resolve(Array.from(ipSet));
                }, 900);
            });

            if (ips && ips.length > 0) {
                ips.forEach(ip => this.addOutputLine(`🖧 Local IP: ${ip}`, 'info'));
            } else {
                this.addOutputLine('No local IPs discovered (WebRTC blocked or not available)', 'info');
            }
        } catch (err) {
            this.addOutputLine(`Local IP discovery failed: ${err.message}`, 'warning');
        }
    }

    screenCommand() {
        const promptText = `user@sudoshield:${this.currentDirectory}$ `;
        this.addOutputLine(promptText, 'command');
    }
    
    lsCommand(args) {
        if (!this.fileSystem) {
            this.addOutputLine('Filesystem not available', 'error');
            return;
        }

        const path = args[0] ? this.resolvePath(args[0]) : this.currentDirectory;
        
        try {
            const items = this.fileSystem.list(path);
            if (items.length === 0) {
                return;
            }
            
            // Format items with colors and icons
            const formatted = items.map(item => {
                const icon = item.type === 'directory' ? '📁' : '📄';
                const name = item.type === 'directory' ? `${item.name}/` : item.name;
                return `${icon} ${name}`;
            });
            
            this.addOutputLine(formatted.join('  '), 'info');
        } catch (error) {
            this.addOutputLine(`ls: ${error.message}`, 'error');
        }
    }
    
    cdCommand(args) {
        if (!this.fileSystem) {
            this.addOutputLine('Filesystem not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.currentDirectory = '/home/user';
            return;
        }
        
        const path = this.resolvePath(args[0]);
        
        try {
            if (!this.fileSystem.exists(path)) {
                this.addOutputLine(`cd: ${path}: No such file or directory`, 'error');
                return;
            }
            
            const stat = this.fileSystem.stat(path);
            if (stat.type !== 'directory') {
                this.addOutputLine(`cd: ${path}: Not a directory`, 'error');
                return;
            }
            
            this.currentDirectory = path;
            this.addOutputLine(`📁 Changed to ${path}`, 'success');
        } catch (error) {
            this.addOutputLine(`cd: ${error.message}`, 'error');
        }
    }
    
    pwdCommand() {
        this.addOutputLine(this.currentDirectory, 'info');
    }
    
    mkdirCommand(args) {
        if (!this.fileSystem) {
            this.addOutputLine('Filesystem not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutputLine('mkdir: missing operand', 'error');
            return;
        }
        
        const path = this.resolvePath(args[0]);
        
        try {
            this.fileSystem.makeDirectory(path);
            this.addOutputLine(`✅ Directory created: ${path}`, 'success');
        } catch (error) {
            this.addOutputLine(`mkdir: ${error.message}`, 'error');
        }
    }
    
    touchCommand(args) {
        if (!this.fileSystem) {
            this.addOutputLine('Filesystem not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutputLine('touch: missing file operand', 'error');
            return;
        }
        
        const path = this.resolvePath(args[0]);
        
        try {
            if (!this.fileSystem.exists(path)) {
                this.fileSystem.writeFile(path, '');
                this.addOutputLine(`✅ File created: ${path}`, 'success');
            } else {
                this.addOutputLine(`File already exists: ${path}`, 'info');
            }
        } catch (error) {
            this.addOutputLine(`touch: ${error.message}`, 'error');
        }
    }
    
    catCommand(args) {
        if (!this.fileSystem) {
            this.addOutputLine('Filesystem not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutputLine('cat: missing file operand', 'error');
            return;
        }
        
        const path = this.resolvePath(args[0]);
        
        try {
            const content = this.fileSystem.readFile(path);
            if (content) {
                const lines = content.split('\n');
                lines.forEach(line => this.addOutputLine(line, 'normal'));
            }
        } catch (error) {
            this.addOutputLine(`cat: ${error.message}`, 'error');
        }
    }

    rmCommand(args) {
        if (!this.fileSystem) {
            this.addOutputLine('Filesystem not available', 'error');
            return;
        }

        if (args.length === 0) {
            this.addOutputLine('rm: missing operand', 'error');
            return;
        }
        
        const path = this.resolvePath(args[0]);
        
        try {
            this.fileSystem.remove(path);
            this.addOutputLine(`✅ Removed: ${path}`, 'success');
        } catch (error) {
            this.addOutputLine(`rm: ${error.message}`, 'error');
        }
    }
    
    echoCommand(args) {
        this.addOutputLine(args.join(' '), 'normal');
    }
    
    clearCommand() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
    }
    
    dateCommand() {
        const now = new Date();
        this.addOutputLine(`🕐 ${now.toLocaleString()}`, 'info');
    }
    
    whoamiCommand() {
        this.addOutputLine('👤 user', 'info');
    }
    
    unameCommand() {
    this.addOutputLine('🛡️ SudoShield OS 2.0 (Enhanced Edition)', 'info');
    }
    
    psCommand() {
        const processes = [
            'PID  TTY          TIME CMD',
            '1    pts/0    00:00:01 init',
            '123  pts/0    00:00:00 desktop',
            '456  pts/0    00:00:00 window-manager',
            '789  pts/0    00:00:00 terminal',
            '999  pts/0    00:00:00 file-manager'
        ];
        
        processes.forEach((line, index) => {
            this.addOutputLine(line, index === 0 ? 'info' : 'normal');
        });
    }
    
    neofetchCommand() {
        const uptime = Math.floor((Date.now() - (window.webOS?.bootTime || Date.now())) / 60000);
        const ascii = [
            '        🌟✨🌟          user@sudoshield',
            '       ✨🌟✨🌟         -----------',
            '       🌟✨O✨O🌟       OS: SudoShield OS 1.0',
            '       ✨🌟✨🌟✨       Host: Browser Engine',
            '     🌟✨🌟✨🌟✨🌟     Kernel: JavaScript v8',
            '    ✨🌟✨🌟✨🌟✨🌟    Uptime: ' + uptime + ' minutes',
            '   🌟✨🌟✨🌟✨🌟✨🌟   Packages: 42 (npm)',
            '   ✨🌟✨🌟✨🌟✨🌟✨   Shell: shield-shell',
            '  🌟✨🌟✨🌟✨🌟✨🌟✨  Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
            ' ✨🌟✨🌟✨🌟✨🌟✨🌟✨ DE: SudoShield Desktop',
            '🌟✨🌟✨🌟✨🌟✨🌟✨🌟 WM: SudoShield Window Manager',
            '✨🌟✨🌟✨🌟✨🌟✨🌟✨  Theme: ' + (window.webOS?.theme?.title || 'SudoShield OS'),
            '🌟✨🌟✨🌟✨🌟✨🌟✨🌟 Icons: FontAwesome + Emoji',
            '✨🌟✨🌟✨🌟✨🌟✨🌟✨  Terminal: SudoShieldTerminal',
            ' 🌟✨🌟✨🌟✨🌟✨🌟✨  CPU: ' + (navigator.hardwareConcurrency || 4) + ' cores',
            '  ✨🌟✨🌟✨🌟✨🌟✨   Memory: ' + (navigator.deviceMemory || '?') + 'GB',
            '   🌟✨🌟✨🌟✨🌟✨',
            '   ✨🌟✨🌟✨🌟✨',
            '    🌟✨🌟✨🌟✨',
            '     ✨🌟✨🌟✨',
            '       🌟✨🌟',
            '        ✨🌟'
        ];
        
        ascii.forEach(line => this.addOutputLine(line, 'success'));
    }
    
    cowsayCommand(args) {
    const message = args.length > 0 ? args.join(' ') : 'Welcome to SudoShield OS! 🛡️';
        const messageLength = message.length;
        
        const cow = [
            ' ' + '_'.repeat(messageLength + 2),
            '< ' + message + ' >',
            ' ' + '-'.repeat(messageLength + 2),
            '        \\   ^__^',
            '         \\  (oo)\\_______',
            '            (__)\\       )\\/\\',
            '                ||----w |',
            '                ||     ||'
        ];
        
        cow.forEach(line => this.addOutputLine(line, 'info'));
    }

    async aiCommand(args) {
        const query = args.join(' ').trim();
        if (!query) {
            this.addOutputLine('Sudoshield AI: missing query', 'error');
            return;
        }
        const webhookUrl = window.webOS?.aiWebhook || 'https://n8n.bytevia.tech/webhook/cf756a74-e94d-45ca-8977-2a3f7c520636';
        this.addOutputLine(`⏳ Sending query to Sudoshield AI: ${query}`, 'info');

        try {
            const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (!res.ok) {
                this.addOutputLine(`Sudoshield AI: responded with status ${res.status}`, 'error');
                return;
            }

            // Attempt to parse text response first, fall back to JSON
            let text;
            try {
                text = await res.text();
            } catch (err) {
                this.addOutputLine(`Sudoshield AI: failed to read response: ${err.message}`, 'error');
                return;
            }

            // If response looks like JSON, try to extract a useful message
            let output = text;
            try {
                const parsed = JSON.parse(text);
                // If payload has 'text' or 'message' fields, prefer them
                if (typeof parsed === 'string') {
                    output = parsed;
                } else if (parsed && typeof parsed === 'object') {
                    if (parsed.text) output = parsed.text;
                    else if (parsed.message) output = parsed.message;
                    else if (parsed.response) output = parsed.response;
                    else output = JSON.stringify(parsed, null, 2);
                }
            } catch (e) {
                // not JSON, keep text
            }

            // Try to render as markdown. If marked is not loaded, attempt to load it.
            try {
                const markedLib = await this.ensureMarked().catch(() => null);
                if (markedLib) {
                    const html = markedLib.parse(output);
                    // Render as HTML inside terminal
                    this.addOutputLine(html, 'normal', true);
                } else {
                    // Fallback: show raw markdown/plain text
                    this.addOutputLine(output, 'normal');
                }
            } catch (err) {
                // If markdown rendering fails for any reason, fallback to plain text
                this.addOutputLine(output, 'normal');
            }
        } catch (error) {
            this.addOutputLine(`Sudoshield AI: network error: ${error.message}`, 'error');
            this.addOutputLine('Suggestions: Check your internet connection, or set window.webOS.aiWebhook to a different endpoint.', 'info');
        } finally {
            this.updatePrompt();
            this.focusInput();
            this.scrollToBottom();
        }
    }
}

// Initialize Terminal app
window.terminalApp = new TerminalApp();

// Ensure there is a global webOS object and set the AI webhook default to the
// user's provided n8n webhook if one isn't already configured. This makes it
// easy to use the terminal AI without extra setup.
try {
    if (typeof window !== 'undefined') {
        window.webOS = window.webOS || {};
        window.webOS.aiWebhook = window.webOS.aiWebhook || 'https://n8n.bytevia.tech/webhook/cf756a74-e94d-45ca-8977-2a3f7c520636';
    }
} catch (e) {
    // ignore in non-browser environments
}