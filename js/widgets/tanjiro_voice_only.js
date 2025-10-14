// Tanjiro AI Voice Integration with ElevenLabs (Voice-Only Mode)
(function() {
    'use strict';
    
    class TanjiroAIVoice {
        constructor() {
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.isAIActive = false;
            this.conversationId = null;
            this.voiceSettings = {
                voiceId: 'T8aK56J4KvNPVFuqu7nT', // updated voice id
                stability: 0.5,
                similarityBoost: 0.8,
                style: 0.0,
                useSpeakerBoost: true
            };
            
            this.responses = [
                "Total Concentration! How can I help you today?",
                "I can smell your determination! What's on your mind?",
                "Water Breathing technique... ready to assist!",
                "Don't give up! I'm here to support you!",
                "Nezuko and I are here to help protect everyone!",
                "The bonds we share make us stronger! How can I help?",
                "I'll never let anyone down! What do you need?",
                "Keep moving forward! Together we can overcome anything!",
                "My nose is telling me you need assistance!",
                "Stay strong! I believe in your potential!"
            ];
            
            this.init();
        }
        
        init() {
            this.enhanceTanjiroWidget();
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
                
                // Add click handler for AI voice toggle
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
                        // Generate AI response when no text provided
                        if (this.isAIActive) {
                            this.generateAIResponse();
                        } else {
                            // Show default quote
                            const quote = this.responses[Math.floor(Math.random() * this.responses.length)];
                            originalSpeak(quote);
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
                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%) !important;
                    border: 2px solid #009944 !important;
                }
                
                @keyframes aiPulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 0 15px rgba(0, 255, 136, 0.8); 
                    }
                    50% { 
                        transform: scale(1.1); 
                        box-shadow: 0 0 25px rgba(0, 255, 136, 1); 
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        toggleAIMode() {
            const aiButton = document.querySelector('.tanjiro-ai-btn');
            
            if (!this.isAIActive) {
                // Activate AI mode
                this.isAIActive = true;
                if (aiButton) {
                    aiButton.classList.add('active');
                    aiButton.innerHTML = '🗣️';
                    aiButton.title = 'AI Voice Active (Click to disable)';
                }
                
                // Show activation message
                this.showActivationMessage();
                
                console.log('🤖 AI Voice Mode: ACTIVATED');
                
            } else {
                // Deactivate AI mode
                this.isAIActive = false;
                if (aiButton) {
                    aiButton.classList.remove('active');
                    aiButton.innerHTML = '🤖';
                    aiButton.title = 'AI Voice Mode';
                }
                
                // Show deactivation message
                if (window.tanjiroWidget && window.tanjiroWidget.speak) {
                    window.tanjiroWidget.speak("AI voice mode deactivated. Back to normal mode!");
                }
                
                console.log('🤖 AI Voice Mode: DEACTIVATED');
            }
        }
        
        showActivationMessage() {
            const activationMessages = [
                "AI voice mode activated! I can now speak with enhanced intelligence!",
                "ElevenLabs AI connected! My voice is now powered by artificial intelligence!",
                "AI mode engaged! I'm ready to have intelligent conversations!",
                "Connected to my AI brain! Let's talk with enhanced capabilities!",
                "AI voice system online! I can now provide more intelligent responses!"
            ];
            
            const message = activationMessages[Math.floor(Math.random() * activationMessages.length)];
            
            // Show in speech bubble
            if (window.tanjiroWidget) {
                const widget = document.querySelector('#tanjiro-widget');
                if (widget) {
                    const bubble = widget.querySelector('.tanjiro-speech-bubble');
                    if (bubble) {
                        bubble.textContent = message;
                        bubble.classList.add('show');
                        
                        setTimeout(() => {
                            bubble.classList.remove('show');
                        }, 5000);
                    }
                }
            }
            
            // Speak it with AI voice
            this.speakText(message);
        }
        
        async generateAIResponse() {
            if (!this.isAIActive) return;
            
            try {
                // Try to get AI response from ElevenLabs agent
                const response = await this.callElevenLabsAgent("Hello, tell me something interesting!");
                
                if (response && response.message) {
                    this.showTanjiroResponse(response.message);
                    await this.speakText(response.message);
                } else {
                    throw new Error('No AI response');
                }
                
            } catch (error) {
                console.error('AI Response error:', error);
                
                // Fallback to enhanced responses
                const enhancedResponse = this.getEnhancedResponse();
                this.showTanjiroResponse(enhancedResponse);
                await this.speakText(enhancedResponse);
            }
        }
        
        getEnhancedResponse() {
            const enhancedResponses = [
                "My AI tells me you're a wonderful person! Keep being amazing!",
                "Through my enhanced intelligence, I can sense your strong spirit!",
                "My artificial neural networks are processing... You have great potential!",
                "The AI algorithms in my mind say you're destined for greatness!",
                "My enhanced cognitive abilities detect kindness in your heart!",
                "Processing through my AI consciousness... You bring light to others!",
                "My digital intuition tells me you make the world a better place!",
                "Through machine learning, I've determined you're truly special!",
                "My AI-powered empathy sensors are picking up your positive energy!",
                "Artificial intelligence combined with my demon slayer instincts... You're incredible!"
            ];
            
            return enhancedResponses[Math.floor(Math.random() * enhancedResponses.length)];
        }
        
        async callElevenLabsAgent(message) {
            // Note: This is a simplified version - you'll need your actual API implementation
            const agentUrl = `https://api.elevenlabs.io/v1/convai/conversations`;
            
            try {
                // Start or continue conversation
                if (!this.conversationId) {
                    const startResponse = await fetch(agentUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'xi-api-key': 'YOUR_ELEVENLABS_API_KEY' // Replace with your API key
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
                        mode: 'text'
                    })
                });
                
                return await messageResponse.json();
                
            } catch (error) {
                console.error('ElevenLabs API Error:', error);
                return null;
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
                    }, Math.min(text.length * 80, 8000)); // Show longer for longer text
                }
            }
        }
        
        async speakText(text) {
            if (!this.isAIActive) return;
            
            try {
                // Use ElevenLabs Text-to-Speech API
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceSettings.voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': 'YOUR_ELEVENLABS_API_KEY' // Replace with your API key
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
    }
    
    // Initialize Tanjiro AI Voice
    let tanjiroAIVoice = null;
    
    function initTanjiroAIVoice() {
        if (!tanjiroAIVoice) {
            tanjiroAIVoice = new TanjiroAIVoice();
            console.log('🗣️ Tanjiro AI Voice Mode Initialized!');
        }
    }
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroAIVoice);
    } else {
        initTanjiroAIVoice();
    }
    
    // Expose to window
    window.tanjiroAIVoice = {
        toggleAI: () => {
            if (tanjiroAIVoice) {
                tanjiroAIVoice.toggleAIMode();
            }
        },
        speak: (text) => {
            if (tanjiroAIVoice) {
                tanjiroAIVoice.speakText(text);
            }
        },
        generateResponse: () => {
            if (tanjiroAIVoice) {
                tanjiroAIVoice.generateAIResponse();
            }
        }
    };
})();