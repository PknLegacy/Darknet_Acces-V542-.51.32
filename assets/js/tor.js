// Tor Browser Demo (no real network, purely local + educational)
window.TorDemo = (function(){
  const state = {
    tabs: [],
    active: null,
    history: {},
    circuit: []
  };

  function randomNode(nodes){
    return nodes[Math.floor(Math.random()*nodes.length)];
  }

  function newCircuit(nodes){
    const entry = randomNode(nodes.filter(n=>n.role==='entry'));
    const middle = randomNode(nodes.filter(n=>n.role==='middle'));
    const exit = randomNode(nodes.filter(n=>n.role==='exit'));
    return [entry, middle, exit];
  }

  function updateCircuitUI(){
    const el = document.getElementById('torCircuit');
    if(!el) return;
    el.innerHTML = state.circuit.map(n=>`<span class="tor-badge">${n.country} • ${n.code.toUpperCase()} (${n.role})</span>`).join(' ➜ ');
  }

  function renderTabs(){
    const tabsEl = document.getElementById('torTabs');
    if(!tabsEl) return;
    tabsEl.innerHTML = '';
    state.tabs.forEach(t=>{
      const b = document.createElement('button');
      b.className = 'tor-tab'+(state.active===t.id ? ' active':'');
      b.textContent = t.title;
      b.addEventListener('click', ()=> activateTab(t.id));
      tabsEl.appendChild(b);
    });
  }

  function activateTab(id){
    state.active = id;
    renderTabs();
    const tab = state.tabs.find(t=>t.id===id);
    if(tab) {
      const view = document.getElementById('torView');
      view.innerHTML = tab.content;
      const addr = document.getElementById('torAddress');
      addr.value = tab.address;
    }
  }

  function openAddress(addr){
    fetch('assets/data/onion_pages.json').then(r=>r.json()).then(pages=>{
      const page = pages.find(p=> p.address.toLowerCase() === addr.toLowerCase());
      const content = page ? `<h3>${page.title}</h3><p>${page.body}</p>` :
        `<h3>404 — Onion not found</h3><p>No demo page for <b>${addr}</b>. Try <code>marketplace42abcd.onion</code> or <code>securemail7yx.onion</code>.</p>`;
      const id = Date.now();
      state.tabs.push({id, title: page? page.title : 'New Tab', address: addr, content});
      activateTab(id);
      // push to history
      state.history[id] = [addr];
    });
  }

  function goBack(){ /* simple demo back stack */ }
  function goForward(){}

  function mount(){
    // load tor nodes
    fetch('assets/data/tor_nodes.json').then(r=>r.json()).then(nodes=>{
      state.circuit = newCircuit(nodes);
      updateCircuitUI();
    });

    // wire controls
    document.getElementById('torGo').addEventListener('click', ()=>{
      const addr = document.getElementById('torAddress').value.trim();
      if(!addr.endsWith('.onion')){ alert('Bitte eine .onion-Adresse eingeben (Demo).'); return; }
      openAddress(addr);
    });
    document.getElementById('torReload').addEventListener('click', ()=>{
      if(state.active==null) return;
      const tab = state.tabs.find(t=>t.id===state.active);
      if(tab) openAddress(tab.address);
    });
    document.getElementById('torNewID').addEventListener('click', ()=>{
      fetch('assets/data/tor_nodes.json').then(r=>r.json()).then(nodes=>{
        state.circuit = newCircuit(nodes);
        updateCircuitUI();
        const view = document.getElementById('torView');
        view.innerHTML = 'New Tor identity obtained. Circuit rebuilt.';
      });
    });
    document.getElementById('torBack').addEventListener('click', goBack);
    document.getElementById('torForward').addEventListener('click', goForward);

    // open a default tab
    openAddress('welcome-demo.onion');
  }

  return { mount };
})();
