// File Manager Application
class FileManagerApp {
    constructor() {
        this.currentPath = '/home/user';
        this.selectedItems = [];
        this.clipboardItems = [];
        this.clipboardOperation = null; // 'cut' or 'copy'
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.history = ['/home/user'];
        this.historyIndex = 0;
    }

    get fileSystem() {
        return window.webOS?.fileSystem;
    }
    
    render() {
        return `
            <div class="file-manager">
                <div class="file-main-content">
                    <div class="file-sidebar">
                        <div class="file-sidebar-controls">
                            <div class="file-nav-buttons">
                                <button class="file-nav-btn" data-action="back" onclick="window.fileManagerApp.goBack()" title="Back">
                                    <i class="fas fa-arrow-left"></i>
                                </button>
                                <button class="file-nav-btn" data-action="forward" onclick="window.fileManagerApp.goForward()" title="Forward">
                                    <i class="fas fa-arrow-right"></i>
                                </button>
                                <button class="file-nav-btn" data-action="up" onclick="window.fileManagerApp.goUp()" title="Up">
                                    <i class="fas fa-arrow-up"></i>
                                </button>
                                <button class="file-nav-btn" data-action="refresh" onclick="window.fileManagerApp.refresh()" title="Refresh">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                            <input type="text" class="file-path" id="file-path" readonly>
                            <div class="file-view-controls">
                                <button class="file-view-btn ${this.viewMode === 'grid' ? 'active' : ''}" data-mode="grid"
                                        onclick="window.fileManagerApp.setViewMode('grid', event)" title="Grid View">
                                    <i class="fas fa-th"></i>
                                </button>
                                <button class="file-view-btn ${this.viewMode === 'list' ? 'active' : ''}" data-mode="list"
                                        onclick="window.fileManagerApp.setViewMode('list', event)" title="List View">
                                    <i class="fas fa-list"></i>
                                </button>
                            </div>
                        </div>
                        <div class="file-sidebar-section">
                            <h4>System</h4>
                            <div class="file-sidebar-item" data-path="/" onclick="window.fileManagerApp.navigateTo('/')">
                                <i class="fas fa-hdd"></i>
                                <span>Root</span>
                            </div>
                            <div class="file-sidebar-item" data-path="/bin" onclick="window.fileManagerApp.navigateTo('/bin')">
                                <i class="fas fa-cog"></i>
                                <span>Binaries</span>
                            </div>
                            <div class="file-sidebar-item" data-path="/etc" onclick="window.fileManagerApp.navigateTo('/etc')">
                                <i class="fas fa-tools"></i>
                                <span>Configuration</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="file-content-area">
                        <div class="file-workspace">
                            <div class="quick-access-panel">
                                <div class="quick-access-header">
                                    <h4>Quick Access</h4>
                                </div>
                                <div class="quick-access-items">
                                    <div class="file-sidebar-item quick-access-item" data-path="/home/user" onclick="window.fileManagerApp.navigateTo('/home/user')">
                                        <i class="fas fa-home"></i>
                                        <span>Home</span>
                                    </div>
                                    <div class="file-sidebar-item quick-access-item" data-path="/home/user/Desktop" onclick="window.fileManagerApp.navigateTo('/home/user/Desktop')">
                                        <i class="fas fa-desktop"></i>
                                        <span>Desktop</span>
                                    </div>
                                    <div class="file-sidebar-item quick-access-item" data-path="/home/user/Documents" onclick="window.fileManagerApp.navigateTo('/home/user/Documents')">
                                        <i class="fas fa-file-alt"></i>
                                        <span>Documents</span>
                                    </div>
                                    <div class="file-sidebar-item quick-access-item" data-path="/home/user/Downloads" onclick="window.fileManagerApp.navigateTo('/home/user/Downloads')">
                                        <i class="fas fa-download"></i>
                                        <span>Downloads</span>
                                    </div>
                                    <div class="file-sidebar-item quick-access-item" data-path="/home/user/Pictures" onclick="window.fileManagerApp.navigateTo('/home/user/Pictures')">
                                        <i class="fas fa-images"></i>
                                        <span>Pictures</span>
                                    </div>
                                </div>
                            </div>
                            <div class="file-content" id="file-content">
                                ${this.renderDirectoryContents()}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="file-statusbar">
                    <span id="file-status">Ready</span>
                    <span id="file-selection-info"></span>
                </div>
            </div>
        `;
    }
    
    init(container) {
        this.container = container;
        this.setupEventListeners();
        this.updatePathBar();
        this.updateSelectionInfo();
        this.updateSidebarActiveState();
        this.updateNavigationButtons();
        
        // Subscribe to filesystem changes
        if (this.fileSystem) {
            this.fileSystem.subscribe((event) => {
                if (event.path.startsWith(this.currentPath) || this.currentPath.startsWith(event.path)) {
                    this.refresh();
                }
            });
        }
    }

