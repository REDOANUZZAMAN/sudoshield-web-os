// Authentication System for WebOS with n8n Webhook Integration
// 
// n8n Webhook Setup:
// 1. Create a webhook node in n8n
// 2. Set the webhook path to match N8N_WEBHOOK_URL
// 3. Connect to your authentication logic (database, API, etc.)
// 4. Return JSON response: { "authenticated": true/false, "message": "optional message" }
//
// For credential updates, create a separate webhook at: N8N_WEBHOOK_URL.replace('auth-check', 'update-credentials')
// Update webhook should return: { "success": true/false, "message": "optional message" }
(function() {
    'use strict';
    
    // Configuration
    const N8N_WEBHOOK_URL = 'https://n8n.bytevia.tech/webhook/3794706c-43aa-49fe-8c32-16d582da2694'; // Production n8n webhook URL
    const AUTH_KEY = 'webos.auth.credentials';
    const SESSION_KEY = 'webos.auth.session';
    const DEFAULT_USERNAME = 'sudoshield';
    const DEFAULT_PASSWORD = 'Sudoos12';
    
    class AuthSystem {
        constructor() {
            this.isAuthenticated = false;
            this.currentUser = null;
            this.sessionTimeout = null;
            this.init();
        }
        
        init() {
            console.log('🔐 Initializing Authentication System...');
            
            // Initialize default credentials if not exists
            this.initializeCredentials();
            
            // Check if user is already logged in
            this.checkSession();
            
            // Setup login form handlers
            this.setupLoginForm();
            
            // Setup logout handlers
            this.setupLogoutHandlers();
            
            // Add dynamic effects
            this.addDynamicEffects();
        }
        
        addDynamicEffects() {
            const authScreen = document.getElementById('auth-screen');
            if (!authScreen) return;
            
            // Create floating particles
            this.createFloatingParticles(authScreen);
            
            // Add mouse parallax effect
            this.addParallaxEffect(authScreen);
            
            // Add input animations
            this.addInputAnimations();
        }
        
        createFloatingParticles(container) {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'auth-particles';
            particlesContainer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            `;
            
            // Color schemes for particles
            const colors = [
                { r: 255, g: 0, b: 0, name: 'red' },      // Red
                { r: 0, g: 100, b: 255, name: 'blue' },   // Blue
                { r: 255, g: 50, b: 150, name: 'pink' },  // Pink
                { r: 150, g: 50, b: 255, name: 'purple' }, // Purple
                { r: 255, g: 255, b: 255, name: 'white' }  // White
            ];
            
            // Create 40 floating particles (increased from 20)
            for (let i = 0; i < 40; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 6 + 3;
                const duration = Math.random() * 8 + 8;
                const delay = Math.random() * 5;
                const x = Math.random() * 100;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const drift = Math.random() * 100 - 50;
                
                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(${color.r}, ${color.g}, ${color.b}, ${Math.random() * 0.6 + 0.4});
                    border-radius: 50%;
                    left: ${x}%;
                    bottom: -20px;
                    animation: floatUp${i} ${duration}s linear ${delay}s infinite;
                    box-shadow: 0 0 ${size * 3}px rgba(${color.r}, ${color.g}, ${color.b}, 0.8),
                                0 0 ${size * 6}px rgba(${color.r}, ${color.g}, ${color.b}, 0.4);
                    filter: blur(${Math.random() * 0.5}px);
                `;
                
                particle.setAttribute('data-color', color.name);
                
                // Add unique animation for each particle
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes floatUp${i} {
                        0% {
                            transform: translateY(0) translateX(0) scale(0) rotate(0deg);
                            opacity: 0;
                        }
                        10% {
                            opacity: 1;
                        }
                        90% {
                            opacity: 1;
                        }
                        100% {
                            transform: translateY(-110vh) translateX(${drift}px) scale(${Math.random() + 0.5}) rotate(${Math.random() * 360}deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
                
                particlesContainer.appendChild(particle);
            }
            
            // Add orbiting particles around the form
            for (let i = 0; i < 8; i++) {
                const orbitParticle = document.createElement('div');
                const size = Math.random() * 8 + 4;
                const color = colors[i % 3]; // Alternate red, blue, pink
                const angle = (360 / 8) * i;
                
                orbitParticle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(${color.r}, ${color.g}, ${color.b}, 0.8);
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform-origin: center;
                    animation: orbit${i} ${8 + i}s linear infinite;
                    box-shadow: 0 0 ${size * 4}px rgba(${color.r}, ${color.g}, ${color.b}, 1);
                `;
                
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes orbit${i} {
                        0% {
                            transform: translate(-50%, -50%) rotate(${angle}deg) translateX(250px) rotate(-${angle}deg);
                        }
                        100% {
                            transform: translate(-50%, -50%) rotate(${angle + 360}deg) translateX(250px) rotate(-${angle + 360}deg);
                        }
                    }
                `;
                document.head.appendChild(style);
                
                particlesContainer.appendChild(orbitParticle);
            }
            
            container.insertBefore(particlesContainer, container.firstChild);
        }
        
        addParallaxEffect(container) {
            const authContainer = container.querySelector('.auth-container');
            if (!authContainer) return;
            
            container.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                
                authContainer.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            container.addEventListener('mouseleave', () => {
                authContainer.style.transform = 'translate(0, 0)';
            });
        }
        
        addInputAnimations() {
            const inputs = document.querySelectorAll('.auth-form-group input');
            
            inputs.forEach((input, index) => {
                const wrapper = input.closest('.auth-form-group');
                
                // Add ripple effect on focus
                input.addEventListener('focus', (e) => {
                    const icon = e.target.parentElement.querySelector('.auth-input-icon');
                    if (icon) {
                        icon.style.animation = 'iconBounce 0.5s ease, iconRotate 0.6s ease';
                        setTimeout(() => {
                            icon.style.animation = '';
                        }, 600);
                    }
                    
                    // Add glow effect
                    wrapper.classList.add('input-focused');
                    
                    // Create ripple particles
                    this.createInputRipple(e.target);
                });
                
                input.addEventListener('blur', () => {
                    wrapper.classList.remove('input-focused');
                });
                
                // Add typing animation with color change
                input.addEventListener('input', (e) => {
                    const wrapper = e.target.parentElement;
                    wrapper.style.animation = 'inputPulse 0.3s ease';
                    
                    // Create typing particles
                    if (e.target.value.length > 0) {
                        this.createTypingParticle(e.target);
                    }
                    
                    setTimeout(() => {
                        wrapper.style.animation = '';
                    }, 300);
                });
                
                // Add wave animation on hover
                wrapper.addEventListener('mouseenter', () => {
                    wrapper.style.animation = 'formWave 0.6s ease';
                    setTimeout(() => {
                        wrapper.style.animation = '';
                    }, 600);
                });
            });
            
            // Add button animations
            const loginBtn = document.getElementById('auth-login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('mouseenter', () => {
                    this.createButtonParticles(loginBtn);
                });
                
                loginBtn.addEventListener('click', (e) => {
                    if (!loginBtn.disabled) {
                        this.createClickExplosion(e);
                    }
                });
            }
            
            // Add icon animation styles
            if (!document.getElementById('icon-animation-styles')) {
                const style = document.createElement('style');
                style.id = 'icon-animation-styles';
                style.textContent = `
                    @keyframes iconBounce {
                        0%, 100% { transform: translateY(-50%) scale(1); }
                        50% { transform: translateY(-50%) scale(1.3); }
                    }
                    
                    @keyframes iconRotate {
                        0% { transform: translateY(-50%) rotate(0deg); }
                        100% { transform: translateY(-50%) rotate(360deg); }
                    }
                    
                    @keyframes inputPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.02); }
                    }
                    
                    @keyframes formWave {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px) rotate(-1deg); }
                        75% { transform: translateX(5px) rotate(1deg); }
                    }
                    
                    .input-focused {
                        animation: focusGlow 1.5s ease infinite !important;
                    }
                    
                    @keyframes focusGlow {
                        0%, 100% { 
                            filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.3));
                        }
                        50% { 
                            filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.8));
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        createInputRipple(input) {
            const rect = input.getBoundingClientRect();
            const colors = ['#ff0000', '#0064ff', '#ff3296'];
            
            for (let i = 0; i < 5; i++) {
                const ripple = document.createElement('div');
                const size = Math.random() * 4 + 2;
                const angle = (Math.PI * 2 / 5) * i;
                const distance = 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                ripple.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                    pointer-events: none;
                    z-index: 10000;
                    box-shadow: 0 0 10px ${color};
                    animation: rippleOut 0.8s ease-out forwards;
                `;
                
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes rippleOut {
                        to {
                            transform: translate(${x}px, ${y}px) scale(0);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
                
                document.body.appendChild(ripple);
                setTimeout(() => ripple.remove(), 800);
            }
        }
        
        createTypingParticle(input) {
            const rect = input.getBoundingClientRect();
            const particle = document.createElement('div');
            const colors = ['#ff0000', '#0064ff', '#ff3296', '#a855f7'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: ${color};
                border-radius: 50%;
                left: ${rect.right - 20}px;
                top: ${rect.top + rect.height / 2}px;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 0 8px ${color};
                animation: particleFly 0.6s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
        
        createButtonParticles(button) {
            const rect = button.getBoundingClientRect();
            const colors = ['#ff0000', '#0064ff'];
            
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    const size = Math.random() * 6 + 3;
                    const x = Math.random() * rect.width;
                    const color = colors[i % 2];
                    
                    particle.style.cssText = `
                        position: fixed;
                        width: ${size}px;
                        height: ${size}px;
                        background: ${color};
                        border-radius: 50%;
                        left: ${rect.left + x}px;
                        top: ${rect.bottom}px;
                        pointer-events: none;
                        z-index: 10000;
                        box-shadow: 0 0 12px ${color};
                        animation: buttonParticleRise 1s ease-out forwards;
                    `;
                    
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                }, i * 100);
            }
        }
        
        createClickExplosion(e) {
            const colors = ['#ff0000', '#0064ff', '#ff3296', '#a855f7', '#ffffff'];
            
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 6 + 3;
                const angle = (Math.PI * 2 / 12) * i;
                const distance = Math.random() * 50 + 30;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particle.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    pointer-events: none;
                    z-index: 10000;
                    box-shadow: 0 0 15px ${color};
                    animation: explode${i} 0.8s ease-out forwards;
                `;
                
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes explode${i} {
                        to {
                            transform: translate(${x}px, ${y}px) scale(0);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 800);
            }
        }
        
        initializeCredentials() {
            // No longer storing credentials locally - n8n handles authentication
            // But we can store a flag that n8n auth is enabled
            const stored = localStorage.getItem(AUTH_KEY);
            if (!stored) {
                const config = {
                    n8nEnabled: true,
                    webhookUrl: N8N_WEBHOOK_URL,
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem(AUTH_KEY, JSON.stringify(config));
                console.log('✅ n8n authentication initialized');
            }
        }
        
        // Store credentials locally for session management (optional)
        storeCredentialsLocally(username, password) {
            // Store minimal info for session management
            const credentials = {
                username: username,
                n8nEnabled: true,
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem(AUTH_KEY, JSON.stringify(credentials));
        }
        
        checkSession() {
            const session = localStorage.getItem(SESSION_KEY);
            
            if (session) {
                try {
                    const sessionData = JSON.parse(session);
                    const now = new Date().getTime();
                    
                    // Check if session is still valid (24 hours)
                    if (now - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                        this.isAuthenticated = true;
                        this.currentUser = sessionData.username;
                        this.showDesktop();
                        console.log('✅ Session restored for:', this.currentUser);
                        return true;
                    } else {
                        // Session expired
                        localStorage.removeItem(SESSION_KEY);
                        console.log('⏰ Session expired');
                    }
                } catch (e) {
                    console.error('❌ Invalid session data:', e);
                    localStorage.removeItem(SESSION_KEY);
                }
            }
            
            this.showLoginScreen();
            return false;
        }
        
        setupLoginForm() {
            const loginForm = document.getElementById('auth-login-form');
            const usernameInput = document.getElementById('auth-username');
            const passwordInput = document.getElementById('auth-password');
            const loginBtn = document.getElementById('auth-login-btn');
            const errorDiv = document.getElementById('auth-error');
            const togglePassword = document.getElementById('auth-toggle-password');
            
            if (!loginForm) {
                console.warn('⚠️ Login form not found');
                return;
            }
            
            // Toggle password visibility
            if (togglePassword) {
                togglePassword.addEventListener('click', () => {
                    const type = passwordInput.type === 'password' ? 'text' : 'password';
                    passwordInput.type = type;
                    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
                });
            }
            
            // Handle form submission
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(usernameInput.value, passwordInput.value, errorDiv, loginBtn);
            });
            
            // Enter key on inputs
            [usernameInput, passwordInput].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleLogin(usernameInput.value, passwordInput.value, errorDiv, loginBtn);
                    }
                });
            });
        }
        
        handleLogin(username, password, errorDiv, loginBtn) {
            // Clear previous error
            if (errorDiv) {
                errorDiv.classList.remove('show');
            }
            
            // Validate inputs
            if (!username || !password) {
                this.showError('Please enter both username and password', errorDiv);
                return;
            }
            
            // Disable button and show loading
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="auth-loading"></span> Authenticating...';
            
            // Send credentials to n8n webhook for validation
            fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        username: username,
                        password: password,
                        deviceId: (function(){
                            try { let id = localStorage.getItem('deviceId'); if (!id) { id = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2,9); localStorage.setItem('deviceId', id);} return id; } catch(e){ return null; }
                        })(),
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('🔗 n8n webhook response:', data);
                
                // Check if authentication is successful
                if (data && data.authenticated === true) {
                    // Store credentials locally for session management
                    this.storeCredentialsLocally(username, password);
                    this.login(username);
                } else {
                    this.showError(data.message || 'Invalid username or password', errorDiv);
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '🔐 Login';
                    
                    // Shake animation on error
                    const authContainer = document.querySelector('.auth-container');
                    if (authContainer) {
                        authContainer.style.animation = 'none';
                        setTimeout(() => {
                            authContainer.style.animation = 'authShake 0.4s ease';
                        }, 10);
                    }
                }
            })
            .catch(error => {
                console.error('❌ n8n webhook error:', error);
                this.showError('Connection error. Please check your internet connection and try again.', errorDiv);
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🔐 Login';
            });
        }
        
        login(username) {
            this.isAuthenticated = true;
            this.currentUser = username;
            
            // Create session
            const session = {
                username: username,
                timestamp: new Date().getTime(),
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            
            console.log('✅ Login successful:', username);
            
            // Show success message briefly
            const successDiv = document.getElementById('auth-success');
            if (successDiv) {
                successDiv.textContent = 'Login successful! Welcome ' + username;
                successDiv.classList.add('show');
            }
            
            // Transition to desktop
            setTimeout(() => {
                // If we want to redirect to main OS page and force a one-time reload there,
                // set a reload-once flag and navigate to index.html. The main script will
                // detect the flag and reload once.
                try{
                    localStorage.setItem('sudoshield.os.reload_once', 'true');
                }catch(e){}

                // Force navigation to index with explicit query marker so main can detect and perform a single reload
                // Use replace to avoid extra history entries
                try{
                    const base = 'index.html';
                    const url = base + '?auth_reload=1';
                    window.location.replace(url);
                }catch(e){
                    // fallback: just call showDesktop if navigation fails
                    this.showDesktop();
                }
            }, 1000);
        }
        
        logout(skipConfirmation = false) {
            if (!skipConfirmation) {
                this.showLogoutConfirmation();
                return;
            }
            
            // Clear session
            localStorage.removeItem(SESSION_KEY);
            this.isAuthenticated = false;
            this.currentUser = null;
            
            console.log('👋 Logged out');
            
            // Clear all form states and messages first
            const usernameInput = document.getElementById('auth-username');
            const passwordInput = document.getElementById('auth-password');
            const loginBtn = document.getElementById('auth-login-btn');
            const errorDiv = document.getElementById('auth-error');
            const successDiv = document.getElementById('auth-success');
            
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.type = 'password';
            }
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🔐 Login';
            }
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.classList.remove('show');
            }
            if (successDiv) {
                successDiv.textContent = '';
                successDiv.classList.remove('show');
            }
            
            // Reset password toggle button
            const togglePassword = document.getElementById('auth-toggle-password');
            if (togglePassword) {
                togglePassword.textContent = '👁️';
            }
            
            // Hide desktop and show login
            this.hideDesktop();
            this.showLoginScreen();
        }
        
        showLogoutConfirmation() {
            const existingConfirm = document.querySelector('.auth-logout-confirm');
            if (existingConfirm) {
                existingConfirm.remove();
            }
            
            const confirmDiv = document.createElement('div');
            confirmDiv.className = 'auth-logout-confirm';
            confirmDiv.innerHTML = `
                <h3>🔓 Logout Confirmation</h3>
                <p>Are you sure you want to logout from SudoShield OS?</p>
                <button class="confirm-yes">Yes, Logout</button>
                <button class="confirm-no">Cancel</button>
            `;
            
            document.body.appendChild(confirmDiv);
            
            const yesBtn = confirmDiv.querySelector('.confirm-yes');
            const noBtn = confirmDiv.querySelector('.confirm-no');
            
            yesBtn.addEventListener('click', () => {
                confirmDiv.remove();
                this.logout(true);
            });
            
            noBtn.addEventListener('click', () => {
                confirmDiv.remove();
            });
        }
        
        showLoginScreen() {
            const authScreen = document.getElementById('auth-screen');
            if (authScreen) {
                authScreen.classList.remove('hidden');
                authScreen.style.display = 'flex';
                authScreen.style.animation = 'authFadeIn 0.5s ease-out';
                
                // Focus username input
                setTimeout(() => {
                    const usernameInput = document.getElementById('auth-username');
                    if (usernameInput) usernameInput.focus();
                }, 100);
            }
        }
        
        showDesktop() {
            const authScreen = document.getElementById('auth-screen');
            const desktop = document.getElementById('desktop');
            
            if (authScreen) {
                authScreen.style.animation = 'authFadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    authScreen.classList.add('hidden');
                    authScreen.style.display = 'none';
                }, 500);
            }
            
            if (desktop) {
                desktop.classList.remove('hidden');
                desktop.style.display = 'block';
                desktop.style.animation = 'fadeIn 0.5s ease-out';
            }
            
            // Initialize desktop if needed
            if (window.initializeDesktop && typeof window.initializeDesktop === 'function') {
                window.initializeDesktop();
            }
        }
        
        hideDesktop() {
            const desktop = document.getElementById('desktop');
            if (desktop) {
                desktop.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    desktop.classList.add('hidden');
                    desktop.style.display = 'none';
                }, 500);
            }
        }
        
        showError(message, errorDiv) {
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.classList.add('show');
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    errorDiv.classList.remove('show');
                }, 5000);
            }
        }
        
        // Update credentials via n8n webhook (using same webhook with action parameter)
        updateCredentials(oldPassword, newUsername, newPassword) {
            return new Promise((resolve) => {
                // Send update request to the same n8n webhook with action parameter
                fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'update',
                        currentUsername: this.currentUser,
                        oldPassword: oldPassword,
                        newUsername: newUsername,
                        newPassword: newPassword,
                        deviceId: (function(){
                            try { let id = localStorage.getItem('deviceId'); if (!id) { id = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2,9); localStorage.setItem('deviceId', id);} return id; } catch(e){ return null; }
                        })(),
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data && data.success === true) {
                        // Update local session info
                        if (newUsername && newUsername !== this.currentUser) {
                            this.currentUser = newUsername;
                            const session = JSON.parse(localStorage.getItem(SESSION_KEY));
                            if (session) {
                                session.username = newUsername;
                                localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                            }
                        }
                        console.log('✅ Credentials updated via n8n');
                        resolve({ success: true, message: data.message || 'Credentials updated successfully' });
                    } else {
                        resolve({ success: false, message: data.message || 'Failed to update credentials' });
                    }
                })
                .catch(error => {
                    console.error('❌ n8n update error:', error);
                    resolve({ success: false, message: 'Connection error during update' });
                });
            });
        }
        
        getCurrentUser() {
            return this.currentUser;
        }
        
        isLoggedIn() {
            return this.isAuthenticated;
        }
        
        setupLogoutHandlers() {
            // Listen for logout events from settings or other apps
            window.addEventListener('webos-logout', () => {
                this.logout();
            });
        }
    }
    
    // Add fade out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes authFadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(1.05);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize authentication system
    window.authSystem = new AuthSystem();
    
    // Expose to window for settings app
    window.updateUserCredentials = async function(oldPassword, newUsername, newPassword) {
        return await window.authSystem.updateCredentials(oldPassword, newUsername, newPassword);
    };
    
    window.logoutUser = function() {
        window.authSystem.logout();
    };
    
    window.getCurrentUsername = function() {
        return window.authSystem.getCurrentUser();
    };
    
})();
