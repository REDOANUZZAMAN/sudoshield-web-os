// Tanjiro Full Voice Conversation with ElevenLabs Agent
(function() {
    'use strict';
    
    class TanjiroVoiceConversation {
        constructor() {
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c';
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT'; // updated voice id
            
            this.isListening = false;
            this.isConnected = false;
            this.conversationId = null;
            this.recognition = null;
            
            this.init();
        }
        
        init() {
            console.log('🎤 Initializing Tanjiro Voice Conversation...');
            this.setupSpeechRecognition();
            this.enhanceTanjiroWidget();
        }
        
        setupSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                
                this.recognition.onstart = () => {
                    console.log('🎤 Listening started...');
                    this.showStatus('Listening... Speak now!');
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    console.log(`🎤 Heard: "${transcript}"`);
                    this.handleVoiceInput(transcript);
                };
                
                this.recognition.onerror = (event) => {
                    console.error('🎤 Speech recognition error:', event.error);
                    this.showStatus(`Voice error: ${event.error}`);
                    this.stopListening();
                };
                
                this.recognition.onend = () => {
                    console.log('🎤 Listening stopped');
                    this.stopListening();
                };
                
                console.log('✅ Speech recognition ready');
            } else {
                console.error('❌ Speech recognition not supported');
                alert('Sorry! Your browser doesn\'t support speech recognition. Please use Chrome or Edge.');
            }
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.integrateWithWidget();
                    console.log('✅ Tanjiro widget integrated with voice conversation');
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        integrateWithWidget() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Add voice conversation button
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const voiceButton = document.createElement('button');
                voiceButton.className = 'tanjiro-btn tanjiro-voice-btn';
                voiceButton.innerHTML = '🎤';
                voiceButton.title = 'Voice Conversation with AI Agent';
                
                controls.insertBefore(voiceButton, controls.firstChild);
                
                voiceButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleVoiceConversation();
                });
            }
            
            this.addStyles();
            this.createStatusDisplay();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-voice-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-voice-styles';
            style.textContent = `
                .tanjiro-voice-btn {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%) !important;
                    border: 2px solid #ff4444 !important;
                }
                
                .tanjiro-voice-btn:hover {
                    background: linear-gradient(135deg, #ffa500 0%, #ff6b6b 100%) !important;
                    box-shadow: 0 0 15px rgba(255, 107, 107, 0.8) !important;
                }
                
                .tanjiro-voice-btn.listening {
                    animation: listeningPulse 1s ease-in-out infinite !important;
                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%) !important;
                    border: 2px solid #009944 !important;
                }
                
                .tanjiro-voice-btn.connected {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
                    border: 2px solid #0066cc !important;
                }
                
                @keyframes listeningPulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 0 15px rgba(0, 255, 136, 0.8); 
                    }
                    50% { 
                        transform: scale(1.2); 
                        box-shadow: 0 0 25px rgba(0, 255, 136, 1); 
                    }
                }
                
                .tanjiro-status-display {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 15px;
                    border: 3px solid #c41e3a;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 10000;
                    display: none;
                    text-align: center;
                    min-width: 300px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                
                .tanjiro-status-display.show {
                    display: block;
                    animation: fadeInScale 0.3s ease-out;
                }
                
                @keyframes fadeInScale {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        createStatusDisplay() {
            const statusDisplay = document.createElement('div');
            statusDisplay.id = 'tanjiro-status-display';
            statusDisplay.className = 'tanjiro-status-display';
            document.body.appendChild(statusDisplay);
        }
        
        showStatus(message, duration = 3000) {
            const statusDisplay = document.getElementById('tanjiro-status-display');
            if (statusDisplay) {
                statusDisplay.textContent = message;
                statusDisplay.classList.add('show');
                
                if (duration > 0) {
                    setTimeout(() => {
                        statusDisplay.classList.remove('show');
                    }, duration);
                }
            }
            console.log(`📱 Status: ${message}`);
        }
        
        hideStatus() {
            const statusDisplay = document.getElementById('tanjiro-status-display');
            if (statusDisplay) {
                statusDisplay.classList.remove('show');
            }
        }
        
        async toggleVoiceConversation() {
            if (this.isListening) {
                this.stopConversation();
            } else {
                await this.startConversation();
            }
        }
        
        async startConversation() {
            console.log('🤖 Starting voice conversation...');
            this.showStatus('Connecting to AI Agent...', 0);
            
            try {
                // Connect to ElevenLabs agent
                await this.connectToAgent();
                
                // Start listening
                this.startListening();
                
                const voiceButton = document.querySelector('.tanjiro-voice-btn');
                if (voiceButton) {
                    voiceButton.classList.add('connected');
                    voiceButton.innerHTML = '🗣️';
                    voiceButton.title = 'Connected - Click to stop';
                }
                
                this.isConnected = true;
                this.showStatus('Connected! Say "Hello Tanjiro" to start talking', 5000);
                
                // Initial greeting
                await this.speakResponse("Hello! I'm Tanjiro and I'm connected to my AI mind! Ask me anything!");
                
            } catch (error) {
                console.error('❌ Connection failed:', error);
                this.showStatus('Connection failed! Using offline mode');
                this.isConnected = false;
            }
        }
        
        stopConversation() {
            console.log('🛑 Stopping voice conversation...');
            
            this.stopListening();
            this.isConnected = false;
            this.conversationId = null;
            
            const voiceButton = document.querySelector('.tanjiro-voice-btn');
            if (voiceButton) {
                voiceButton.classList.remove('connected', 'listening');
                voiceButton.innerHTML = '🎤';
                voiceButton.title = 'Voice Conversation with AI Agent';
            }
            
            this.hideStatus();
            this.speakResponse("Voice conversation ended. Click the button to talk again!");
        }
        
        startListening() {
            if (!this.recognition) {
                console.error('❌ Speech recognition not available');
                return;
            }
            
            this.isListening = true;
            
            const voiceButton = document.querySelector('.tanjiro-voice-btn');
            if (voiceButton) {
                voiceButton.classList.add('listening');
            }
            
            try {
                this.recognition.start();
            } catch (error) {
                console.error('❌ Failed to start listening:', error);
                this.stopListening();
            }
        }
        
        stopListening() {
            this.isListening = false;
            
            const voiceButton = document.querySelector('.tanjiro-voice-btn');
            if (voiceButton) {
                voiceButton.classList.remove('listening');
            }
            
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (error) {
                    // Ignore stop errors
                }
            }
        }
        
        async connectToAgent() {
            console.log('🔌 Connecting to ElevenLabs agent...');
            
            // Try to create a conversation with the agent
            const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    agent_id: this.agentId
                })
            });
            
            if (!response.ok) {
                throw new Error(`Agent connection failed: ${response.status}`);
            }
            
            const data = await response.json();
            this.conversationId = data.conversation_id;
            console.log(`✅ Connected to agent: ${this.conversationId}`);
        }
        
        async handleVoiceInput(transcript) {
            console.log(`🎯 Processing: "${transcript}"`);
            this.showStatus(`You said: "${transcript}"\nGetting AI response...`, 0);
            
            try {
                // Send to ElevenLabs agent
                const response = await this.sendToAgent(transcript);
                
                if (response && response.message) {
                    console.log(`🤖 Agent response: "${response.message}"`);
                    await this.speakResponse(response.message);
                } else {
                    throw new Error('No response from agent');
                }
                
            } catch (error) {
                console.error('❌ Agent error:', error);
                
                // Fallback response
                const fallbackResponse = this.getFallbackResponse(transcript);
                await this.speakResponse(fallbackResponse);
            }
            
            // Continue listening after response
            if (this.isConnected) {
                setTimeout(() => {
                    this.showStatus('Listening for your next question...', 3000);
                    this.startListening();
                }, 2000);
            }
        }
        
        async sendToAgent(message) {
            if (!this.conversationId) {
                await this.connectToAgent();
            }
            
            console.log(`📤 Sending to agent: "${message}"`);
            
            const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${this.conversationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    message: message,
                    mode: 'text'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Agent message failed: ${response.status}`);
            }
            
            return await response.json();
        }
        
        getFallbackResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                return "Hello! I'm Tanjiro Kamado! It's great to hear your voice!";
            } else if (lowerMessage.includes('how are you')) {
                return "I'm doing great! Ready to help protect everyone and answer your questions!";
            } else if (lowerMessage.includes('demon') || lowerMessage.includes('fight')) {
                return "I'll protect everyone from demons with my Water Breathing techniques!";
            } else if (lowerMessage.includes('nezuko')) {
                return "Nezuko is my beloved sister! She's a good demon who protects humans!";
            } else if (lowerMessage.includes('water breathing')) {
                return "Water Breathing is my fighting style! First Form: Water Surface Slash!";
            } else {
                const responses = [
                    "I hear you! Let me think about that with my demon slayer wisdom.",
                    "That's interesting! My enhanced senses are telling me more about this.",
                    "I understand! With the power of friendship and determination, we can find answers.",
                    "My AI-enhanced mind is processing your question! Give me a moment.",
                    "That's a great question! My demon slayer training helps me think clearly about this."
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        async speakResponse(text) {
            console.log(`🗣️ Speaking: "${text}"`);
            this.showStatus(`Tanjiro: "${text}"`, 0);
            
            // Show in speech bubble
            this.showInBubble(text);
            
            try {
                // Speak with ElevenLabs
                await this.speakWithElevenLabs(text);
                console.log('✅ ElevenLabs speech completed');
            } catch (error) {
                console.error('❌ ElevenLabs speech failed:', error);
                // Fallback to browser TTS
                this.speakWithBrowser(text);
            }
            
            this.hideStatus();
        }
        
        showInBubble(text) {
            const widget = document.querySelector('#tanjiro-widget');
            if (widget) {
                const bubble = widget.querySelector('.tanjiro-speech-bubble');
                if (bubble) {
                    bubble.textContent = text;
                    bubble.classList.add('show');
                    
                    setTimeout(() => {
                        bubble.classList.remove('show');
                    }, Math.min(text.length * 80, 8000));
                }
            }
        }
        
        async speakWithElevenLabs(text) {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.8,
                        style: 0.0,
                        use_speaker_boost: true
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`TTS failed: ${response.status}`);
            }
            
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            return new Promise((resolve, reject) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve();
                };
                
                audio.onerror = (error) => {
                    URL.revokeObjectURL(audioUrl);
                    reject(error);
                };
                
                audio.play().catch(reject);
            });
        }
        
        speakWithBrowser(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.volume = 0.8;
                
                const voices = speechSynthesis.getVoices();
                const goodVoice = voices.find(voice => 
                    voice.name.includes('Google') || 
                    voice.name.includes('Male') ||
                    voice.name.includes('David')
                );
                
                if (goodVoice) {
                    utterance.voice = goodVoice;
                }
                
                speechSynthesis.speak(utterance);
            }
        }
    }
    
    // Initialize
    let tanjiroVoiceConv = null;
    
    function initTanjiroVoiceConversation() {
        if (!tanjiroVoiceConv) {
            tanjiroVoiceConv = new TanjiroVoiceConversation();
            console.log('🎤 Tanjiro Voice Conversation System Ready!');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroVoiceConversation);
    } else {
        initTanjiroVoiceConversation();
    }
    
    // Expose for testing
    window.tanjiroVoiceConv = {
        start: () => {
            if (tanjiroVoiceConv) {
                tanjiroVoiceConv.startConversation();
            }
        },
        stop: () => {
            if (tanjiroVoiceConv) {
                tanjiroVoiceConv.stopConversation();
            }
        },
        say: (text) => {
            if (tanjiroVoiceConv) {
                tanjiroVoiceConv.speakResponse(text);
            }
        }
    };
})();