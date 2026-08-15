// nav.js — injecte la navigation dans toutes les pages
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navHTML = `
    <nav class="topbar">
      <a href="index.html" class="topbar-logo">
        <img src="25357-Photoroom.png" alt="Meylan Handball TV" class="topbar-logo-img">
      </a>
      <ul class="topbar-nav" id="mainNav">
        <li><a href="index.html" ${currentPage==='index.html'?'class="active"':''}>Accueil</a></li>
        <li><a href="accreditations.html" ${currentPage==='accreditations.html'?'class="active"':''}>Accréditations</a></li>
        <li><a href="composition.html" ${currentPage==='composition.html'?'class="active"':''}>Diffusions</a></li>
        <li><a href="equipe.html" ${currentPage==='equipe.html'?'class="active"':''}>L'Équipe</a></li>
        <li><a href="gratification.html" ${currentPage==='gratification.html'?'class="active"':''}>Gratification</a></li>
        <li><a href="documentation.html" ${currentPage==='documentation.html'?'class="active"':''}>Documentation</a></li>
        <li><a href="connexion.html">Se connecter</a></li>
      </ul>
      <div class="hamburger" id="hamburger" onclick="document.getElementById('mainNav').classList.toggle('open')">
        <span></span><span></span><span></span>
      </div>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
})();
