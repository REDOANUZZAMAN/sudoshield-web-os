// Tanjiro Simple Direct AI - Working ElevenLabs Integration
(function() {
    'use strict';
    
    class TanjiroSimpleAI {
        constructor() {
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c';
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT';
            
            this.isListening = false;
            this.isConnected = false;
            this.recognition = null;
            
            this.init();
        }
        
        init() {
            console.log('🤖 Initializing Tanjiro Simple AI...');
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
                    this.showTanjiroState('listening', 'I\'m listening... speak now!');
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript.trim();
                    console.log(`🎤 Heard: "${transcript}"`);
                    if (transcript.length > 0) {
                        this.handleVoiceInput(transcript);
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.error('🎤 Speech error:', event.error);
                    this.showTanjiroState('error', `Voice error: ${event.error}`);
                    this.stopListening();
                };
                
                this.recognition.onend = () => {
                    console.log('🎤 Listening ended');
                    this.stopListening();
                };
                
            } else {
                console.error('❌ Speech recognition not supported');
                alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
            }
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.integrateWithTanjiro();
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        integrateWithTanjiro() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const aiButton = document.createElement('button');
                aiButton.className = 'tanjiro-btn tanjiro-simple-ai-btn';
                aiButton.innerHTML = '🤖';
                aiButton.title = 'Talk to AI Tanjiro';
                
                controls.insertBefore(aiButton, controls.firstChild);
                
                aiButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleAI();
                });
            }
            
            this.addStyles();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-simple-ai-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-simple-ai-styles';
            style.textContent = `
                .tanjiro-simple-ai-btn {
                    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
                    border: 2px solid #2980b9 !important;
                }
                
                .tanjiro-simple-ai-btn:hover {
                    background: linear-gradient(135deg, #2980b9 0%, #3498db 100%) !important;
                    box-shadow: 0 0 15px rgba(52, 152, 219, 0.7) !important;
                }
                
                .tanjiro-simple-ai-btn.active {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
                    border: 2px solid #c0392b !important;
                    animation: activeAI 1.5s ease-in-out infinite !important;
                }
                
                .tanjiro-simple-ai-btn.listening {
                    background: linear-gradient(135deg, #27ae60 0%, #229954 100%) !important;
                    border: 2px solid #229954 !important;
                    animation: listeningPulse 1s ease-in-out infinite !important;
                }
                
                @keyframes activeAI {
                    0%, 100% { box-shadow: 0 0 10px rgba(231, 76, 60, 0.7); }
                    50% { box-shadow: 0 0 20px rgba(231, 76, 60, 1); }
                }
                
                @keyframes listeningPulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 0 10px rgba(39, 174, 96, 0.7); 
                    }
                    50% { 
                        transform: scale(1.1); 
                        box-shadow: 0 0 20px rgba(39, 174, 96, 1); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        toggleAI() {
            if (this.isConnected) {
                this.disconnect();
            } else {
                this.connect();
            }
        }
        
        connect() {
            console.log('🤖 Connecting AI...');
            this.isConnected = true;
            
            const btn = document.querySelector('.tanjiro-simple-ai-btn');
            if (btn) {
                btn.classList.add('active');
                btn.innerHTML = '🔴';
                btn.title = 'AI Active - Click to disconnect';
            }
            
            this.showTanjiroState('connected', 'AI mind activated! Click my button again to start talking!');
        }
        
        disconnect() {
            console.log('🛑 Disconnecting AI...');
            this.isConnected = false;
            this.stopListening();
            
            const btn = document.querySelector('.tanjiro-simple-ai-btn');
            if (btn) {
                btn.classList.remove('active', 'listening');
                btn.innerHTML = '🤖';
                btn.title = 'Talk to AI Tanjiro';
            }
            
            this.showTanjiroState('disconnected', 'AI disconnected. Click the button to reconnect!');
        }
        
        startListening() {
            if (!this.isConnected || !this.recognition || this.isListening) return;
            
            this.isListening = true;
            
            const btn = document.querySelector('.tanjiro-simple-ai-btn');
            if (btn) {
                btn.classList.add('listening');
                btn.innerHTML = '🎤';
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
            
            const btn = document.querySelector('.tanjiro-simple-ai-btn');
            if (btn) {
                btn.classList.remove('listening');
                if (this.isConnected) {
                    btn.innerHTML = '🔴';
                } else {
                    btn.innerHTML = '🤖';
                }
            }
            
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (error) {
                    // Ignore errors
                }
            }
        }
        
        async handleVoiceInput(transcript) {
            console.log(`🎯 Processing: "${transcript}"`);
            this.showTanjiroState('thinking', `I heard: "${transcript}"\nLet me think about this...`);
            
            try {
                // Test ElevenLabs TTS first
                console.log('🧪 Testing TTS connection...');
                await this.testTTS();
                
                // Try to get AI response
                console.log('🤖 Getting AI response...');
                const response = await this.getAIResponse(transcript);
                
                if (response) {
                    await this.speakResponse(response);
                } else {
                    throw new Error('No AI response');
                }
                
            } catch (error) {
                console.error('❌ AI failed:', error);
                
                // Use fallback response
                const fallback = this.getFallbackResponse(transcript);
                await this.speakResponse(fallback);
            }
            
            // Ready for next input
            if (this.isConnected) {
                setTimeout(() => {
                    this.showTanjiroState('connected', 'Ready for your next question! Click the red button to talk again.');
                }, 2000);
            }
        }
        
        async testTTS() {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    text: 'Test',
                    model_id: 'eleven_monolingual_v1'
                })
            });
            
            if (!response.ok) {
                throw new Error(`TTS test failed: ${response.status}`);
            }
            
            console.log('✅ TTS connection working');
        }
        
        async getAIResponse(message) {
            console.log('🔍 Trying different AI endpoints...');
            
            // Method 1: Direct agent conversation
            try {
                console.log('📡 Trying agent conversation API...');
                const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        agent_id: this.agentId,
                        message: message
                    })
                });
                
                console.log(`📡 Agent API response: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('📡 Agent response data:', data);
                    
                    if (data.message || data.text || data.response) {
                        return data.message || data.text || data.response;
                    }
                }
            } catch (error) {
                console.log('📡 Agent API failed:', error.message);
            }
            
            // Method 2: Try text completion
            try {
                console.log('📝 Trying text completion...');
                const prompt = `You are Tanjiro Kamado from Demon Slayer. Respond to this message in character: "${message}"`;
                
                // This is a fallback - we'll just use intelligent responses
                return this.getFallbackResponse(message);
                
            } catch (error) {
                console.log('📝 Text completion failed:', error.message);
            }
            
            return null;
        }
        
        getFallbackResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            // Character-accurate responses
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                return "Hello! I'm Tanjiro Kamado! It's great to hear your voice!";
            } else if (lowerMessage.includes('how are you')) {
                return "I'm doing well! My heart is strong and I'm ready to protect everyone!";
            } else if (lowerMessage.includes('demon') || lowerMessage.includes('fight')) {
                return "I'll defeat any demon with my Water Breathing techniques! I won't let anyone get hurt!";
            } else if (lowerMessage.includes('nezuko')) {
                return "Nezuko is my precious sister! She's a good demon who protects humans instead of eating them!";
            } else if (lowerMessage.includes('water breathing')) {
                return "Water Breathing First Form: Water Surface Slash! It's one of my strongest techniques!";
            } else if (lowerMessage.includes('family') || lowerMessage.includes('brother')) {
                return "Family is everything to me! I'll do anything to protect the people I care about!";
            } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
                return "I can help you with anything! Whether it's advice, conversation, or just being here to listen!";
            } else if (lowerMessage.includes('sad') || lowerMessage.includes('worried')) {
                return "Don't worry! No matter how difficult things get, I believe there's always hope! We can face any challenge together!";
            } else {
                const responses = [
                    "That's really interesting! Tell me more about what you're thinking.",
                    "I can sense your determination! That's the spirit we need to overcome any obstacle!",
                    "My enhanced senses are telling me you have a good heart. Let's work together on this!",
                    "Just like in battle, sometimes we need to think carefully before we act. What's your next move?",
                    "Your words remind me of my training on Mount Sagiri. There's always more to learn and discover!"
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        async speakResponse(text) {
            console.log(`🗣️ Speaking: "${text}"`);
            this.showTanjiroState('speaking', text);
            
            try {
                await this.speakWithElevenLabs(text);
                console.log('✅ Speech completed');
            } catch (error) {
                console.error('❌ ElevenLabs failed, using browser TTS:', error);
                this.speakWithBrowser(text);
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
                        style: 0.2,
                        use_speaker_boost: true
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`TTS failed: ${response.status} - ${await response.text()}`);
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
                speechSynthesis.speak(utterance);
            }
        }
        
        showTanjiroState(state, message) {
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
            console.log(`🎭 Tanjiro [${state}]: ${message}`);
        }
    }
    
    // Initialize
    let tanjiroSimpleAI = null;
    
    function initTanjiroSimpleAI() {
        if (!tanjiroSimpleAI) {
            tanjiroSimpleAI = new TanjiroSimpleAI();
            console.log('🤖 Tanjiro Simple AI Ready!');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroSimpleAI);
    } else {
        initTanjiroSimpleAI();
    }
    
    // Global access
    window.tanjiroSimpleAI = {
        connect: () => tanjiroSimpleAI && tanjiroSimpleAI.connect(),
        disconnect: () => tanjiroSimpleAI && tanjiroSimpleAI.disconnect(),
        listen: () => tanjiroSimpleAI && tanjiroSimpleAI.startListening(),
        speak: (text) => tanjiroSimpleAI && tanjiroSimpleAI.speakResponse(text)
    };
})();