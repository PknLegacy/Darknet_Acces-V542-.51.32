// Simple hash router
const views = {
  home: () => `
    <div class="warning-banner">WARNING: ALL ACTIVITIES ARE LOGGED AND MONITORED</div>
    <h2 style="color:#fff;margin-bottom:25px;font-size:18px;">SYSTEM STATUS</h2>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-value" id="activeUsers">247</div><div class="stat-label">Active Users</div></div>
      <div class="stat-box"><div class="stat-value">1,847</div><div class="stat-label">Connections</div></div>
      <div class="stat-box"><div class="stat-value">HIGH</div><div class="stat-label">Threat Level</div></div>
      <div class="stat-box"><div class="stat-value">89.2%</div><div class="stat-label">Anonymity</div></div>
    </div>
    <div class="surveillance-alert">SURVEILLANCE ALERT: Unusual traffic patterns detected. Recommend immediate protocol change.</div>
    <div style="background:#0a0a0a;border:1px solid #333;padding:20px;margin-top:25px;">
      <h3 style="color:#ccc;margin-bottom:15px;font-size:14px;">RECENT ACTIVITY</h3>
      <div style="font-size:12px;color:#666;">
        <div style="margin:8px 0;">03:14:27 - Connection established from unknown proxy</div>
        <div style="margin:8px 0;">03:15:42 - Encrypted message received</div>
        <div style="margin:8px 0;">03:16:15 - WARNING: Monitoring software detected</div>
        <div style="margin:8px 0;">03:17:03 - Emergency protocol standby</div>
        <div style="margin:8px 0;">03:17:34 - User authentication failed (3x)</div>
      </div>
    </div>
  `,
  connection: () => `
    <h2 style="color:#fff;margin-bottom:25px;">CONNECTION MATRIX</h2>
    <div class="connection-panel">
      <div class="connection-status">
        <h3 style="color:#ccc;">Current Node</h3>
        <button class="btn" id="btn-change-connection">CHANGE CONNECTION</button>
      </div>
      <div class="connection-info">
        <div class="info-box"><div class="info-label">Server Location</div><div class="info-value" id="currentServer">Moscow-Dark-07</div></div>
        <div class="info-box"><div class="info-label">IP Address</div><div class="info-value" id="currentIP">185.220.47.133</div></div>
        <div class="info-box"><div class="info-label">Encryption Level</div><div class="info-value">AES-256 Military Grade</div></div>
        <div class="info-box"><div class="info-label">Threat Assessment</div><div class="info-value" id="threatLevel" style="color:#ff4444;">EXTREME</div></div>
      </div>
      <div id="connectionLoader" class="loading-bar" style="display:none;"><div class="loading-progress"></div></div>
      <div style="margin-top:25px;">
        <h4 style="color:#ccc;margin-bottom:15px;">Available Nodes</h4>
        <div class="node-grid" id="nodeGrid"></div>
      </div>
    </div>
  `,
  chat: () => `
    <h2 style="color:#fff;margin-bottom:25px;">ENCRYPTED CHAT ROOM: #darknet-main</h2>
    <div class="chat-container">
      <div class="chat-header">Encrypted Communications | <span id="chatUsers">47</span> Users Online</div>
      <div class="chat-messages" id="chatMessages"></div>
    </div>
    <div style="margin-top:15px;display:flex;gap:15px;">
      <input type="text" id="messageInput" placeholder="Enter encrypted message..." style="flex:1;">
      <button class="btn" id="btn-send">SEND</button>
      <button class="btn danger" id="btn-panic">PANIC</button>
    </div>
  `,
  marketplace: () => `
    <h2 style="color:#fff;margin-bottom:25px;">UNDERGROUND MARKETPLACE</h2>
    <div class="surveillance-alert">WARNING: All transactions are monitored. Use untraceable payment methods only.</div>
    <div class="marketplace-grid" id="market"></div>
  `,
  terminal: () => `
    <h2 style="color:#fff;margin-bottom:25px;">COMMAND TERMINAL</h2>
    <div class="terminal" id="terminal">
      <div class="terminal-line"><span class="prompt">darknet@terminal:~$</span> system status</div>
      <div class="terminal-line">Status: ACTIVE | Threat Level: HIGH</div>
      <div class="terminal-line">Connections: 1,847 active | Encryption: AES-256</div>
      <div class="terminal-line"><span class="prompt">darknet@terminal:~$</span> netstat -surveillance</div>
      <div class="terminal-line">WARNING: 3 monitoring processes detected</div>
      <div class="terminal-line">185.220.47.133:443 -> GOVERNMENT_MONITOR [ACTIVE]</div>
      <div class="terminal-line">192.168.13.45:80 -> UNKNOWN_SCANNER [PROBING]</div>
      <div class="terminal-line"><span class="prompt">darknet@terminal:~$</span> tor-status --verbose</div>
      <div class="terminal-line">Tor version 4.7.1 [MODIFIED]</div>
      <div class="terminal-line">Circuit: RU -> CN -> IR -> UNKNOWN</div>
      <div class="terminal-line">Exit node: [REDACTED] | Country: [CLASSIFIED]</div>
      <div class="terminal-line"><span class="prompt">darknet@terminal:~$</span> <span id="cursor">_</span></div>
    </div>
    <div style="display:flex;gap:15px;margin-top:20px;">
      <button class="btn" data-cmd="scan-network">SCAN NETWORK</button>
      <button class="btn" data-cmd="change-identity">CHANGE IDENTITY</button>
      <button class="btn danger" data-cmd="emergency-shutdown">EMERGENCY SHUTDOWN</button>
    </div>
  `,
  surveillance: () => `
    <h2 style="color:#fff;margin-bottom:25px;">SURVEILLANCE MONITOR</h2>
    <div class="surveillance-alert">ACTIVE MONITORING DETECTED: Your activities are being tracked by multiple agencies.</div>
    <div style="background:#0a0a0a;border:1px solid #333;padding:20px;margin:20px 0;">
      <h3 style="color:#ff4444;margin-bottom:15px;">THREAT ANALYSIS</h3>
      <div style="margin:10px 0;">
        <div style="color:#ccc;">Government Monitoring: <span style="color:#ff4444;">ACTIVE</span></div>
        <div style="color:#ccc;">ISP Tracking: <span style="color:#ff4444;">HIGH</span></div>
        <div style="color:#ccc;">Corporate Surveillance: <span style="color:#ffaa00;">MEDIUM</span></div>
        <div style="color:#ccc;">Peer Monitoring: <span style="color:#0f0;">LOW</span></div>
      </div>
    </div>
    <div style="background:#0a0a0a;border:1px solid #333;padding:20px;">
      <h3 style="color:#ccc;margin-bottom:15px;">RECENT SURVEILLANCE EVENTS</h3>
      <div style="font-size:12px;color:#666;" id="survLog"></div>
    </div>
  `,
  crypto: () => `
    <h2 style="color:#fff;margin-bottom:25px;">CRYPTOCURRENCY WALLET</h2>
    <div class="warning-banner">ALL TRANSACTIONS ARE TRACED - USE MIXING SERVICES</div>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-value">0.00000000</div><div class="stat-label">Bitcoin Balance</div></div>
      <div class="stat-box"><div class="stat-value">0.000000</div><div class="stat-label">Monero Balance</div></div>
      <div class="stat-box"><div class="stat-value">HIGH</div><div class="stat-label">Transaction Risk</div></div>
      <div class="stat-box"><div class="stat-value">TRACKED</div><div class="stat-label">Wallet Status</div></div>
    </div>
    <div style="display:flex;gap:15px;margin-top:20px;">
      <button class="btn" data-wallet="receive">RECEIVE</button>
      <button class="btn" data-wallet="send">SEND</button>
      <button class="btn danger" data-wallet="mix">MIX COINS</button>
    </div>
  `,
  files: () => `
    <h2 style="color:#fff;margin-bottom:25px;">ENCRYPTED FILE STORAGE</h2>
    <div class="surveillance-alert">FILE ACCESS MONITORED - ALL DOWNLOADS ARE LOGGED</div>
    <div style="background:#0a0a0a;border:1px solid #333;">
      <div style="background:#111;padding:15px;border-bottom:1px solid #222;">/encrypted/storage/classified/</div>
      <div style="padding:20px;" id="filesList"></div>
    </div>
  `,
  vpn: () => `
    <h2 style="color:#fff;margin-bottom:25px;">VPN CONNECTION STATUS</h2>
    <div style="background:#0a0a0a;border:1px solid #333;padding:25px;">
      <div style="display:flex;align-items:center;gap:15px;margin-bottom:25px;">
        <div style="width:12px;height:12px;border-radius:50%;background:#0f0;animation:pulse 1s infinite;"></div>
        <span style="color:#0f0;font-weight:bold;">CONNECTION ACTIVE</span>
        <div style="margin-left:auto;"><button class="btn danger" id="btn-disconnect">DISCONNECT</button></div>
      </div>
      <div class="connection-info">
        <div class="info-box"><div class="info-label">Server Location</div><div class="info-value">Netherlands - Amsterdam</div></div>
        <div class="info-box"><div class="info-label">IP Address</div><div class="info-value">185.220.101.47</div></div>
        <div class="info-box"><div class="info-label">Protocol</div><div class="info-value">OpenVPN UDP</div></div>
        <div class="info-box"><div class="info-label">Encryption</div><div class="info-value">AES-256-GCM</div></div>
      </div>
      <div style="margin-top:25px;">
        <h4 style="color:#ccc;margin-bottom:15px;">Connection Log</h4>
        <div style="background:#000;padding:15px;font-size:11px;color:#666;" id="vpnLog"></div>
      </div>
    </div>
  `,
  tor: () => `
    <h2 style="color:#fff;margin-bottom:25px;">TOR BROWSER — DEMO</h2>
    <div class="tor">
      <div class="tor-tabs" id="torTabs"></div>
      <div class="tor-toolbar">
        <button class="btn" id="torBack">&larr;</button>
        <button class="btn" id="torForward">&rarr;</button>
        <button class="btn" id="torReload">Reload</button>
        <input class="tor-address" id="torAddress" placeholder="Enter .onion address"/>
        <button class="btn" id="torGo">Go</button>
        <button class="btn" id="torNewID">New Identity</button>
      </div>
      <div class="tor-circuit" id="torCircuit"></div>
      <div class="tor-view" id="torView">New Tor session. Type an .onion to open a demo page.</div>
    </div>
  `
};

function render(route){
  const container = document.getElementById('view');
  container.innerHTML = views[route] ? views[route]() : views.home();
  window.location.hash = route;
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.route===route);
  });
  document.dispatchEvent(new CustomEvent('view:rendered',{detail:{route}}));
}

function initRouter(){
  const defaultRoute = window.location.hash.replace('#','') || 'home';
  render(defaultRoute);
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=> render(btn.dataset.route));
  });
}

window.addEventListener('DOMContentLoaded', initRouter);
