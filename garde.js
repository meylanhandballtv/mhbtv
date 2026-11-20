/* ═══════════════════════════════════════════════════════
   garde.js — protège une page confidentielle MHBTV
   et ajoute, juste sous la barre de navigation du site,
   une barre pour passer d'une page autorisée à l'autre.

   À placer tout en haut du <head> de CHAQUE page protégée :
       <script src="garde.js"></script>

   • Compte non connecté ou page non autorisée → retour à connexion.html
   • Barre affichée sous la nav : boutons des pages du compte + Déconnexion
   ═══════════════════════════════════════════════════════ */
(function () {
  var page = location.pathname.split('/').pop() || 'index.html';
  var s = null;
  try { s = JSON.parse(sessionStorage.getItem('mhbtv_session')); } catch (e) {}

  var autorise = !!s && s.exp > Date.now() && Array.isArray(s.pages) &&
                 s.pages.some(function (p) { return p.fichier === page; });

  if (!autorise) {
    document.documentElement.style.display = 'none';
    location.replace('connexion.html');
    return;
  }

  /* ── Styles ── */
  var css = document.createElement('style');
  css.textContent =
    '#mhbtv-switch{z-index:99;display:flex;align-items:center;gap:.4rem;box-sizing:border-box;width:100%;' +
    'padding:.5rem .75rem;background:rgba(10,10,12,.97);border-bottom:1px solid #2a2a2e;' +
    'font-family:"Barlow Condensed",sans-serif;overflow-x:auto}' +
    '#mhbtv-switch .lab{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:#888;margin-right:.4rem;white-space:nowrap}' +
    '#mhbtv-switch a,#mhbtv-switch button{display:inline-flex;align-items:center;gap:.4rem;white-space:nowrap;' +
    'padding:.4rem .9rem;border-radius:6px;border:1px solid #2a2a2e;background:#16161a;color:#ddd;' +
    'font:700 .85rem "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:border-color .2s,color .2s}' +
    '#mhbtv-switch a:hover,#mhbtv-switch button:hover{border-color:#E8001D;color:#fff}' +
    '#mhbtv-switch a.actif{background:#E8001D;border-color:#E8001D;color:#fff;pointer-events:none}' +
    '#mhbtv-switch .sp{flex:1}' +
    '@media print{#mhbtv-switch,#mhbtv-switch-spacer{display:none!important}}';
  document.head.appendChild(css);

  /* ── Construction de la barre ── */
  function construire() {
    var bar = document.createElement('div');
    bar.id = 'mhbtv-switch';

    if (s.pages.length > 1) {
      var lab = document.createElement('span');
      lab.className = 'lab';
      lab.textContent = s.id;
      bar.appendChild(lab);
      s.pages.forEach(function (p) {
        var a = document.createElement('a');
        a.href = p.fichier;
        a.textContent = (p.icone ? p.icone + ' ' : '') + p.nom;
        if (p.fichier === page) a.className = 'actif';
        bar.appendChild(a);
      });
    }

    var sp = document.createElement('span');
    sp.className = 'sp';
    bar.appendChild(sp);

    var out = document.createElement('button');
    out.type = 'button';
    out.textContent = 'Déconnexion';
    out.onclick = function () {
      sessionStorage.removeItem('mhbtv_session');
      location.href = 'connexion.html';
    };
    bar.appendChild(out);
    return bar;
  }

  /* ── Placement sous la nav du site (fixe, sticky ou normale) ── */
  var bar, spacer;
  function placer(nav) {
    var h = nav.getBoundingClientRect().height;
    var pos = getComputedStyle(nav).position;

    if (pos === 'fixed') {
      // nav fixe : barre fixe juste dessous + espace réservé pour ne rien masquer
      bar.style.position = 'fixed';
      bar.style.top = h + 'px';
      bar.style.left = '0';
      bar.style.right = '0';
      if (!spacer) {
        spacer = document.createElement('div');
        spacer.id = 'mhbtv-switch-spacer';
        nav.insertAdjacentElement('afterend', spacer);
      }
      spacer.style.height = bar.offsetHeight + 'px';
    } else {
      // nav sticky ou dans le flux : barre collée juste dessous
      bar.style.position = 'sticky';
      bar.style.top = (pos === 'sticky' ? h : 0) + 'px';
      if (spacer) { spacer.remove(); spacer = null; }
    }
  }

  function monter(essais) {
    var nav = document.querySelector('nav, header, .navbar, #navbar, .nav');
    if (!nav && essais < 20) { setTimeout(function () { monter(essais + 1); }, 50); return; }

    bar = construire();
    if (nav) {
      nav.insertAdjacentElement('afterend', bar);
      placer(nav);
      window.addEventListener('resize', function () { placer(nav); });
    } else {
      // nav introuvable : repli en haut de page
      document.body.insertBefore(bar, document.body.firstChild);
      bar.style.position = 'sticky';
      bar.style.top = '0';
    }
  }

  if (document.body) monter(0);
  else document.addEventListener('DOMContentLoaded', function () { monter(0); });
})();
