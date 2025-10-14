// Tanjiro One-Click Direct Voice AI Agent
(function() {
    'use strict';
    
    class TanjiroOneClickAI {
        constructor() {
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT';
            this.webhookUrl = 'https://n8n.bytevia.tech/webhook/947d8534-6be2-4332-9a97-ab8b7de6c804';
            
            this.isActive = false;
            this.isListening = false;
            this.recognition = null;
            this.audioContext = null;
            this.conversationActive = false;
            this.currentAudio = null;
            
            this.init();
        }
        
        init() {
            console.log('🎯 Initializing Tanjiro One-Click AI...');
            this.setupSpeechRecognition();
            this.enhanceTanjiroWidget();
        }
        
        setupSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new SpeechRecognition();
                
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                
                this.recognition.onstart = () => {
                    console.log('🎤 Listening for voice...');
                    this.updateUI('listening');
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[event.results.length - 1][0].transcript.trim();
                    if (transcript.length > 0) {
                        console.log(`🎤 User said: "${transcript}"`);
                        
                        // Stop any playing audio immediately when user speaks
                        this.stopCurrentAudio();
                        
                        this.handleVoiceInput(transcript);
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.error('🎤 Speech error:', event.error);
                    if (event.error === 'no-speech') {
                        // Restart listening if just silence
                        if (this.conversationActive) {
                            setTimeout(() => {
                                if (this.conversationActive) {
                                    this.startListening();
                                }
                            }, 500);
                        }
                    }
                };
                
                this.recognition.onend = () => {
                    // Auto-restart if conversation is still active
                    if (this.conversationActive && !this.isListening) {
                        setTimeout(() => {
                            if (this.conversationActive) {
                                this.startListening();
                            }
                        }, 500);
                    }
                };
                
                console.log('✅ Speech recognition ready');
            } else {
                console.error('❌ Speech recognition not supported');
                alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            }
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (document.querySelector('#tanjiro-widget')) {
                    this.addVoiceButton();
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        addVoiceButton() {
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            const controls = tanjiroWidget?.querySelector('.tanjiro-controls');
            
            if (controls) {
                const voiceButton = document.createElement('button');
                voiceButton.className = 'tanjiro-btn tanjiro-oneclick-btn';
                voiceButton.innerHTML = '🎙️';
                voiceButton.title = 'One-Click Voice AI - Talk Directly to Agent';
                
                controls.insertBefore(voiceButton, controls.firstChild);
                
                voiceButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleVoiceAI();
                });
                
                console.log('✅ One-click voice button added');
            }
            
            this.addStyles();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-oneclick-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-oneclick-styles';
            style.textContent = `
                .tanjiro-oneclick-btn {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
                    border: 2px solid #c0392b !important;
                    font-size: 24px !important;
                    transition: all 0.3s ease !important;
                }
                
                .tanjiro-oneclick-btn:hover {
                    background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%) !important;
                    box-shadow: 0 0 20px rgba(231, 76, 60, 0.8) !important;
                    transform: scale(1.1) !important;
                }
                
                .tanjiro-oneclick-btn.active {
                    background: linear-gradient(135deg, #27ae60 0%, #229954 100%) !important;
                    border: 2px solid #229954 !important;
                    animation: voiceActive 1.5s ease-in-out infinite !important;
                }
                
                .tanjiro-oneclick-btn.listening {
                    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
                    border: 2px solid #2980b9 !important;
                    animation: voiceListening 1s ease-in-out infinite !important;
                }
                
                .tanjiro-oneclick-btn.thinking {
                    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%) !important;
                    border: 2px solid #e67e22 !important;
                    animation: voiceThinking 2s linear infinite !important;
                }
                
                .tanjiro-oneclick-btn.speaking {
                    background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%) !important;
                    border: 2px solid #8e44ad !important;
                    animation: voiceSpeaking 0.6s ease-in-out infinite !important;
                }
                
                @keyframes voiceActive {
                    0%, 100% { 
                        box-shadow: 0 0 15px rgba(39, 174, 96, 0.6);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(39, 174, 96, 1);
                        transform: scale(1.05);
                    }
                }
                
                @keyframes voiceListening {
                    0%, 100% { 
                        box-shadow: 0 0 15px rgba(52, 152, 219, 0.6);
                        transform: scale(1) rotate(0deg);
                    }
                    50% { 
                        box-shadow: 0 0 25px rgba(52, 152, 219, 1);
                        transform: scale(1.08) rotate(5deg);
                    }
                }
                
                @keyframes voiceThinking {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes voiceSpeaking {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.05); }
                    50% { transform: scale(1.1); }
                    75% { transform: scale(1.05); }
                }
                
                #tanjiro-widget.voice-mode {
                    /* No visual change when voice is active */
                }
            `;
            document.head.appendChild(style);
        }
        
        async toggleVoiceAI() {
            if (this.conversationActive) {
                this.stopConversation();
                this.stopCurrentAudio(); // Stop audio immediately
            } else {
                await this.startConversation();
            }
        }
        
        async startConversation() {
            console.log('🎯 Starting voice conversation...');
            this.conversationActive = true;
            this.updateUI('active');
            
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            if (tanjiroWidget) {
                tanjiroWidget.classList.add('voice-mode');
            }
            
            // Start listening immediately
            this.startListening();
        }
        
        stopConversation() {
            console.log('🛑 Stopping conversation...');
            this.conversationActive = false;
            this.stopListening();
            this.stopCurrentAudio();
            this.updateUI('inactive');
            
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            if (tanjiroWidget) {
                tanjiroWidget.classList.remove('voice-mode');
            }
        }
        
        startListening() {
            if (!this.recognition || this.isListening || !this.conversationActive) return;
            
            this.isListening = true;
            this.updateUI('listening');
            
            try {
                this.recognition.start();
                console.log('🎤 Started listening...');
            } catch (error) {
                console.error('❌ Failed to start listening:', error);
                this.isListening = false;
                
                // Try again after a moment if still active
                setTimeout(() => {
                    if (this.conversationActive && !this.isListening) {
                        this.startListening();
                    }
                }, 1000);
            }
        }
        
        stopListening() {
            this.isListening = false;
            
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (error) {
                    // Ignore stop errors
                }
            }
        }
        
        async handleVoiceInput(transcript) {
            console.log(`🎯 User said: "${transcript}"`);
            
            // Ensure audio is stopped (already stopped in onresult but double-check)
            this.stopCurrentAudio();
            
            // Stop listening while processing
            this.stopListening();
            this.updateUI('thinking');
            
            try {
                // Send to webhook and get response
                const webhookResponse = await this.sendToWebhook(transcript);
                
                // Only speak if conversation is still active
                if (this.conversationActive) {
                    await this.speakResponse(webhookResponse);
                }
                
            } catch (error) {
                console.error('❌ Webhook failed:', error);
                if (this.conversationActive) {
                    await this.speakResponse('Sorry, I could not connect to the AI agent. Please try again.');
                }
            }
            
            // Continue listening if conversation still active
            if (this.conversationActive) {
                this.startListening();
            }
        }
        
        async sendToWebhook(userMessage) {
            console.log(`📤 Sending to webhook: "${userMessage}"`);
            
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });
            
            console.log(`📥 Webhook status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`Webhook returned ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📥 Webhook response:', data);
            
            // Return whatever message webhook sends back
            return data.response || data.message || data.text || data.reply || JSON.stringify(data);
        }
        
        getFallbackResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            // Greetings
            if (lowerMessage.match(/\b(hello|hi|hey|greetings)\b/)) {
                const greetings = [
                    "Hello! I'm Tanjiro! It's great to talk with you!",
                    "Hi there! My name is Tanjiro Kamado. How can I help you today?",
                    "Greetings! I'm happy to have this conversation with you!"
                ];
                return greetings[Math.floor(Math.random() * greetings.length)];
            }
            
            // How are you
            if (lowerMessage.match(/\b(how are you|how do you feel|are you okay)\b/)) {
                return "I'm doing great! My spirit is strong and I'm ready to help you with anything!";
            }
            
            // Questions about capabilities
            if (lowerMessage.match(/\b(what can you do|help me|capabilities)\b/)) {
                return "I can have conversations with you about anything! Ask me questions, tell me your thoughts, or just chat naturally. I'm here to listen and respond!";
            }
            
            // Demon Slayer topics
            if (lowerMessage.match(/\b(demon|fight|breathing|technique|sword)\b/)) {
                return "As a demon slayer, I use Water Breathing techniques! My mission is to protect people from demons and find a cure for Nezuko!";
            }
            
            // Nezuko
            if (lowerMessage.match(/\b(nezuko|sister)\b/)) {
                return "Nezuko is my precious sister! She's a kind demon who protects humans. I'll never give up on finding a way to turn her back into a human!";
            }
            
            // AI/Technology
            if (lowerMessage.match(/\b(ai|artificial|intelligence|voice|talk)\b/)) {
                return "Yes! I'm using AI technology to understand and respond to you! It's amazing how we can have a natural conversation like this!";
            }
            
            // Emotional support
            if (lowerMessage.match(/\b(sad|worried|scared|problem|difficult)\b/)) {
                return "I understand. Remember, no matter how dark things seem, there's always hope! I believe in you, and I'm here to support you!";
            }
            
            // Positive messages
            if (lowerMessage.match(/\b(thank|thanks|great|awesome|amazing)\b/)) {
                return "You're very welcome! It makes me happy to help! Is there anything else you'd like to talk about?";
            }
            
            // Default responses
            const defaultResponses = [
                `That's interesting! Tell me more about "${userMessage}". I'm listening!`,
                `I understand what you're saying. My enhanced senses tell me you have more to share about this!`,
                `Your words about "${userMessage}" remind me of the importance of understanding different perspectives!`,
                `That's a thoughtful point! Like in battle, sometimes we need to carefully consider all aspects!`,
                `I hear you! Just as I trained to become a demon slayer, I'm learning from our conversation about "${userMessage}"!`
            ];
            
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        async speakResponse(text) {
            console.log(`🗣️ Speaking: "${text}"`);
            this.updateUI('speaking');
            
            try {
                await this.speakWithElevenLabs(text);
            } catch (error) {
                console.error('❌ TTS failed, using browser:', error);
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
                        stability: 0.6,
                        similarity_boost: 0.85,
                        style: 0.3,
                        use_speaker_boost: true
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`TTS failed: ${response.status}`);
            }
            
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            this.currentAudio = new Audio(audioUrl);
            
            return new Promise((resolve, reject) => {
                this.currentAudio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    this.currentAudio = null;
                    resolve();
                };
                
                this.currentAudio.onerror = (error) => {
                    URL.revokeObjectURL(audioUrl);
                    this.currentAudio = null;
                    reject(error);
                };
                
                this.currentAudio.play().catch(reject);
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
        
        stopCurrentAudio() {
            // Stop ElevenLabs audio
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio = null;
                console.log('🛑 Stopped current audio');
            }
            
            // Stop browser speech synthesis
            if ('speechSynthesis' in window && speechSynthesis.speaking) {
                speechSynthesis.cancel();
                console.log('🛑 Stopped browser speech');
            }
        }
        
        updateUI(state) {
            const button = document.querySelector('.tanjiro-oneclick-btn');
            if (!button) return;
            
            // Remove all state classes
            button.classList.remove('active', 'listening', 'thinking', 'speaking');
            
            switch (state) {
                case 'active':
                    button.classList.add('active');
                    button.innerHTML = '✅';
                    button.title = 'Voice AI Active - Talking...';
                    break;
                case 'listening':
                    button.classList.add('listening');
                    button.innerHTML = '🎤';
                    button.title = 'Listening to your voice...';
                    break;
                case 'thinking':
                    button.classList.add('thinking');
                    button.innerHTML = '🤔';
                    button.title = 'Thinking...';
                    break;
                case 'speaking':
                    button.classList.add('speaking');
                    button.innerHTML = '🗣️';
                    button.title = 'Speaking response...';
                    break;
                case 'inactive':
                default:
                    button.innerHTML = '🎙️';
                    button.title = 'One-Click Voice AI - Talk Directly to Agent';
                    break;
            }
        }
        
        showMessage(text) {
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
            console.log(`💬 ${text}`);
        }
    }
    
    // Initialize
    let tanjiroOneClickAI = null;
    
    function initOneClickAI() {
        tanjiroOneClickAI = new TanjiroOneClickAI();
        console.log('🎯 Tanjiro One-Click AI Ready!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOneClickAI);
    } else {
        initOneClickAI();
    }
    
    // Global access
    window.tanjiroOneClickAI = {
        start: () => tanjiroOneClickAI?.startConversation(),
        stop: () => tanjiroOneClickAI?.stopConversation(),
        speak: (text) => tanjiroOneClickAI?.speakResponse(text)
    };
    
})();