
// Central app controller
const App = (function(){
  const templates = {};
  // load template strings (kept concise here, detailed generation below)
  function fetchJSON(path){ return fetch(path).then(r=>r.json()); }
  function qs(sel,ctx=document){return ctx.querySelector(sel)}
  function qsa(sel,ctx=document){return Array.from(ctx.querySelectorAll(sel))}

  // Fullscreen on first user interaction
  function enableFullscreenOnFirstClick(){
    function tryFull(){
      const el = document.documentElement;
      if(el.requestFullscreen){
        el.requestFullscreen().catch(()=>{});
      } else if(el.webkitRequestFullscreen){
        el.webkitRequestFullscreen();
      }
      // show hint briefly
      const hint = document.createElement('div'); hint.className='fullscreen-hint'; hint.textContent='Entered Fullscreen (Press ESC to exit)';
      document.body.appendChild(hint);
      setTimeout(()=> hint.remove(), 4000);
      window.removeEventListener('click', tryFull);
    }
    window.addEventListener('click', tryFull, {once:true});
  }

  function renderHome(){
    return `
      <div class="warning-banner">WARNING: ALL ACTIVITIES ARE LOGGED AND MONITORED</div>
      <h2 style="color:#fff;margin-bottom:25px;font-size:18px;">SYSTEM STATUS</h2>
      <div class="stats-grid">
        <div class="stat-box"><div class="stat-value" id="activeUsers">247</div><div class="stat-label">Active Users</div></div>
        <div class="stat-box"><div class="stat-value">1,847</div><div class="stat-label">Connections</div></div>
        <div class="stat-box"><div class="stat-value">HIGH</div><div class="stat-label">Threat Level</div></div>
        <div class="stat-box"><div class="stat-value">89.2%</div><div class="stat-label">Anonymity</div></div>
      </div>
      <div class="surveillance-alert">SURVEILLANCE ALERT: Unusual traffic patterns detected. Recommend immediate protocol change.</div>
    `;
  }

  function renderConnection(){ /* reuse from previous project by dynamic data */ return window._templates.connection || ''; }
  function renderMarketplace(){ return window._templates.marketplace || ''; }

  async function renderView(route){
    const container = document.getElementById('view');
    switch(route){
      case 'home': container.innerHTML = renderHome(); break;
      case 'connection': container.innerHTML = await window._templates.connection(); break;
      case 'chat': container.innerHTML = await window._templates.chat(); break;
      case 'marketplace': container.innerHTML = await window._templates.marketplace(); break;
      case 'terminal': container.innerHTML = await window._templates.terminal(); break;
      case 'files': container.innerHTML = await window._templates.files(); break;
      case 'vpn': container.innerHTML = await window._templates.vpn(); break;
      case 'surveillance': container.innerHTML = await window._templates.surveillance(); break;
      case 'crypto': container.innerHTML = await window._templates.crypto(); break;
      case 'tor': container.innerHTML = await window._templates.tor(); break;
      case 'google': container.innerHTML = await window._templates.google(); break;
      default: container.innerHTML = renderHome();
    }
    // after render, initialize view-specific logic
    document.dispatchEvent(new CustomEvent('app:view:rendered',{detail:{route}}));
  }

  function initTemplates(){
    // load the previous views from a compact source (we embed small templates)
    window._templates = {};
    window._templates.connection = async ()=> (await fetch('assets/js/templates/connection.html').then(r=>r.text())).toString();
    // For brevity, embed major templates in code to avoid missing files
    window._templates.chat = async ()=> `
      <h2 style="color:#fff;margin-bottom:15px;">ENCRYPTED CHAT ROOM: #darknet-main</h2>
      <div class="chat-container">
        <div class="chat-header">Encrypted Communications | <span id="chatUsers">47</span> Users Online</div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
          <input type="text" id="messageInput" placeholder="Enter your message...">
          <button id="btn-send" class="btn">Send</button>
          <button id="btn-clear" class="btn">Clear</button>
        </div>
      </div>
    `;
    window._templates.marketplace = async ()=> (await fetch('assets/js/templates/marketplace.html').then(r=>r.text())).toString();
    window._templates.terminal = async ()=> (await fetch('assets/js/templates/terminal.html').then(r=>r.text())).toString();
    window._templates.files = async ()=> (await fetch('assets/js/templates/files.html').then(r=>r.text())).toString();
    window._templates.vpn = async ()=> (await fetch('assets/js/templates/vpn.html').then(r=>r.text())).toString();
    window._templates.surveillance = async ()=> (await fetch('assets/js/templates/surveillance.html').then(r=>r.text())).toString();
    window._templates.crypto = async ()=> (await fetch('assets/js/templates/crypto.html').then(r=>r.text())).toString();
    window._templates.tor = async ()=> (await fetch('assets/js/templates/tor.html').then(r=>r.text())).toString();
    window._templates.google = async ()=> (await fetch('assets/js/templates/google.html').then(r=>r.text())).toString();
  }

  // Chat AI: simple pattern matching + json Q/A selection
  async function initChatAI(){
    const qa = await fetch('assets/data/chat_ai.json').then(r=>r.json());
    const messagesEl = qs('#chatMessages');
    const input = qs('#messageInput');
    const btnSend = qs('#btn-send');
    const btnClear = qs('#btn-clear');
    if(!messagesEl || !input) return;

    // Load history
    const history = JSON.parse(localStorage.getItem('chat_history_v2')||'[]');
    history.forEach(m=>{
      const el = document.createElement('div'); el.className = m.role==='user' ? 'message user' : 'message ai';
      el.innerHTML = `<div>${m.text}</div><span class="message-meta">${m.role==='user'?'You':'AI'} • ${m.time}</span>`;
      messagesEl.appendChild(el);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;

    function saveToHistory(role, text){
      const now = new Date(); const time = now.toTimeString().slice(0,5);
      const h = JSON.parse(localStorage.getItem('chat_history_v2')||'[]');
      h.push({role,text,time});
      localStorage.setItem('chat_history_v2', JSON.stringify(h.slice(-200))); // keep last 200
    }

    function aiRespond(userText){
      // simple matching
      const lowered = userText.toLowerCase();
      // search for best match
      let candidate = qa.find(q=>{
        return q.keywords.some(k=> lowered.includes(k));
      });
      if(!candidate){
        // fallback: if question mark present, choose generic, else small reply
        if(userText.trim().endsWith('?')){
          candidate = qa.find(q=> q.type==='question') || qa[0];
        } else {
          candidate = qa.find(q=> q.type==='small') || qa[0];
        }
      }
      // choose random answer from candidate.answers
      const answer = candidate.answers[Math.floor(Math.random()*candidate.answers.length)];
      // simulate typing delay
      setTimeout(()=>{
        const el = document.createElement('div'); el.className = 'message ai';
        const now = new Date().toTimeString().slice(0,5);
        el.innerHTML = `<div>${answer}</div><span class="message-meta">AI • ${now}</span>`;
        messagesEl.appendChild(el); messagesEl.scrollTop = messagesEl.scrollHeight;
        saveToHistory('ai', answer);
      }, 600 + Math.random()*900);
    }

    btnSend.addEventListener('click', ()=>{
      const val = input.value.trim(); if(!val) return;
      const now = new Date().toTimeString().slice(0,5);
      const el = document.createElement('div'); el.className = 'message user';
      el.innerHTML = `<div>${val}</div><span class="message-meta">You • ${now}</span>`;
      messagesEl.appendChild(el); messagesEl.scrollTop = messagesEl.scrollHeight;
      saveToHistory('user', val);
      input.value='';
      aiRespond(val);
    });

    input.addEventListener('keydown', e=>{
      if(e.key==='Enter'){ btnSend.click(); }
    });

    btnClear.addEventListener('click', ()=>{
      if(confirm('Clear chat history?')){ localStorage.removeItem('chat_history_v2'); messagesEl.innerHTML=''; }
    });
  }

  function initViewBindings(route){
    if(route==='connection'){
      // reuse earlier populateNodes function if present
      if(window.populateNodes) window.populateNodes();
      const btn = qs('#btn-change-connection'); if(btn) btn.addEventListener('click', window.changeConnection);
    }
    if(route==='chat'){
      initChatAI();
    }
    if(route==='marketplace'){ if(window.populateMarket) window.populateMarket(); }
    if(route==='files'){ if(window.populateFiles) window.populateFiles(); }
    if(route==='surveillance'){ if(window.populateSurveillanceLog) window.populateSurveillanceLog(); }
    if(route==='vpn'){ if(window.initVPN) window.initVPN(); }
    if(route==='terminal'){ if(window.initTerminal) window.initTerminal(); }
    if(route==='tor'){ if(window.TorDemo) window.TorDemo.mount(); }
    if(route==='google'){ if(window.GoogleDemo) window.GoogleDemo.mount(); }
  }

  function init(){
    enableFullscreenOnFirstClick();
    initTemplates();
    initTemplates = function(){}; // prevent re-init
    // render on route change
    document.addEventListener('view:change', e=> renderView(e.detail.route));
    document.addEventListener('app:view:rendered', e=> initViewBindings(e.detail.route));
    // initial render
    setTimeout(()=> renderView(window.location.hash.replace('#','')||'home'), 10);
    // global header counters and emergency buttons
    setInterval(()=>{
      const userCount = document.getElementById('userCount');
      const activeUsers = document.getElementById('activeUsers');
      if(userCount){
        let current = parseInt(userCount.textContent) || 247;
        const change = Math.floor(Math.random()*6)-3;
        current = Math.max(180, Math.min(420, current + change));
        userCount.textContent = current+' ACTIVE';
        if(activeUsers) activeUsers.textContent = current;
      }
    }, 8000);
    ['btn-emergency','btn-burn','btn-ghost'].forEach(id=>{
      const btn = document.getElementById(id);
      if(btn) btn.addEventListener('click', ()=> alert('Protocol triggered: UI-only simulation.'));
    });
  }

  return { init, renderView, renderHome };
})();

window.addEventListener('DOMContentLoaded', ()=> App.init());


// === SOUND SYSTEM ===
const sounds = {
  click: new Audio("assets/sounds/click.mp3"),
  success: new Audio("assets/sounds/success.mp3"),
  error: new Audio("assets/sounds/error.mp3"),
  loop: new Audio("assets/sounds/loop.mp3")
};
sounds.loop.loop = true;

// Play helper
function playSound(type) {
  if(localStorage.getItem("sound") !== "off") {
    sounds[type]?.play().catch(()=>{});
  }
}

// === THEME SYSTEM ===
function setTheme(theme) {
  document.body.classList.remove("green-crt", "amber-crt", "white-crt");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "green-crt";
  setTheme(savedTheme);
}

function toggleLoopSound(on) {
  if(on) {
    sounds.loop.play().catch(()=>{});
    localStorage.setItem("loop", "on");
  } else {
    sounds.loop.pause();
    localStorage.setItem("loop", "off");
  }
}

// Init on load
window.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Restore sound loop
  if(localStorage.getItem("loop") === "on") {
    toggleLoopSound(true);
  }

  // Settings Handlers
  const themeSelect = document.getElementById("theme-select");
  const soundToggle = document.getElementById("sound-toggle");
  const loopToggle = document.getElementById("loop-toggle");

  if(themeSelect) {
    themeSelect.value = localStorage.getItem("theme") || "green-crt";
    themeSelect.addEventListener("change", e => setTheme(e.target.value));
  }

  if(soundToggle) {
    soundToggle.checked = localStorage.getItem("sound") !== "off";
    soundToggle.addEventListener("change", e => {
      localStorage.setItem("sound", e.target.checked ? "on" : "off");
    });
  }

  if(loopToggle) {
    loopToggle.checked = localStorage.getItem("loop") === "on";
    loopToggle.addEventListener("change", e => toggleLoopSound(e.target.checked));
  }
});
