// footer.js — injecte le pied de page dans toutes les pages
(function() {
  const footerHTML = `
    <footer>
      <div class="footer-brand">
        <a href="index.html" class="logo-text">
          <img src="25357-Photoroom.png" alt="Meylan Handball TV" class="footer-logo-img">
        </a>
        <p>Association bénévole de retransmission sportive du handball isérois.<br>Saison 2026-2027.</p>
      </div>
      <div>
        <h4>Navigation</h4>
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="equipe.html">L'équipe MHBTV</a></li>
        </ul>
      </div>
      <div>
        <h4>Ressources</h4>
        <ul>
          <li><a href="statuts.html">Statuts et Règlements</a></li>
          <li><a href="documentation.html">Documentation</a></li>
          <li><a href="audiences.html">Audiences</a></li>
        </ul>
      </div>
    </footer>
    <div class="footer-bottom">
      <p>© 2026-2027 Meylan Handball TV · Tous droits réservés</p>
      <p>Site interne — Usage réservé aux membres</p>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
