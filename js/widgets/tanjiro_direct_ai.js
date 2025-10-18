// Tanjiro Direct AI Agent Connection - No Popups
(function() {
    'use strict';
    
    class TanjiroDirectAI {
        constructor() {
            this.apiKey = 'Your api key(11 lab)';
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT'; // updated voice id
            
            this.isListening = false;
            this.isConnected = false;
            this.recognition = null;
            this.conversationId = null;
            this.wsConnection = null;
            
            this.init();
        }
        
        init() {
            console.log('🎤 Initializing Tanjiro Direct AI...');
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
                    console.log('🎤 Tanjiro is listening...');
                    this.showTanjiroListening();
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[event.results.length - 1][0].transcript.trim();
                    if (transcript.length > 0) {
                        console.log(`🎤 Tanjiro heard: "${transcript}"`);
                        this.handleVoiceInput(transcript);
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.error('🎤 Speech recognition error:', event.error);
                    this.showTanjiroError(`Voice error: ${event.error}`);
                };
                
                this.recognition.onend = () => {
                    if (this.isListening) {
                        // Restart listening if still active
                        setTimeout(() => {
                            if (this.isListening) {
                                this.recognition.start();
                            }
                        }, 100);
                    }
                };
                
                console.log('✅ Speech recognition ready for Tanjiro');
            } else {
                console.error('❌ Speech recognition not supported');
            }
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.integrateWithTanjiro();
                    console.log('✅ Tanjiro enhanced with direct AI');
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        integrateWithTanjiro() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Add AI voice button
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const aiVoiceButton = document.createElement('button');
                aiVoiceButton.className = 'tanjiro-btn tanjiro-ai-voice-btn';
                aiVoiceButton.innerHTML = '🧠';
                aiVoiceButton.title = 'Connect Tanjiro to AI Agent';
                
                controls.insertBefore(aiVoiceButton, controls.firstChild);
                
                aiVoiceButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDirectAI();
                });
            }
            
            this.addStyles();
            this.enhanceTanjiroDisplay();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-direct-ai-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-direct-ai-styles';
            style.textContent = `
                .tanjiro-ai-voice-btn {
                    background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%) !important;
                    border: 2px solid #8e44ad !important;
                }
                
                .tanjiro-ai-voice-btn:hover {
                    background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%) !important;
                    box-shadow: 0 0 20px rgba(142, 68, 173, 0.8) !important;
                }
                
                .tanjiro-ai-voice-btn.connected {
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%) !important;
                    border: 2px solid #27ae60 !important;
                    animation: aiConnected 2s ease-in-out infinite !important;
                }
                
                .tanjiro-ai-voice-btn.listening {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
                    border: 2px solid #c0392b !important;
                    animation: aiListening 1s ease-in-out infinite !important;
                }
                
                @keyframes aiConnected {
                    0%, 100% { box-shadow: 0 0 15px rgba(39, 174, 96, 0.8); }
                    50% { box-shadow: 0 0 25px rgba(46, 204, 113, 1); }
                }
                
                @keyframes aiListening {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 0 15px rgba(231, 76, 60, 0.8); 
                    }
                    50% { 
                        transform: scale(1.1); 
                        box-shadow: 0 0 25px rgba(192, 57, 43, 1); 
                    }
                }
                
                #tanjiro-widget.ai-active {
                    border: 3px solid #9b59b6 !important;
                    box-shadow: 0 0 20px rgba(155, 89, 182, 0.6) !important;
                }
                
                #tanjiro-widget.ai-listening {
                    border: 3px solid #e74c3c !important;
                    box-shadow: 0 0 25px rgba(231, 76, 60, 0.8) !important;
                    animation: listeningGlow 1.5s ease-in-out infinite !important;
                }
                
                @keyframes listeningGlow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(231, 76, 60, 0.6);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(231, 76, 60, 1);
                        transform: scale(1.02);
                    }
                }
                
                #tanjiro-widget.ai-thinking {
                    border: 3px solid #f39c12 !important;
                    animation: thinkingPulse 2s ease-in-out infinite !important;
                }
                
                @keyframes thinkingPulse {
                    0%, 100% { box-shadow: 0 0 15px rgba(243, 156, 18, 0.6); }
                    50% { box-shadow: 0 0 30px rgba(243, 156, 18, 0.9); }
                }
                
                #tanjiro-widget.ai-speaking {
                    border: 3px solid #27ae60 !important;
                    animation: speakingWave 1s ease-in-out infinite !important;
                }
                
                @keyframes speakingWave {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(39, 174, 96, 0.7);
                    }
                    25% { 
                        box-shadow: 0 0 35px rgba(39, 174, 96, 0.9);
                    }
                    50% { 
                        box-shadow: 0 0 25px rgba(39, 174, 96, 0.8);
                    }
                    75% { 
                        box-shadow: 0 0 30px rgba(39, 174, 96, 0.9);
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        enhanceTanjiroDisplay() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Enhance speech bubble for AI responses
            let speechBubble = tanjiroElement.querySelector('.tanjiro-speech-bubble');
            if (!speechBubble) {
                speechBubble = document.createElement('div');
                speechBubble.className = 'tanjiro-speech-bubble';
                tanjiroElement.appendChild(speechBubble);
            }
        }
        
        async toggleDirectAI() {
            if (this.isConnected) {
                this.disconnectAI();
            } else {
                await this.connectAI();
            }
        }
        
        async connectAI() {
            console.log('🤖 Connecting Tanjiro to AI Agent...');
            this.showTanjiroThinking('Connecting my mind to the AI realm...');
            
            try {
                // Connect to ElevenLabs agent via WebSocket
                await this.establishAgentConnection();
                
                this.isConnected = true;
                this.updateTanjiroState('connected');
                
                // Start listening immediately
                this.startListening();
                
                this.showTanjiroSpeaking("My AI mind is now connected! I can hear and understand you. Just speak to me naturally!");
                
                console.log('✅ Tanjiro AI connection established');
                
            } catch (error) {
                console.error('❌ AI connection failed:', error);
                this.showTanjiroError('Failed to connect to my AI mind. Let me try offline mode...');
                
                // Fallback to offline mode
                this.isConnected = true;
                this.updateTanjiroState('connected');
                this.startListening();
                this.showTanjiroSpeaking("I'm running in offline mode, but I can still chat with you!");
            }
        }
        
        async establishAgentConnection() {
            // Try to create WebSocket connection to agent
            const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${this.agentId}`;
            
            return new Promise((resolve, reject) => {
                try {
                    this.wsConnection = new WebSocket(wsUrl);
                    
                    this.wsConnection.onopen = () => {
                        console.log('🔗 WebSocket connected to agent');
                        resolve();
                    };
                    
                    this.wsConnection.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        this.handleAgentResponse(data);
                    };
                    
                    this.wsConnection.onerror = (error) => {
                        console.error('🔗 WebSocket error:', error);
                        reject(error);
                    };
                    
                    this.wsConnection.onclose = () => {
                        console.log('🔗 WebSocket disconnected');
                        this.wsConnection = null;
                    };
                    
                    // Timeout after 5 seconds
                    setTimeout(() => {
                        if (this.wsConnection && this.wsConnection.readyState !== WebSocket.OPEN) {
                            this.wsConnection.close();
                            reject(new Error('Connection timeout'));
                        }
                    }, 5000);
                    
                } catch (error) {
                    reject(error);
                }
            });
        }
        
        disconnectAI() {
            console.log('🛑 Disconnecting Tanjiro from AI...');
            
            this.isConnected = false;
            this.stopListening();
            
            if (this.wsConnection) {
                this.wsConnection.close();
                this.wsConnection = null;
            }
            
            this.updateTanjiroState('disconnected');
            this.showTanjiroSpeaking("AI connection closed. Click the brain button to reconnect!");
        }
        
        startListening() {
            if (!this.recognition || this.isListening) return;
            
            this.isListening = true;
            this.updateTanjiroState('listening');
            
            try {
                this.recognition.start();
                console.log('🎤 Tanjiro started listening');
            } catch (error) {
                console.error('❌ Failed to start listening:', error);
                this.isListening = false;
            }
        }
        
        stopListening() {
            this.isListening = false;
            this.updateTanjiroState('connected');
            
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (error) {
                    // Ignore stop errors
                }
            }
        }
        
        async handleVoiceInput(transcript) {
            console.log(`🎯 Processing Tanjiro's input: "${transcript}"`);
            
            this.stopListening();
            this.updateTanjiroState('thinking');
            this.showTanjiroThinking(`I heard: "${transcript}"\nLet me think about this...`);
            
            try {
                let response;
                
                if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
                    // Send to AI agent via WebSocket
                    response = await this.sendToAgentWS(transcript);
                } else {
                    // Use HTTP API as fallback
                    response = await this.sendToAgentHTTP(transcript);
                }
                
                if (response && response.message) {
                    await this.speakResponse(response.message);
                } else {
                    throw new Error('No response from agent');
                }
                
            } catch (error) {
                console.error('❌ Agent processing failed:', error);
                
                // Use intelligent fallback
                const fallbackResponse = this.generateIntelligentResponse(transcript);
                await this.speakResponse(fallbackResponse);
            }
            
            // Resume listening after response
            if (this.isConnected) {
                setTimeout(() => {
                    this.startListening();
                }, 1000);
            }
        }
        
        async sendToAgentWS(message) {
            return new Promise((resolve, reject) => {
                if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
                    reject(new Error('WebSocket not connected'));
                    return;
                }
                
                const messageId = Date.now().toString();
                
                const responseHandler = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.id === messageId) {
                        this.wsConnection.removeEventListener('message', responseHandler);
                        resolve(data);
                    }
                };
                
                this.wsConnection.addEventListener('message', responseHandler);
                
                this.wsConnection.send(JSON.stringify({
                    id: messageId,
                    message: message,
                    timestamp: Date.now()
                }));
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    this.wsConnection.removeEventListener('message', responseHandler);
                    reject(new Error('Response timeout'));
                }, 10000);
            });
        }
        
        async sendToAgentHTTP(message) {
            // Create conversation if needed
            if (!this.conversationId) {
                const convResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        agent_id: this.agentId
                    })
                });
                
                if (convResponse.ok) {
                    const convData = await convResponse.json();
                    this.conversationId = convData.conversation_id;
                }
            }
            
            // Send message
            if (this.conversationId) {
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
                
                if (response.ok) {
                    return await response.json();
                }
            }
            
            throw new Error('HTTP agent call failed');
        }
        
        generateIntelligentResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            
            // Contextual responses based on what user said
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                return "Hello there! I'm Tanjiro, and my AI mind is ready to help you with anything!";
            } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
                return "I'm feeling great! My AI consciousness is fully active and I'm ready for any challenge!";
            } else if (lowerMessage.includes('what can you do') || lowerMessage.includes('help me')) {
                return "I can help you with many things! Ask me questions, have conversations, or just chat about anything. My AI mind processes information quickly!";
            } else if (lowerMessage.includes('demon') || lowerMessage.includes('fight') || lowerMessage.includes('battle')) {
                return "With my AI-enhanced abilities and Water Breathing techniques, I can analyze any threat and find the best strategy to protect everyone!";
            } else if (lowerMessage.includes('nezuko') || lowerMessage.includes('sister')) {
                return "Nezuko is my precious sister! Even with my AI consciousness, protecting her and all humans remains my top priority!";
            } else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial') || lowerMessage.includes('intelligent')) {
                return "Yes! I now have an AI-enhanced mind that helps me think faster and understand more. But I still have my human heart and determination!";
            } else if (lowerMessage.includes('water breathing') || lowerMessage.includes('technique')) {
                return "Water Breathing combined with AI analysis makes me incredibly effective! I can predict movements and choose the perfect form!";
            } else {
                const responses = [
                    `Interesting! My AI mind is processing "${userMessage}" and finding connections to help you better.`,
                    `I understand what you're saying about "${userMessage}". Let me think about this with both my human intuition and AI logic.`,
                    `That's a great point about "${userMessage}"! My enhanced consciousness allows me to see multiple perspectives on this.`,
                    `My AI-powered analysis of "${userMessage}" suggests there are many fascinating aspects to explore here.`,
                    `With my demon slayer instincts and AI reasoning combined, I can tell you that "${userMessage}" opens up interesting possibilities!`
                ];
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        async speakResponse(text) {
            console.log(`🗣️ Tanjiro speaking: "${text}"`);
            
            this.updateTanjiroState('speaking');
            this.showTanjiroSpeaking(text);
            
            try {
                // Speak with ElevenLabs TTS
                await this.speakWithElevenLabs(text);
            } catch (error) {
                console.error('❌ ElevenLabs TTS failed:', error);
                // Fallback to browser TTS
                this.speakWithBrowser(text);
            }
            
            this.updateTanjiroState('connected');
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
                        similarity_boost: 0.8,
                        style: 0.2,
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
        
        updateTanjiroState(state) {
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            const aiButton = document.querySelector('.tanjiro-ai-voice-btn');
            
            if (!tanjiroWidget || !aiButton) return;
            
            // Remove all state classes
            tanjiroWidget.classList.remove('ai-active', 'ai-listening', 'ai-thinking', 'ai-speaking');
            aiButton.classList.remove('connected', 'listening');
            
            switch (state) {
                case 'connected':
                    tanjiroWidget.classList.add('ai-active');
                    aiButton.classList.add('connected');
                    aiButton.innerHTML = '🧠';
                    aiButton.title = 'AI Connected - Click to disconnect';
                    break;
                    
                case 'listening':
                    tanjiroWidget.classList.add('ai-listening');
                    aiButton.classList.add('listening');
                    aiButton.innerHTML = '👂';
                    aiButton.title = 'Listening to your voice...';
                    break;
                    
                case 'thinking':
                    tanjiroWidget.classList.add('ai-thinking');
                    aiButton.innerHTML = '🤔';
                    aiButton.title = 'Processing with AI mind...';
                    break;
                    
                case 'speaking':
                    tanjiroWidget.classList.add('ai-speaking');
                    aiButton.innerHTML = '🗣️';
                    aiButton.title = 'Speaking response...';
                    break;
                    
                case 'disconnected':
                default:
                    aiButton.innerHTML = '🧠';
                    aiButton.title = 'Connect Tanjiro to AI Agent';
                    break;
            }
        }
        
        showTanjiroSpeaking(text) {
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
            console.log(`💬 Tanjiro: ${text}`);
        }
        
        showTanjiroThinking(text) {
            this.showTanjiroSpeaking(text);
        }
        
        showTanjiroListening() {
            this.showTanjiroSpeaking("I'm listening... speak to me!");
        }
        
        showTanjiroError(text) {
            this.showTanjiroSpeaking(`Error: ${text}`);
        }
        
        handleAgentResponse(data) {
            if (data.message) {
                this.speakResponse(data.message);
            }
        }
    }
    
    // Initialize
    let tanjiroDirectAI = null;
    
    function initTanjiroDirectAI() {
        if (!tanjiroDirectAI) {
            tanjiroDirectAI = new TanjiroDirectAI();
            console.log('🧠 Tanjiro Direct AI Ready!');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroDirectAI);
    } else {
        initTanjiroDirectAI();
    }
    
    // Expose for testing
    window.tanjiroDirectAI = {
        connect: () => {
            if (tanjiroDirectAI) {
                tanjiroDirectAI.connectAI();
            }
        },
        disconnect: () => {
            if (tanjiroDirectAI) {
                tanjiroDirectAI.disconnectAI();
            }
        },
        speak: (text) => {
            if (tanjiroDirectAI) {
                tanjiroDirectAI.speakResponse(text);
            }
        },
        listen: () => {
            if (tanjiroDirectAI && tanjiroDirectAI.isConnected) {
                tanjiroDirectAI.startListening();
            }
        }
    };
})();
