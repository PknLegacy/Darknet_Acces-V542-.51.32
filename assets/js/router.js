// Simple hash router (extended)
const views = {
  home: () => `...`, // keep initial view handled in app.js to reduce duplication
  connection: null, chat: null, marketplace: null, terminal: null,
  surveillance: null, crypto: null, files: null, vpn: null, tor: null, google: null
};

// We will delegate rendering to app.renderView to allow centralized templates
function render(route){
  window.location.hash = route;
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.route===route);
  });
  document.dispatchEvent(new CustomEvent('view:change',{detail:{route}}));
}

function initRouter(){
  const defaultRoute = window.location.hash.replace('#','') || 'home';
  render(defaultRoute);
  document.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=> render(btn.dataset.route));
  });
}

window.addEventListener('DOMContentLoaded', initRouter);
