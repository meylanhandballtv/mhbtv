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

  /* ── Texte de la bannière « Accès réservé » (modifiable, par page) ── */
  var TEXTE_DEFAUT = 'Page interne réservée aux membres autorisés. Toutes les données sont confidentielles et ne doivent pas être diffusées sous peine de sanctions.';
  var TEXTE_DCO    = 'Tableau de bord interne destiné aux membres de la Direction de la Coordination Opérationnelle (DCO). Toutes les données sont confidentielles et ne doivent pas être diffusées sous peine de sanctions.';
  var TEXTES = {
    'dco-inspectiongenerale.html': TEXTE_DCO,
    'tableau-bord-rr.html':        TEXTE_DCO
    'generateur-pv-ag.html':       TEXTE_DCO,
    'fiche_presence_rr.html':      TEXTE_DCO
  };
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
    '.restricted-banner{background:rgba(232,0,29,.07);border-bottom:1px solid rgba(232,0,29,.2);padding:.65rem 4rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;' +
    'font-family:"Barlow Condensed",sans-serif;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#777)}' +
    '.restricted-banner b{color:var(--red,#E8001D);letter-spacing:.18em}' +
    '@media(max-width:900px){.restricted-banner{padding:.65rem 1.5rem}}' +
    '@media print{#mhbtv-switch,#mhbtv-switch-spacer{display:none!important}.restricted-banner{position:static!important}}';
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

  /* ── Placement sous la nav du site (.topbar : fixe, 64 px, z-index 1000) ──
        Ordre de haut en bas : topbar → barre de navigation → bannière « Accès réservé » → contenu */
  var bar, spacer, basePad = null;
  function placer(nav) {
    var h = nav.getBoundingClientRect().height;
    var pos = getComputedStyle(nav).position;
    var banner = document.querySelector('.restricted-banner');
    var fond = 'linear-gradient(rgba(232,0,29,.07),rgba(232,0,29,.07)),#0a0a0a';

    if (pos === 'fixed') {
      bar.style.position = 'fixed';
      bar.style.top = h + 'px';
      bar.style.left = '0';
      bar.style.right = '0';
      var hb = bar.offsetHeight;

      var hbann = 0;
      if (banner) {
        banner.style.position = 'fixed';
        banner.style.top = (h + hb) + 'px';
        banner.style.left = '0';
        banner.style.right = '0';
        banner.style.zIndex = '98';
        banner.style.background = fond;
        banner.style.boxSizing = 'border-box';
        hbann = banner.offsetHeight;
      }

      // on décale le contenu de la hauteur de la barre + bannière pour ne rien masquer
      var extra = hb + hbann;
      var contenu = document.querySelector('.page');
      if (contenu) {
        if (basePad === null) basePad = parseFloat(getComputedStyle(contenu).paddingTop) || 0;
        contenu.style.paddingTop = (basePad + extra) + 'px';
      } else {
        if (!spacer) {
          spacer = document.createElement('div');
          spacer.id = 'mhbtv-switch-spacer';
          nav.insertAdjacentElement('afterend', spacer);
        }
        spacer.style.height = extra + 'px';
      }
    } else {
      var top = (pos === 'sticky' ? h : 0);
      bar.style.position = 'sticky';
      bar.style.top = top + 'px';
      if (banner) {
        banner.style.position = 'sticky';
        banner.style.top = (top + bar.offsetHeight) + 'px';
        banner.style.zIndex = '98';
        banner.style.background = fond;
      }
    }
  }

  function monter(essais) {
    var nav = document.querySelector('nav.topbar, .topbar, nav, header');
    if (!nav && essais < 20) { setTimeout(function () { monter(essais + 1); }, 50); return; }

    bar = construire();

    // Bannière injectée par le script (on supprime d'abord celle éventuellement écrite en dur dans la page)
    document.querySelectorAll('.restricted-banner').forEach(function (el) { el.remove(); });
    var banniere = document.createElement('div');
    banniere.className = 'restricted-banner';
    var titre = document.createElement('b');
    titre.textContent = '🔒 Accès réservé';
    banniere.appendChild(titre);
    banniere.appendChild(document.createTextNode(' ' + (TEXTES[page] || TEXTE_DEFAUT)));
    if (nav) {
      nav.insertAdjacentElement('afterend', bar);
      bar.insertAdjacentElement('afterend', banniere);
      placer(nav);
      window.addEventListener('resize', function () { placer(nav); });
      window.addEventListener('load', function () { placer(nav); });   // recalcul une fois polices/images chargées
    } else {
      // nav introuvable : repli en haut de page
      document.body.insertBefore(banniere, document.body.firstChild);
      document.body.insertBefore(bar, document.body.firstChild);
      bar.style.position = 'sticky';
      bar.style.top = '0';
    }
  }

  if (document.body) monter(0);
  else document.addEventListener('DOMContentLoaded', function () { monter(0); });
})();
