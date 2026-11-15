/* ════════════════════════════════════════════════════════
   avatars.js — remplace les initiales par les photos des membres
   Pour accreditations.html ET gratification.html

   • Chaque membre peut avoir :
       - un nom de fichier dans le dossier photos/  (ex. 'xavier')
         → extensions testées automatiquement
       - OU un lien web complet  (ex. 'https://site.com/photo.jpg')
   • Nom du fichier = prénom (xavier, marie, emmanuel…), sans accent.
     Extensions testées automatiquement : jpg, jpeg, png, webp
     (majuscules ou minuscules, prénom en minuscules ou avec Majuscule).
   • Si aucune photo n'est trouvée, les initiales restent affichées
     et un message apparaît dans la console (F12) pour t'aider.
════════════════════════════════════════════════════════ */
(function () {
  const DOSSIER = 'photos-equipe/';
  const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];

  /* Nom affiché (minuscules, sans accent)  →  nom de fichier sans extension
     (dossier photos/)  OU  lien web commençant par http.
     Deux membres de même prénom : utiliser "prenom nom".
     Exemple lien web :  'marie': 'https://exemple.com/images/marie.jpg'   */
  const PHOTOS = {
    'xavier':    'https://static.wixstatic.com/media/08ddad_3791d14047924cf5b0b0568bdc959c29~mv2.jpg/v1/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/_MG_2232%20(2).jpg',
    'marie':     'https://meylanhandballtv.github.io/mhbtv/photos-equipe/IMG-20260812-WA0001.jpg',
    'emmanuel':  'https://meylanhandballtv.github.io/mhbtv/23123.jpg',
    'manu':      'https://meylanhandballtv.github.io/mhbtv/23123.jpg',
    'nicolas':   'https://static.wixstatic.com/media/08ddad_1258452952b64fb999b4694245f88ed1~mv2.jpg/v1/crop/x_0,y_216,w_1200,h_1167/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_20250622_173607.jpg',
    'yoan':      'https://static.wixstatic.com/media/08ddad_3fbbe61c2c324a32a0575778c22ff675~mv2.jpg/v1/crop/x_0,y_277,w_1536,h_1494/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_37_52_38f7c792.jpg',
    'enzo':      'https://meylanhandballtv.github.io/mhbtv/photos-equipe/WhatsApp%20Image%202026-08-14%20at%2012.38.04.jpeg',
    'nabil':     '',
    'tim':       'https://static.wixstatic.com/media/08ddad_5b566ba5c4bc4938afd9b8cab0429bc3~mv2.jpg/v1/crop/x_0,y_4,w_300,h_292/fill/w_420,h_409,al_c,lg_1,q_80,enc_avif,quality_auto/1000084110.jpg',
    'younes':    'https://static.wixstatic.com/media/08ddad_7864b88d3369490b808289deb37af449~mv2.jpg/v1/crop/x_0,y_277,w_1536,h_1494/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_52_03_1c873682.jpg',
    'ennio':     'https://static.wixstatic.com/media/08ddad_6cdf5e59a9fd4b3592ee4b0e2b54ee71~mv2.jpg/v1/crop/x_308,y_504,w_617,h_600/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ennio.jpg',
    'kylian tour':    'https://meylanhandballtv.github.io/mhbtv/photos-equipe/WhatsApp%20Image%202026-11-15%20at%2016.18.42.jpeg',
    'kyliann hequette': 'https://static.wixstatic.com/media/08ddad_eef6bd79c3504cfc9f5ee8f73e1fc0b2~mv2.jpg/v1/crop/x_0,y_3,w_198,h_193/fill/w_277,h_270,al_c,lg_1,q_80,enc_avif,quality_auto/photo%20kyliann.jpg',
    'elisa':     'https://meylanhandballtv.github.io/mhbtv/photos-equipe/WhatsApp%20Image%202026-11-07%20at%2017.43.59.jpeg',
    'tanguy':    'https://meylanhandballtv.github.io/mhbtv/photos-equipe/WhatsApp%20Image%202026-11-15%20at%2013.22.24.jpeg',
    'gaetan':    'https://static.wixstatic.com/media/08ddad_0fc5d5943ab0449cbdfc332c045f44d8~mv2.jpg/v1/crop/x_0,y_15,w_1080,h_1051/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_58_17_85fb79ef.jpg',
    'dorina':    'https://static.wixstatic.com/media/08ddad_28f414e3864e4a9eb4f05d693ee61713~mv2.jpg/v1/crop/x_0,y_216,w_1200,h_1167/fill/w_443,h_431,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-08-22%20%C3%A0%2018_43_29_fb21d50b.jpg'
  };

  const norm = s => s.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();

  function baseFichier(nom) {
    const n = norm(nom);
    return PHOTOS[n] || PHOTOS[n.split(' ')[0]] || null;
  }

  /* Styles injectés */
  const style = document.createElement('style');
  style.textContent = `
    .m-avatar, .lb-avatar { position: relative; overflow: hidden; }
    .m-avatar img, .lb-avatar img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; border-radius: 50%; display: block;
    }`;
  document.head.appendChild(style);

  function appliquer(avatar, nom) {
    if (!nom || avatar.dataset.photoDone) return;
    avatar.dataset.photoDone = '1';

    /* Retire toute image déjà présente (ex. d'une version précédente de la page) */
    avatar.querySelectorAll('img').forEach(i => i.remove());

    const base = baseFichier(nom);
    if (!base) { console.warn('[avatars] Aucune entrée PHOTOS pour :', nom); return; }

    /* Lien web → utilisé tel quel. Sinon → dossier photos/ avec toutes les extensions */
    const essais = [];
    if (/^(https?:)?\/\//i.test(base)) {
      essais.push(base);
    } else {
      const noms = [base, base.charAt(0).toUpperCase() + base.slice(1)];
      noms.forEach(n => EXTS.forEach(e => essais.push(DOSSIER + n + '.' + e)));
    }

    let i = 0;
    const img = document.createElement('img');
    img.alt = nom;
    img.referrerPolicy = 'no-referrer';
    img.onerror = () => {
      i++;
      if (i < essais.length) {
        img.src = essais[i];
      } else {
        img.remove();
        console.warn('[avatars] Photo introuvable pour', nom, '— dernier essai :', essais[essais.length - 1]);
      }
    };
    img.src = essais[0];
    avatar.appendChild(img);
  }

  function init() {
    /* accreditations.html : nom dans .m-fullname, à côté de l'avatar */
    document.querySelectorAll('.m-avatar').forEach(av => {
      const nom = av.parentElement.querySelector('.m-fullname');
      if (nom) appliquer(av, nom.textContent);
    });

    /* gratification.html : nom = texte qui suit l'avatar dans .lb-name */
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
