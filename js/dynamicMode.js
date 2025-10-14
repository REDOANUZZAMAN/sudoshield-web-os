// Dynamic Mode Controller
(function(){
    const FLAG_KEY = 'webos.dynamicMode.enabled';
    const enabled = localStorage.getItem(FLAG_KEY);
    // default ON unless explicitly disabled
    if(enabled !== 'false') {
        document.documentElement.classList.add('dynamic-mode');
    }

    // Parallax effect (lightweight)
    let last = 0;
    const wallpaper = document.getElementById('wallpaper');
    if(wallpaper){
        window.addEventListener('mousemove', (e)=>{
            if(!document.documentElement.classList.contains('dynamic-mode')) return;
            const now = performance.now();
            if(now - last < 40) return; // throttle ~25fps
            last = now;
            const cx = window.innerWidth/2;
            const cy = window.innerHeight/2;
            const dx = (e.clientX - cx) / cx; // -1..1
            const dy = (e.clientY - cy) / cy;
            wallpaper.style.transform = `translate(${dx*4}px, ${dy*3}px) scale(1.05)`;
        });
        window.addEventListener('mouseleave', ()=>{ if(wallpaper) wallpaper.style.transform=''; });
    }

    // Time-of-day accent modulation (very subtle shift) - DISABLED to prevent blue filter
    function updateAccentShift(){
        // Disabled to prevent hue rotation effects - explicitly clear any cached values
        document.documentElement.style.removeProperty('--dynamic-hue-rotate');
        document.documentElement.style.filter = '';
        return;
        // if(!document.documentElement.classList.contains('dynamic-mode')) return;
        // const hour = new Date().getHours();
        // // Map hour to a hue rotation -30 to +30
        // const shift = (hour/23)*60 - 30;
        // document.documentElement.style.setProperty('--dynamic-hue-rotate', shift.toFixed(1)+'deg');
    }
    updateAccentShift();
    setInterval(updateAccentShift, 15*60*1000); // update every 15 min

    // Apply hue rotation to gradient-bearing elements via CSS variable hook (disabled to prevent blue filter)
    // const style = document.createElement('style');
    // style.textContent = `html.dynamic-mode { filter: hue-rotate(var(--dynamic-hue-rotate,0deg)); }`;
    // document.head.appendChild(style);

    // Expose simple API for toggling
    window.webOS = window.webOS || {};
    window.webOS.toggleDynamicMode = function(force){
        const root = document.documentElement;
        const on = force !== undefined ? force : !root.classList.contains('dynamic-mode');
        if(on){
            root.classList.add('dynamic-mode');
            localStorage.setItem(FLAG_KEY, 'true');
        } else {
            root.classList.remove('dynamic-mode');
            localStorage.setItem(FLAG_KEY, 'false');
        }
    };
})();