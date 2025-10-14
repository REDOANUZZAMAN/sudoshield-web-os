// Tanjiro ElevenLabs ConvAI Widget Integration
(function() {
    'use strict';
    
    class TanjiroConvAIIntegration {
        constructor() {
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.isWidgetVisible = false;
            this.convaiWidget = null;
            
            this.init();
        }
        
        init() {
            console.log('🤖 Initializing Tanjiro ConvAI Integration...');
            this.loadConvAIScript();
            this.enhanceTanjiroWidget();
        }
        
        loadConvAIScript() {
            // Check if script already exists
            if (document.querySelector('script[src*="convai-widget-embed"]')) {
                console.log('✅ ConvAI script already loaded');
                setTimeout(() => this.setupConvAIWidget(), 1000);
                return;
            }
            
            // Load ElevenLabs ConvAI script
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
            script.type = 'text/javascript';
            script.async = true;
            
            script.onload = () => {
                console.log('✅ ConvAI script loaded successfully');
                setTimeout(() => this.setupConvAIWidget(), 1000);
            };
            
            script.onerror = () => {
                console.error('❌ Failed to load ConvAI script');
            };
            
            document.head.appendChild(script);
        }
        
        setupConvAIWidget() {
            // Create the ConvAI widget element
            this.convaiWidget = document.createElement('elevenlabs-convai');
            this.convaiWidget.setAttribute('agent-id', this.agentId);
            this.convaiWidget.id = 'tanjiro-convai-widget';
            
            // Style the widget
            this.convaiWidget.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 9998;
                display: none;
                border-radius: 15px;
                border: 3px solid #c41e3a;
                box-shadow: 0 10px 30px rgba(196, 30, 58, 0.5);
                background: rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
            `;
            
            document.body.appendChild(this.convaiWidget);
            console.log('✅ ConvAI widget created and styled');
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (document.querySelector('#tanjiro-widget')) {
                    this.addConvAIButton();
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        addConvAIButton() {
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            const controls = tanjiroWidget?.querySelector('.tanjiro-controls');
            
            if (controls) {
                const convAIButton = document.createElement('button');
                convAIButton.className = 'tanjiro-btn tanjiro-convai-btn';
                convAIButton.innerHTML = '🎯';
                convAIButton.title = 'Talk to AI Agent Tanjiro';
                
                controls.insertBefore(convAIButton, controls.firstChild);
                
                convAIButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleConvAI();
                });
                
                console.log('✅ ConvAI button added to Tanjiro widget');
            }
            
            this.addStyles();
            this.showWelcomeMessage();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-convai-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-convai-styles';
            style.textContent = `
                .tanjiro-convai-btn {
                    background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%) !important;
                    border: 2px solid #8b0000 !important;
                    position: relative;
                    overflow: hidden;
                }
                
                .tanjiro-convai-btn:hover {
                    background: linear-gradient(135deg, #8b0000 0%, #c41e3a 100%) !important;
                    box-shadow: 0 0 20px rgba(196, 30, 58, 0.8) !important;
                    transform: scale(1.05) !important;
                }
                
                .tanjiro-convai-btn.active {
                    background: linear-gradient(135deg, #27ae60 0%, #229954 100%) !important;
                    border: 2px solid #229954 !important;
                    animation: convaiActive 2s ease-in-out infinite !important;
                }
                
                .tanjiro-convai-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s;
                }
                
                .tanjiro-convai-btn:hover::before {
                    left: 100%;
                }
                
                @keyframes convaiActive {
                    0%, 100% { 
                        box-shadow: 0 0 15px rgba(39, 174, 96, 0.6);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 25px rgba(39, 174, 96, 0.9);
                        transform: scale(1.02);
                    }
                }
                
                /* Widget animations */
                #tanjiro-convai-widget {
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                #tanjiro-convai-widget.show {
                    display: block !important;
                    animation: slideInUp 0.6s ease-out;
                }
                
                #tanjiro-convai-widget.hide {
                    animation: slideOutDown 0.4s ease-in;
                }
                
                @keyframes slideInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(50px) scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes slideOutDown {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(50px) scale(0.8);
                    }
                }
                
                /* Tanjiro widget enhancement when ConvAI is active */
                #tanjiro-widget.convai-mode {
                    border: 3px solid #c41e3a !important;
                    box-shadow: 0 0 25px rgba(196, 30, 58, 0.6) !important;
                    animation: convaiGlow 3s ease-in-out infinite !important;
                }
                
                @keyframes convaiGlow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(196, 30, 58, 0.4);
                    }
                    50% { 
                        box-shadow: 0 0 35px rgba(196, 30, 58, 0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        toggleConvAI() {
            if (this.isWidgetVisible) {
                this.hideConvAI();
            } else {
                this.showConvAI();
            }
        }
        
        showConvAI() {
            if (!this.convaiWidget) {
                console.error('❌ ConvAI widget not ready yet');
                this.showTanjiroMessage('ConvAI widget is still loading... Please wait a moment and try again!');
                return;
            }
            
            console.log('🎯 Showing ConvAI widget');
            this.isWidgetVisible = true;
            
            // Update button
            const button = document.querySelector('.tanjiro-convai-btn');
            if (button) {
                button.classList.add('active');
                button.innerHTML = '💬';
                button.title = 'Hide AI Conversation';
            }
            
            // Update Tanjiro widget
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            if (tanjiroWidget) {
                tanjiroWidget.classList.add('convai-mode');
            }
            
            // Show ConvAI widget with animation
            this.convaiWidget.style.display = 'block';
            this.convaiWidget.classList.remove('hide');
            this.convaiWidget.classList.add('show');
            
            this.showTanjiroMessage('AI Agent connected! Use the voice widget below to talk directly with my AI consciousness!');
        }
        
        hideConvAI() {
            console.log('🎯 Hiding ConvAI widget');
            this.isWidgetVisible = false;
            
            // Update button
            const button = document.querySelector('.tanjiro-convai-btn');
            if (button) {
                button.classList.remove('active');
                button.innerHTML = '🎯';
                button.title = 'Talk to AI Agent Tanjiro';
            }
            
            // Update Tanjiro widget
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            if (tanjiroWidget) {
                tanjiroWidget.classList.remove('convai-mode');
            }
            
            // Hide ConvAI widget with animation
            if (this.convaiWidget) {
                this.convaiWidget.classList.remove('show');
                this.convaiWidget.classList.add('hide');
                
                setTimeout(() => {
                    this.convaiWidget.style.display = 'none';
                }, 400);
            }
            
            this.showTanjiroMessage('AI conversation closed. Click the target button to reconnect!');
        }
        
        showTanjiroMessage(message) {
            const widget = document.querySelector('#tanjiro-widget');
            if (widget) {
                const bubble = widget.querySelector('.tanjiro-speech-bubble');
                if (bubble) {
                    bubble.textContent = message;
                    bubble.classList.add('show');
                    
                    setTimeout(() => {
                        bubble.classList.remove('show');
                    }, Math.min(message.length * 80, 8000));
                }
            }
            console.log(`💬 Tanjiro: ${message}`);
        }
        
        showWelcomeMessage() {
            setTimeout(() => {
                this.showTanjiroMessage('Click the red target 🎯 button to connect with my AI agent for voice conversation!');
            }, 2000);
        }
    }
    
    // Initialize when DOM is ready
    function initTanjiroConvAI() {
        new TanjiroConvAIIntegration();
        console.log('🤖 Tanjiro ConvAI Integration Ready!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroConvAI);
    } else {
        initTanjiroConvAI();
    }
    
})();