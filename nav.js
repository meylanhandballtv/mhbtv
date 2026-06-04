// nav.js — injecte la navigation dans toutes les pages
(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  const navHTML = `
    <nav class="topbar">
      <a href="index.html" class="topbar-logo">MEYLAN <span>HANDBALL</span> TV</a>
      <ul class="topbar-nav" id="mainNav">
        <li><a href="index.html" ${currentPage==='index.html'?'class="active"':''}>Accueil</a></li>
        <li><a href="diffusions.html" ${currentPage==='diffusions.html'?'class="active"':''}>Diffusions</a></li>
        <li><a href="equipe.html" ${currentPage==='equipe.html'?'class="active"':''}>L'Équipe</a></li>
        <li class="nav-dropdown">
          <a href="statuts.html" ${currentPage.startsWith('statut')||currentPage.startsWith('reglement')?'class="active"':''}>Statuts & Règlements</a>
          <div class="dropdown-menu">
            <a href="statuts.html">Statuts</a>
            <a href="reglement-general.html">Règlement général</a>
            <a href="reglement-retransmissions.html">Règlement retransmissions</a>
          </div>
        </li>
        <li class="nav-dropdown">
          <a href="documentation.html" ${currentPage==='documentation.html'||currentPage==='audiences.html'||currentPage==='charte.html'?'class="active"':''}>Documentation</a>
          <div class="dropdown-menu">
            <a href="audiences.html">Audiences</a>
            <a href="charte.html">Charte graphique</a>
            <a href="documentation.html">Compte-rendus AG</a>
          </div>
        </li>
        <li><a href="gratification.html" ${currentPage==='gratification.html'?'class="active"':''}>Gratification</a></li>
      </ul>
      <div class="hamburger" id="hamburger" onclick="document.getElementById('mainNav').classList.toggle('open')">
        <span></span><span></span><span></span>
      </div>
    </nav>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', navHTML);
})();
