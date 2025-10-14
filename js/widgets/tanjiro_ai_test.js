// Tanjiro AI Test - Debug Version
(function() {
    'use strict';
    
    console.log('🔧 Loading Tanjiro AI Test...');
    
    class TanjiroAITest {
        constructor() {
            this.apiKey = 'sk_04f4aa2d4fe8f84d12f25ad4ff1c429de4348916dec0331c';
            this.agentId = 'agent_7401k5h2achneqqrpbbgrxrvh71d';
            this.voiceId = 'T8aK56J4KvNPVFuqu7nT';
            this.init();
        }
        
        init() {
            console.log('🔧 Initializing Tanjiro AI Test...');
            setTimeout(() => {
                this.enhanceTanjiroWidget();
            }, 2000);
        }
        
        enhanceTanjiroWidget() {
            console.log('🔧 Looking for Tanjiro widget...');
            const tanjiroElement = document.querySelector('#tanjiro-widget');
            
            if (!tanjiroElement) {
                console.error('❌ Tanjiro widget not found!');
                this.createTestButton();
                return;
            }
            
            console.log('✅ Tanjiro widget found!');
            
            const controls = tanjiroElement.querySelector('.tanjiro-controls');
            if (controls) {
                const testButton = document.createElement('button');
                testButton.className = 'tanjiro-btn tanjiro-test-btn';
                testButton.innerHTML = '🧪';
                testButton.title = 'Test AI Connection';
                testButton.style.background = 'linear-gradient(135deg, #ff9500 0%, #ff6500 100%)';
                testButton.style.border = '2px solid #ff6500';
                
                controls.insertBefore(testButton, controls.firstChild);
                
                testButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.runTests();
                });
                
                console.log('✅ Test button added to Tanjiro widget');
            } else {
                console.error('❌ Tanjiro controls not found!');
            }
        }
        
        createTestButton() {
            // Create a floating test button if Tanjiro widget not found
            const testButton = document.createElement('button');
            testButton.innerHTML = '🧪 Test AI';
            testButton.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                padding: 10px 20px;
                background: #ff6500;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            `;
            
            document.body.appendChild(testButton);
            
            testButton.addEventListener('click', () => {
                this.runTests();
            });
            
            console.log('✅ Created floating test button');
        }
        
        async runTests() {
            console.log('🧪 Starting AI Connection Tests...');
            this.showStatus('Running AI Tests...', 0);
            
            // Test 1: API Key validity
            await this.testAPIKey();
            
            // Test 2: TTS functionality
            await this.testTTS();
            
            // Test 3: Agent connection
            await this.testAgent();
            
            // Test 4: Speech recognition
            this.testSpeechRecognition();
            
            console.log('🧪 All tests completed!');
            this.showStatus('Tests completed! Check console for results.', 5000);
        }
        
        async testAPIKey() {
            console.log('🔑 Testing API Key...');
            this.showStatus('Testing API Key...', 0);
            
            try {
                const response = await fetch('https://api.elevenlabs.io/v1/user', {
                    method: 'GET',
                    headers: {
                        'xi-api-key': this.apiKey
                    }
                });
                
                console.log(`🔑 API Key test response: ${response.status}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ API Key is valid!', data);
                    this.showStatus('✅ API Key is valid!', 2000);
                } else {
                    console.error('❌ API Key is invalid!', response.status);
                    this.showStatus('❌ API Key is invalid!', 2000);
                }
            } catch (error) {
                console.error('❌ API Key test failed:', error);
                this.showStatus('❌ API Key test failed!', 2000);
            }
        }
        
        async testTTS() {
            console.log('🗣️ Testing Text-to-Speech...');
            this.showStatus('Testing Text-to-Speech...', 0);
            
            try {
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': this.apiKey
                    },
                    body: JSON.stringify({
                        text: 'Hello! This is a test from Tanjiro!',
                        model_id: 'eleven_monolingual_v1'
                    })
                });
                
                console.log(`🗣️ TTS test response: ${response.status}`);
                
                if (response.ok) {
                    console.log('✅ TTS is working!');
                    this.showStatus('✅ TTS is working! Playing test audio...', 2000);
                    
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    audio.play().then(() => {
                        console.log('🎵 Test audio played successfully');
                        URL.revokeObjectURL(audioUrl);
                    }).catch(error => {
                        console.error('🎵 Audio playback failed:', error);
                    });
                    
                } else {
                    const errorText = await response.text();
                    console.error('❌ TTS failed:', response.status, errorText);
                    this.showStatus(`❌ TTS failed: ${response.status}`, 2000);
                }
            } catch (error) {
                console.error('❌ TTS test failed:', error);
                this.showStatus('❌ TTS test failed!', 2000);
            }
        }
        
        async testAgent() {
            console.log('🤖 Testing Agent Connection...');
            this.showStatus('Testing Agent Connection...', 0);
            
            // Test different agent endpoints
            const endpoints = [
                {
                    name: 'Conversations API',
                    url: 'https://api.elevenlabs.io/v1/convai/conversations',
                    method: 'POST',
                    body: { agent_id: this.agentId }
                },
                {
                    name: 'Agent Info API',
                    url: `https://api.elevenlabs.io/v1/convai/agents/${this.agentId}`,
                    method: 'GET'
                }
            ];
            
            for (const endpoint of endpoints) {
                try {
                    console.log(`🔍 Testing ${endpoint.name}...`);
                    
                    const options = {
                        method: endpoint.method,
                        headers: {
                            'Content-Type': 'application/json',
                            'xi-api-key': this.apiKey
                        }
                    };
                    
                    if (endpoint.body) {
                        options.body = JSON.stringify(endpoint.body);
                    }
                    
                    const response = await fetch(endpoint.url, options);
                    
                    console.log(`🔍 ${endpoint.name} response: ${response.status}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`✅ ${endpoint.name} works!`, data);
                        this.showStatus(`✅ ${endpoint.name} works!`, 2000);
                    } else {
                        const errorText = await response.text();
                        console.error(`❌ ${endpoint.name} failed:`, response.status, errorText);
                        this.showStatus(`❌ ${endpoint.name} failed: ${response.status}`, 2000);
                    }
                    
                } catch (error) {
                    console.error(`❌ ${endpoint.name} error:`, error);
                    this.showStatus(`❌ ${endpoint.name} error!`, 2000);
                }
                
                // Wait between tests
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        testSpeechRecognition() {
            console.log('🎤 Testing Speech Recognition...');
            this.showStatus('Testing Speech Recognition...', 0);
            
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                console.log('✅ Speech Recognition is supported!');
                this.showStatus('✅ Speech Recognition is supported!', 2000);
                
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                
                console.log('🎤 Speech Recognition object created successfully');
                
            } else {
                console.error('❌ Speech Recognition is not supported!');
                this.showStatus('❌ Speech Recognition not supported!', 2000);
            }
        }
        
        showStatus(message, duration) {
            // Create or update status display
            let statusDiv = document.getElementById('tanjiro-test-status');
            
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'tanjiro-test-status';
                statusDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 10px;
                    border: 2px solid #ff6500;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 10000;
                    text-align: center;
                    min-width: 300px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
                `;
                document.body.appendChild(statusDiv);
            }
            
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';
            
            if (duration > 0) {
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, duration);
            }
            
            console.log(`📱 Status: ${message}`);
        }
    }
    
    // Initialize after DOM is ready
    function initTest() {
        console.log('🔧 Initializing Tanjiro AI Test System...');
        new TanjiroAITest();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTest);
    } else {
        initTest();
    }
    
})();

console.log('🔧 Tanjiro AI Test script loaded!');