    updateNavigationButtons() {
        const backBtn = document.querySelector('.file-nav-btn[data-action="back"]');
        const forwardBtn = document.querySelector('.file-nav-btn[data-action="forward"]');
        const upBtn = document.querySelector('.file-nav-btn[data-action="up"]');
        const refreshBtn = document.querySelector('.file-nav-btn[data-action="refresh"]');

        const canGoBack = this.historyIndex > 0;
        const canGoForward = this.historyIndex < this.history.length - 1;
        const canGoUp = this.currentPath !== '/';

        if (backBtn) {
            backBtn.disabled = !canGoBack;
            backBtn.classList.toggle('disabled', !canGoBack);
        }

        if (forwardBtn) {
            forwardBtn.disabled = !canGoForward;
            forwardBtn.classList.toggle('disabled', !canGoForward);
        }

        if (upBtn) {
            upBtn.disabled = !canGoUp;
            upBtn.classList.toggle('disabled', !canGoUp);
        }

        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('disabled');
        }
    }
    
    setupEventListeners() {
        // Right-click context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.file-content')) {
                e.preventDefault();
                this.showContextMenu(e.clientX, e.clientY, e.target.closest('.file-item'));
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.file-manager')) {
                this.handleKeyboard(e);
            }
        });
    }
    

    
    getDirectoryContents(path) {
        if (!this.fileSystem) return null;
        
        try {
            const items = this.fileSystem.list(path);
            return {
                type: 'directory',
                contents: items.reduce((acc, item) => {
                    acc[item.name] = {
                        type: item.type,
                        size: this.formatFileSize(item.size),
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        modified: new Date(item.updatedAt).toLocaleDateString()
                    };
                    return acc;
                }, {})
            };
        } catch (error) {
            console.error('Error reading directory:', error);
            return null;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    renderDirectoryContents() {
        const dir = this.getDirectoryContents(this.currentPath);
        
        if (!dir || dir.type !== 'directory') {
            return '<div class="file-error">Unable to read directory</div>';
        }
        
        const items = Object.entries(dir.contents);
        
        if (items.length === 0) {
            return '<div class="file-empty">This folder is empty</div>';
        }
        
        if (this.viewMode === 'grid') {
            return `
                <div class="file-grid">
                    ${items.map(([name, item]) => this.renderFileItem(name, item)).join('')}
                </div>
            `;
        } else {
            return `
                <div class="file-list">
                    <div class="file-list-header">
                        <span class="file-list-col-name">Name</span>
                        <span class="file-list-col-size">Size</span>
                        <span class="file-list-col-type">Type</span>
                        <span class="file-list-col-modified">Modified</span>
                    </div>
                    ${items.map(([name, item]) => this.renderFileItemList(name, item)).join('')}
                </div>
            `;
        }
    }
    
    renderFileItem(name, item) {
        const icon = this.getFileIcon(name, item.type);
        const isSelected = this.selectedItems.includes(name);
        const typeClass = item.type === 'directory' ? 'directory' : 'file';
        const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
        
        return `
            <div class="file-item ${typeClass} ${isSelected ? 'selected' : ''}" 
                 data-name="${name}" 
                 data-type="${item.type}"
                 data-ext="${ext}"
                 onclick="window.fileManagerApp.selectItem('${name}', event)"
                 ondblclick="window.fileManagerApp.openItem('${name}')">
                <div class="file-icon">
                    <i class="${icon}"></i>
                </div>
                <span class="file-name">${name}</span>
            </div>
        `;
    }
    
    renderFileItemList(name, item) {
        const icon = this.getFileIcon(name, item.type);
        const size = item.size || (item.type === 'directory' ? '--' : '0 B');
        const type = item.type === 'directory' ? 'Folder' : this.getFileType(name);
        const modified = item.modified || '--';
        const isSelected = this.selectedItems.includes(name);
        
        return `
            <div class="file-list-item ${isSelected ? 'selected' : ''}" 
                 data-name="${name}" 
                 data-type="${item.type}"
                 onclick="window.fileManagerApp.selectItem('${name}', event)"
                 ondblclick="window.fileManagerApp.openItem('${name}')">
                <span class="file-list-col-name">
                    <i class="${icon}"></i>
                    ${name}
                </span>
                <span class="file-list-col-size">${size}</span>
                <span class="file-list-col-type">${type}</span>
                <span class="file-list-col-modified">${modified}</span>
            </div>
        `;
    }
    
    getFileIcon(name, type) {
        if (type === 'directory') {
            return 'fas fa-folder';
        }
        
        const ext = name.split('.').pop().toLowerCase();
        const iconMap = {
            'txt': 'fas fa-file-alt',
            'md': 'fab fa-markdown',
            'js': 'fab fa-js-square',
            'ts': 'fas fa-code',
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'json': 'fas fa-code',
            'py': 'fab fa-python',
            'png': 'fas fa-file-image',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'gif': 'fas fa-file-image',
            'pdf': 'fas fa-file-pdf',
            'zip': 'fas fa-file-archive',
            'mp3': 'fas fa-file-audio',
            'mp4': 'fas fa-file-video',
            'sh': 'fas fa-terminal'
        };
        
        return iconMap[ext] || 'fas fa-file';
    }
    
    getFileType(name) {
        const ext = name.split('.').pop().toLowerCase();
        const typeMap = {
            'txt': 'Text Document',
            'md': 'Markdown Document',
            'js': 'JavaScript File',
            'ts': 'TypeScript File',
            'html': 'HTML Document',
            'css': 'CSS Stylesheet',
            'json': 'JSON File',
            'py': 'Python Script',
            'png': 'PNG Image',
            'jpg': 'JPEG Image',
            'jpeg': 'JPEG Image',
            'gif': 'GIF Image',
            'pdf': 'PDF Document',
            'zip': 'ZIP Archive',
            'mp3': 'Audio File',
            'mp4': 'Video File',
            'sh': 'Shell Script'
        };
        
        return typeMap[ext] || 'Unknown';
    }
    
    navigateTo(path) {
        if (!this.fileSystem) {
            this.setStatus('Filesystem not available', 'error');
            return;
        }

        try {
            if (!this.fileSystem.exists(path)) {
                this.setStatus(`Cannot access ${path}`, 'error');
                return;
            }

            const stat = this.fileSystem.stat(path);
            if (stat.type !== 'directory') {
                this.setStatus(`${path} is not a directory`, 'error');
                return;
            }

            // Update history
            if (this.currentPath !== path) {
                this.history = this.history.slice(0, this.historyIndex + 1);
                this.history.push(path);
                this.historyIndex = this.history.length - 1;
            }

            this.currentPath = path;
            this.selectedItems = [];
            this.refreshContent();
            this.updatePathBar();
            this.updateSelectionInfo();
            this.updateSidebarActiveState();
            this.updateNavigationButtons();
            this.setStatus('Ready');
        } catch (error) {
            this.setStatus(`Error accessing ${path}: ${error.message}`, 'error');
        }
    }
    
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const path = this.history[this.historyIndex];
            this.currentPath = path;
            this.selectedItems = [];
            this.refreshContent();
            this.updatePathBar();
            this.updateSelectionInfo();
            this.updateSidebarActiveState();
            this.updateNavigationButtons();
            this.setStatus('Navigated back');
        }
    }
    
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const path = this.history[this.historyIndex];
            this.currentPath = path;
            this.selectedItems = [];
            this.refreshContent();
            this.updatePathBar();
            this.updateSelectionInfo();
            this.updateSidebarActiveState();
            this.updateNavigationButtons();
            this.setStatus('Navigated forward');
        }
    }
    
    goUp() {
        if (this.currentPath === '/') return;
        
        const parts = this.currentPath.split('/').filter(p => p);
        parts.pop();
        const parentPath = '/' + parts.join('/');
        
        if (this.currentPath !== parentPath) {
            this.navigateTo(parentPath);
        }
        this.updateNavigationButtons();
    }
    
    refresh() {
        this.refreshContent();
        this.updateSidebarActiveState();
        this.updateNavigationButtons();
        this.setStatus('Refreshed');
    }
    
    refreshContent() {
        const content = document.getElementById('file-content');
        if (content) {
            content.innerHTML = this.renderDirectoryContents();
        }
    }
    
    updatePathBar() {
        const pathInput = document.getElementById('file-path');
        if (pathInput) {
            pathInput.value = this.currentPath;
        }
    }
    
    selectItem(name, event) {
        if (event.ctrlKey || event.metaKey) {
            // Multi-select
            const index = this.selectedItems.indexOf(name);
            if (index === -1) {
                this.selectedItems.push(name);
            } else {
                this.selectedItems.splice(index, 1);
            }
        } else {
            // Single select
            this.selectedItems = [name];
        }
        
        this.refreshContent();
        this.updateSelectionInfo();
    }
    
    openItem(name) {
        const dir = this.getDirectoryContents(this.currentPath);
        const item = dir.contents[name];
        
        if (item.type === 'directory') {
            const newPath = this.currentPath === '/' ? '/' + name : this.currentPath + '/' + name;
            this.navigateTo(newPath);
        } else {
            this.openFile(name, item);
        }
    }
    
    openFile(name, item) {
        const filePath = this.currentPath === '/' ? '/' + name : this.currentPath + '/' + name;
        
        try {
            const content = this.fileSystem.readFile(filePath);
            if (content) {
                // Create a simple file viewer modal
                this.showFileViewer(name, content);
            } else {
                this.setStatus(`Cannot read ${name}`, 'warning');
            }
        } catch (error) {
            this.setStatus(`Error opening ${name}: ${error.message}`, 'error');
        }
    }

    showFileViewer(filename, content) {
        // Simple file viewer - in a real app this would be more sophisticated
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        `;
        
        const viewer = document.createElement('div');
        viewer.style.cssText = `
            background: white; padding: 20px; border-radius: 8px;
            max-width: 80%; max-height: 80%; overflow: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        viewer.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <h3 style="margin: 0;">${filename}</h3>
                <button onclick="this.closest('.modal').remove()" style="
                    background: #e74c3c; color: white; border: none;
                    padding: 5px 10px; border-radius: 4px; cursor: pointer;
                ">Close</button>
            </div>
            <pre style="white-space: pre-wrap; font-family: monospace; 
                       background: #f8f9fa; padding: 15px; border-radius: 4px;
                       max-height: 400px; overflow: auto;">${content}</pre>
        `;
        
        modal.className = 'modal';
        modal.appendChild(viewer);
        document.body.appendChild(modal);
        
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    
    setViewMode(mode, evt) {
        this.viewMode = mode;
        this.refreshContent();
        
        // Update view buttons
        document.querySelectorAll('.file-view-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetButton = evt && evt.target
            ? evt.target.closest('.file-view-btn')
            : document.querySelector(`.file-view-btn[data-mode="${mode}"]`);

        if (targetButton) {
            targetButton.classList.add('active');
        }
    }
    
    updateSelectionInfo() {
        const info = document.getElementById('file-selection-info');
        if (!info) return;
        
        const count = this.selectedItems.length;
        if (count === 0) {
            info.textContent = '';
        } else if (count === 1) {
            info.textContent = `1 item selected`;
        } else {
            info.textContent = `${count} items selected`;
        }
    }
    
    setStatus(message, type = 'info') {
        const status = document.getElementById('file-status');
        if (status) {
            status.textContent = message;
            status.className = `status-${type}`;
            
            // Clear status after 3 seconds
            setTimeout(() => {
                status.textContent = 'Ready';
                status.className = '';
            }, 3000);
        }
    }
    
    showContextMenu(x, y, item) {
        // Context menu implementation would go here
        this.setStatus('Context menu not implemented in demo', 'info');
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case 'Delete':
                if (this.selectedItems.length > 0) {
                    this.setStatus('Delete not implemented in demo filesystem', 'warning');
                }
                break;
            case 'F5':
                e.preventDefault();
                this.refresh();
                break;
            case 'Escape':
                this.selectedItems = [];
                this.refreshContent();
                this.updateSelectionInfo();
                break;
        }
    }
}

// Add file manager specific styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .file-empty, .file-error {
            text-align: center;
            padding: 80px 24px;
            color: rgba(148, 163, 184, 0.75);
            font-style: italic;
            letter-spacing: 0.4px;
        }
        
        .file-error {
            color: rgba(248, 113, 113, 0.85);
        }
        
        .file-list {
            width: 100%;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid rgba(148, 163, 184, 0.16);
            background: rgba(15, 23, 42, 0.6);
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(8px);
        }
        
        .file-list-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 18px 22px;
            font-weight: 700;
            letter-spacing: 0.6px;
            color: rgba(191, 219, 254, 0.75);
            border-bottom: 1px solid rgba(148, 163, 184, 0.14);
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 58, 138, 0.85));
        }
        
        .file-list-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 16px 22px;
            color: rgba(226, 232, 240, 0.86);
            cursor: pointer;
            transition: background 0.25s ease, transform 0.25s ease;
            border-bottom: 1px solid rgba(148, 163, 184, 0.08);
        }
        
        .file-list-item:hover {
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.16), rgba(236, 72, 153, 0.22));
            transform: translateX(4px);
        }
        
        .file-list-item.selected {
            background: linear-gradient(90deg, rgba(14, 165, 233, 0.38), rgba(236, 72, 153, 0.5));
            box-shadow: inset 0 0 25px rgba(59, 130, 246, 0.25);
            color: #f8fafc;
        }
        
        .file-list-col-name {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
        }
        
        .file-list-col-name i {
            font-size: 18px;
            color: rgba(147, 197, 253, 0.95);
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.55));
        }
        
        .file-list-col-size,
        .file-list-col-type,
        .file-list-col-modified {
            color: rgba(148, 163, 184, 0.85);
            font-size: 13px;
        }
        
        .status-error {
            color: rgba(248, 113, 113, 0.95) !important;
        }
        
        .status-warning {
            color: rgba(251, 191, 36, 0.95) !important;
        }
        
        .status-info {
            color: rgba(56, 189, 248, 0.9) !important;
        }
    </style>
`);

// Initialize File Manager app
window.fileManagerApp = new FileManagerApp();