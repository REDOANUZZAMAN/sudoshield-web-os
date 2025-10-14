// Tanjiro AI Voice - Debug Version with ElevenLabs Testing
(function() {
    'use strict';
    
    class TanjiroAIVoiceDebug {
        constructor() {
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.isAIActive = false;
            this.conversationId = null;
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c'; // Your ElevenLabs API key
            this.voiceSettings = {
                voiceId: 'T8aK56J4KvNPVFuqu7nT', // updated voice id
                stability: 0.5,
                similarityBoost: 0.8,
                style: 0.0,
                useSpeakerBoost: true
            };
            
            this.debugMode = true; // Enable debug logging
            
            this.init();
        }
        
        init() {
            this.enhanceTanjiroWidget();
            this.createDebugPanel();
        }
        
        createDebugPanel() {
            const debugPanel = document.createElement('div');
            debugPanel.id = 'tanjiro-debug-panel';
            debugPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 400px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 10001;
                overflow-y: auto;
                border: 2px solid #c41e3a;
                display: none;
            `;
            
            debugPanel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #c41e3a;">🤖 Tanjiro AI Debug</h4>
                    <button id="close-debug" style="background: #c41e3a; color: white; border: none; border-radius: 3px; padding: 2px 8px; cursor: pointer;">×</button>
                </div>
                <div id="debug-content">
                    <p><strong>Status:</strong> <span id="debug-status">Initializing...</span></p>
                    <p><strong>API Key:</strong> <span id="api-key-status">Not configured</span></p>
                    <p><strong>Agent ID:</strong> ${this.agentId}</p>
                    <hr>
                    <button id="test-api" style="width: 100%; padding: 8px; background: #4facfe; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">Test API Connection</button>
                    <button id="test-voice" style="width: 100%; padding: 8px; background: #00cc66; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">Test Voice</button>
                    <div id="debug-log" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; max-height: 150px; overflow-y: auto;">
                        <div class="log-entry">Debug panel initialized</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(debugPanel);
            
            // Add event listeners
            document.getElementById('close-debug').addEventListener('click', () => {
                debugPanel.style.display = 'none';
            });
            
            document.getElementById('test-api').addEventListener('click', () => {
                this.testAPIConnection();
            });
            
            document.getElementById('test-voice').addEventListener('click', () => {
                this.testVoice();
            });
            
            // Check API key status
            this.updateAPIKeyStatus();
            
            // Show debug panel
            setTimeout(() => {
                debugPanel.style.display = 'block';
            }, 1000);
        }
        
        log(message, type = 'info') {
            if (!this.debugMode) return;
            
            const debugLog = document.getElementById('debug-log');
            if (debugLog) {
                const timestamp = new Date().toLocaleTimeString();
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                logEntry.style.cssText = `
                    margin-bottom: 5px;
                    padding: 3px;
                    border-radius: 3px;
                    background: ${type === 'error' ? 'rgba(255,0,0,0.2)' : type === 'success' ? 'rgba(0,255,0,0.2)' : 'transparent'};
                `;
                logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> ${message}`;
                debugLog.appendChild(logEntry);
                debugLog.scrollTop = debugLog.scrollHeight;
            }
            
            console.log(`🤖 Tanjiro AI: ${message}`);
        }
        
        updateAPIKeyStatus() {
            const apiKeyStatus = document.getElementById('api-key-status');
            const debugStatus = document.getElementById('debug-status');
            
            if (this.apiKey === 'YOUR_ELEVENLABS_API_KEY' || !this.apiKey) {
                if (apiKeyStatus) apiKeyStatus.innerHTML = '<span style="color: #ff6666;">❌ Not configured</span>';
                if (debugStatus) debugStatus.innerHTML = '<span style="color: #ff6666;">API Key needed</span>';
                this.log('❌ API Key not configured! Please set your ElevenLabs API key.', 'error');
            } else {
                if (apiKeyStatus) apiKeyStatus.innerHTML = '<span style="color: #66ff66;">✅ Configured</span>';
                if (debugStatus) debugStatus.innerHTML = '<span style="color: #66ff66;">Ready</span>';
                this.log('✅ API Key configured', 'success');
            }
        }
        
        async testAPIConnection() {
            this.log('🔄 Testing API connection...');
            
            if (this.apiKey === 'YOUR_ELEVENLABS_API_KEY' || !this.apiKey) {
                this.log('❌ Cannot test - API key not configured', 'error');
                alert('Please configure your ElevenLabs API key first!\n\nEdit js/widgets/tanjiro_voice_debug.js and replace YOUR_ELEVENLABS_API_KEY with your actual API key.');
                return;
            }
            
            try {
                // Test basic API connectivity
                const response = await fetch('https://api.elevenlabs.io/v1/voices', {
                    method: 'GET',
                    headers: {
                        'xi-api-key': this.apiKey
                    }
                });
                
                this.log(`📡 API Response Status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.log(`✅ API Connection successful! Found ${data.voices?.length || 0} voices`, 'success');
                    
                    // Test agent specifically
                    await this.testAgent();
                } else {
                    const errorText = await response.text();
                    this.log(`❌ API Error: ${response.status} - ${errorText}`, 'error');
                    
                    if (response.status === 401) {
                        alert('❌ API Key Invalid!\n\nYour ElevenLabs API key appears to be incorrect. Please check it in the script.');
                    }
                }
                
            } catch (error) {
                this.log(`❌ Connection Error: ${error.message}`, 'error');
                alert(`❌ Connection Failed!\n\nError: ${error.message}\n\nThis could be due to:\n- CORS policy restrictions\n- Network connectivity issues\n- Invalid API endpoint`);
            }
        }
        
        async testAgent() {
            this.log('🤖 Testing Conversational AI agent...');
            
            try {
                // Try the correct Conversational AI endpoint
                const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations?agent_id=${this.agentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    }
                });
                
                this.log(`🤖 Agent Response Status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.log(`✅ Agent connection successful! Conversation ID: ${data.conversation_id}`, 'success');
                    this.conversationId = data.conversation_id;
                    
                    // Test sending a message
                    await this.testAgentMessage();
                } else {
                    const errorText = await response.text();
                    this.log(`❌ Agent Error: ${response.status} - ${errorText}`, 'error');
                    
                    // Try alternative endpoint format
                    this.log('🔄 Trying alternative agent API format...');
                    await this.testAgentAlternative();
                }
                
            } catch (error) {
                this.log(`❌ Agent Test Error: ${error.message}`, 'error');
            }
        }
        
        async testAgentAlternative() {
            try {
                // Alternative: Try direct agent conversation
                const response = await fetch(`https://api.elevenlabs.io/v1/agents/${this.agentId}/conversation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        message: "Hello, can you introduce yourself as Tanjiro?",
                        session_id: 'test_session_' + Date.now()
                    })
                });
                
                this.log(`🤖 Alternative Agent Status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.log(`✅ Alternative agent successful! Response: "${data.message || data.response || 'No message'}"`, 'success');
                    
                    if (data.message || data.response) {
                        this.showTanjiroResponse(data.message || data.response);
                    }
                } else {
                    const errorText = await response.text();
                    this.log(`❌ Alternative Agent Error: ${response.status} - ${errorText}`, 'error');
                    
                    // Try WebSocket connection info
                    this.log('ℹ️ Note: This agent might require WebSocket connection or different API format', 'info');
                    this.log('ℹ️ Fallback mode will be used for AI responses', 'info');
                }
                
            } catch (error) {
                this.log(`❌ Alternative Agent Error: ${error.message}`, 'error');
            }
        }
        
        async testAgentMessage() {
            if (!this.conversationId) {
                this.log('❌ No conversation ID for message test', 'error');
                return;
            }
            
            this.log('💬 Testing agent message...');
            
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${this.conversationId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        message: "Hello, can you introduce yourself?",
                        mode: 'text'
                    })
                });
                
                this.log(`💬 Message Response Status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.log(`✅ Message successful! Response: "${data.message || 'No message'}"`, 'success');
                    
                    if (data.message) {
                        // Show the response
                        this.showTanjiroResponse(data.message);
                    }
                } else {
                    const errorText = await response.text();
                    this.log(`❌ Message Error: ${response.status} - ${errorText}`, 'error');
                }
                
            } catch (error) {
                this.log(`❌ Message Test Error: ${error.message}`, 'error');
            }
        }
        
        async testVoice() {
            this.log('🎵 Testing voice synthesis...');
            
            if (this.apiKey === 'YOUR_ELEVENLABS_API_KEY' || !this.apiKey) {
                this.log('❌ Cannot test voice - API key not configured', 'error');
                return;
            }
            
            const testText = "Hello! This is a test of my AI voice system!";
            
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceSettings.voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        text: testText,
                        model_id: 'eleven_monolingual_v1',
                        voice_settings: {
                            stability: this.voiceSettings.stability,
                            similarity_boost: this.voiceSettings.similarityBoost,
                            style: this.voiceSettings.style,
                            use_speaker_boost: this.voiceSettings.useSpeakerBoost
                        }
                    })
                });
                
                this.log(`🎵 Voice Response Status: ${response.status}`);
                
                if (response.ok) {
                    this.log('✅ Voice synthesis successful! Playing audio...', 'success');
                    
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    audio.onended = () => {
                        URL.revokeObjectURL(audioUrl);
                        this.log('🎵 Audio playback completed', 'success');
                    };
                    
                    audio.onerror = (error) => {
                        this.log(`❌ Audio playback error: ${error}`, 'error');
                    };
                    
                    await audio.play();
                    this.showTanjiroResponse(testText);
                    
                } else {
                    const errorText = await response.text();
                    this.log(`❌ Voice Error: ${response.status} - ${errorText}`, 'error');
                }
                
            } catch (error) {
                this.log(`❌ Voice Test Error: ${error.message}`, 'error');
                
                // Fallback to browser TTS
                this.log('🔄 Trying browser fallback TTS...', 'info');
                this.fallbackSpeak(testText);
            }
        }
        
        enhanceTanjiroWidget() {
            const checkWidget = () => {
                if (window.tanjiroWidget && document.querySelector('#tanjiro-widget')) {
                    this.integrateWithWidget();
                    this.log('✅ Tanjiro widget found and integrated', 'success');
                } else {
                    setTimeout(checkWidget, 500);
                }
            };
            checkWidget();
        }
        
        integrateWithWidget() {
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            if (!tanjiroElement) return;
            
            // Add AI voice button
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const aiButton = document.createElement('button');
                aiButton.className = 'tanjiro-btn tanjiro-ai-btn';
                aiButton.innerHTML = '🤖';
                aiButton.title = 'AI Voice Mode (Debug)';
                
                controls.insertBefore(aiButton, controls.firstChild);
                
                aiButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleAIMode();
                });
            }
            
            // Override speak function
            if (window.tanjiroWidget.speak) {
                const originalSpeak = window.tanjiroWidget.speak;
                window.tanjiroWidget.speak = (text) => {
                    if (text) {
                        originalSpeak(text);
                        if (this.isAIActive) {
                            this.speakText(text);
                        }
                    } else {
                        if (this.isAIActive) {
                            this.generateAIResponse();
                        } else {
                            originalSpeak("Click the AI button to enable AI voice mode!");
                        }
                    }
                };
            }
            
            this.addStyles();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-ai-debug-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-ai-debug-styles';
            style.textContent = `
                .tanjiro-ai-btn {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%) !important;
                    border: 2px solid #ff4444 !important;
                }
                
                .tanjiro-ai-btn:hover {
                    background: linear-gradient(135deg, #ffa500 0%, #ff6b6b 100%) !important;
                    box-shadow: 0 0 15px rgba(255, 107, 107, 0.8) !important;
                }
                
                .tanjiro-ai-btn.active {
                    animation: debugPulse 1s ease-in-out infinite !important;
                    background: linear-gradient(135deg, #00ff88 0%, #00cc66 100%) !important;
                    border: 2px solid #009944 !important;
                }
                
                @keyframes debugPulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(0, 255, 136, 0.8); }
                    50% { transform: scale(1.1); box-shadow: 0 0 25px rgba(0, 255, 136, 1); }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        toggleAIMode() {
            const aiButton = document.querySelector('.tanjiro-ai-btn');
            
            if (!this.isAIActive) {
                this.isAIActive = true;
                if (aiButton) {
                    aiButton.classList.add('active');
                    aiButton.innerHTML = '🗣️';
                }
                this.log('🤖 AI Mode ACTIVATED', 'success');
                this.showTanjiroResponse("AI Debug Mode activated! Check the debug panel for API status.");
            } else {
                this.isAIActive = false;
                if (aiButton) {
                    aiButton.classList.remove('active');
                    aiButton.innerHTML = '🤖';
                }
                this.log('🤖 AI Mode DEACTIVATED', 'info');
                this.showTanjiroResponse("AI Debug Mode deactivated.");
            }
        }
        
        async generateAIResponse() {
            if (!this.isAIActive) return;
            
            this.log('🤖 Generating AI response...');
            
            try {
                const response = await this.callElevenLabsAgent("Hello! Tell me something about being a demon slayer!");
                
                if (response && response.message) {
                    this.log(`✅ AI Response received: "${response.message}"`, 'success');
                    this.showTanjiroResponse(response.message);
                    await this.speakText(response.message);
                } else {
                    throw new Error('No response from agent');
                }
                
            } catch (error) {
                this.log(`❌ AI Response failed: ${error.message}`, 'error');
                
                const fallback = "My AI connection isn't working right now, but I'm still here to help you!";
                this.showTanjiroResponse(fallback);
                this.fallbackSpeak(fallback);
            }
        }
        
        async callElevenLabsAgent(message) {
            try {
                // Try the direct agent conversation method
                this.log(`� Sending message to agent: "${message}"`);
                
                const response = await fetch(`https://api.elevenlabs.io/v1/agents/${this.agentId}/conversation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        message: message,
                        session_id: this.conversationId || ('session_' + Date.now())
                    })
                });
                
                this.log(`📡 Agent response status: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    this.log(`✅ Agent response: "${data.message || data.response || 'No message'}"`, 'success');
                    return { message: data.message || data.response || data.text };
                } else {
                    const errorText = await response.text();
                    this.log(`❌ Agent API Error: ${response.status} - ${errorText}`, 'error');
                    
                    // If agent doesn't work, we'll use enhanced fallback
                    throw new Error(`Agent API failed: ${response.status}`);
                }
                
            } catch (error) {
                this.log(`❌ ElevenLabs Agent Error: ${error.message}`, 'error');
                
                // Since the agent isn't working, let's use intelligent fallback responses
                return this.getIntelligentFallback(message);
            }
        }
        
        getIntelligentFallback(userMessage) {
            this.log('🤖 Using intelligent fallback responses', 'info');
            
            const lowerMessage = userMessage.toLowerCase();
            let response;
            
            // Tanjiro-style contextual responses
            if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                response = "Hello! I'm Tanjiro Kamado, a Demon Slayer! It's great to meet you!";
            } else if (lowerMessage.includes('demon') || lowerMessage.includes('fight')) {
                response = "I'll protect everyone from demons! With my Water Breathing techniques, no demon can harm innocent people!";
            } else if (lowerMessage.includes('nezuko') || lowerMessage.includes('sister')) {
                response = "Nezuko is my dear sister! She's different from other demons - she protects humans instead of eating them!";
            } else if (lowerMessage.includes('water breathing') || lowerMessage.includes('technique')) {
                response = "Water Breathing is the technique I learned from Master Urokodaki! First Form: Water Surface Slash!";
            } else if (lowerMessage.includes('help') || lowerMessage.includes('protect')) {
                response = "I'll always help those in need! It's my duty as a Demon Slayer to protect innocent people!";
            } else if (lowerMessage.includes('strong') || lowerMessage.includes('train')) {
                response = "I must become stronger! Every day I train harder to protect everyone I care about!";
            } else if (lowerMessage.includes('sad') || lowerMessage.includes('hurt')) {
                response = "Don't give up! No matter how difficult things get, we must keep moving forward with hope!";
            } else if (lowerMessage.includes('slayer')) {
                response = "The Demon Slayer Corps fights to protect humanity! We risk our lives so others can live in peace!";
            } else {
                // General encouraging responses
                const responses = [
                    "I can sense your kind heart! You have the strength to overcome any challenge!",
                    "My nose tells me you're a good person! Keep that determination burning bright!",
                    "Total Concentration! Together we can face whatever comes our way!",
                    "The bonds we share make us stronger! I believe in your potential!",
                    "Never give up hope! Even in the darkest times, there's always light ahead!",
                    "Your spirit reminds me why I fight to protect everyone! Stay strong!",
                    "I can smell your courage! You have what it takes to succeed!",
                    "Keep moving forward with that pure heart of yours! I'm here to support you!"
                ];
                response = responses[Math.floor(Math.random() * responses.length)];
            }
            
            return { message: response };
        }
        
        showTanjiroResponse(text) {
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
        
        async speakText(text) {
            if (!this.isAIActive) return;
            
            this.log(`🎵 Speaking: "${text}"`);
            
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceSettings.voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        text: text,
                        model_id: 'eleven_monolingual_v1',
                        voice_settings: this.voiceSettings
                    })
                });
                
                if (response.ok) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    return new Promise((resolve) => {
                        audio.onended = () => {
                            URL.revokeObjectURL(audioUrl);
                            this.log('🎵 Voice playback completed', 'success');
                            resolve();
                        };
                        audio.play();
                    });
                } else {
                    throw new Error(`TTS failed: ${response.status}`);
                }
            } catch (error) {
                this.log(`❌ Voice synthesis failed: ${error.message}`, 'error');
                this.fallbackSpeak(text);
            }
        }
        
        fallbackSpeak(text) {
            this.log('🔄 Using browser TTS fallback', 'info');
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                speechSynthesis.speak(utterance);
            }
        }
    }
    
    // Initialize
    let tanjiroAIDebug = null;
    
    function initTanjiroAIDebug() {
        if (!tanjiroAIDebug) {
            tanjiroAIDebug = new TanjiroAIVoiceDebug();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroAIDebug);
    } else {
        initTanjiroAIDebug();
    }
    
    window.tanjiroAIDebug = tanjiroAIDebug;
})();