// Core interactions moved from inline <script> to JS module
let connectionInProgress = false;

function qs(sel,ctx=document){return ctx.querySelector(sel)}
function qsa(sel,ctx=document){return Array.from(ctx.querySelectorAll(sel))}

function addTerminalMessage(message){
  const terminal = qs('#terminal');
  if(!terminal) return;
  const newLine = document.createElement('div');
  newLine.className = 'terminal-line';
  newLine.innerHTML = `<span style="color:#ffaa00;">[${new Date().toLocaleTimeString()}]</span> ${message}`;
  const cursor = qs('#cursor');
  terminal.insertBefore(newLine, cursor ? cursor.parentElement : null);
  terminal.scrollTop = terminal.scrollHeight;
}

function changeConnection(){
  if(connectionInProgress) return;
  connectionInProgress = true;
  const loader = qs('#connectionLoader');
  const progress = loader.querySelector('.loading-progress');
  loader.style.display='block';progress.style.width='0%';
  let val=0;
  const interval = setInterval(()=>{
    val += Math.random()*15+5;
    if(val>100){val=100;clearInterval(interval);
      setTimeout(()=>{
        loader.style.display='none';connectionInProgress=false;
        const servers=['Moscow-Dark-07','Beijing-Shadow-12','Tehran-Ghost-09','Siberia-Deep-15'];
        const ips=['185.220.47.133','192.168.13.45','10.0.0.89','172.16.0.23'];
        const threats=['EXTREME','HIGH','MEDIUM','LOW'];
        const i=Math.floor(Math.random()*servers.length);
        qs('#currentServer').textContent=servers[i];
        qs('#currentIP').textContent=ips[i];
        qs('#threatLevel').textContent=threats[i];
        qs('#threatLevel').style.color = threats[i]==='EXTREME' ? '#ff4444' : threats[i]==='HIGH' ? '#ff8844' : '#00ff00';
        addTerminalMessage('Connection changed to: '+servers[i]);
      },800);
    }
    progress.style.width = val+'%';
  },200);
}

function selectNode(nodeName, ip){
  if(connectionInProgress) return;
  connectionInProgress = true;
  const loader = qs('#connectionLoader');
  const progress = loader.querySelector('.loading-progress');
  loader.style.display='block';progress.style.width='0%';
  let val=0;
  const interval = setInterval(()=>{
    val += Math.random()*10+3;
    if(val>100){val=100;clearInterval(interval);
      setTimeout(()=>{
        loader.style.display='none';connectionInProgress=false;
        qs('#currentServer').textContent=nodeName;
        qs('#currentIP').textContent=ip;
        if(nodeName.includes('666')){
          qs('#threatLevel').textContent='LETHAL'; qs('#threatLevel').style.color='#f00';
          addTerminalMessage('WARNING: Connected to dangerous node '+nodeName);
        } else {
          qs('#threatLevel').textContent='MEDIUM'; qs('#threatLevel').style.color='#ffaa00';
          addTerminalMessage('Connected to node: '+nodeName);
        }
      },1000);
    }
    progress.style.width = val+'%';
  },150);
}

function sendMessage(){
  const input = qs('#messageInput'); const messages = qs('#chatMessages');
  if(!input || !messages) return;
  const val = input.value.trim(); if(!val) return;
  const now = new Date(); const time = now.toTimeString().slice(0,5);
  const msg = document.createElement('div'); msg.className='message';
  msg.innerHTML = `<span class="message-user">user_anonymous:</span><span class="message-time">${time}</span><div>${val}</div>`;
  messages.appendChild(msg); messages.scrollTop = messages.scrollHeight; input.value='';
  setTimeout(()=>{
    const warn = document.createElement('div'); warn.className='message system';
    const t = new Date().toTimeString().slice(0,5);
    const locations = ['Berlin, Germany','Moscow, Russia','Beijing, China','Tehran, Iran','Unknown Location'];
    warn.innerHTML = `<span class="message-user">MONITOR:</span><span class="message-time">${t}</span><div>Message intercepted and logged. User location: ${locations[Math.floor(Math.random()*locations.length)]}</div>`;
    messages.appendChild(warn); messages.scrollTop = messages.scrollHeight;
  }, 1500);
}

function executeCommand(cmd){
  const terminal = qs('#terminal'); if(!terminal) return;
  const line = document.createElement('div'); line.className='terminal-line';
  if(cmd==='scan-network'){
    line.innerHTML = `<span class="prompt">darknet@terminal:~$</span> scan-network --deep<br>
      Scanning network infrastructure...<br>
      Found 247 active nodes | 15 compromised | 3 honeypots detected<br>
      WARNING: Government monitoring stations identified`;
  } else if(cmd==='change-identity'){
    line.innerHTML = `<span class="prompt">darknet@terminal:~$</span> change-identity --full<br>
      Generating new digital fingerprint...<br>
      MAC address spoofed | Browser signature altered<br>
      New identity: [CLASSIFIED]`;
  } else if(cmd==='emergency-shutdown'){
    line.innerHTML = `<span class="prompt">darknet@terminal:~$</span> emergency-shutdown --now<br>
      <span style="color:#ff4444;">EMERGENCY PROTOCOL INITIATED</span><br>
      <span style="color:#ff4444;">WIPING ALL TRACES...</span><br>
      <span style="color:#ff4444;">CONNECTION TERMINATED</span>`;
  }
  const cursor = qs('#cursor');
  terminal.insertBefore(line, cursor ? cursor.parentElement : null);
  terminal.scrollTop = terminal.scrollHeight;
}

