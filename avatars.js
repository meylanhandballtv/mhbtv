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
    'xavier':   'https://static.wixstatic.com/media/08ddad_3791d14047924cf5b0b0568bdc959c29~mv2.jpg/v1/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/_MG_2232%20(2).jpg',
    'marie':    'photos-equipe/IMG-20260812-WA0001.jpg',
    'emmanuel': '23123.jpg',
    'manu':     '23123.jpg',   // alias utilisé dans le classement
    'nicolas':  'https://static.wixstatic.com/media/08ddad_1258452952b64fb999b4694245f88ed1~mv2.jpg/v1/crop/x_0,y_216,w_1200,h_1167/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_20250622_173607.jpg',
    'yoan':     'https://static.wixstatic.com/media/08ddad_3fbbe61c2c324a32a0575778c22ff675~mv2.jpg/v1/crop/x_0,y_277,w_1536,h_1494/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_37_52_38f7c792.jpg',
    'enzo':     'photos-equipe/WhatsApp Image 2026-08-14 at 12.38.04.jpeg',
    'nabil':    'nabil.jpg',
    'tim':      'https://static.wixstatic.com/media/08ddad_5b566ba5c4bc4938afd9b8cab0429bc3~mv2.jpg/v1/crop/x_0,y_4,w_300,h_292/fill/w_420,h_409,al_c,lg_1,q_80,enc_avif,quality_auto/1000084110.jpg',
    'younes':   'https://static.wixstatic.com/media/08ddad_7864b88d3369490b808289deb37af449~mv2.jpg/v1/crop/x_0,y_277,w_1536,h_1494/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_52_03_1c873682.jpg',
    'ennio':    'https://static.wixstatic.com/media/08ddad_6cdf5e59a9fd4b3592ee4b0e2b54ee71~mv2.jpg/v1/crop/x_308,y_504,w_617,h_600/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ennio.jpg',
    'kylian':   'photos-equipe/WhatsApp Image 2026-11-15 at 16.18.42.jpeg',
    'elisa':    'photos-equipe/WhatsApp Image 2026-11-07 at 17.43.59.jpeg',
    'gaetan':   'https://static.wixstatic.com/media/08ddad_0fc5d5943ab0449cbdfc332c045f44d8~mv2.jpg/v1/crop/x_0,y_15,w_1080,h_1051/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_58_17_85fb79ef.jpg',
    'dorina':   'https://static.wixstatic.com/media/08ddad_28f414e3864e4a9eb4f05d693ee61713~mv2.jpg/v1/crop/x_0,y_216,w_1200,h_1167/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_43_29_fb21d50b.jpg',
    'kyliann':  'https://static.wixstatic.com/media/08ddad_eef6bd79c3504cfc9f5ee8f73e1fc0b2~mv2.jpg/v1/crop/x_0,y_3,w_198,h_193/fill/w_277,h_270,al_c,lg_1,q_80,enc_avif,quality_auto/photo%20kyliann.jpg',
    'tanguy':   'photos-equipe/WhatsApp Image 2026-11-15 at 13.22.24.jpeg"
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
