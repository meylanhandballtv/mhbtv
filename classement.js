/* ═══════════════════════════════════════════════
   CLASSEMENT MHBTV
   Il suffit de modifier les listes ci-dessous.
   - Ordre libre : le tri est automatique
   - nom peut rester vide : ""
   - horsClassement: true → affiché avec « * », sans rang
   ═══════════════════════════════════════════════ */
const PERIODES = {
  // 2026-2027 (en cours)
  jan: {
    maj: "22 novembre 2026",
    membres: [
      { prenom: "Manu",    nom: "", score: 665 },
      { prenom: "Marie",   nom: "", score: 615 },
      { prenom: "Xavier",  nom: "", score: 480 },
      { prenom: "Nicolas", nom: "", score: 405 },
      { prenom: "Enzo",    nom: "", score: 275 },
      { prenom: "Tanguy",  nom: "", score: 180 },
      { prenom: "Tim",     nom: "", score: 165 },
      { prenom: "Ennio",   nom: "", score: 115 },
      { prenom: "Elisa",   nom: "", score: 50 },
      { prenom: "Yoan",    nom: "", score: 45 },
      { prenom: "Younes",  nom: "", score: 40 },
      { prenom: "Kylian",  nom: "", score: 35 },
      { prenom: "Nabil",   nom: "", score: 30 },
    ],
  },

  // 2025-2026
  avr: {
    note: "Les points seront mis à jour après chaque événement.",
    membres: [
      { prenom: "Nicolas", nom: "",  score: 3430 },
      { prenom: "Marie",   nom: "",  score: 3345 },
      { prenom: "Ennio",   nom: "",  score: 3340 },
      { prenom: "Enzo",    nom: "",  score: 3120 },
      { prenom: "Xavier",  nom: "",  score: 2530, horsClassement: true },
      { prenom: "Manu",    nom: "",  score: 2040 },
      { prenom: "Tim",     nom: "",  score: 1225 },
      { prenom: "Nabil",   nom: "",  score: 1200 },
      { prenom: "Yoan",    nom: "",  score: 1015 },
      { prenom: "Gaetan",  nom: "",  score: 800 },
      { prenom: "Dorina",  nom: "",  score: 470 },
      { prenom: "Younes",  nom: "",  score: 415 },
      { prenom: "Kylian",  nom: "T", score: 100 },
      { prenom: "Kyliann", nom: "H", score: 0 },
    ],
  },
};

/* ═══════════ Moteur (pas besoin d'y toucher) ═══════════ */

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function grade(score) {
  if (score > 450)  return { nom: "Or",     couleur: "var(--gold)" };
  if (score >= 200) return { nom: "Argent", couleur: "var(--silver)" };
  if (score >= 50)  return { nom: "Bronze", couleur: "var(--bronze)" };
  return { nom: "", couleur: "var(--muted)" };
}

const RANG_STYLE = {
  1: { bg: "rgba(240,180,41,0.2)",   col: "var(--gold)" },
  2: { bg: "rgba(176,190,197,0.18)", col: "var(--silver)" },
  3: { bg: "rgba(205,127,50,0.18)",  col: "var(--bronze)" },
};

function initiales(m) {
  const p = (m.prenom || "").trim(), n = (m.nom || "").trim();
  return esc((p.slice(0, 1) + n.slice(0, 1)).toUpperCase());
}

function nomComplet(m) {
  return esc(m.prenom + (m.nom ? " " + m.nom : ""));
}

function rendrePeriode(id) {
  const p = PERIODES[id];
  const el = document.getElementById("period-" + id);
  if (!p || !el) return;

  const tries = [...p.membres].sort((a, b) => b.score - a.score);

  // Rangs avec ex æquo (hors classement et scores à 0 exclus)
  let dernierScore = null, dernierRang = 0, compteur = 0;
  tries.forEach(m => {
    if (m.horsClassement || m.score <= 0) { m._rang = null; return; }
    compteur++;
    if (m.score !== dernierScore) { dernierRang = compteur; dernierScore = m.score; }
    m._rang = dernierRang;
  });

  const lignes = tries.map(m => {
    const g = grade(m.score);
    const r = m._rang;
    const st = RANG_STYLE[r] || { bg: "rgba(255,255,255,0.06)", col: "var(--white)" };
    const cls = r && r <= 3 ? `rank-${r}` : (m.score <= 0 && !m.horsClassement ? "no-data" : "");
    const rangTxt = r ? r : (m.horsClassement ? "*" : "—");
    const opacite = m.horsClassement ? ' style="opacity:0.6;"' : "";
    const couleurPts = r && r <= 3 ? `color:${st.col};` : (m.score <= 0 ? "color:var(--muted);" : "");
    return `
      <div class="lb-row ${cls}">
        <span class="lb-rank"${r && r <= 3 ? "" : ' style="color:var(--muted);"'}>${rangTxt}</span>
        <div class="lb-name"${opacite}><div class="lb-avatar" style="background:${st.bg};color:${st.col};">${initiales(m)}</div>${nomComplet(m)}</div>
        <span class="lb-grade" style="color:${g.couleur};text-align:center;">${g.nom}</span>
        <div class="lb-pts" style="${couleurPts}">${m.score.toLocaleString("fr-FR")} <span class="pts-label">pts</span></div>
      </div>`;
  }).join("");

  const bandeau = p.maj ? `
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;padding:0.8rem 1.25rem;background:rgba(240,180,41,0.06);border:1px solid rgba(240,180,41,0.2);border-radius:6px;">
      <span>📅</span>
      <span style="font-size:0.85rem;color:var(--muted);">Mis à jour le <strong style="color:var(--white);">${esc(p.maj)}</strong> · Saison en cours</span>
    </div>` : "";

  const note = p.note ? `<p style="font-size:0.8rem;color:var(--muted);margin-top:1rem;text-align:center;">${esc(p.note)}</p>` : "";

  el.innerHTML = `${bandeau}
    <div class="leaderboard">
      <div class="lb-header">
        <span>#</span><span>Membre</span><span style="text-align:center;">Grade</span><span style="text-align:right;">Points</span>
      </div>${lignes}
    </div>${note}`;
}

// Meilleurs scores cumulés (somme de toutes les périodes)
function rendreCumul() {
  const el = document.getElementById("topCumul");
  if (!el) return;
  const total = {};
  Object.values(PERIODES).forEach(p => p.membres.forEach(m => {
    const k = (m.prenom + " " + (m.nom || "")).trim().toLowerCase();
    total[k] = total[k] || { m, score: 0 };
    total[k].score += m.score;
  }));
  const top = Object.values(total).sort((a, b) => b.score - a.score).slice(0, 3);
  const medailles = ["🥇", "🥈", "🥉"], couleurs = ["var(--gold)", "var(--silver)", "var(--bronze)"];
  el.innerHTML = top.map((t, i) => `
    <div class="side-row"><span class="label">${medailles[i]} ${nomComplet(t.m)}</span>
    <span class="val" style="color:${couleurs[i]};">${t.score.toLocaleString("fr-FR")} pts</span></div>`).join("");
}

Object.keys(PERIODES).forEach(rendrePeriode);
rendreCumul();
