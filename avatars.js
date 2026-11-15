/* ════════════════════════════════════════════════════════
   avatars.js — remplace les initiales par les photos des membres
   Utilisé par accreditations.html et gratification.html
   → Déposer les photos dans le dossier  photos/  (ex. photos/xavier.jpg)
   → Si une photo manque ou ne charge pas, les initiales restent affichées
════════════════════════════════════════════════════════ */
(function () {
  const DOSSIER = 'photos/';

  /* Clé = prénom en minuscules, sans accent  →  fichier photo.
     Pour ajouter un membre : une ligne. Pour deux membres de même prénom,
     utiliser "prenom nom" (ex. 'tim tour', 'kylian tour'). */
  const PHOTOS = {
    'xavier':   'xavier.jpg',
    'marie':    'marie.jpg',
    'emmanuel': 'emmanuel.jpg',
    'manu':     'emmanuel.jpg',   // alias utilisé dans le classement
    'nicolas':  'nicolas.jpg',
    'yoan':     'yoan.jpg',
    'enzo':     'enzo.jpg',
    'nabil':    'nabil.jpg',
    'tim':      'tim.jpg',
    'younes':   'younes.jpg',
    'ennio':    'ennio.jpg',
    'kylian':   'kylian.jpg',
    'elisa':    'elisa.jpg',
    'gaetan':   'gaetan.jpg',
    'dorina':   'dorina.jpg',
    'kyliann':  'kyliann.jpg'
  };

  const norm = s => s.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

  function trouverPhoto(nom) {
    const n = norm(nom);
    if (PHOTOS[n]) return PHOTOS[n];              // nom complet
    const prenom = n.split(' ')[0];
    return PHOTOS[prenom] || null;                // prénom seul
  }

  /* Styles injectés : le cercle existant sert de cadre */
  const style = document.createElement('style');
  style.textContent = `
    .m-avatar.has-photo, .lb-avatar.has-photo {
      padding: 0; overflow: hidden; background: none !important;
    }
    .m-avatar.has-photo img, .lb-avatar.has-photo img {
      width: 100%; height: 100%; object-fit: cover;
      border-radius: 50%; display: block;
    }`;
  document.head.appendChild(style);

  function appliquer(avatar, nom) {
    if (!nom || avatar.classList.contains('has-photo')) return;
    const fichier = trouverPhoto(nom);
    if (!fichier) return;
    const initiales = avatar.textContent;
    const img = new Image();
    img.alt = nom;
    img.loading = 'lazy';
    img.onload = () => {
      avatar.textContent = '';
      avatar.classList.add('has-photo');
      avatar.appendChild(img);
    };
    img.onerror = () => { avatar.textContent = initiales; };
    img.src = DOSSIER + fichier;
  }

  function init() {
    /* accreditations.html : l'avatar est suivi du nom dans .m-fullname */
    document.querySelectorAll('.m-avatar').forEach(av => {
      const nom = av.parentElement.querySelector('.m-fullname');
      if (nom) appliquer(av, nom.textContent);
    });

    /* gratification.html : le nom est le texte qui suit l'avatar dans .lb-name */
    document.querySelectorAll('.lb-avatar').forEach(av => {
      const nom = Array.from(av.parentElement.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent).join('');
      appliquer(av, nom);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
