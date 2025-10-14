// Tanjiro AI Agent Integration with ElevenLabs
(function() {
    'use strict';
    
    class TanjiroAIAgent {
        constructor() {
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.isConversationActive = false;
            this.conversationId = null;
            this.audioQueue = [];
            this.isPlaying = false;
            this.voiceSettings = {
                voiceId: 'T8aK56J4KvNPVFuqu7nT', // updated voice id
                stability: 0.5,
                similarityBoost: 0.8,
                style: 0.0,
                useSpeakerBoost: true
            };
            
            this.init();
        }
        
        init() {
            this.enhanceTanjiroWidget();
            this.setupVoiceControls();
            this.addConversationUI();
        }
        
        enhanceTanjiroWidget() {
            // Wait for Tanjiro widget to load
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.integrateWithWidget();
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        integrateWithWidget() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Add AI voice button to controls
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const aiButton = document.createElement('button');
                aiButton.className = 'tanjiro-btn tanjiro-ai-btn';
                aiButton.setAttribute('data-action', 'ai-voice');
                aiButton.innerHTML = '🤖';
                aiButton.title = 'AI Voice Mode';
                
                // Insert AI button as first button
                controls.insertBefore(aiButton, controls.firstChild);
                
                // Add click handler for direct AI connection
                aiButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleAIMode();
                });
            }
            
            // Override speak function to use AI voice
            if (window.tanjiroWidget.speak) {
                const originalSpeak = window.tanjiroWidget.speak;
                window.tanjiroWidget.speak = (text) => {
                    if (text) {
                        // Show text in bubble
                        originalSpeak(text);
                        // Also speak with AI voice if AI mode is active
                        if (this.isAIActive) {
                            this.speakText(text);
                        }
                    } else {
                        // Generate AI response
                        if (this.isAIActive) {
                            this.generateRandomResponse();
                        }
                    }
                };
            }
            
            // Add styles for AI integration
            this.addAIStyles();
        }
        
        addAIStyles() {
            if (document.getElementById('tanjiro-ai-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-ai-styles';
            style.textContent = `
                .tanjiro-ai-btn {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
                    border: 2px solid #0066cc !important;
                }
                
                .tanjiro-ai-btn:hover {
                    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%) !important;
                    box-shadow: 0 0 15px rgba(79, 172, 254, 0.8) !important;
                }
                
                .tanjiro-ai-btn.active {
                    animation: aiPulse 1s ease-in-out infinite !important;
                }
                
                @keyframes aiPulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(79, 172, 254, 0.8); }
                    50% { transform: scale(1.1); box-shadow: 0 0 25px rgba(79, 172, 254, 1); }
                }
                
                .tanjiro-input-overlay {
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    z-index: 10000;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s ease;
                    transform: translateY(20px);
                }
                
                .tanjiro-input-overlay.show {
                    opacity: 1;
                    pointer-events: all;
                    transform: translateY(0);
                }
                
                .tanjiro-quick-input {
                    background: linear-gradient(135deg, #1a3d1f 0%, #0d1f0f 100%);
                    border: 3px solid #c41e3a;
                    border-radius: 15px;
                    padding: 20px;
                    min-width: 300px;
                    max-width: 400px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                
                .tanjiro-input-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    color: white;
                    font-weight: bold;
                }
                
                .tanjiro-input-header span {
                    color: #c41e3a;
                    font-size: 16px;
                }
                
                .tanjiro-input-header button {
                    background: none;
                    border: none;
                    color: #c41e3a;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.3s;
                }
                
                .tanjiro-input-header button:hover {
                    background: rgba(196, 30, 58, 0.2);
                }
                
                .tanjiro-input-wrapper {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                
                .tanjiro-input-wrapper input {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #c41e3a;
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    font-size: 14px;
                    outline: none;
                }
                
                .tanjiro-input-wrapper input:focus {
                    border-color: #4facfe;
                    box-shadow: 0 0 5px rgba(79, 172, 254, 0.5);
                }
                
                .tanjiro-input-wrapper button {
                    padding: 12px 20px;
                    background: #c41e3a;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.3s;
                    white-space: nowrap;
                }
                
                .tanjiro-input-wrapper button:hover {
                    background: #a01729;
                }
                
                .tanjiro-input-wrapper button:disabled {
                    background: #666;
                    cursor: not-allowed;
                }
                
                .tanjiro-input-status {
                    text-align: center;
                    color: #4facfe;
                    font-size: 12px;
                    font-style: italic;
                    margin-top: 5px;
                }
            `;
            
            document.head.appendChild(style);
        }
        
        addConversationUI() {
            // Create simple input overlay for direct chat
            const overlay = document.createElement('div');
            overlay.id = 'tanjiro-input-overlay';
            overlay.className = 'tanjiro-input-overlay';
            
            overlay.innerHTML = `
                <div class="tanjiro-quick-input">
                    <div class="tanjiro-input-header">
                        <span>� Chat with Tanjiro</span>
                        <button id="tanjiro-close-input">×</button>
                    </div>
                    <div class="tanjiro-input-wrapper">
                        <input type="text" id="tanjiro-quick-message" placeholder="Type your message to Tanjiro..." maxlength="500">
                        <button id="tanjiro-quick-send">Send</button>
                    </div>
                    <div class="tanjiro-input-status" id="tanjiro-input-status">Connected to AI Agent</div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Add event listeners
            this.setupQuickInputEvents(overlay);
        }
        
        setupQuickInputEvents(overlay) {
            const input = overlay.querySelector('#tanjiro-quick-message');
            const sendBtn = overlay.querySelector('#tanjiro-quick-send');
            const closeBtn = overlay.querySelector('#tanjiro-close-input');
            
            // Send message
            const sendMessage = () => {
                const message = input.value.trim();
                if (message) {
                    this.sendQuickMessage(message);
                    input.value = '';
                }
            };
            
            sendBtn.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Close overlay
            closeBtn.addEventListener('click', () => this.closeQuickInput());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeQuickInput();
                }
            });
            
            // Initialize voice as enabled
            this.voiceEnabled = true;
        }
        
        setupVoiceControls() {
            // Add voice recording capability if needed
            this.setupSpeechRecognition();
        }
        
        setupSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    const input = document.querySelector('#tanjiro-message-input');
                    if (input) {
                        input.value = transcript;
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.warn('Speech recognition error:', event.error);
                };
            }
        }
        
        oneClickConnect() {
            const aiButton = document.querySelector('.tanjiro-ai-btn');
            
            if (aiButton) {
                // Show connecting animation
                aiButton.classList.add('active');
                aiButton.innerHTML = '⚡';
                aiButton.title = 'Connecting to AI...';
            }
            
            // Show quick greeting and enable AI mode
            this.showAIGreeting();
            this.isConversationActive = true;
            
            // Show quick input
            this.showQuickInput();
        }
        
        showAIGreeting() {
            const greetings = [
                "Hello! I'm connected to my AI now! Ask me anything!",
                "AI mode activated! How can I help you today?",
                "Connected to ElevenLabs! What would you like to talk about?",
                "I'm ready to chat! My AI powers are at your service!",
                "AI Tanjiro online! Let's have a conversation!"
            ];
            
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            
            if (window.tanjiroWidget && window.tanjiroWidget.speak) {
                // Use original speak to show in bubble
                const widget = document.querySelector('#tanjiro-widget .tanjiro-character');
                if (widget) {
                    const originalSpeak = document.querySelector('#tanjiro-widget .tanjiro-speech-bubble');
                    if (originalSpeak) {
                        originalSpeak.textContent = greeting;
                        originalSpeak.classList.add('show');
                        
                        setTimeout(() => {
                            originalSpeak.classList.remove('show');
                        }, 4000);
                    }
                }
            }
            
            // Also speak it
            this.speakText(greeting);
        }
        
        showQuickInput() {
            const overlay = document.querySelector('#tanjiro-input-overlay');
            if (overlay) {
                overlay.classList.add('show');
                
                // Focus input
                const input = overlay.querySelector('#tanjiro-quick-message');
                if (input) {
                    setTimeout(() => input.focus(), 300);
                }
            }
        }
        
        closeQuickInput() {
            const overlay = document.querySelector('#tanjiro-input-overlay');
            const aiButton = document.querySelector('.tanjiro-ai-btn');
            
            if (overlay) {
                overlay.classList.remove('show');
            }
            
            if (aiButton) {
                aiButton.classList.remove('active');
                aiButton.innerHTML = '🤖';
                aiButton.title = 'Connect to AI Agent';
            }
            
            this.isConversationActive = false;
        }
        
        async sendQuickMessage(message) {
            const status = document.querySelector('#tanjiro-input-status');
            const sendBtn = document.querySelector('#tanjiro-quick-send');
            
            // Update status
            if (status) status.textContent = 'Tanjiro is thinking...';
            if (sendBtn) sendBtn.disabled = true;
            
            try {
                // Call ElevenLabs Conversational AI
                const response = await this.callElevenLabsAgent(message);
                
                if (response && response.message) {
                    // Show Tanjiro's response in speech bubble
                    this.showTanjiroResponse(response.message);
                    
                    // Make Tanjiro speak the response
                    if (this.voiceEnabled) {
                        await this.speakText(response.message);
                    }
                    
                    // Make widget react
                    this.animateWidget(response.message);
                    
                    if (status) status.textContent = 'Connected to AI Agent';
                } else {
                    throw new Error('No response from agent');
                }
                
            } catch (error) {
                console.error('Agent conversation error:', error);
                
                // Fallback response
                const fallbackResponse = this.getFallbackResponse(message);
                this.showTanjiroResponse(fallbackResponse);
                
                if (this.voiceEnabled) {
                    await this.speakText(fallbackResponse);
                }
                
                if (status) status.textContent = 'Using offline mode';
            }
            
            if (sendBtn) sendBtn.disabled = false;
        }
        
        async callElevenLabsAgent(message) {
            // Note: This is a simplified version
            // You'll need to implement the actual ElevenLabs Conversational AI API call
            // The exact implementation depends on ElevenLabs' API structure
            
            const agentUrl = `https://api.elevenlabs.io/v1/convai/conversations`;
            
            try {
                // Start or continue conversation
                if (!this.conversationId) {
                    // Start new conversation
                    const startResponse = await fetch(agentUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'xi-api-key': 'YOUR_ELEVENLABS_API_KEY' // You need to add your API key
                        },
                        body: JSON.stringify({
                            agent_id: this.agentId
                        })
                    });
                    
                    const conversationData = await startResponse.json();
                    this.conversationId = conversationData.conversation_id;
                }
                
                // Send message
                const messageResponse = await fetch(`${agentUrl}/${this.conversationId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': 'YOUR_ELEVENLABS_API_KEY'
                    },
                    body: JSON.stringify({
                        message: message,
                        mode: 'text' // or 'audio' if you want audio response
                    })
                });
                
                return await messageResponse.json();
                
            } catch (error) {
                console.error('ElevenLabs API Error:', error);
                return null;
            }
        }
        
        getFallbackResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // Tanjiro-style responses based on keywords
            if (lowerMessage.includes('demon') || lowerMessage.includes('fight')) {
                return "I'll protect everyone from demons! With my Water Breathing techniques, no demon can harm innocent people!";
            } else if (lowerMessage.includes('nezuko') || lowerMessage.includes('sister')) {
                return "Nezuko is my dear sister! She's different from other demons - she protects humans instead of eating them!";
            } else if (lowerMessage.includes('water breathing') || lowerMessage.includes('technique')) {
                return "Water Breathing is the technique I learned from Master Urokodaki! First Form: Water Surface Slash!";
            } else if (lowerMessage.includes('help') || lowerMessage.includes('protect')) {
                return "I'll always help those in need! It's my duty as a Demon Slayer to protect innocent people!";
            } else if (lowerMessage.includes('strong') || lowerMessage.includes('train')) {
                return "I must become stronger! Every day I train harder to protect everyone I care about!";
            } else if (lowerMessage.includes('sad') || lowerMessage.includes('hurt')) {
                return "Don't give up! No matter how difficult things get, we must keep moving forward with hope!";
            } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                return "Hello! I'm Tanjiro Kamado! It's nice to meet you! How can I help you today?";
            } else {
                const responses = [
                    "I understand your feelings. Let's work together to overcome any challenges!",
                    "That's interesting! Tell me more about what you're thinking.",
                    "I believe in the power of determination and kindness. What do you believe in?",
                    "Everyone has their own struggles, but we can support each other!",
                    "Stay strong! There's always hope, even in the darkest times!",
                    "I can smell your emotions... You seem like a good person!"
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        showTanjiroResponse(text) {
            // Show response in Tanjiro's speech bubble
            const widget = document.querySelector('#tanjiro-widget');
            if (widget) {
                const bubble = widget.querySelector('.tanjiro-speech-bubble');
                if (bubble) {
                    bubble.textContent = text;
                    bubble.classList.add('show');
                    
                    setTimeout(() => {
                        bubble.classList.remove('show');
                    }, Math.min(text.length * 100, 8000)); // Show longer for longer text
                }
            }
        }
        
        async speakText(text) {
            if (!this.voiceEnabled) return;
            
            try {
                // Use ElevenLabs Text-to-Speech API
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceSettings.voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': 'YOUR_ELEVENLABS_API_KEY'
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: 'eleven_monolingual_v1',
                        voice_settings: {
                            stability: this.voiceSettings.stability,
                            similarity_boost: this.voiceSettings.similarityBoost,
                            style: this.voiceSettings.style,
                            use_speaker_boost: this.voiceSettings.useSpeakerBoost
                        }
                    })
                });
                
                if (response.ok) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    return new Promise((resolve) => {
                        audio.onended = () => {
                            URL.revokeObjectURL(audioUrl);
                            resolve();
                        };
                        audio.play();
                    });
                }
            } catch (error) {
                console.error('TTS Error:', error);
                // Fallback to browser TTS
                this.fallbackSpeak(text);
            }
        }
        
        fallbackSpeak(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.volume = 0.8;
                
                // Try to find a suitable voice
                const voices = speechSynthesis.getVoices();
                const maleVoice = voices.find(voice => 
                    voice.name.includes('Male') || 
                    voice.name.includes('David') ||
                    voice.name.includes('Daniel')
                );
                
                if (maleVoice) {
                    utterance.voice = maleVoice;
                }
                
                speechSynthesis.speak(utterance);
            }
        }
        
        animateWidget(message) {
            if (!window.tanjiroWidget) return;
            
            // Determine animation based on message content
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('attack') || lowerMessage.includes('fight') || lowerMessage.includes('breathing')) {
                window.tanjiroWidget.attack();
            } else if (lowerMessage.includes('walk') || lowerMessage.includes('move')) {
                window.tanjiroWidget.walk();
            }
        }
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }
    
    // Initialize Tanjiro AI Agent
    let tanjiroAI = null;
    
    function initTanjiroAI() {
        if (!tanjiroAI) {
            tanjiroAI = new TanjiroAIAgent();
            console.log('🤖 Tanjiro AI Agent Initialized!');
        }
    }
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroAI);
    } else {
        initTanjiroAI();
    }
    
    // Expose to window
    window.tanjiroAI = {
        connect: () => {
            if (tanjiroAI) {
                tanjiroAI.oneClickConnect();
            }
        },
        speak: (text) => {
            if (tanjiroAI) {
                tanjiroAI.speakText(text);
            }
        },
        sendMessage: (message) => {
            if (tanjiroAI) {
                tanjiroAI.sendQuickMessage(message);
            }
        }
    };
})();