function populateNodes(){
  fetch('assets/data/nodes.json').then(r=>r.json()).then(nodes=>{
    const grid = qs('#nodeGrid'); if(!grid) return;
    grid.innerHTML = '';
    nodes.forEach(n=>{
      const div = document.createElement('div');
      div.className = 'node-item'+(n.dangerous?' dangerous':'');
      div.innerHTML = `<div class="node-location">${n.name}</div><div class="node-status">${n.status}</div>`;
      div.addEventListener('click', ()=> selectNode(n.name, n.ip));
      grid.appendChild(div);
    });
  });
}

function populateMarket(){
  const items = [
    {t:'Advanced Encryption Software', d:'Military-grade encryption tools with quantum resistance', p:'0.0245 BTC'},
    {t:'Anonymous VPN Service', d:'1-year premium access, no logs, offshore servers', p:'0.0089 BTC'},
    {t:'Cryptocurrency Tumbling', d:'Clean your digital footprints, untraceable transactions', p:'0.0156 BTC'},
    {t:'Secure Communication Kit', d:'End-to-end encrypted messaging with self-destruct', p:'0.0123 BTC'},
    {t:'Digital Identity Package', d:'Complete anonymous digital identity with documentation', p:'0.1247 BTC', danger:true},
    {t:'Counter-Surveillance Tools', d:'Software suite for detecting and evading monitoring', p:'0.0334 BTC'}
  ];
  const grid = qs('#market'); if(!grid) return;
  grid.innerHTML = items.map(it=>`
    <div class="marketplace-item">
      <div class="item-title">${it.t}</div>
      <div class="item-description">${it.d}</div>
      <div class="item-price">${it.p}</div>
      <button class="btn ${it.danger?'danger':''}" onclick="alert('DEMO ONLY — no real purchases')">${it.danger?'HIGH RISK':'PURCHASE'}</button>
    </div>`).join('');
}

function populateFiles(){
  const files = [
    {name:'government_secrets.gpg', meta:'2.7 MB | AES-256 | Last accessed: NEVER'},
    {name:'financial_records.7z.gpg', meta:'847 KB | Triple DES | Last accessed: 3 days ago'},
    {name:'classified_documents.tar.gz.gpg', meta:'15.2 MB | MILITARY GRADE | WARNING: LETHAL IF EXPOSED', danger:true},
    {name:'backup_identity.zip.enc', meta:'125 KB | RSA-4096 | Emergency only'}
  ];
  const list = qs('#filesList'); if(!list) return;
  list.innerHTML = files.map(f=>`
    <div style="margin:15px 0;padding:15px;background:#111;border-left:2px solid ${f.danger?'#ff4444':'#333'};">
      <div style="color:#fff;margin-bottom:5px;">${f.name}</div>
      <div style="color:${f.danger?'#ff4444':'#666'};font-size:11px;">${f.meta}</div>
    </div>`).join('');
}

function populateSurveillanceLog(){
  const log = [
    '03:17:45 - Deep packet inspection detected',
    '03:16:23 - Traffic analysis in progress',
    '03:15:12 - DNS queries logged',
    '03:14:07 - Metadata collection active',
    '03:13:45 - Behavioral analysis initiated'
  ];
  const el = qs('#survLog'); if(el) el.innerHTML = log.map(x=>`<div style="margin:5px 0;">${x}</div>`).join('');
}

function initView(route){
  if(route==='connection'){
    qs('#btn-change-connection').addEventListener('click', changeConnection);
    populateNodes();
  }
  if(route==='chat'){
    qs('#btn-send').addEventListener('click', sendMessage);
    qs('#btn-panic').addEventListener('click', ()=> alert('PANIC MODE (DEMO)'));
    qs('#chatMessages').innerHTML = `
      <div class="message system"><span class="message-user">SYSTEM:</span><span class="message-time">??:??</span><div>WARNING: This channel is monitored. Use encryption codes.</div></div>`;
  }
  if(route==='marketplace'){ populateMarket(); }
  if(route==='files'){ populateFiles(); }
  if(route==='surveillance'){ populateSurveillanceLog(); }
  if(route==='vpn'){
    const log=['03:17:42 - Connection established','03:17:43 - DNS leak protection: ACTIVE','03:17:44 - Kill switch: ENABLED','03:17:45 - IPv6 traffic: BLOCKED','03:17:46 - WARNING: Deep packet inspection detected'];
    qs('#vpnLog').innerHTML = log.map(x=>`<div>${x}</div>`).join('');
    qs('#btn-disconnect').addEventListener('click', ()=> alert('VPN DISCONNECTION (DEMO)'));
  }
  if(route==='terminal'){
    qsa('[data-cmd]').forEach(b=> b.addEventListener('click', ()=> executeCommand(b.dataset.cmd)));
  }
  if(route==='home'){
    // nothing extra
  }
  if(route==='tor'){
    window.TorDemo && window.TorDemo.mount();
  }
}

document.addEventListener('view:rendered', e=> initView(e.detail.route));

// Global header counters and emergency buttons
window.addEventListener('DOMContentLoaded', ()=>{
  setInterval(()=>{
    const userCount = document.getElementById('userCount');
    const activeUsers = document.getElementById('activeUsers');
    if(userCount){
      let current = parseInt(userCount.textContent);
      if(isNaN(current)){ current = 247; }
      const change = Math.floor(Math.random()*6)-3;
      current = Math.max(200, Math.min(300, current + change));
      userCount.textContent = current+' ACTIVE';
      if(activeUsers) activeUsers.textContent = current;
    }
  }, 8000);

  ['btn-emergency','btn-burn','btn-ghost'].forEach(id=>{
    const btn = document.getElementById(id);
    if(btn) btn.addEventListener('click', ()=> alert('Demo only — keine echten Aktionen.'));
  });

  // blink cursor
  setInterval(()=>{
    const c = document.getElementById('cursor');
    if(c) c.style.opacity = c.style.opacity==='0'?'1':'0';
  }, 500);
});
