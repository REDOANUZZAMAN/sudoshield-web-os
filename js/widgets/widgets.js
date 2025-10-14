// Widgets Manager (Clock, Weather, System Stats, Compact Mode)
(function(){
    const STORAGE_KEY = 'webos.widgets.v2';
    const container = document.getElementById('desktop-widgets');
    const clockContainer = document.getElementById('desktop-clock-widget');
    const systemContainer = document.getElementById('desktop-system-widget');
    if(!container || !clockContainer || !systemContainer) return;

    // Public config inside webOS.settings
    window.webOS = window.webOS || {};
    window.webOS.settings = window.webOS.settings || {};
    const s = window.webOS.settings;
    if(s.widgetsEnabled === undefined) s.widgetsEnabled = true;
    if(s.widgetsCompact === undefined) s.widgetsCompact = false;
    if(s.widgetsStats === undefined) s.widgetsStats = false;
    if(s.widgetsClock === undefined) s.widgetsClock = true;
    if(s.widgetsWeather === undefined) s.widgetsWeather = true;

    let state = loadState();
    // cache for compact merged line
    if(!state.compactWeather) state.compactWeather = null;
    const timers = new Set();

    function loadState(){ 
        try { 
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; 
            // Reset state if positions seem corrupted
            if(data.positions && typeof data.positions !== 'object') {
                console.warn('Resetting corrupted widget positions');
                data.positions = {};
            }
            return data;
        } catch(e){ 
            console.warn('Failed to load widget state, resetting');
            return {}; 
        } 
    }
    function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    function clearTimers(){ timers.forEach(t=>clearInterval(t)); timers.clear(); }

    function wipe(){ clearTimers(); container.innerHTML=''; clockContainer.innerHTML=''; systemContainer.innerHTML=''; }

    // UTIL DRAG
    function makeDraggable(el){
        let startX,startY,origX,origY,drag=false; const header=el.querySelector('.widget-header'); if(!header) return;
        header.addEventListener('mousedown', e=>{ drag=true; startX=e.clientX; startY=e.clientY; const r=el.getBoundingClientRect(); origX=r.left; origY=r.top; el.style.transition='none'; document.addEventListener('mousemove',move); document.addEventListener('mouseup',up); });
        function move(e){ if(!drag) return; const dx=e.clientX-startX, dy=e.clientY-startY; let nx=origX+dx, ny=origY+dy; nx=Math.max(0,Math.min(window.innerWidth-el.offsetWidth,nx)); ny=Math.max(0,Math.min(window.innerHeight-el.offsetHeight-60,ny)); el.style.left=nx+'px'; el.style.top=ny+'px'; el.style.position='absolute'; }
        function up(){ if(drag){ drag=false; el.style.transition=''; state.positions=state.positions||{}; state.positions[el.dataset.widget]={ left:el.style.left, top:el.style.top }; saveState(); // after user drag, ensure widgets are nicely arranged
            try{ setTimeout(()=>{ if(typeof arrangeWidgets === 'function') arrangeWidgets(); },50); }catch(e){} } document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); }
        const saved=state.positions?.[el.dataset.widget];
        if(saved){
            el.style.position='absolute';
            const fallback = 24;
            const parseCoord = v => {
                if(typeof v === 'number') return v;
                if(typeof v === 'string'){
                    const num=parseFloat(v);
                    if(!Number.isNaN(num)) return num;
                }
                return fallback;
            };
            let left=parseCoord(saved.left);
            let top=parseCoord(saved.top);
            
            // Wait for element to be rendered to get accurate dimensions
            setTimeout(() => {
                const rect = el.getBoundingClientRect();
                const margin = 20;
                const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
                const maxTop = Math.max(margin, window.innerHeight - rect.height - 80); // -80 for taskbar
                
                const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
                const clampedLeft = clamp(left, margin, maxLeft);
                const clampedTop = clamp(top, margin, maxTop);
                
                el.style.left = clampedLeft + 'px';
                el.style.top = clampedTop + 'px';
                
                // Save corrected position if it was changed
                if(Math.abs(clampedLeft - left) > 1 || Math.abs(clampedTop - top) > 1){
                    state.positions[el.dataset.widget] = { 
                        left: el.style.left, 
                        top: el.style.top 
                    };
                    saveState();
                    console.log(`Widget ${el.dataset.widget} auto-repositioned for current screen size`);
                }
            }, 100);
        }
    }

    // CLOCK
    function buildClock(compact){
        const el=document.createElement('div'); el.className='widget-card widget-clock'; el.dataset.widget='clock';
        el.innerHTML=compact?compactClockMarkup():`<div class="widget-header"><span>Clock</span><div class="widget-drag-handle">&#x2630;</div></div><div class="time">--:--</div><div class="date">---</div><div class="widget-footer"><span class="tz"></span><span class="uptime" title="Uptime">--h</span></div>`;
        container.appendChild(el); 
        // Position clock in top-left by default
        if(!state.positions?.clock) {
            el.style.position = 'absolute';
            el.style.left = '20px';
            el.style.top = '20px';
        }
        updateClock(el); const id=setInterval(()=>updateClock(el),1000); timers.add(id); makeDraggable(el); return el;
    }
    function updateClock(el){
        const now=new Date();
        const time=now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false});
        const date=now.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
        const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
        const uptimeH=Math.floor((Date.now() - (window.webOS?.bootTime||Date.now()))/3600000);
        const tEl=el.querySelector('.time'); if(tEl) tEl.textContent=time;
        const dEl=el.querySelector('.date'); if(dEl) dEl.textContent=date;
        const tzEl=el.querySelector('.tz'); if(tzEl) tzEl.textContent=tz;
        const upEl=el.querySelector('.uptime'); if(upEl) upEl.textContent=uptimeH+'h';
        if(el.classList.contains('widget-compact')){
            const span=el.querySelector('.compact-line');
            if(span){
                // merge clock base + weather snippet (if available)
                const base = `${time} · ${date}`;
                if(state.compactWeather){
                    span.textContent = base + ' · ' + state.compactWeather;
                } else {
                    span.textContent = base + ' · Loading weather...';
                }
            }
        }
    }
    function compactClockMarkup(){ return `<div class="widget-header"><span>Clock+Weather</span><div class="widget-drag-handle">&#x2630;</div></div><div class="compact-line">Loading...</div>`; }

    // DYNAMIC CLOCK
    function buildDynamicClock(){
        const el=document.createElement('div'); 
        el.className='widget-card widget-dynamic-clock'; 
        el.dataset.widget='dynamic-clock';
        el.innerHTML=`
            <div class="widget-header">
                <span><i class="fas fa-clock"></i> Live Clock</span>
                <div class="widget-drag-handle">&#x2630;</div>
            </div>
            <div class="clock-body">
                <div class="dynamic-time">--:--:--</div>
                <div class="dynamic-date">---</div>
                <div class="dynamic-timezone">---</div>
            </div>
        `;
        clockContainer.appendChild(el); 
        // Auto-position in top-left corner (only if no saved position)
        if(!state.positions?.['dynamic-clock']) {
            el.style.position = 'absolute';
            el.style.left = '20px';
            el.style.top = '20px';
            // Save this default position
            state.positions = state.positions || {};
            state.positions['dynamic-clock'] = { left: '20px', top: '20px' };
            saveState();
        }
        updateDynamicClock(el); 
        const id=setInterval(()=>updateDynamicClock(el),100); // Update every 100ms for smooth seconds
        timers.add(id); 
        makeDraggable(el); 
        return el;
    }
    
    function updateDynamicClock(el){
        const now = new Date();
        const time = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
        const date = now.toLocaleDateString([], {weekday:'long', year:'numeric', month:'long', day:'numeric'});
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const timeEl = el.querySelector('.dynamic-time'); 
        if(timeEl) {
            // Add transition effect when time changes
            if(timeEl.textContent !== time) {
                timeEl.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    timeEl.style.transform = 'scale(1)';
                }, 150);
            }
            timeEl.textContent = time;
        }
        
        const dateEl = el.querySelector('.dynamic-date'); 
        if(dateEl) dateEl.textContent = date;
        
        const tzEl = el.querySelector('.dynamic-timezone'); 
        if(tzEl) tzEl.textContent = timezone.replace('_', ' ');
    }

    // MODERN WEATHER WIDGET
    function buildModernWeather(){
        const el=document.createElement('div'); 
        el.className='widget-card widget-modern-weather'; 
        el.dataset.widget='modern-weather';
        el.innerHTML=`
            <div class="widget-header">
                <span><i class="fas fa-cloud-sun"></i> Weather</span>
                <div class="widget-drag-handle">&#x2630;</div>
            </div>
            <div class="weather-body">
                <div class="weather-main">
                    <div class="weather-temp">--°</div>
                    <div class="weather-icon"><i class="fas fa-cloud"></i></div>
                </div>
                <div class="weather-condition">Loading...</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <i class="fas fa-eye"></i>
                        <span class="weather-humidity">--%</span>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-wind"></i>
                        <span class="weather-wind">-- km/h</span>
                    </div>
                </div>
                <div class="weather-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="weather-loc">Getting location...</span>
                </div>
            </div>
        `;
        clockContainer.appendChild(el); 
        // Auto-position in top-right corner (only if no saved position)
        if(!state.positions?.['modern-weather']) {
            // Wait for element to render to get accurate width
            setTimeout(() => {
                const rect = el.getBoundingClientRect();
                const rightPosition = window.innerWidth - rect.width - 20;
                el.style.position = 'absolute';
                el.style.left = rightPosition + 'px';
                el.style.top = '20px';
                // Save this default position
                state.positions = state.positions || {};
                state.positions['modern-weather'] = { left: rightPosition + 'px', top: '20px' };
                saveState();
            }, 50);
        }
        fetchModernWeather(el); 
        const id=setInterval(()=>fetchModernWeather(el),10*60*1000); 
        timers.add(id); 
        makeDraggable(el); 
        return el;
    }
    
    async function fetchModernWeather(el){
        try {
            const pos=await getPosition(2500).catch(()=>null); 
            let lat=pos?.coords?.latitude, lon=pos?.coords?.longitude; 
            if(!lat||!lon){ lat=state.lastLat||40.7128; lon=state.lastLon||-74.0060; }
            state.lastLat=lat; state.lastLon=lon; saveState();
            
            const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
            const res=await fetch(url,{cache:'no-cache'}); 
            if(!res.ok) throw new Error(res.status);
            
            const data=await res.json(); 
            const c=data.current; 
            const wtext=weatherCodeToText(c.weather_code);
            const iconClass = getWeatherIcon(c.weather_code);
            
            // Update temperature with animation
            const tempEl = el.querySelector('.weather-temp');
            if(tempEl) {
                const newTemp = Math.round(c.temperature_2m) + '°';
                if(tempEl.textContent !== newTemp) {
                    tempEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        tempEl.textContent = newTemp;
                        tempEl.style.transform = 'scale(1)';
                    }, 150);
                } else {
                    tempEl.textContent = newTemp;
                }
            }
            
            // Update weather icon
            const iconEl = el.querySelector('.weather-icon i');
            if(iconEl) iconEl.className = iconClass;
            
            // Update condition
            const condEl = el.querySelector('.weather-condition');
            if(condEl) condEl.textContent = wtext;
            
            // Update details
            const humidEl = el.querySelector('.weather-humidity');
            if(humidEl) humidEl.textContent = c.relative_humidity_2m + '%';
            
            const windEl = el.querySelector('.weather-wind');
            if(windEl) windEl.textContent = Math.round(c.wind_speed_10m) + ' km/h';
            
            // Update location
            const locEl = el.querySelector('.weather-loc');
            if(locEl) locEl.textContent = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
            
        } catch(e){
            const condEl = el.querySelector('.weather-condition');
            if(condEl) condEl.textContent = 'Weather unavailable';
            
            const locEl = el.querySelector('.weather-loc');
            if(locEl) locEl.textContent = 'Location unavailable';
        }
    }
    
    function getWeatherIcon(code) {
        const iconMap = {
            0: 'fas fa-sun', // Clear
            1: 'fas fa-sun', // Mainly clear
            2: 'fas fa-cloud-sun', // Partly cloudy
            3: 'fas fa-cloud', // Overcast
            45: 'fas fa-smog', // Fog
            48: 'fas fa-smog', // Rime fog
            51: 'fas fa-cloud-drizzle', // Drizzle
            53: 'fas fa-cloud-drizzle',
            55: 'fas fa-cloud-drizzle',
            56: 'fas fa-snowflake', // Freezing drizzle
            57: 'fas fa-snowflake',
            61: 'fas fa-cloud-rain', // Rain
            63: 'fas fa-cloud-rain',
            65: 'fas fa-cloud-showers-heavy',
            66: 'fas fa-snowflake', // Freezing rain
            67: 'fas fa-snowflake',
            71: 'fas fa-snowflake', // Snow
            73: 'fas fa-snowflake',
            75: 'fas fa-snowflake',
            77: 'fas fa-snowflake',
            80: 'fas fa-cloud-sun-rain', // Rain showers
            81: 'fas fa-cloud-sun-rain',
            82: 'fas fa-cloud-showers-heavy',
            85: 'fas fa-snowflake', // Snow showers
            86: 'fas fa-snowflake',
            95: 'fas fa-bolt', // Thunderstorm
            96: 'fas fa-bolt',
            99: 'fas fa-bolt'
        };
        return iconMap[code] || 'fas fa-cloud';
    }

    // WEATHER
    function buildWeather(){
        const el=document.createElement('div'); el.className='widget-card widget-weather'; el.dataset.widget='weather';
        el.innerHTML=`<div class="widget-header"><span>Weather</span><div class="widget-drag-handle">&#x2630;</div></div><div class="temp-row"><div class="temp">--°</div><div class="condition">...</div></div><div class="meta"><span class="wind">Wind --</span><span class="humidity">Hum --</span></div><div class="widget-footer"><span class="loc">Loc...</span><span class="updated">--:--</span></div>`;
        container.appendChild(el); 
        // Position weather below clock in top-left by default
        if(!state.positions?.weather) {
            el.style.position = 'absolute';
            el.style.left = '20px';
            el.style.top = '180px';
        }
        fetchWeather(el); const id=setInterval(()=>fetchWeather(el),10*60*1000); timers.add(id); makeDraggable(el); return el;
    }
    async function fetchWeather(el){
        try {
            const pos=await getPosition(2500).catch(()=>null); let lat=pos?.coords?.latitude, lon=pos?.coords?.longitude; if(!lat||!lon){ lat=state.lastLat||40.7128; lon=state.lastLon||-74.0060; }
            state.lastLat=lat; state.lastLon=lon; saveState();
            const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
            const res=await fetch(url,{cache:'no-cache'}); if(!res.ok) throw new Error(res.status);
            const data=await res.json(); const c=data.current; const wtext=weatherCodeToText(c.weather_code);
            const weatherSnippet = `${Math.round(c.temperature_2m)}° ${wtext}`;
            if(s.widgetsCompact){
                state.compactWeather = weatherSnippet;
                saveState();
                const clockEl = container.querySelector('.widget-clock.widget-compact');
                if(clockEl) updateClock(clockEl);
            } else if(el){
                el.querySelector('.temp').textContent=Math.round(c.temperature_2m)+'°';
                el.querySelector('.condition').textContent=wtext;
                el.querySelector('.humidity').textContent='Hum '+c.relative_humidity_2m+'%';
                el.querySelector('.wind').textContent='Wind '+Math.round(c.wind_speed_10m)+'km/h';
                el.querySelector('.updated').textContent=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                el.querySelector('.loc').textContent=lat.toFixed(2)+','+lon.toFixed(2);
                if(state.compactWeather){
                    state.compactWeather = null;
                    saveState();
                }
            }
        } catch(e){
            if(s.widgetsCompact){
                state.compactWeather = 'Weather unavailable';
                saveState();
                const clockEl = container.querySelector('.widget-clock.widget-compact');
                if(clockEl) updateClock(clockEl);
            } else if(el){
                const c=el.querySelector('.condition'); if(c) c.textContent='Offline';
            }
        }
    }
    function weatherCodeToText(code){ const map={0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Rime fog',51:'Drizzle',53:'Drizzle',55:'Drizzle',56:'Frz Drizzle',57:'Frz Drizzle',61:'Rain',63:'Rain',65:'Rain',66:'Frz Rain',67:'Frz Rain',71:'Snow',73:'Snow',75:'Snow',77:'Snow gr',80:'Rain shw',81:'Rain shw',82:'Rain shw',85:'Snow shw',86:'Snow shw',95:'Thunder',96:'Thndr hail',99:'Thndr hail'}; return map[code]||'Weather'; }
    function getPosition(timeout){ return new Promise((res,rej)=>{ if(!navigator.geolocation) return rej(new Error('geo')); const t=setTimeout(()=>rej(new Error('timeout')),timeout); navigator.geolocation.getCurrentPosition(p=>{clearTimeout(t);res(p);},err=>{clearTimeout(t);rej(err);},{enableHighAccuracy:false}); }); }

    // MODERN SYSTEM WIDGET
    function buildModernSystem(){
        const el=document.createElement('div'); 
        el.className='widget-card widget-modern-system'; 
        el.dataset.widget='modern-system';
        el.innerHTML=`
            <div class="widget-header">
                <span><i class="fas fa-microchip"></i> System Monitor</span>
                <div class="widget-drag-handle">&#x2630;</div>
            </div>
            <div class="system-body">
                <div class="system-stats">
                    <div class="system-stat cpu-stat">
                        <div class="stat-circle">
                            <svg class="stat-ring" viewBox="0 0 36 36">
                                <path class="stat-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="stat-ring-fill cpu-ring" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                            <div class="stat-text">
                                <div class="stat-value cpu-value">0%</div>
                            </div>
                        </div>
                        <div class="stat-label">CPU</div>
                    </div>
                    <div class="system-stat gpu-stat">
                        <div class="stat-circle">
                            <svg class="stat-ring" viewBox="0 0 36 36">
                                <path class="stat-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="stat-ring-fill gpu-ring" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                            <div class="stat-text">
                                <div class="stat-value gpu-value">0%</div>
                            </div>
                        </div>
                        <div class="stat-label">GPU</div>
                    </div>
                    <div class="system-stat ram-stat">
                        <div class="stat-circle">
                            <svg class="stat-ring" viewBox="0 0 36 36">
                                <path class="stat-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="stat-ring-fill ram-ring" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                            <div class="stat-text">
                                <div class="stat-value ram-value">0%</div>
                            </div>
                        </div>
                        <div class="stat-label">RAM</div>
                    </div>
                    <div class="system-stat temp-stat">
                        <div class="stat-circle">
                            <svg class="stat-ring" viewBox="0 0 36 36">
                                <path class="stat-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="stat-ring-fill temp-ring" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                            <div class="stat-text">
                                <div class="stat-value temp-value">--°</div>
                            </div>
                        </div>
                        <div class="stat-label">TEMP</div>
                    </div>
                    <div class="system-stat uptime-stat">
                        <div class="stat-info">
                            <i class="fas fa-power-off"></i>
                            <div class="stat-value uptime-value">0m</div>
                        </div>
                        <div class="stat-label">UPTIME</div>
                    </div>
                </div>
            </div>
        `;
        systemContainer.appendChild(el); 
        // Auto-position in top-center between clock and weather (only if no saved position)
        if(!state.positions?.['modern-system']) {
            // Wait for element to render to get accurate width
            setTimeout(() => {
                const rect = el.getBoundingClientRect();
                const centerPosition = (window.innerWidth - rect.width) / 2;
                el.style.position = 'absolute';
                el.style.left = centerPosition + 'px';
                el.style.top = '20px';
                // Save this default position (don't use transform with saved positions)
                state.positions = state.positions || {};
                state.positions['modern-system'] = { left: centerPosition + 'px', top: '20px' };
                saveState();
            }, 50);
        }
        updateModernSystem(el); 
        // Use longer interval for better performance (3 seconds instead of 2)
        const id=setInterval(()=>updateModernSystem(el), 3000); 
        timers.add(id); 
        makeDraggable(el); 
        return el;
    }
    function updateModernSystem(el){
        // CPU approximation: improved calculation with better smoothing
        if(!state._cpuSample){ 
            state._cpuSample = {
                last: performance.now(), 
                load: 15, // Start with realistic value
                samples: []
            }; 
        }
        const now = performance.now(); 
        const delta = now - state._cpuSample.last; 
        state._cpuSample.last = now; 
        
        // More realistic CPU simulation based on activity
        const baseLoad = 10 + Math.random() * 20; // 10-30% base
        const activityLoad = Math.sin(now / 5000) * 15 + 15; // Oscillating 0-30%
        const randomSpike = Math.random() < 0.1 ? Math.random() * 30 : 0; // 10% chance of spike
        const rawLoad = Math.min(100, baseLoad + activityLoad + randomSpike);
        
        // Smooth with exponential moving average
        state._cpuSample.load = rawLoad * 0.15 + state._cpuSample.load * 0.85;
        
        // Update CPU circular progress
        const cpuValue = el.querySelector('.cpu-value');
        const cpuRing = el.querySelector('.cpu-ring');
        if(cpuValue && cpuRing) {
            const cpu = Math.round(state._cpuSample.load);
            cpuValue.textContent = cpu + '%';
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (cpu / 100) * circumference;
            cpuRing.style.strokeDasharray = circumference;
            cpuRing.style.strokeDashoffset = offset;
            
            // Change color based on load
            if(cpu > 80) cpuValue.style.color = '#FF6B6B';
            else if(cpu > 50) cpuValue.style.color = '#F7DC6F';
            else cpuValue.style.color = '#fff';
        }
        
        // Update GPU circular progress
        const gpuValue = el.querySelector('.gpu-value');
        const gpuRing = el.querySelector('.gpu-ring');
        if(gpuValue && gpuRing) {
            let percent;
            
            // GPU simulation (realistic gaming/graphics workload)
            if(!state._gpuEstimate) {
                state._gpuEstimate = {
                    base: 15 + Math.random() * 20, // 15-35% base
                    samples: []
                };
            }
            
            // Simulate GPU load with more variation than CPU
            const baseLoad = state._gpuEstimate.base;
            const activityLoad = Math.sin(now / 3000) * 15 + 10; // Oscillating -5 to 25%
            const randomSpike = Math.random() < 0.1 ? Math.random() * 25 : 0; // 10% chance of spike
            const rawLoad = Math.max(5, Math.min(85, baseLoad + activityLoad + randomSpike)); // Keep between 5-85%
            
            // Smooth with exponential moving average
            state._gpuEstimate.base = rawLoad * 0.2 + state._gpuEstimate.base * 0.8;
            percent = Math.round(state._gpuEstimate.base);
            
            // Update display
            gpuValue.textContent = percent + '%';
            
            // Update circular ring
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (percent / 100) * circumference;
            gpuRing.style.strokeDasharray = `${circumference} ${circumference}`;
            gpuRing.style.strokeDashoffset = offset;
            
            // Change color based on usage
            if(percent > 80) {
                gpuValue.style.color = '#FF6B6B'; // Red for high load
            } else if(percent > 60) {
                gpuValue.style.color = '#F7DC6F'; // Yellow for medium load
            } else {
                gpuValue.style.color = '#9B59B6'; // Purple color for GPU
            }
        }
        
        // Update RAM circular progress
        const ramValue = el.querySelector('.ram-value');
        const ramRing = el.querySelector('.ram-ring');
        if(ramValue && ramRing) {
            // Initialize RAM estimator if not exists
            if(!state._ramEstimate) {
                state._ramEstimate = 60; // Start at 60%
            }
            
            // Simulate realistic RAM usage with smooth variation
            const variation = (Math.random() - 0.5) * 2; // -1 to +1
            state._ramEstimate = state._ramEstimate + variation;
            
            // Keep in realistic range
            state._ramEstimate = Math.max(45, Math.min(80, state._ramEstimate));
            const percent = Math.round(state._ramEstimate);
            
            // Update text
            ramValue.textContent = percent + '%';
            
            // Update circular ring
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (percent / 100) * circumference;
            ramRing.style.strokeDasharray = circumference + ' ' + circumference;
            ramRing.style.strokeDashoffset = offset;
            
            // Update color based on usage
            if(percent > 75) {
                ramValue.style.color = '#FF6B6B';
            } else if(percent > 60) {
                ramValue.style.color = '#F7DC6F';
            } else {
                ramValue.style.color = '#45B7D1';
            }
        }
        
        // Update Temperature circular progress (simulated - realistic range)
        const tempValue = el.querySelector('.temp-value');
        const tempRing = el.querySelector('.temp-ring');
        if(tempValue && tempRing) {
            // Simulate CPU temperature based on load
            const cpuLoad = state._cpuSample.load;
            const baseTemp = 35;
            const loadTemp = (cpuLoad / 100) * 30; // 0-30°C based on load
            const temp = Math.round(baseTemp + loadTemp + Math.random() * 5);
            
            tempValue.textContent = temp + '°';
            
            // Update circular progress (map temp 30-90°C to 0-100%)
            const tempPercent = Math.min(100, Math.max(0, ((temp - 30) / 60) * 100));
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (tempPercent / 100) * circumference;
            tempRing.style.strokeDasharray = circumference;
            tempRing.style.strokeDashoffset = offset;
            
            if(temp > 70) tempValue.style.color = '#FF6B6B';
            else if(temp > 60) tempValue.style.color = '#F7DC6F';
            else tempValue.style.color = '#fff';
        }
        
        // Update Uptime
        const uptimeValue = el.querySelector('.uptime-value');
        if(uptimeValue) {
            const mins = Math.floor((Date.now() - (window.webOS?.bootTime || Date.now())) / 60000);
            const hours = Math.floor(mins / 60);
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            const remainingMins = mins % 60;
            
            if(days > 0) {
                uptimeValue.textContent = days + 'd ' + remainingHours + 'h';
            } else if(hours > 0) {
                uptimeValue.textContent = hours + 'h ' + remainingMins + 'm';
            } else {
                uptimeValue.textContent = mins + 'm';
            }
        }
    }

    // BUILD ALL
    function buildAll(){
        wipe();
        if(!s.widgetsEnabled) { container.style.display='none'; return; } else container.style.display='';
        // Build dynamic clock in top-left corner if enabled
        if(s.widgetsClock) buildDynamicClock();
        // Build weather widget under clock if enabled
        if(s.widgetsWeather) buildModernWeather();
        // Build modern system widget in top-center if enabled
        if(s.widgetsStats) buildModernSystem();
    }

    // API
    window.webOS.widgets = {
        rebuild: buildAll,
        setEnabled(v){ s.widgetsEnabled = v; persistSettings(); buildAll(); },
        setCompact(v){ s.widgetsCompact = v; persistSettings(); buildAll(); },
        setStats(v){ s.widgetsStats = v; persistSettings(); buildAll(); },
        setClock(v){ s.widgetsClock = v; persistSettings(); buildAll(); },
        setWeather(v){ s.widgetsWeather = v; persistSettings(); buildAll(); },
        arrange: function(){ try{ if(typeof arrangeWidgets === 'function') arrangeWidgets(); }catch(e){console.warn('arrange failed',e);} },
        fixOffScreenWidgets() {
            console.log('Fixing off-screen widgets...');
            
            // Get containers
            const clockContainer = document.getElementById('desktop-clock-widget');
            const systemContainer = document.getElementById('desktop-system-widget');
            const mainContainer = document.getElementById('desktop-widgets');
            
            // Function to constrain widget to viewport
            function constrainWidget(element) {
                if(!element || element.style.display === 'none') return;
                
                const rect = element.getBoundingClientRect();
                const margin = 20;
                let newLeft = parseFloat(element.style.left) || 0;
                let newTop = parseFloat(element.style.top) || 0;
                let updated = false;
                
                // Check boundaries and adjust
                if(rect.right > window.innerWidth) {
                    newLeft = window.innerWidth - rect.width - margin;
                    updated = true;
                }
                if(rect.left < 0) {
                    newLeft = margin;
                    updated = true;
                }
                if(rect.bottom > window.innerHeight) {
                    newTop = window.innerHeight - rect.height - margin;
                    updated = true;
                }
                if(rect.top < 0) {
                    newTop = margin;
                    updated = true;
                }
                
                // Apply new position if needed
                if(updated) {
                    element.style.left = newLeft + 'px';
                    element.style.top = newTop + 'px';
                    console.log(`Repositioned widget to ${newLeft}, ${newTop}`);
                }
            }
            
            // Fix all widget containers
            [clockContainer, systemContainer].forEach(constrainWidget);
            
            // Fix widgets in main container
            if(mainContainer) {
                const widgets = mainContainer.querySelectorAll('.desktop-widget');
                widgets.forEach(constrainWidget);
            }
            
            // Save updated positions
            saveWidgetStates();
            console.log('Widget positions fixed and saved');
        }
    };

    function persistSettings(){
        try {
            // Reuse existing settings persistence key
            const raw = localStorage.getItem('webos.settings.v1');
            let data = raw ? JSON.parse(raw) : { theme: window.webOS.theme, settings: window.webOS.settings };
            data.settings = { ...window.webOS.settings };
            localStorage.setItem('webos.settings.v1', JSON.stringify(data));
        } catch(e){ console.warn('Persist widgets settings failed', e); }
    }

    // Function to ensure widget stays within viewport bounds (global scope)
    function constrainToViewport(element, widgetKey) {
            if(!element) {
                console.log(`[Cross-Monitor] ${widgetKey} - Element not found`);
                return;
            }
            
            // Wait for element to be properly rendered
            if(!element.offsetParent && element.style.display !== 'none') {
                console.log(`[Cross-Monitor] ${widgetKey} - Element not ready, retrying...`);
                setTimeout(() => constrainToViewport(element, widgetKey), 100);
                return;
            }
            
            const rect = element.getBoundingClientRect();
            const margin = 20;
            let needsUpdate = false;
            let newLeft = parseFloat(element.style.left) || 0;
            let newTop = parseFloat(element.style.top) || 0;
            
            console.log(`[Cross-Monitor] ${widgetKey} - Current: (${newLeft}, ${newTop}) Bounds: (${Math.round(rect.left)}, ${Math.round(rect.top)}, ${Math.round(rect.right)}, ${Math.round(rect.bottom)}) Viewport: ${window.innerWidth}x${window.innerHeight}`);
            
            // Check if widget is outside viewport boundaries
            if(rect.right > window.innerWidth) {
                newLeft = window.innerWidth - rect.width - margin;
                needsUpdate = true;
                console.log(`[Cross-Monitor] ${widgetKey} - ❌ RIGHT overflow! Moving left to: ${newLeft}`);
            }
            if(rect.left < 0) {
                newLeft = margin;
                needsUpdate = true;
                console.log(`[Cross-Monitor] ${widgetKey} - ❌ LEFT overflow! Moving right to: ${newLeft}`);
            }
            if(rect.bottom > window.innerHeight - 60) { // -60 for taskbar
                newTop = window.innerHeight - rect.height - 80;
                needsUpdate = true;
                console.log(`[Cross-Monitor] ${widgetKey} - ❌ BOTTOM overflow! Moving up to: ${newTop}`);
            }
            if(rect.top < 0) {
                newTop = margin;
                needsUpdate = true;
                console.log(`[Cross-Monitor] ${widgetKey} - ❌ TOP overflow! Moving down to: ${newTop}`);
            }
            
            // Apply corrections if needed and save new position
            if(needsUpdate) {
                const finalLeft = Math.max(margin, newLeft);
                const finalTop = Math.max(margin, newTop);
                
                element.style.left = finalLeft + 'px';
                element.style.top = finalTop + 'px';
                
                // Save corrected position
                state.positions = state.positions || {};
                state.positions[widgetKey] = {
                    left: element.style.left,
                    top: element.style.top
                };
                saveState();
                
                console.log(`[Cross-Monitor] ${widgetKey} - ✅ FIXED! New position: (${finalLeft}, ${finalTop}) - SAVED`);
            } else {
                console.log(`[Cross-Monitor] ${widgetKey} - ✅ Already within bounds`);
            }
        }
        
    // Auto-arrange primary widgets: clock (left-top), system (center-top), weather (right-top)
    function arrangeWidgets(){
        try{
            const margin = 20;
            const top = 20;
            const clockWidget = clockContainer?.querySelector('.widget-dynamic-clock') || clockContainer?.querySelector('.widget-clock');
            const weatherWidget = clockContainer?.querySelector('.widget-modern-weather') || container?.querySelector('.widget-weather');
            const systemWidget = systemContainer?.querySelector('.widget-modern-system') || systemContainer?.firstElementChild;

            // Helper to set and save position
            const setPos = (el, key, left, topPos)=>{
                if(!el) return false;
                el.style.position = 'absolute';
                const prevLeft = parseFloat(el.style.left) || null;
                const prevTop = parseFloat(el.style.top) || null;
                el.style.left = Math.round(left) + 'px';
                el.style.top = Math.round(topPos) + 'px';
                state.positions = state.positions || {};
                state.positions[key] = { left: el.style.left, top: el.style.top };
                return (prevLeft !== parseFloat(el.style.left) || prevTop !== parseFloat(el.style.top));
            };

            let changed = false;

            // Place clock at left-top
            if(clockWidget){
                const left = margin;
                changed = setPos(clockWidget, clockWidget.dataset.widget || 'dynamic-clock', left, top) || changed;
                // ensure within viewport
                constrainToViewport(clockWidget, clockWidget.dataset.widget || 'dynamic-clock');
            }

            // Place weather at right-top
            if(weatherWidget){
                const rect = weatherWidget.getBoundingClientRect();
                const width = rect.width || weatherWidget.offsetWidth || 200;
                const left = Math.max(margin, window.innerWidth - width - margin);
                changed = setPos(weatherWidget, weatherWidget.dataset.widget || 'modern-weather', left, top) || changed;
                constrainToViewport(weatherWidget, weatherWidget.dataset.widget || 'modern-weather');
            }

            // Place system at centered top, but try to avoid overlap with clock and weather
            if(systemWidget){
                const sRect = systemWidget.getBoundingClientRect();
                const sWidth = sRect.width || systemWidget.offsetWidth || 300;
                let centerLeft = (window.innerWidth - sWidth) / 2;

                // If clock and weather exist, ensure system doesn't overlap them
                const leftClock = clockWidget ? (parseFloat(clockWidget.style.left) || 0) : null;
                const wRect = weatherWidget ? (weatherWidget.getBoundingClientRect()) : null;
                const rightWeather = wRect ? (parseFloat(weatherWidget.style.left) + wRect.width) : null;

                // Minimum spacing between widgets
                const spacing = 12;

                if(clockWidget){
                    const cRect = clockWidget.getBoundingClientRect();
                    // If centerLeft would overlap clock, nudge right
                    if(centerLeft < cRect.right + spacing){
                        centerLeft = cRect.right + spacing;
                    }
                }
                if(weatherWidget){
                    const wRect2 = weatherWidget.getBoundingClientRect();
                    // If centerLeft + sWidth would overlap weather, nudge left
                    if(centerLeft + sWidth > wRect2.left - spacing){
                        centerLeft = wRect2.left - sWidth - spacing;
                    }
                }

                // If there's no horizontal room to place all three on the same line, drop system slightly down to avoid overlap
                if(centerLeft < margin) centerLeft = margin;
                if(centerLeft + sWidth > window.innerWidth - margin){
                    // not enough room horizontally: place system below the top line
                    const belowTop = top + Math.max( (clockWidget?clockWidget.getBoundingClientRect().height:0), (weatherWidget?weatherWidget.getBoundingClientRect().height:0) ) + spacing;
                    changed = setPos(systemWidget, systemWidget.dataset.widget || 'modern-system', Math.max(margin, (window.innerWidth - sWidth)/2), belowTop) || changed;
                } else {
                    changed = setPos(systemWidget, systemWidget.dataset.widget || 'modern-system', centerLeft, top) || changed;
                }
                constrainToViewport(systemWidget, systemWidget.dataset.widget || 'modern-system');
            }

            if(changed) saveState();
        }catch(e){ console.warn('arrangeWidgets failed', e); }
    }
    // Responsive positioning function with viewport boundary checks
    function updateResponsivePositions() {
        const clockWidget = clockContainer?.querySelector('.widget-dynamic-clock');
        const weatherWidget = clockContainer?.querySelector('.widget-modern-weather');
        const systemWidget = systemContainer?.querySelector('.widget-modern-system');
        
        // Check and constrain all widgets to viewport
        if(clockWidget) {
            // Set default position if no saved position exists (top-left)
            if(!state.positions?.['dynamic-clock']) {
                clockWidget.style.position = 'absolute';
                clockWidget.style.left = '20px';
                clockWidget.style.top = '20px';
                state.positions = state.positions || {};
                state.positions['dynamic-clock'] = { left: '20px', top: '20px' };
                saveState();
            }
            // Always check bounds for saved positions
            constrainToViewport(clockWidget, 'dynamic-clock');
        }
        
        if(weatherWidget) {
            // Set default position if no saved position exists (top-right)
            if(!state.positions?.['modern-weather']) {
                const rect = weatherWidget.getBoundingClientRect();
                const rightPosition = window.innerWidth - rect.width - 20;
                weatherWidget.style.position = 'absolute';
                weatherWidget.style.left = rightPosition + 'px';
                weatherWidget.style.top = '20px';
                state.positions = state.positions || {};
                state.positions['modern-weather'] = { left: rightPosition + 'px', top: '20px' };
                saveState();
            }
            // Always check bounds for saved positions
            constrainToViewport(weatherWidget, 'modern-weather');
        }
        
        if(systemWidget) {
            // Set default position if no saved position exists (centered between clock and weather)
            if(!state.positions?.['modern-system']) {
                const rect = systemWidget.getBoundingClientRect();
                const centerPosition = (window.innerWidth - rect.width) / 2;
                systemWidget.style.position = 'absolute';
                systemWidget.style.left = centerPosition + 'px';
                systemWidget.style.top = '20px';
                state.positions = state.positions || {};
                state.positions['modern-system'] = { left: centerPosition + 'px', top: '20px' };
                saveState();
            }
            // Always check bounds for saved positions
            constrainToViewport(systemWidget, 'modern-system');
        }
        // Also try to intelligently arrange the three main widgets
        try{ if(typeof arrangeWidgets === 'function') arrangeWidgets(); }catch(e){}
    }

    // Track screen size for monitor changes
    let lastScreenSize = { width: window.innerWidth, height: window.innerHeight };
    
    // Add window resize listener for responsive updates
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Immediate constraint check (no delay for cross-monitor fixes)
        const clockWidget = clockContainer?.querySelector('.widget-dynamic-clock');
        const weatherWidget = clockContainer?.querySelector('.widget-modern-weather');  
        const systemWidget = systemContainer?.querySelector('.widget-modern-system');
        
        if(clockWidget) constrainToViewport(clockWidget, 'dynamic-clock');
        if(weatherWidget) constrainToViewport(weatherWidget, 'modern-weather');
        if(systemWidget) constrainToViewport(systemWidget, 'modern-system');
        
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const currentSize = { width: window.innerWidth, height: window.innerHeight };
            const sizeChange = Math.abs(currentSize.width - lastScreenSize.width) > 100 || 
                              Math.abs(currentSize.height - lastScreenSize.height) > 100;
            
            // If significant size change (likely moved to different monitor), force repositioning
            if(sizeChange) {
                console.log(`🖥️ MONITOR SWITCH DETECTED: ${lastScreenSize.width}x${lastScreenSize.height} → ${currentSize.width}x${currentSize.height}`);
                
                // Immediately check and fix all widgets
                setTimeout(() => {
                    console.log('🔧 Starting cross-monitor widget fixes...');
                    
                    // Force constraint check on all widgets
                    const clockWidget = clockContainer?.querySelector('.widget-dynamic-clock');
                    const weatherWidget = clockContainer?.querySelector('.widget-modern-weather');
                    const systemWidget = systemContainer?.querySelector('.widget-modern-system');
                    
                    if(clockWidget) constrainToViewport(clockWidget, 'dynamic-clock');
                    if(weatherWidget) constrainToViewport(weatherWidget, 'modern-weather');
                    if(systemWidget) constrainToViewport(systemWidget, 'modern-system');
                    
                    // Also update responsive positions
                    updateResponsivePositions();
                    
                    console.log('✅ Cross-monitor widget fixes completed');
                }, 100);
                
                // Second pass after DOM settles
                setTimeout(() => {
                    console.log('🔧 Second pass widget constraint check...');
                    updateResponsivePositions();
                }, 500);
            }
            
            updateResponsivePositions();
            lastScreenSize = currentSize;
        }, 150);
    });

    // Initial build
    buildAll();
    // Ensure preferred top-left/center/top-right arrangement immediately after build
    try{ setTimeout(()=>{ if(typeof arrangeWidgets === 'function') arrangeWidgets(); },120); }catch(e){}
    // Self-heal: if enabled but nothing rendered (race or CSS removal), retry once
    setTimeout(()=>{
        if(s.widgetsEnabled && container.childElementCount === 0){
            console.warn('[Widgets] Empty after initial build, attempting rebuild');
            buildAll();
        }
    }, 800);
})();