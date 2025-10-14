// Server-Side Authentication Configuration
const AUTH_CONFIG = {
    API_URL: '/api/auth.php',  // Change this to your API URL
    ENDPOINTS: {
        LOGIN: '?action=login',
        LOGOUT: '?action=logout',
        CHECK: '?action=check',
        UPDATE: '?action=update'
    }
};

// Authentication System for WebOS - Server-Side Version
(function() {
    'use strict';
    
    class AuthSystem {
        constructor() {
            this.isAuthenticated = false;
            this.currentUser = null;
            this.sessionTimeout = null;
            this.init();
        }
        
        init() {
            console.log('🔐 Initializing Server-Side Authentication System...');
            
            // Check if user is already logged in
            this.checkSession();
            
            // Setup login form handlers
            this.setupLoginForm();
            
            // Setup logout handlers
            this.setupLogoutHandlers();
            
            // Add dynamic effects
            this.addDynamicEffects();
        }
        
        async checkSession() {
            try {
                const response = await fetch(AUTH_CONFIG.API_URL + AUTH_CONFIG.ENDPOINTS.CHECK, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success && data.authenticated) {
                    this.isAuthenticated = true;
                    this.currentUser = data.user.username;
                    this.showDesktop();
                    console.log('✅ Session restored for:', this.currentUser);
                    return true;
                } else {
                    this.showLoginScreen();
                    return false;
                }
            } catch (error) {
                console.error('❌ Session check error:', error);
                this.showLoginScreen();
                return false;
            }
        }
        
        async handleLogin(username, password, errorDiv, loginBtn) {
            if (!username || !password) {
                this.showError('Please enter username and password', errorDiv);
                return;
            }
            
            // Disable button and show loading
            loginBtn.disabled = true;
            loginBtn.innerHTML = '⏳ Logging in...';
            
            // Clear any previous errors
            if (errorDiv) errorDiv.classList.remove('show');
            
            try {
                const response = await fetch(AUTH_CONFIG.API_URL + AUTH_CONFIG.ENDPOINTS.LOGIN, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.login(data.user.username);
                } else {
                    this.showError(data.message || 'Invalid credentials', errorDiv);
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '🔐 Login';
                }
            } catch (error) {
                console.error('❌ Login error:', error);
                this.showError('Connection error. Please try again.', errorDiv);
                loginBtn.disabled = false;
                loginBtn.innerHTML = '🔐 Login';
            }
        }
        
        login(username) {
            this.isAuthenticated = true;
            this.currentUser = username;
            
            console.log('✅ Login successful:', username);
            
            // Show success message briefly
            const successDiv = document.getElementById('auth-success');
            if (successDiv) {
                successDiv.textContent = 'Login successful! Welcome ' + username;
                successDiv.classList.add('show');
            }
            
            // Transition to desktop
            setTimeout(() => {
                this.showDesktop();
            }, 1000);
        }
        
        async logout(skipConfirmation = false) {
            if (!skipConfirmation) {
                this.showLogoutConfirmation();
                return;
            }
            
            try {
                const response = await fetch(AUTH_CONFIG.API_URL + AUTH_CONFIG.ENDPOINTS.LOGOUT, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.isAuthenticated = false;
                    this.currentUser = null;
                    
                    console.log('👋 Logged out');
                    
                    // Clear all form states and messages
                    this.clearFormState();
                    
                    // Hide desktop and show login
                    this.hideDesktop();
                    this.showLoginScreen();
                }
            } catch (error) {
                console.error('❌ Logout error:', error);
            }
        }
        
        clearFormState() {
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
            
            const togglePassword = document.getElementById('auth-toggle-password');
            if (togglePassword) {
                togglePassword.textContent = '👁️';
            }
        }
        
        async updateCredentials(oldPassword, newUsername, newPassword) {
            try {
                const response = await fetch(AUTH_CONFIG.API_URL + AUTH_CONFIG.ENDPOINTS.UPDATE, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        oldPassword: oldPassword,
                        newUsername: newUsername,
                        newPassword: newPassword
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if (newUsername) {
                        this.currentUser = newUsername;
                    }
                    return { success: true, message: data.message };
                } else {
                    return { success: false, message: data.message };
                }
            } catch (error) {
                console.error('❌ Update credentials error:', error);
                return { success: false, message: 'Connection error' };
            }
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
        
        setupLogoutHandlers() {
            window.addEventListener('webos-logout', () => {
                this.logout();
            });
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
                
                setTimeout(() => {
                    errorDiv.classList.remove('show');
                }, 5000);
            }
        }
        
        addDynamicEffects() {
            // Keep existing particle effects code
            const authScreen = document.getElementById('auth-screen');
            if (!authScreen) return;
            
            this.createFloatingParticles(authScreen);
            this.addParallaxEffect(authScreen);
            this.addInputAnimations();
        }
        
        // Include all existing particle and animation methods...
        // (Keep the existing createFloatingParticles, addParallaxEffect, etc.)
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.authSystem = new AuthSystem();
        });
    } else {
        window.authSystem = new AuthSystem();
    }
    
    // Export for other modules
    window.logoutUser = function() {
        window.authSystem.logout();
    };
    
})();
