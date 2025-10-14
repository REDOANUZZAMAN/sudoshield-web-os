// Tanjiro with ElevenLabs ConvAI Widget Integration
(function() {
    'use strict';
    
    class TanjiroConvAI {
        constructor() {
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.isWidgetReady = false;
            this.convaiWidget = null;
            
            this.init();
        }
        
        init() {
            console.log('🤖 Initializing Tanjiro ConvAI Widget...');
            this.waitForTanjiroWidget();
            this.loadConvAIWidget();
        }
        
        waitForTanjiroWidget() {
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.enhanceTanjiroWidget();
                    console.log('✅ Tanjiro widget found and enhanced');
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        loadConvAIWidget() {
            // Add the ConvAI widget script if not already loaded
            if (!document.querySelector('script[src*="convai-widget-embed"]')) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
                script.type = 'text/javascript';
                script.async = true;
                
                script.onload = () => {
                    console.log('✅ ConvAI widget script loaded');
                    this.setupConvAIWidget();
                };
                
                script.onerror = () => {
                    console.error('❌ Failed to load ConvAI widget script');
                };
                
                document.head.appendChild(script);
            } else {
                // Script already loaded, wait for it to initialize
                setTimeout(() => this.setupConvAIWidget(), 1000);
            }
        }
        
        setupConvAIWidget() {
            // Create the ConvAI widget element
            const convaiElement = document.createElement('elevenlabs-convai');
            convaiElement.setAttribute('agent-id', this.agentId);
            convaiElement.style.position = 'fixed';
            convaiElement.style.bottom = '20px';
            convaiElement.style.right = '20px';
            convaiElement.style.zIndex = '9999';
            convaiElement.style.display = 'none'; // Hidden by default
            convaiElement.id = 'tanjiro-convai-widget';
            
            document.body.appendChild(convaiElement);
            
            // Wait for the widget to initialize
            setTimeout(() => {
                this.convaiWidget = document.getElementById('tanjiro-convai-widget');
                this.isWidgetReady = true;
                console.log('✅ ConvAI widget ready');
            }, 2000);
        }
        
        enhanceTanjiroWidget() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Add AI conversation button to Tanjiro widget
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const aiButton = document.createElement('button');
                aiButton.className = 'tanjiro-btn tanjiro-ai-btn';
                aiButton.innerHTML = '🤖';
                aiButton.title = 'Talk with AI Tanjiro';
                
                controls.insertBefore(aiButton, controls.firstChild);
                
                aiButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleAIConversation();
                });
            }
            
            this.addStyles();
            this.createAIStatus();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-ai-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-ai-styles';
            style.textContent = `
                .tanjiro-ai-btn {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
                    border: 2px solid #0066cc !important;
                    position: relative;
                }
                
                .tanjiro-ai-btn:hover {
                    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%) !important;
                    box-shadow: 0 0 20px rgba(79, 172, 254, 0.8) !important;
                    transform: scale(1.1) !important;
                }
                
                .tanjiro-ai-btn.active {
                    animation: aiActive 2s ease-in-out infinite !important;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%) !important;
                    border: 2px solid #ff4444 !important;
                }
                
                @keyframes aiActive {
                    0%, 100% { 
                        box-shadow: 0 0 15px rgba(255, 107, 107, 0.8); 
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(255, 165, 0, 1); 
                    }
                }
                
                .tanjiro-ai-status {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.95);
                    color: white;
                    padding: 25px 35px;
                    border-radius: 20px;
                    border: 3px solid #c41e3a;
                    font-size: 18px;
                    font-weight: bold;
                    z-index: 10001;
                    display: none;
                    text-align: center;
                    min-width: 350px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
                }
                
                .tanjiro-ai-status.show {
                    display: block;
                    animation: statusFadeIn 0.4s ease-out;
                }
                
                .tanjiro-ai-status h3 {
                    margin: 0 0 15px 0;
                    color: #c41e3a;
                    font-size: 22px;
                }
                
                .tanjiro-ai-status p {
                    margin: 8px 0;
                    font-size: 16px;
                }
                
                @keyframes statusFadeIn {
                    0% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.7) rotateY(20deg); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1) rotateY(0deg); 
                    }
                }
                
                /* Style the ElevenLabs widget when visible */
                #tanjiro-convai-widget {
                    border-radius: 15px !important;
                    border: 3px solid #c41e3a !important;
                    box-shadow: 0 10px 30px rgba(196, 30, 58, 0.5) !important;
                }
                
                /* Hide the default ElevenLabs branding when integrated */
                #tanjiro-convai-widget iframe {
                    border-radius: 12px !important;
                }
            `;
            
            document.head.appendChild(style);
        }
        
        createAIStatus() {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'tanjiro-ai-status';
            statusDiv.className = 'tanjiro-ai-status';
            statusDiv.innerHTML = `
                <h3>🤖 AI Tanjiro</h3>
                <p>Click the 🤖 button to start voice conversation!</p>
                <p><em>Powered by ElevenLabs AI Agent</em></p>
            `;
            document.body.appendChild(statusDiv);
        }
        
        showStatus(title, message, duration = 4000) {
            const statusDiv = document.getElementById('tanjiro-ai-status');
            if (statusDiv) {
                statusDiv.innerHTML = `
                    <h3>🤖 ${title}</h3>
                    <p>${message}</p>
                `;
                statusDiv.classList.add('show');
                
                if (duration > 0) {
                    setTimeout(() => {
                        statusDiv.classList.remove('show');
                    }, duration);
                }
            }
            console.log(`🤖 ${title}: ${message}`);
        }
        
        hideStatus() {
            const statusDiv = document.getElementById('tanjiro-ai-status');
            if (statusDiv) {
                statusDiv.classList.remove('show');
            }
        }
        
        toggleAIConversation() {
            if (!this.isWidgetReady) {
                this.showStatus('Loading...', 'AI widget is still loading, please wait a moment!');
                return;
            }
            
            const aiButton = document.querySelector('.tanjiro-ai-btn');
            const convaiWidget = document.getElementById('tanjiro-convai-widget');
            
            if (!convaiWidget) {
                this.showStatus('Error', 'AI widget not found! Refreshing page...');
                setTimeout(() => location.reload(), 2000);
                return;
            }
            
            if (convaiWidget.style.display === 'none') {
                // Show the ConvAI widget
                this.showAIWidget();
                
                if (aiButton) {
                    aiButton.classList.add('active');
                    aiButton.innerHTML = '🗣️';
                    aiButton.title = 'Hide AI Conversation';
                }
                
                this.showStatus('AI Connected!', 'You can now speak with AI Tanjiro using the widget below!', 3000);
                
            } else {
                // Hide the ConvAI widget
                this.hideAIWidget();
                
                if (aiButton) {
                    aiButton.classList.remove('active');
                    aiButton.innerHTML = '🤖';
                    aiButton.title = 'Talk with AI Tanjiro';
                }
                
                this.hideStatus();
            }
        }
        
        showAIWidget() {
            const convaiWidget = document.getElementById('tanjiro-convai-widget');
            if (convaiWidget) {
                convaiWidget.style.display = 'block';
                convaiWidget.style.animation = 'slideInUp 0.5s ease-out';
                
                // Add slide animation
                if (!document.getElementById('convai-animations')) {
                    const animStyle = document.createElement('style');
                    animStyle.id = 'convai-animations';
                    animStyle.textContent = `
                        @keyframes slideInUp {
                            0% { 
                                transform: translateY(100px); 
                                opacity: 0; 
                            }
                            100% { 
                                transform: translateY(0); 
                                opacity: 1; 
                            }
                        }
                        
                        @keyframes slideOutDown {
                            0% { 
                                transform: translateY(0); 
                                opacity: 1; 
                            }
                            100% { 
                                transform: translateY(100px); 
                                opacity: 0; 
                            }
                        }
                    `;
                    document.head.appendChild(animStyle);
                }
            }
        }
        
        hideAIWidget() {
            const convaiWidget = document.getElementById('tanjiro-convai-widget');
            if (convaiWidget) {
                convaiWidget.style.animation = 'slideOutDown 0.3s ease-in';
                
                setTimeout(() => {
                    convaiWidget.style.display = 'none';
                }, 300);
            }
        }
        
        // Method to programmatically show Tanjiro speaking
        showTanjiroSpeaking(message) {
            const widget = document.querySelector('#tanjiro-widget');
            if (widget) {
                const bubble = widget.querySelector('.tanjiro-speech-bubble');
                if (bubble) {
                    bubble.textContent = message;
                    bubble.classList.add('show');
                    
                    setTimeout(() => {
                        bubble.classList.remove('show');
                    }, Math.min(message.length * 80, 6000));
                }
            }
        }
    }
    
    // Initialize
    let tanjiroConvAI = null;
    
    function initTanjiroConvAI() {
        if (!tanjiroConvAI) {
            tanjiroConvAI = new TanjiroConvAI();
            console.log('🤖 Tanjiro ConvAI Integration Ready!');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroConvAI);
    } else {
        initTanjiroConvAI();
    }
    
    // Expose for testing and external control
    window.tanjiroConvAI = {
        show: () => {
            if (tanjiroConvAI) {
                tanjiroConvAI.showAIWidget();
            }
        },
        hide: () => {
            if (tanjiroConvAI) {
                tanjiroConvAI.hideAIWidget();
            }
        },
        toggle: () => {
            if (tanjiroConvAI) {
                tanjiroConvAI.toggleAIConversation();
            }
        },
        speak: (message) => {
            if (tanjiroConvAI) {
                tanjiroConvAI.showTanjiroSpeaking(message);
            }
        }
    };
})();