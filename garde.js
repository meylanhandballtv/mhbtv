/* ═══════════════════════════════════════════════════════
   garde.js — protège une page confidentielle MHBTV
   et ajoute une barre pour passer d'une page autorisée à l'autre.

   À placer tout en haut du <head> de CHAQUE page protégée :
       <script src="garde.js"></script>

   • Compte non connecté ou page non autorisée → retour à connexion.html
   • Compte avec 2+ pages → barre de navigation fixe en bas de l'écran
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

  /* ── Barre de navigation ── */
  var css = document.createElement('style');
  css.textContent =
    '#mhbtv-switch{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;align-items:center;gap:.4rem;' +
    'padding:.5rem .75rem;background:rgba(10,10,12,.96);border-top:1px solid #2a2a2e;backdrop-filter:blur(6px);' +
    'font-family:"Barlow Condensed",sans-serif;overflow-x:auto}' +
    '#mhbtv-switch .lab{font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:#888;margin-right:.4rem;white-space:nowrap}' +
    '#mhbtv-switch a,#mhbtv-switch button{display:inline-flex;align-items:center;gap:.4rem;white-space:nowrap;' +
    'padding:.45rem .9rem;border-radius:6px;border:1px solid #2a2a2e;background:#16161a;color:#ddd;' +
    'font:700 .85rem "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:border-color .2s,color .2s}' +
    '#mhbtv-switch a:hover,#mhbtv-switch button:hover{border-color:#E8001D;color:#fff}' +
    '#mhbtv-switch a.actif{background:#E8001D;border-color:#E8001D;color:#fff;pointer-events:none}' +
    '#mhbtv-switch .sp{flex:1}' +
    '@media print{#mhbtv-switch{display:none!important}}';
  document.head.appendChild(css);

  function monter() {
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

    document.body.appendChild(bar);
    document.body.style.paddingBottom = '64px'; // évite que la barre masque le bas de la page
  }

  if (document.body) monter();
  else document.addEventListener('DOMContentLoaded', monter);
})();
