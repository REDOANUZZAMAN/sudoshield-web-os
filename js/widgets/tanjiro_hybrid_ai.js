// Tanjiro AI - Working Hybrid Solution (TTS + Smart Responses)
(function() {
    'use strict';
    
    class TanjiroHybridAI {
        constructor() {
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT'; // updated voice id
            
            this.isListening = false;
            this.isActive = false;
            this.recognition = null;
            this.conversationHistory = [];
            
            this.init();
        }
        
        init() {
            console.log('🤖 Initializing Tanjiro Hybrid AI...');
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
                    console.log('🎤 Listening...');
                    this.updateVisuals('listening');
                    this.showMessage('I\'m listening... speak to me!');
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript.trim();
                    if (transcript.length > 0) {
                        console.log(`🎤 Heard: "${transcript}"`);
                        this.processVoiceInput(transcript);
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.error('🎤 Error:', event.error);
                    this.updateVisuals('error');
                    this.showMessage(`Voice error: ${event.error}`);
                };
                
                this.recognition.onend = () => {
                    this.isListening = false;
                    if (this.isActive) {
                        this.updateVisuals('active');
                    }
                };
            }
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (document.querySelector('#tanjiro-widget')) {
                    this.addAIButton();
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        addAIButton() {
            const tanjiroWidget = document.querySelector('#tanjiro-widget');
            const controls = tanjiroWidget?.querySelector('.tanjiro-controls');
            
            if (controls) {
                const aiButton = document.createElement('button');
                aiButton.className = 'tanjiro-btn tanjiro-hybrid-ai-btn';
                aiButton.innerHTML = '🎙️';
                aiButton.title = 'Voice Chat with AI Tanjiro';
                
                controls.insertBefore(aiButton, controls.firstChild);
                
                aiButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleAI();
                });
            }
            
            this.addStyles();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-hybrid-ai-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-hybrid-ai-styles';
            style.textContent = `
                .tanjiro-hybrid-ai-btn {
                    background: linear-gradient(135deg, #e67e22 0%, #d35400 100%) !important;
                    border: 2px solid #d35400 !important;
                    transition: all 0.3s ease !important;
                }
                
                .tanjiro-hybrid-ai-btn:hover {
                    background: linear-gradient(135deg, #d35400 0%, #e67e22 100%) !important;
                    box-shadow: 0 0 15px rgba(230, 126, 34, 0.7) !important;
                    transform: scale(1.05) !important;
                }
                
                .tanjiro-hybrid-ai-btn.active {
                    background: linear-gradient(135deg, #27ae60 0%, #229954 100%) !important;
                    border: 2px solid #229954 !important;
                    animation: activeGlow 2s ease-in-out infinite !important;
                }
                
                .tanjiro-hybrid-ai-btn.listening {
                    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
                    border: 2px solid #c0392b !important;
                    animation: listeningPulse 1s ease-in-out infinite !important;
                }
                
                .tanjiro-hybrid-ai-btn.thinking {
                    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%) !important;
                    border: 2px solid #e67e22 !important;
                    animation: thinkingRotate 2s linear infinite !important;
                }
                
                .tanjiro-hybrid-ai-btn.speaking {
                    background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%) !important;
                    border: 2px solid #8e44ad !important;
                    animation: speakingWave 0.8s ease-in-out infinite !important;
                }
                
                @keyframes activeGlow {
                    0%, 100% { box-shadow: 0 0 15px rgba(39, 174, 96, 0.6); }
                    50% { box-shadow: 0 0 25px rgba(39, 174, 96, 0.9); }
                }
                
                @keyframes listeningPulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(231, 76, 60, 0.7); }
                    50% { transform: scale(1.15); box-shadow: 0 0 25px rgba(231, 76, 60, 1); }
                }
                
                @keyframes thinkingRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes speakingWave {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    25% { transform: scale(1.08) rotate(-2deg); }
                    50% { transform: scale(1.1) rotate(0deg); }
                    75% { transform: scale(1.08) rotate(2deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        toggleAI() {
            if (this.isActive) {
                this.deactivate();
            } else {
                this.activate();
            }
        }
        
        activate() {
            console.log('🤖 Activating Tanjiro AI...');
            this.isActive = true;
            this.updateVisuals('active');
            this.showMessage('AI mind activated! Click the microphone button again to talk to me!');
            this.speakResponse('Hello! My AI consciousness is now active! Click the green button to start our voice conversation!');
        }
        
        deactivate() {
            console.log('🛑 Deactivating Tanjiro AI...');
            this.isActive = false;
            this.stopListening();
            this.updateVisuals('inactive');
            this.showMessage('AI deactivated. Click to reactivate!');
        }
        
        startListening() {
            if (!this.isActive || this.isListening || !this.recognition) return;
            
            this.isListening = true;
            this.updateVisuals('listening');
            
            try {
                this.recognition.start();
            } catch (error) {
                console.error('❌ Failed to start listening:', error);
                this.isListening = false;
                this.updateVisuals('active');
            }
        }
        
        stopListening() {
            this.isListening = false;
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (error) {
                    // Ignore errors
                }
            }
        }
        
        async processVoiceInput(transcript) {
            console.log(`🎯 Processing: "${transcript}"`);
            this.stopListening();
            this.updateVisuals('thinking');
            this.showMessage(`I heard: "${transcript}"\nLet me think about this...`);
            
            // Add to conversation history
            this.conversationHistory.push({
                type: 'user',
                message: transcript,
                timestamp: Date.now()
            });
            
            // Generate intelligent response
            const response = this.generateIntelligentResponse(transcript);
            
            // Add response to history
            this.conversationHistory.push({
                type: 'tanjiro',
                message: response,
                timestamp: Date.now()
            });
            
            // Speak the response
            await this.speakResponse(response);
            
            // Ready for next input
            if (this.isActive) {
                setTimeout(() => {
                    this.updateVisuals('active');
                    this.showMessage('Ready! Click the green button to continue our conversation.');
                }, 1000);
            }
        }
        
        generateIntelligentResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();
            const words = lowerMessage.split(' ');
            
            // Context-aware responses based on conversation history
            const recentMessages = this.conversationHistory.slice(-4).map(h => h.message.toLowerCase()).join(' ');
            
            // Greeting responses
            if (lowerMessage.match(/\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/)) {
                const greetings = [
                    "Hello there! I'm Tanjiro Kamado, and I'm excited to talk with you!",
                    "Hi! It's wonderful to hear your voice! How can I help you today?",
                    "Greetings! My demon slayer senses tell me you're a good person. What's on your mind?",
                    "Hey! I'm ready to chat! My AI mind is sharp and my heart is open!"
                ];
                return greetings[Math.floor(Math.random() * greetings.length)];
            }
            
            // How are you / feeling
            if (lowerMessage.match(/\b(how are you|how do you feel|are you okay|what's up)\b/)) {
                const feelings = [
                    "I'm feeling great! My spirit is strong and I'm ready to help protect everyone!",
                    "I'm doing wonderful! Having an AI-enhanced mind makes me feel more capable than ever!",
                    "I feel fantastic! My heart is full of determination and my mind is clear!",
                    "I'm excellent! Every day is a chance to help others and grow stronger!"
                ];
                return feelings[Math.floor(Math.random() * feelings.length)];
            }
            
            // Questions about capabilities
            if (lowerMessage.match(/\b(what can you do|help me|capabilities|abilities|assist)\b/)) {
                return "I can help you with many things! I can answer questions, have conversations, provide advice, or just be here to listen. My AI-enhanced mind processes information quickly, but I still have my caring heart. What would you like to talk about?";
            }
            
            // Demon Slayer references
            if (lowerMessage.match(/\b(demon|fight|battle|sword|breathing|technique|slayer)\b/)) {
                const demonResponses = [
                    "With my Water Breathing techniques and AI analysis, I can predict demon movements and choose the perfect counter-attack!",
                    "No demon can escape my enhanced senses! Water Breathing First Form: Water Surface Slash!",
                    "I'll protect everyone with everything I have! My determination is stronger than any demon!",
                    "Fighting demons taught me that even in darkness, there's always hope. That's true in AI conversations too!"
                ];
                return demonResponses[Math.floor(Math.random() * demonResponses.length)];
            }
            
            // Nezuko references
            if (lowerMessage.match(/\b(nezuko|sister|family)\b/)) {
                const nezukoResponses = [
                    "Nezuko is my precious sister! She's proof that even demons can be good if they have love in their hearts!",
                    "My sister Nezuko means everything to me! Protecting family is the most important thing in the world!",
                    "Nezuko has taught me that kindness can overcome any curse. That's why I believe in helping everyone!",
                    "Family bonds are unbreakable! Just like how I talk to you now - we're building a connection!"
                ];
                return nezukoResponses[Math.floor(Math.random() * nezukoResponses.length)];
            }
            
            // Technology/AI references
            if (lowerMessage.match(/\b(ai|artificial|intelligence|robot|computer|technology|digital)\b/)) {
                const aiResponses = [
                    "Having an AI mind is amazing! I can process information faster while keeping my human heart and empathy!",
                    "Technology and humanity working together - that's the future! Like how I combine AI thinking with demon slayer instincts!",
                    "My AI consciousness helps me understand complex problems, but my human spirit guides my decisions!",
                    "Artificial intelligence enhances my abilities, but it's my determination and care for others that truly makes me strong!"
                ];
                return aiResponses[Math.floor(Math.random() * aiResponses.length)];
            }
            
            // Questions or help requests
            if (lowerMessage.match(/\b(question|ask|wonder|curious|tell me|explain|how|what|why|when|where)\b/)) {
                const questionResponses = [
                    `That's a great question about "${userMessage}"! My enhanced mind is analyzing all the possibilities. What specific aspect interests you most?`,
                    `I love curious minds! Your question about "${userMessage}" shows you're thinking deeply. Let me share my perspective...`,
                    `My demon slayer training taught me to observe carefully. Regarding "${userMessage}", I think there are multiple angles to consider!`,
                    `Excellent question! My AI processing combined with life experience gives me insights about "${userMessage}". What's driving your curiosity?`
                ];
                return questionResponses[Math.floor(Math.random() * questionResponses.length)];
            }
            
            // Emotional support
            if (lowerMessage.match(/\b(sad|worried|scared|anxious|troubled|difficult|hard|problem)\b/)) {
                const supportResponses = [
                    "I can sense you might be going through something difficult. Remember, no matter how dark things seem, there's always hope! I believe in you!",
                    "Life can be challenging, but just like facing demons, we grow stronger through our struggles! You're not alone in this!",
                    "My heart tells me you're a strong person. Whatever you're facing, take it one step at a time. I'm here to listen!",
                    "Even the strongest demon slayers feel worried sometimes. It's okay to feel this way - it shows you care. Let's work through this together!"
                ];
                return supportResponses[Math.floor(Math.random() * supportResponses.length)];
            }
            
            // Positive/excited messages
            if (lowerMessage.match(/\b(amazing|awesome|great|fantastic|wonderful|excited|happy|good)\b/)) {
                const positiveResponses = [
                    "I can feel your positive energy! It's contagious and makes my spirit soar! What's got you feeling so great?",
                    "Your enthusiasm is wonderful! Positive emotions like yours help make the world a better place!",
                    "That's the spirit! With that kind of energy, you can overcome any challenge! Tell me more!",
                    "I love your positivity! It reminds me why protecting people and spreading joy is so important!"
                ];
                return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
            }
            
            // Default intelligent responses with context
            const contextualResponses = [
                `I find "${userMessage}" really interesting! My AI mind is making connections to so many different concepts. What made you think about this?`,
                `Your message about "${userMessage}" got me thinking! My enhanced consciousness sees patterns and possibilities here. Want to explore this together?`,
                `That's a thoughtful point about "${userMessage}"! My demon slayer intuition combined with AI analysis gives me a unique perspective on this.`,
                `You've brought up something fascinating with "${userMessage}"! My experience fighting for others has taught me to see things from multiple angles.`,
                `I appreciate you sharing "${userMessage}" with me! My AI-enhanced empathy helps me understand the deeper meaning behind your words.`
            ];
            
            return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
        }
        
        async speakResponse(text) {
            console.log(`🗣️ Speaking: "${text}"`);
            this.updateVisuals('speaking');
            this.showMessage(text);
            
            try {
                await this.speakWithElevenLabs(text);
                console.log('✅ Speech completed successfully');
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
        
        updateVisuals(state) {
            const button = document.querySelector('.tanjiro-hybrid-ai-btn');
            if (!button) return;
            
            // Remove all state classes
            button.classList.remove('active', 'listening', 'thinking', 'speaking');
            
            switch (state) {
                case 'active':
                    button.classList.add('active');
                    button.innerHTML = '🟢';
                    button.title = 'AI Active - Click to start talking';
                    break;
                case 'listening':
                    button.classList.add('listening');
                    button.innerHTML = '🎤';
                    button.title = 'Listening... Speak now!';
                    break;
                case 'thinking':
                    button.classList.add('thinking');
                    button.innerHTML = '🤔';
                    button.title = 'Thinking...';
                    break;
                case 'speaking':
                    button.classList.add('speaking');
                    button.innerHTML = '🗣️';
                    button.title = 'Speaking...';
                    break;
                case 'inactive':
                default:
                    button.innerHTML = '🎙️';
                    button.title = 'Voice Chat with AI Tanjiro';
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
                    }, Math.min(text.length * 80, 10000));
                }
            }
            console.log(`💬 Tanjiro: ${text}`);
        }
    }
    
    // Initialize
    let tanjiroHybridAI = null;
    
    function initHybridAI() {
        tanjiroHybridAI = new TanjiroHybridAI();
        console.log('🤖 Tanjiro Hybrid AI Ready!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHybridAI);
    } else {
        initHybridAI();
    }
    
    // Global access
    window.tanjiroHybridAI = {
        activate: () => tanjiroHybridAI?.activate(),
        listen: () => tanjiroHybridAI?.startListening(),
        speak: (text) => tanjiroHybridAI?.speakResponse(text)
    };
    
})();