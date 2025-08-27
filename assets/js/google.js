
// Google Browser (Simulation)
window.GoogleDemo = (function(){
  const state = { tabs: [], active: null, history: {} };

  function renderTabs(){
    const tabsEl = document.getElementById('googleTabs'); if(!tabsEl) return;
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
    state.active = id; renderTabs();
    const tab = state.tabs.find(t=>t.id===id);
    if(tab){
      const view = document.getElementById('googleView');
      view.innerHTML = tab.content;
      const addr = document.getElementById('googleAddress');
      if(addr) addr.value = tab.address;
    }
  }

  function openUrl(q){
    fetch('assets/data/google_pages.json').then(r=>r.json()).then(pages=>{
      // try to match by slug or return search results
      const match = pages.find(p => p.slug === q.toLowerCase() || p.url === q.toLowerCase());
      let content;
      if(match) content = `<h3>${match.title}</h3><p>${match.body}</p>`;
      else content = `<h3>Search results for: ${q}</h3><p>No live web access. Showing local demo results.</p><ul>${pages.map(p=>`<li>${p.title} — <small>${p.url}</small></li>`).join('')}</ul>`;
      const id = Date.now();
      state.tabs.push({id, title: q, address: q, content});
      activateTab(id);
    });
  }

  function mount(){
    renderTabs();
    document.getElementById('googleGo').addEventListener('click', ()=>{
      const q = document.getElementById('googleAddress').value.trim();
      if(!q) return;
      openUrl(q);
    });
    document.getElementById('googleNewTab').addEventListener('click', ()=> openUrl('New Tab'));
    // open default search page
    openUrl('search');
  }

  return { mount };
})();
