# SudoShield Web OS

A feature-rich browser-based Web OS that delivers a desktop-like experience directly in your browser. Includes a virtual filesystem, window manager, built-in apps, AI integration via n8n webhooks, visual effects, and an extensible terminal. Everything runs client-side with zero external dependencies.

![Status](https://img.shields.io/badge/status-active-success.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-integration-FF6D5A?style=flat&logo=n8n&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **Desktop Environment** - Full window manager with draggable, resizable windows
- **Virtual Filesystem** - Complete file system accessible via terminal and file manager
- **Built-in Apps** - Terminal, Browser, File Manager, Settings, YouTube, Games, and more
- **AI Integration** - n8n webhook support for conversational AI and automation
- **Markdown Support** - Terminal AI responses with client-side HTML rendering via marked.js
- **Extensible Terminal** - 20+ commands with IP discovery, AI queries, and system info
- **Visual Effects** - Particles, matrix rain, Demon Slayer theme, and decorative elements
- **Widgets** - Tanjiro AI widgets for voice and text interfaces
- **Zero Dependencies** - Pure JavaScript, runs entirely client-side
- **DuckDuckGo Integration** - Built-in browser with live search suggestions
- **Web Desktop Launcher** - Home screen with app shortcuts and search

## Use Cases

- Educational demonstrations of web technologies
- Desktop environment prototypes and mockups
- Terminal-based web applications
- AI chatbot interfaces with n8n
- Portfolio projects showcasing full-stack capabilities
- Browser-based tools and utilities
- Learning JavaScript and web development
- Building extensible web applications

## Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Static HTTP server (recommended, but not required)
- No build tools or external dependencies needed

### Installation

```bash
# Clone the repository
git clone https://github.com/REDOANUZZAMAN/sudoshield-web-os.git
cd sudoshield-web-os

# Option 1: Use Python's built-in server (Python 3)
python -m http.server 8000

# Option 2: Use Node's http-server
npx http-server -p 8000

# Option 3: Use a simple Node server
node -e "require('http').createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/html'}); require('fs').createReadStream('index.html').pipe(res); }).listen(8000)"

# Option 4: Open index.html directly in browser
# (Some features may not work due to CORS restrictions)
```

### Usage

1. Open `http://localhost:8000` in your browser
2. The SudoShield Web OS desktop will load
3. Click on app tiles to open applications
4. Use the Terminal app for commands and AI interaction

## Architecture

### Project Structure

```
sudoshield-web-os/
├── index.html                          # Main entry point
├── shieldadmin.html                    # Admin interface
├── preview_demonslayer.html            # Theme preview
│
├── js/
│   ├── desktop.js                      # Desktop initialization
│   ├── windowManager.js                # Window management and rendering
│   ├── apps/
│   │   ├── terminal.js                 # Terminal app with commands
│   │   ├── browser.js                  # Web browser with DuckDuckGo
│   │   ├── fileManager.js              # File system browser
│   │   ├── settings.js                 # System settings
│   │   └── [other-apps].js             # Additional built-in apps
│   └── utils.js                        # Utility functions
│
├── widgets/
│   ├── tanjiroAI.js                    # AI widget interface
│   ├── voiceWidget.js                  # Voice interaction widget
│   └── widgets.js                      # Widget manager
│
├── effects/
│   ├── particles.js                    # Particle effects
│   ├── matrixRain.js                   # Matrix rain effect
│   └── visualEffects.js                # Visual effect manager
│
├── system/
│   ├── fileSystem.js                   # Virtual filesystem
│   ├── authentication.js               # Auth helpers
│   └── stateManager.js                 # State management
│
├── api/
│   └── endpoints.js                    # API definitions
│
├── css/
│   ├── style.css                       # Main styles
│   ├── apps.css                        # App-specific styles
│   └── effects.css                     # Effects styles
│
├── SUDOSHIELD_N8N_WORKFLOW.json        # Sample n8n workflow
├── system_prompt.txt                   # AI system prompt
└── README.md                           # This file
```

### Core Components

**Desktop Manager** (`js/desktop.js`)
- Initializes the Web OS environment
- Manages app lifecycle
- Handles user interactions

**Window Manager** (`js/windowManager.js`)
- Creates, renders, and manages windows
- Handles dragging, resizing, z-index
- Manages minimize/maximize states

**Virtual Filesystem** (`system/fileSystem.js`)
- Implements in-browser filesystem
- Supports files and directories
- Accessible via `window.webOS.fileSystem`

**Terminal** (`js/apps/terminal.js`)
- Command-line interface
- 20+ built-in commands
- AI integration via n8n webhooks

**Browser App** (`js/apps/browser.js`)
- Full-featured web browser
- DuckDuckGo search integration
- Live suggestions and instant results

## Terminal Commands

### File System Commands

```bash
ls [path]              # List directory contents
cd [dir]               # Change directory
pwd                    # Print working directory
mkdir <dir>            # Create directory
touch <file>           # Create file
cat <file>             # Display file contents
rm <path>              # Remove file or directory
```

### System Commands

```bash
clear                  # Clear terminal output
date                   # Show current date/time
whoami                 # Show current user
uname                  # Show system information
ps                     # Show running processes
neofetch               # Show ASCII system info
```

### Utility Commands

```bash
help                   # Show available commands
cowsay <text>          # Display cowsay bubble
shldip                 # Get public/local IP address
shldip --server        # Get IP via server webhook
shldq <query>          # Query SudoAssist AI
```

## AI Integration with n8n

### Configuration

Configure AI webhooks in the browser console:

```javascript
// Set AI webhook
window.webOS.aiWebhook = 'https://your-n8n-instance.com/webhook/sudoshield-ai'

// Set IP discovery webhook (optional)
window.webOS.n8nPublicIpWebhook = 'https://your-n8n-instance.com/webhook/sudoshield-ip'
```

### Terminal AI Command

```bash
shldq "What is the capital of France?"
```

The terminal will:
1. Send your query to the configured n8n webhook
2. Receive and parse the response
3. Render Markdown responses as HTML
4. Display plain text fallback if rendering fails

### Expected Webhook Response

The webhook should return one of:

**JSON Envelope:**
```json
{
  "text": "The capital of France is Paris.",
  "message": "The capital of France is Paris.",
  "response": "The capital of France is Paris."
}
```

**Plain Text:**
```
The capital of France is Paris.
```

**Markdown:**
```markdown
# France

The capital of France is **Paris**, located in the north-central part of the country.
```

### Setup with n8n

1. Import `SUDOSHIELD_N8N_WORKFLOW.json` into your n8n instance
2. Configure with your AI model (GPT, Claude, Ollama, etc.)
3. Copy the webhook URL
4. Configure in browser console as shown above

## Customization

### Add New Apps

1. Create a new file in `js/apps/yourapp.js`:

```javascript
window.webOS.apps.YourApp = {
  name: 'Your App',
  icon: 'icon-url',
  launch: function() {
    const window = window.webOS.createWindow({
      title: 'Your App',
      width: 600,
      height: 400
    });
    
    window.setContent(`
      <div>Your app content here</div>
    `);
    
    return window;
  }
};
```

2. Register in the app launcher
3. Restart the browser

### Add Visual Effects

Edit `effects/visualEffects.js`:

```javascript
window.webOS.effects.addCustomEffect({
  name: 'customEffect',
  init: function() {
    // Initialize effect
  },
  render: function() {
    // Render effect
  },
  destroy: function() {
    // Cleanup
  }
});
```

### Customize System Prompt

Edit `system_prompt.txt` to change AI behavior:

```
You are SudoAssist, a helpful AI assistant...
- Stay concise and professional
- Provide code examples when relevant
- Always cite sources
```

Use this as the system prompt in your n8n AI node.

### Modify Filesystem

Access the virtual filesystem directly:

```javascript
// Create directory
window.webOS.fileSystem.mkdir('/home/user/projects')

// Create file
window.webOS.fileSystem.writeFile('/home/user/projects/readme.txt', 'Hello World')

// Read file
const content = window.webOS.fileSystem.readFile('/home/user/projects/readme.txt')

// List directory
const files = window.webOS.fileSystem.listDirectory('/home/user')
```

## Security Considerations

### HTML Sanitization

AI-generated HTML is rendered in the terminal. Before deploying to production:

1. Install DOMPurify:
```bash
npm install dompurify
# or add via CDN
```

2. Integrate into `js/apps/terminal.js`:
```javascript
import DOMPurify from 'dompurify';

// In HTML rendering section
const cleanHTML = DOMPurify.sanitize(htmlContent);
element.innerHTML = cleanHTML;
```

### API Security

- Never hardcode secrets in the frontend
- Use server-side webhooks for sensitive operations
- Store API keys in environment variables on the server
- Validate all webhook responses
- Implement rate limiting on webhook endpoints
- Use HTTPS for all webhook URLs

### Content Security Policy

Add to HTML `<head>`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               img-src 'self' https:; 
               style-src 'self' 'unsafe-inline'">
```

### Local Library Hosting

For air-gapped environments, host libraries locally:

1. Download marked.min.js locally
2. Update `ensureMarked()` in terminal.js:
```javascript
async function ensureMarked() {
  if (!window.marked) {
    const script = document.createElement('script');
    script.src = '/js/lib/marked.min.js'; // Local copy
    document.head.appendChild(script);
    await new Promise(resolve => script.onload = resolve);
  }
}
```

## Troubleshooting

### Browser Shows "Not Allowed"

**Problem**: Certain sites block iframe embedding

**Solution**: The browser detects this and offers "Open in new tab" button

### Terminal Command Not Found

**Problem**: Custom command not appearing

**Solution**: 
- Check command is registered in terminal.js
- Clear browser cache and reload
- Check console for errors

### AI Webhook Returns Error

**Problem**: `shldq` command fails

**Solution**:
- Verify webhook URL: `window.webOS.aiWebhook`
- Check n8n workflow is active
- Test webhook manually: `curl https://your-webhook.url`
- Check browser console for CORS errors

### Marked.js Not Loading

**Problem**: Markdown responses show raw HTML

**Solution**:
- Check CDN is accessible: https://cdn.jsdelivr.net/npm/marked/marked.min.js
- Switch to local copy (see Security section)
- Fallback to plain text is automatic

### File System Persists Across Sessions

**Problem**: Files appear to disappear on refresh

**Solution**: Virtual filesystem is in-memory. To persist:

```javascript
// Save to localStorage
function saveFSToStorage() {
  localStorage.webOSFS = JSON.stringify(window.webOS.fileSystem.export());
}

// Load from localStorage
function loadFSFromStorage() {
  const data = localStorage.webOSFS;
  if (data) window.webOS.fileSystem.import(JSON.parse(data));
}

// Call on startup and periodically
```

## Development

### Setting Up Dev Environment

```bash
# Clone repo
git clone https://github.com/yourusername/sudoshield-web-os.git
cd sudoshield-web-os

# Start local server
npm install -g http-server
http-server -p 8000 --cors

# Open browser
# http://localhost:8000

# Enable debug mode
localStorage.debug = 'sudoshield:*'
```

### Testing Commands Locally

```bash
# Open browser console
# Test file system
window.webOS.fileSystem.mkdir('/test')
window.webOS.fileSystem.writeFile('/test/file.txt', 'content')
console.log(window.webOS.fileSystem.readFile('/test/file.txt'))

# Test AI webhook
window.webOS.aiWebhook = 'https://your-webhook'
// Then use terminal: shldq test
```

### Recommended Tools

- **VS Code** - Code editor
- **Chrome DevTools** - Debugging
- **http-server** - Local server
- **DOMPurify** - HTML sanitization
- **Jest** - Unit testing (recommended to add)

### Code Style

- Use ES6 syntax
- Comment complex logic
- Follow naming conventions (camelCase for variables)
- Use `window.webOS` for global access
- Avoid global variables outside `window.webOS`

## Performance Optimization

### Reduce Initial Load Time

1. Defer non-critical app loading
2. Lazy-load visual effects
3. Use minified CSS/JS in production

### Memory Management

1. Destroy windows properly
2. Remove event listeners when disposing
3. Clear timers on cleanup

### Bandwidth

1. Host marked.js locally
2. Compress CSS/JS files
3. Use image sprites for icons

## Recommended Enhancements

### Short-Term (v1.1)

- [ ] Add DOMPurify for HTML sanitization
- [ ] Implement localStorage persistence for filesystem
- [ ] Create unit tests for core modules
- [ ] Add dark mode toggle

### Medium-Term (v2.0)

- [ ] Multi-user accounts with saved states
- [ ] Drag-and-drop file upload
- [ ] Sound effects and notifications
- [ ] Plugin system for third-party apps
- [ ] Web Worker support for heavy tasks

### Long-Term (v3.0)

- [ ] Local data sync across devices
- [ ] Offline-first support with Service Workers
- [ ] Real terminal emulation
- [ ] Container/sandbox support
- [ ] Voice command integration

## Resources

### Documentation

- [MDN Web Docs](https://developer.mozilla.org/)
- [n8n Documentation](https://docs.n8n.io/)
- [marked.js Guide](https://marked.js.org/)
- [DuckDuckGo API](https://duckduckgo.com/api)

### Related Projects

- [DeskOS](https://github.com/vizitiucom/DeskOS)
- [OS.js](https://www.os-js.org/)
- [Marijn's Browser](https://github.com/marijnh/browser)

### Learning Resources

- [Web Components Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Window Management](https://developer.mozilla.org/en-US/docs/Web/API/Window)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Guidelines

- Follow existing code style
- Add comments for complex logic
- Test in multiple browsers
- Update documentation
- Keep commits atomic and descriptive

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**SudoShield OS Contributors**
- GitHub: [yourusername](https://github.com/yourusername)
- Issues: [Report bugs here](https://github.com/yourusername/sudoshield-web-os/issues)

## Support

- Open an issue for bug reports
- Start a discussion for feature requests
- Check [ISSUES.md](ISSUES.md) for known issues
- See troubleshooting section above

## Acknowledgments

- Inspired by desktop operating systems
- n8n for workflow automation
- DuckDuckGo for search integration
- Open source community

## Roadmap

**October 2025**
- Version 1.0 release
- Core OS features
- Terminal with AI integration
- Built-in apps

**November 2025**
- HTML sanitization with DOMPurify
- localStorage persistence
- Plugin system foundation

**December 2025**
- Multi-user support
- Advanced theming
- Voice command beta

**Q1 2026**
- Service Worker offline support
- Web Worker integration
- Third-party app marketplace

---

Made with love and JavaScript

**Last Updated:** October 2025
