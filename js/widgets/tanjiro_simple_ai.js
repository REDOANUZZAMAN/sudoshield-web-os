// Tanjiro AI Voice - Simplified Working Version
(function() {
    'use strict';
    
    class TanjiroSimpleAI {
        constructor() {
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT'; // updated voice id
            this.isAIActive = false;
            
            this.responses = [
                "Hello! I'm Tanjiro Kamado! How can I help you today?",
                "Total Concentration! I'm here to protect everyone!",
                "My nose is telling me you're a kind person!",
                "Water Breathing technique ready! What do you need?",
                "I'll never give up! Neither should you!",
                "Nezuko and I are here to help!",
                "Keep moving forward with determination!",
                "I can sense your strong spirit!",
                "Don't lose hope! There's always light ahead!",
                "Together we can overcome any challenge!"
            ];
            
            this.init();
        }
        
        init() {
            console.log('🤖 Tanjiro Simple AI initializing...');
            this.enhanceTanjiroWidget();
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.integrateWithWidget();
                    console.log('✅ Tanjiro widget integrated');
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        integrateWithWidget() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Add simple AI button
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const aiButton = document.createElement('button');
                aiButton.className = 'tanjiro-btn tanjiro-simple-ai-btn';
                aiButton.innerHTML = '🗣️';
                aiButton.title = 'AI Voice (Click to speak)';
                
                controls.insertBefore(aiButton, controls.firstChild);
                
                aiButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.speakRandomResponse();
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
                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%) !important;
                    border: 2px solid #009944 !important;
                    animation: simplePulse 2s ease-in-out infinite !important;
                }
                
                .tanjiro-simple-ai-btn:hover {
                    background: linear-gradient(135deg, #00cc66 0%, #00ff88 100%) !important;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.8) !important;
                }
                
                @keyframes simplePulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        async speakRandomResponse() {
            const response = this.responses[Math.floor(Math.random() * this.responses.length)];
            console.log(`🗣️ Speaking: "${response}"`);
            
            // Show in speech bubble
            this.showInBubble(response);
            
            // Speak with ElevenLabs
            try {
                await this.speakWithElevenLabs(response);
                console.log('✅ ElevenLabs speech successful');
            } catch (error) {
                console.error('❌ ElevenLabs failed, using browser TTS:', error);
                this.speakWithBrowser(response);
            }
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
                    }, 5000);
                }
            }
        }
        
        async speakWithElevenLabs(text) {
            const url = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`;
            
            const response = await fetch(url, {
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
                throw new Error(`ElevenLabs API error: ${response.status}`);
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
                
                // Try to find a good voice
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
    let tanjiroSimpleAI = null;
    
    function initTanjiroSimpleAI() {
        if (!tanjiroSimpleAI) {
            tanjiroSimpleAI = new TanjiroSimpleAI();
            console.log('🗣️ Tanjiro Simple AI initialized!');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroSimpleAI);
    } else {
        initTanjiroSimpleAI();
    }
    
    // Expose for testing
    window.tanjiroSimpleAI = {
        speak: () => {
            if (tanjiroSimpleAI) {
                tanjiroSimpleAI.speakRandomResponse();
            }
        },
        test: () => {
            console.log('🧪 Testing Tanjiro Simple AI...');
            if (tanjiroSimpleAI) {
                tanjiroSimpleAI.speakRandomResponse();
            }
        }
    };
})();