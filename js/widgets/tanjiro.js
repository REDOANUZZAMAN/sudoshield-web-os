// Tanjiro Kamado Widget - Demon Slayer Character
(function() {
    'use strict';
    
    const WIDGET_KEY = 'webos.tanjiro.widget';
    let tanjiroWidget = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    class TanjiroWidget {
        constructor() {
            this.element = null;
            this.position = this.loadPosition();
            this.state = 'idle'; // idle, breathing, attacking, walking
            this.enabled = true;
            this.walking = false;
            this.direction = 1; // 1 = right, -1 = left
            this.walkSpeed = 2;
            this.targetPosition = null;
            this.quotes = [
                "I will never give up!",
                "Become stronger!",
                "Water Breathing!",
                "I can smell it...",
                "Don't give up!",
                "Protect everyone!",
                "Total Concentration!",
                "I won't let anyone die!",
                "Nezuko!",
                "Keep moving forward!"
            ];
            
            this.init();
        }
        
        init() {
            this.createWidget();
            this.attachEventListeners();
            this.startIdleAnimation();
            
            // Random quotes
            setInterval(() => this.showQuote(), 30000); // Every 30 seconds
            
            // Random breathing animation
            setInterval(() => this.breathingAttack(), 45000); // Every 45 seconds
            
            // Random walking
            setInterval(() => this.walkToRandomPosition(), 15000); // Every 15 seconds
        }
        
        loadPosition() {
            try {
                const saved = localStorage.getItem(WIDGET_KEY);
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch (e) {
                console.warn('Failed to load Tanjiro position:', e);
            }
            
            // Default position (bottom-right)
            return {
                x: window.innerWidth - 200,
                y: window.innerHeight - 300
            };
        }
        
        savePosition() {
            try {
                localStorage.setItem(WIDGET_KEY, JSON.stringify(this.position));
            } catch (e) {
                console.warn('Failed to save Tanjiro position:', e);
            }
        }
        
        createWidget() {
            this.element = document.createElement('div');
            this.element.id = 'tanjiro-widget';
            this.element.className = 'tanjiro-widget';
            this.element.style.left = this.position.x + 'px';
            this.element.style.top = this.position.y + 'px';
            
            this.element.innerHTML = `
                <div class="tanjiro-character">
                    <div class="tanjiro-head">
                        <div class="tanjiro-hair"></div>
                        <div class="tanjiro-scar"></div>
                        <div class="tanjiro-eyes">
                            <div class="eye left"></div>
                            <div class="eye right"></div>
                        </div>
                        <div class="tanjiro-earring left"></div>
                        <div class="tanjiro-earring right"></div>
                    </div>
                    <div class="tanjiro-body">
                        <div class="haori-pattern"></div>
                        <div class="tanjiro-arm left"></div>
                        <div class="tanjiro-arm right">
                            <div class="tanjiro-sword">
                                <div class="sword-handle"></div>
                                <div class="sword-blade"></div>
                            </div>
                        </div>
                    </div>
                    <div class="tanjiro-legs">
                        <div class="tanjiro-leg left"></div>
                        <div class="tanjiro-leg right"></div>
                    </div>
                </div>
                <div class="tanjiro-speech-bubble"></div>
                <div class="tanjiro-controls">
                    <button class="tanjiro-btn" data-action="speak" title="Speak">💬</button>
                    <button class="tanjiro-btn" data-action="attack" title="Water Breathing">⚔️</button>
                    <button class="tanjiro-btn" data-action="walk" title="Walk">🚶</button>
                    <button class="tanjiro-btn" data-action="move" title="Drag">✋</button>
                </div>
            `;
            
            document.body.appendChild(this.element);
            this.addStyles();
        }
        
        addStyles() {
            if (document.getElementById('tanjiro-widget-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'tanjiro-widget-styles';
            style.textContent = `
                .tanjiro-widget {
                    position: fixed;
                    width: 150px;
                    height: 250px;
                    z-index: 9999;
                    cursor: grab;
                    user-select: none;
                    transition: transform 0.15s ease;
                }
                
                .tanjiro-widget:hover {
                    transform: scale(1.05);
                }
                
                .tanjiro-widget.dragging {
                    cursor: grabbing;
                    transition: none;
                }
                
                /* Character Container */
                .tanjiro-character {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    animation: tanjiroIdle 3s ease-in-out infinite;
                }
                
                /* Head */
                .tanjiro-head {
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 70px;
                    background: linear-gradient(180deg, #ffc5a8 0%, #ffb89d 100%);
                    border-radius: 50% 50% 45% 45%;
                    border: 2px solid #8b4513;
                    z-index: 10;
                }
                
                /* Hair */
                .tanjiro-hair {
                    position: absolute;
                    top: -15px;
                    left: -5px;
                    right: -5px;
                    height: 50px;
                    background: linear-gradient(135deg, #2d1810 0%, #4a2618 50%, #c41e3a 100%);
                    border-radius: 50% 50% 30% 30%;
                    z-index: -1;
                }
                
                .tanjiro-hair::before {
                    content: '';
                    position: absolute;
                    top: 5px;
                    left: 10px;
                    width: 15px;
                    height: 25px;
                    background: #c41e3a;
                    border-radius: 50%;
                    transform: rotate(-20deg);
                }
                
                .tanjiro-hair::after {
                    content: '';
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    width: 15px;
                    height: 25px;
                    background: #c41e3a;
                    border-radius: 50%;
                    transform: rotate(20deg);
                }
                
                /* Scar */
                .tanjiro-scar {
                    position: absolute;
                    top: 20px;
                    left: 8px;
                    width: 20px;
                    height: 3px;
                    background: #8b0000;
                    border-radius: 2px;
                    box-shadow: 0 8px 0 #8b0000;
                }
                
                /* Eyes */
                .tanjiro-eyes {
                    position: absolute;
                    top: 28px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    display: flex;
                    justify-content: space-between;
                }
                
                .eye {
                    width: 8px;
                    height: 12px;
                    background: #2d1810;
                    border-radius: 50%;
                    animation: blink 4s infinite;
                }
                
                @keyframes blink {
                    0%, 96%, 100% { transform: scaleY(1); }
                    98% { transform: scaleY(0.1); }
                }
                
                /* Hanafuda Earrings */
                .tanjiro-earring {
                    position: absolute;
                    top: 40px;
                    width: 12px;
                    height: 16px;
                    background: linear-gradient(135deg, #c41e3a 0%, #c41e3a 50%, #000 50%, #000 100%);
                    border-radius: 2px;
                    border: 1px solid #8b0000;
                    animation: earringSwing 2s ease-in-out infinite;
                }
                
                .tanjiro-earring.left {
                    left: -5px;
                }
                
                .tanjiro-earring.right {
                    right: -5px;
                }
                
                @keyframes earringSwing {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg); }
                }
                
                /* Body */
                .tanjiro-body {
                    position: absolute;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 100px;
                    background: linear-gradient(180deg, #1a3d1f 0%, #0d1f0f 100%);
                    border-radius: 20px 20px 10px 10px;
                    border: 2px solid #0a0f0a;
                }
                
                /* Checkered Haori Pattern */
                .haori-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        linear-gradient(45deg, #1a3d1f 25%, transparent 25%),
                        linear-gradient(-45deg, #1a3d1f 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #2d5530 75%),
                        linear-gradient(-45deg, transparent 75%, #2d5530 75%);
                    background-size: 10px 10px;
                    background-position: 0 0, 0 5px, 5px -5px, -5px 0;
                    border-radius: 20px 20px 10px 10px;
                    opacity: 0.6;
                }
                
                /* Arms */
                .tanjiro-arm {
                    position: absolute;
                    width: 18px;
                    height: 55px;
                    background: linear-gradient(180deg, #1a3d1f 0%, #1a3d1f 30%, #ffc5a8 100%);
                    border-radius: 9px;
                    border: 1px solid #0a0f0a;
                }
                
                .tanjiro-arm.left {
                    top: 15px;
                    left: -12px;
                    transform-origin: top center;
                    transform: rotate(-10deg);
                }
                
                /* Left hand - simple fist */
                .tanjiro-arm.left::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    width: 12px;
                    height: 14px;
                    background: linear-gradient(135deg, #ffc5a8 0%, #ffb89d 100%);
                    border-radius: 6px;
                    transform: translateX(-50%);
                    border: 1px solid #d9967a;
                }
                
                .tanjiro-arm.right {
                    top: 15px;
                    right: -12px;
                    transform-origin: top center;
                    transform: rotate(10deg);
                    position: relative;
                }
                
                /* Right hand - gripping */
                .tanjiro-arm.right::after {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    width: 16px;
                    height: 14px;
                    background: linear-gradient(135deg, #ffc5a8 0%, #ffb89d 100%);
                    border-radius: 7px 7px 5px 5px;
                    transform: translateX(-50%);
                    border: 1px solid #d9967a;
                    z-index: 4;
                }
                
                /* Legs */
                .tanjiro-legs {
                    position: absolute;
                    top: 175px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 70px;
                }
                
                .tanjiro-leg {
                    position: absolute;
                    width: 22px;
                    height: 60px;
                    background: linear-gradient(180deg, #2d1810 0%, #1a0f08 50%, #333 100%);
                    border-radius: 8px;
                    border: 1px solid #1a0f08;
                }
                
                .tanjiro-leg.left {
                    left: 5px;
                    transform-origin: top center;
                    transform: rotate(0deg);
                }
                
                .tanjiro-leg.right {
                    right: 5px;
                    transform-origin: top center;
                    transform: rotate(0deg);
                }
                
                /* Sword - Attached to right hand */
                .tanjiro-sword {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-8px) rotateX(0deg);
                    width: 68px;
                    height: 12px;
                    z-index: 3;
                    pointer-events: none;
                    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
                    transition: transform 0.15s ease;
                }
                
                /* Rotate sword 180 degrees on X-axis when widget is flipped so blade points forward */
                .tanjiro-widget.flipped .tanjiro-sword {
                    transform: translateX(-8px) rotateX(180deg);
                }
                
                /* Counter-flip speech bubble text when flipped */
                .tanjiro-widget.flipped .tanjiro-speech-bubble {
                    transform: translateX(-50%) scaleX(-1) scale(0);
                }
                
                .tanjiro-widget.flipped .tanjiro-speech-bubble.show {
                    transform: translateX(-50%) scaleX(-1) scale(1);
                }
                
                .sword-handle {
                    position: absolute;
                    left: 3px;
                    top: 1px;
                    width: 12px;
                    height: 8px;
                    background: linear-gradient(180deg, 
                        #4a3420 0%, 
                        #3d2817 20%,
                        #2d1810 50%, 
                        #1a0f08 80%,
                        #0d0805 100%
                    );
                    border-radius: 3px;
                    border: 2px solid #654321;
                    box-shadow: 
                        inset 0 1px 2px rgba(255,255,255,0.2),
                        inset 0 -1px 2px rgba(0,0,0,0.5),
                        0 2px 4px rgba(0,0,0,0.4);
                }
                
                /* Handle wrap pattern - more visible */
                .sword-handle::after {
                    content: '';
                    position: absolute;
                    left: 1px;
                    top: 1px;
                    right: 1px;
                    bottom: 1px;
                    background: repeating-linear-gradient(
                        90deg,
                        transparent 0px,
                        transparent 2px,
                        #c41e3a 2px,
                        #c41e3a 3px,
                        #8b0000 3px,
                        #8b0000 4px
                    );
                    border-radius: 2px;
                    opacity: 0.9;
                }
                
                /* Tsuba (guard) - more visible */
                .sword-handle::before {
                    content: '';
                    position: absolute;
                    left: 9px;
                    top: -4px;
                    width: 5px;
                    height: 16px;
                    background: radial-gradient(ellipse at center, 
                        #b8860b 0%, 
                        #8b4513 30%,
                        #654321 70%,
                        #4a2d1a 100%
                    );
                    border-radius: 2px;
                    border: 2px solid #4a2d1a;
                    box-shadow: 
                        0 2px 4px rgba(0,0,0,0.5),
                        inset 0 1px 1px rgba(255,215,0,0.3),
                        inset 0 -1px 1px rgba(0,0,0,0.5);
                }
                
                .sword-blade {
                    position: absolute;
                    left: 13px;
                    top: 4px;
                    width: 52px;
                    height: 4px;
                    background: linear-gradient(90deg, 
                        #5ab3ff 0%, 
                        #409cff 20%, 
                        #00bfff 50%, 
                        #87ceeb 80%,
                        #b0d9f0 100%
                    );
                    border-radius: 0 2px 2px 0;
                    box-shadow: 
                        0 0 12px rgba(64, 156, 255, 1), 
                        0 0 6px rgba(64, 156, 255, 0.8),
                        inset 0 1px 1px rgba(255,255,255,0.6);
                    clip-path: polygon(0 25%, 92% 0%, 100% 50%, 92% 100%, 0 75%);
                }
                
                /* Blade shine/edge */
                .sword-blade::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, 
                        rgba(255,255,255,1) 0%, 
                        rgba(255,255,255,0.6) 50%,
                        rgba(255,255,255,0.2) 100%
                    );
                }
                
                /* Speech Bubble */
                .tanjiro-speech-bubble {
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%) scaleX(1) scale(0);
                    min-width: 120px;
                    max-width: 200px;
                    padding: 10px 15px;
                    background: white;
                    border: 2px solid #c41e3a;
                    border-radius: 15px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    font-size: 12px;
                    color: #333;
                    text-align: center;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 20;
                    pointer-events: none;
                }
                
                .tanjiro-speech-bubble.show {
                    transform: translateX(-50%) scaleX(1) scale(1);
                    opacity: 1;
                }
                
                .tanjiro-speech-bubble::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-top: 10px solid white;
                }
                
                /* Controls */
                .tanjiro-controls {
                    position: absolute;
                    bottom: -35px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 5px;
                    background: rgba(20, 10, 10, 0.9);
                    padding: 5px;
                    border-radius: 15px;
                    border: 2px solid #c41e3a;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .tanjiro-widget:hover .tanjiro-controls {
                    opacity: 1;
                }
                
                .tanjiro-btn {
                    width: 32px;
                    height: 32px;
                    background: rgba(196, 30, 58, 0.3);
                    border: 2px solid #c41e3a;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                
                .tanjiro-btn:hover {
                    background: #c41e3a;
                    transform: scale(1.1);
                    box-shadow: 0 0 10px rgba(196, 30, 58, 0.8);
                }
                
                /* Animations */
                @keyframes tanjiroIdle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                /* Walking state - animations only when walking */
                .tanjiro-widget.walking .tanjiro-character {
                    animation: tanjiroBob 0.5s ease-in-out infinite;
                }
                
                .tanjiro-widget.walking .tanjiro-arm.left {
                    animation: armSwingLeftWalk 0.5s ease-in-out infinite;
                }
                
                .tanjiro-widget.walking .tanjiro-arm.right {
                    animation: armSwingRightWalk 0.5s ease-in-out infinite;
                }
                
                .tanjiro-widget.walking .tanjiro-leg.left {
                    animation: legWalkLeft 0.5s ease-in-out infinite;
                }
                
                .tanjiro-widget.walking .tanjiro-leg.right {
                    animation: legWalkRight 0.5s ease-in-out infinite;
                }
                
                /* Walking animations */
                @keyframes tanjiroBob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                
                @keyframes armSwingLeftWalk {
                    0%, 100% { transform: rotate(-30deg); }
                    50% { transform: rotate(25deg); }
                }
                
                @keyframes armSwingRightWalk {
                    0%, 100% { transform: rotate(25deg); }
                    50% { transform: rotate(-30deg); }
                }
                
                @keyframes legWalkLeft {
                    0%, 100% { transform: rotate(-20deg); }
                    50% { transform: rotate(20deg); }
                }
                
                @keyframes legWalkRight {
                    0%, 100% { transform: rotate(20deg); }
                    50% { transform: rotate(-20deg); }
                }
                
                /* Character design - always facing right by default */
                .tanjiro-character {
                    /* Widget rotates, character stays forward-facing */
                }
                
                /* Attack Animation */
                .tanjiro-widget.attacking .tanjiro-character {
                    animation: tanjiroAttack 0.8s ease-out;
                }
                
                .tanjiro-widget.attacking .tanjiro-arm.right {
                    animation: swordAttackArm 0.8s ease-out !important;
                }
                
                .tanjiro-widget.attacking .tanjiro-sword {
                    animation: swordAttackBlade 0.8s ease-out;
                }
                
                @keyframes tanjiroAttack {
                    0% { transform: translateX(0) rotate(0deg); }
                    30% { transform: translateX(-15px) rotate(-15deg); }
                    60% { transform: translateX(15px) rotate(15deg); }
                    100% { transform: translateX(0) rotate(0deg); }
                }
                
                @keyframes swordAttackArm {
                    0% { transform: rotate(20deg); }
                    30% { transform: rotate(-90deg); }
                    60% { transform: rotate(45deg); }
                    100% { transform: rotate(20deg); }
                }
                
                @keyframes swordAttackBlade {
                    0%, 100% { 
                        filter: brightness(1);
                        box-shadow: 0 0 8px rgba(64, 156, 255, 0.8);
                    }
                    50% { 
                        filter: brightness(2);
                        box-shadow: 0 0 20px rgba(64, 156, 255, 1), 0 0 40px rgba(64, 156, 255, 0.8);
                    }
                }
                
                /* Breathing Animation */
                .tanjiro-widget.breathing .tanjiro-character {
                    animation: tanjiroBreathing 2s ease-in-out;
                }
                
                @keyframes tanjiroBreathing {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            
            document.head.appendChild(style);
        }
        
        attachEventListeners() {
            // Dragging
            this.element.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.stopDrag());
            
            // Control buttons
            this.element.querySelectorAll('.tanjiro-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    this.handleAction(action);
                });
            });
            
            // Click to speak
            this.element.querySelector('.tanjiro-character').addEventListener('click', (e) => {
                if (!isDragging) {
                    this.showQuote();
                }
            });
        }
        
        startDrag(e) {
            if (e.target.closest('.tanjiro-btn')) return;
            
            isDragging = true;
            this.element.classList.add('dragging');
            
            const rect = this.element.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
        }
        
        drag(e) {
            if (!isDragging) return;
            
            this.position.x = e.clientX - dragOffset.x;
            this.position.y = e.clientY - dragOffset.y;
            
            // Keep within viewport
            this.position.x = Math.max(0, Math.min(window.innerWidth - 150, this.position.x));
            this.position.y = Math.max(0, Math.min(window.innerHeight - 250, this.position.y));
            
            this.element.style.left = this.position.x + 'px';
            this.element.style.top = this.position.y + 'px';
        }
        
        stopDrag() {
            if (isDragging) {
                isDragging = false;
                this.element.classList.remove('dragging');
                this.savePosition();
            }
        }
        
        handleAction(action) {
            switch(action) {
                case 'speak':
                    this.showQuote();
                    break;
                case 'attack':
                    this.breathingAttack();
                    break;
                case 'walk':
                    this.walkToRandomPosition();
                    break;
                case 'move':
                    this.showQuote("You can drag me anywhere!");
                    break;
            }
        }
        
        showQuote(customQuote = null) {
            const bubble = this.element.querySelector('.tanjiro-speech-bubble');
            const quote = customQuote || this.quotes[Math.floor(Math.random() * this.quotes.length)];
            
            bubble.textContent = quote;
            bubble.classList.add('show');
            
            setTimeout(() => {
                bubble.classList.remove('show');
            }, 3000);
        }
        
        breathingAttack() {
            this.element.classList.add('attacking');
            
            this.showQuote("Water Breathing: First Form!");
            
            setTimeout(() => {
                this.element.classList.remove('attacking');
            }, 800);
        }
        
        startIdleAnimation() {
            // Already handled by CSS animations
        }
        
        walkToRandomPosition() {
            if (this.walking) return; // Already walking
            
            // Random position on screen
            const padding = 50;
            const targetX = Math.random() * (window.innerWidth - 150 - padding * 2) + padding;
            const targetY = Math.random() * (window.innerHeight - 250 - padding * 2) + padding;
            
            this.targetPosition = { x: targetX, y: targetY };
            this.startWalking();
        }
        
        startWalking() {
            if (this.walking) return;
            
            this.walking = true;
            this.element.classList.add('walking');
            this.walkingInterval = requestAnimationFrame(() => this.updateWalk());
        }
        
        updateWalk() {
            if (!this.walking || !this.targetPosition) {
                this.stopWalking();
                return;
            }
            
            const dx = this.targetPosition.x - this.position.x;
            const dy = this.targetPosition.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Reached destination
            if (distance < this.walkSpeed) {
                this.position.x = this.targetPosition.x;
                this.position.y = this.targetPosition.y;
                this.stopWalking();
                return;
            }
            
            // Move towards target
            const angle = Math.atan2(dy, dx);
            this.position.x += Math.cos(angle) * this.walkSpeed;
            this.position.y += Math.sin(angle) * this.walkSpeed;
            
            // Simple flip: face right when going right, face left when going left
            if (dx < 0) {
                // Walking left - flip horizontally
                this.element.style.transform = 'scaleX(-1)';
                this.element.classList.add('flipped');
            } else if (dx > 0) {
                // Walking right - normal
                this.element.style.transform = 'scaleX(1)';
                this.element.classList.remove('flipped');
            }
            // If only moving vertically (dx == 0), keep current direction
            
            // Keep within viewport
            this.position.x = Math.max(0, Math.min(window.innerWidth - 150, this.position.x));
            this.position.y = Math.max(0, Math.min(window.innerHeight - 250, this.position.y));
            
            // Update position
            this.element.style.left = this.position.x + 'px';
            this.element.style.top = this.position.y + 'px';
            
            // Continue walking
            this.walkingInterval = requestAnimationFrame(() => this.updateWalk());
        }
        
        stopWalking() {
            this.walking = false;
            this.element.classList.remove('walking');
            this.element.classList.remove('flipped');
            this.targetPosition = null;
            
            // Reset to normal (facing right)
            this.element.style.transform = 'scaleX(1)';
            
            if (this.walkingInterval) {
                cancelAnimationFrame(this.walkingInterval);
                this.walkingInterval = null;
            }
            
            this.savePosition();
        }
        
        playSound() {
            // Sound disabled
        }
        
        destroy() {
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }
    }
    
    // Initialize Tanjiro Widget
    function initTanjiroWidget() {
        // Check if widget is enabled in settings
        const settings = window.webOS?.settings || {};
        const widgetsEnabled = settings.widgetsEnabled !== false;
        const tanjiroEnabled = settings.widgetsTanjiro === true; // Changed: Now requires explicit true to enable
        
        if (widgetsEnabled && tanjiroEnabled) {
            if (!tanjiroWidget) {
                tanjiroWidget = new TanjiroWidget();
                console.log('⚔️ Tanjiro Kamado Widget Initialized!');
            }
        } else {
            console.log('ℹ️ Tanjiro widget is disabled in settings (autostart disabled)');
        }
    }
    
    // Auto-initialize on page load (only if explicitly enabled)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTanjiroWidget);
    } else {
        initTanjiroWidget();
    }
    
    // Note: Widget will only start if widgetsTanjiro is explicitly set to true in settings
    
    // Expose to window for manual control
    window.tanjiroWidget = {
        show: () => {
            if (!tanjiroWidget) {
                tanjiroWidget = new TanjiroWidget();
                console.log('⚔️ Tanjiro widget shown');
            } else if (tanjiroWidget.element) {
                tanjiroWidget.element.style.display = 'block';
            }
        },
        hide: () => {
            if (tanjiroWidget && tanjiroWidget.element) {
                tanjiroWidget.element.style.display = 'none';
                console.log('ℹ️ Tanjiro widget hidden');
            }
        },
        speak: (quote) => {
            if (tanjiroWidget) {
                tanjiroWidget.showQuote(quote);
            }
        },
        attack: () => {
            if (tanjiroWidget) {
                tanjiroWidget.breathingAttack();
            }
        },
        walk: (x, y) => {
            if (tanjiroWidget) {
                if (x !== undefined && y !== undefined) {
                    tanjiroWidget.targetPosition = { x, y };
                    tanjiroWidget.startWalking();
                } else {
                    tanjiroWidget.walkToRandomPosition();
                }
            }
        },
        stop: () => {
            if (tanjiroWidget) {
                tanjiroWidget.stopWalking();
            }
        }
    };
})();
