// Matrix Rain Effect with Real Characters
class MatrixRain {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.columns = [];
        this.chars = '01';
        this.isActive = false;
        this.animationId = null;
        
        this.fontSize = 14;
        this.columnWidth = this.fontSize;
    }
    
    init() {
        if (this.isActive) return;
        
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'matrix-rain-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.8';
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.setupColumns();
        
        // Add to wallpaper element
        const wallpaper = document.getElementById('wallpaper');
        if (wallpaper && wallpaper.classList.contains('wallpaper-rain')) {
            wallpaper.appendChild(this.canvas);
            this.isActive = true;
            this.animate();
        }
    }
    
    setupCanvas() {
        const updateSize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.setupColumns();
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
    }
    
    setupColumns() {
        const columnCount = Math.floor(this.canvas.width / this.columnWidth);
        this.columns = [];
        
        for (let i = 0; i < columnCount; i++) {
            this.columns[i] = {
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 1,
                chars: [],
                length: Math.random() * 20 + 10
            };
            
            // Initialize character trail for each column
            for (let j = 0; j < this.columns[i].length; j++) {
                this.columns[i].chars[j] = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            }
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        // Semi-transparent black overlay for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set text properties
        this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
        this.ctx.textAlign = 'center';
        
        // Draw each column
        this.columns.forEach((column, i) => {
            const x = i * this.columnWidth;
            
            // Draw character trail
            for (let j = 0; j < column.length; j++) {
                const charY = column.y - (j * this.fontSize);
                
                if (charY > 0 && charY < this.canvas.height) {
                    // Calculate opacity based on position in trail
                    const opacity = (column.length - j) / column.length;
                    
                    if (j === 0) {
                        // Leading character (brightest)
                        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    } else if (j < 3) {
                        // Near-leading characters (bright green)
                        this.ctx.fillStyle = `rgba(0, 255, 65, ${opacity * 0.9})`;
                    } else {
                        // Trail characters (darker green)
                        this.ctx.fillStyle = `rgba(0, 255, 65, ${opacity * 0.6})`;
                    }
                    
                    // Occasionally change character for flickering effect
                    if (Math.random() < 0.02) {
                        column.chars[j] = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
                    }
                    
                    this.ctx.fillText(column.chars[j], x + this.columnWidth / 2, charY);
                }
            }
            
            // Update column position
            column.y += column.speed;
            
            // Reset column when it goes off screen
            if (column.y > this.canvas.height + (column.length * this.fontSize)) {
                column.y = -column.length * this.fontSize;
                column.speed = Math.random() * 3 + 1;
                column.length = Math.random() * 20 + 10;
                
                // Generate new character trail
                column.chars = [];
                for (let j = 0; j < column.length; j++) {
                    column.chars[j] = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.isActive = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.ctx = null;
        this.columns = [];
    }
}

// Global matrix rain instance
window.matrixRain = new MatrixRain();

// Auto-initialize when rain wallpaper is detected
const checkForRainWallpaper = () => {
    const wallpaper = document.getElementById('wallpaper');
    if (wallpaper && wallpaper.classList.contains('wallpaper-rain')) {
        if (!window.matrixRain.isActive) {
            setTimeout(() => window.matrixRain.init(), 100);
        }
    } else {
        if (window.matrixRain.isActive) {
            window.matrixRain.destroy();
        }
    }
};

// Listen for wallpaper changes
if (window.webOS?.bus) {
    window.webOS.bus.addEventListener('theme:wallpaper', (e) => {
        setTimeout(checkForRainWallpaper, 200);
    });
}

// Check on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkForRainWallpaper, 500);
});

// Periodically check for wallpaper changes (fallback)
setInterval(checkForRainWallpaper, 2000);