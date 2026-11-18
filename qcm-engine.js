/* ============================================================
   MOTEUR QCM MHBTV — commun aux 3 questionnaires d'accréditation
   Lit window.QCM_CONFIG (défini dans chaque page).
   ============================================================ */

/* ⚙️ ENVOI EMAILJS — UNIQUE POUR LES 3 QCM (à ne modifier qu'ici) */
const EMAILJS = {
  publicKey:  '2EYsWCwGZ3DzfdnAI',
  serviceId:  'service_uba7d6x',
  templateId: 'template_3kvaucq'
};

(function () {
  const C = window.QCM_CONFIG;
  const root = document.getElementById('qcm-root');
  const LET = 'ABCDEF';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  // Accepte les deux anciens formats : {question,options,answer,article} ou {q,opts,ans}
  const bank = (C.questions || []).map(x => ({
    q: x.question ?? x.q, opts: x.options ?? x.opts,
    ans: x.answer ?? x.ans, ref: x.article ?? x.ref ?? ''
  }));
  if (!bank.length) { root.textContent = 'Aucune question configurée.'; return; }
  const N = C.draw > 0 ? Math.min(C.draw, bank.length) : bank.length;

  root.innerHTML = `
  <div class="doc-meta">
    <span>Certificat <strong>${esc(C.level)}</strong></span>
    <span>${N} questions${N < bank.length ? ' tirées au hasard sur ' + bank.length : ''}</span>
    <span>Seuil de réussite : <strong>${C.passMark}/20</strong></span>
  </div>

  <div class="qcm-screen" id="s-intro">
    <div class="doc-preamble"><h4>À propos de ce certificat</h4>${(C.about || []).map(p => `<p>${p}</p>`).join('')}</div>
    <div class="honor-card"><h4>Engagement sur l'honneur</h4>
      <p>Ce questionnaire fonctionne en autonomie, sans surveillance directe. <strong>La Coordination générale fait confiance à ses membres.</strong></p>
      <p>À la fin du questionnaire, votre résultat est <strong>transmis automatiquement</strong> à l'Instance Compétente des Retransmissions (ICR).</p>
    </div>
    <div class="identity">
      <label>Prénom<input id="f-prenom" maxlength="40" autocomplete="given-name"></label>
      <label>Nom<input id="f-nom" maxlength="40" autocomplete="family-name"></label>
      <div class="form-error" id="f-err">Merci d'indiquer votre prénom et votre nom.</div>
    </div>
    <button class="btn btn-primary" id="b-start" style="padding:.6rem 1.5rem;font-size:.8rem">Commencer le QCM</button>
  </div>

  <div class="qcm-screen" id="s-quiz" hidden>
    <div class="quiz-progress-wrap"><span class="quiz-progress-label" id="q-label"></span>
      <div class="quiz-progress-track"><div class="quiz-progress-fill" id="q-fill"></div></div></div>
    <div class="question-card"><div class="question-eyebrow" id="q-ref"></div>
      <div class="question-text" id="q-text"></div><div class="option-list" id="q-opts"></div></div>
    <div class="quiz-nav">
      <button class="btn btn-outline" id="b-prev" style="padding:.6rem 1.5rem;font-size:.8rem">← Précédent</button>
      <button class="btn btn-primary" id="b-next" style="padding:.6rem 1.5rem;font-size:.8rem">Suivant →</button>
    </div>
  </div>

  <div class="qcm-screen qcm-center" id="s-send" hidden><div class="spinner"></div>
    <div class="qcm-title">Envoi en cours…</div><p class="qcm-msg">Transmission de votre résultat à l'ICR.</p></div>

  <div class="qcm-screen qcm-center" id="s-error" hidden>
    <div class="qcm-title" style="color:var(--red)">Échec de l'envoi</div>
    <p class="qcm-msg">Votre résultat n'a pas pu être transmis. Vérifiez votre connexion internet puis réessayez.</p>
    <button class="btn btn-primary" id="b-retry" style="padding:.6rem 1.5rem;font-size:.8rem">Réessayer l'envoi</button>
    <button class="btn btn-outline" id="b-skip" style="padding:.6rem 1.5rem;font-size:.8rem">Voir mon résultat sans envoi</button>
  </div>

  <div class="qcm-screen qcm-center" id="s-result" hidden></div>`;

  let quiz = [], cur = 0, ans = [], who = {}, payload = null, passed = false, correct = 0, note20 = 0;
  const SCREENS = ['intro', 'quiz', 'send', 'error', 'result'];
  const show = id => SCREENS.forEach(s => $('s-' + s).hidden = (s !== id));
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  $('b-start').onclick = () => {
    who = { prenom: $('f-prenom').value.trim(), nom: $('f-nom').value.trim() };
    if (!who.prenom || !who.nom) { $('f-err').style.display = 'block'; return; }
    quiz = C.draw > 0 ? shuffle(bank).slice(0, N) : bank;
    ans = new Array(N).fill(null); cur = 0;
    show('quiz'); render();
  };

  function render() {
    const q = quiz[cur];
    $('q-label').textContent = `Question ${cur + 1} / ${N}`;
    $('q-fill').style.width = ((cur + 1) / N * 100) + '%';
    $('q-ref').textContent = q.ref;
    $('q-text').textContent = q.q;
    const list = $('q-opts'); list.innerHTML = '';
    q.opts.forEach((t, i) => {
      const l = document.createElement('label');
      l.className = 'option-item' + (ans[cur] === i ? ' selected' : '');
      l.innerHTML = `<input type="radio" name="o" ${ans[cur] === i ? 'checked' : ''}><span></span>`;
      l.querySelector('span').textContent = t;
      l.onclick = () => { ans[cur] = i; render(); };
      list.appendChild(l);
    });
    $('b-prev').style.opacity = cur === 0 ? .4 : 1;
    $('b-next').textContent = cur === N - 1 ? 'Terminer le QCM' : 'Suivant →';
  }
  $('b-prev').onclick = () => { if (cur > 0) { cur--; render(); } };
  $('b-next').onclick = () => {
    if (ans[cur] === null) { alert('Merci de sélectionner une réponse avant de continuer.'); return; }
    if (cur < N - 1) { cur++; render(); } else finish();
  };

  function finish() {
    correct = quiz.filter((q, i) => ans[i] === q.ans).length;
    const raw = correct / N * 20;
    note20 = Math.round(raw * 10) / 10;
    passed = raw >= C.passMark;
    const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const reponses = quiz.map((q, i) => {
      const u = ans[i], ok = u === q.ans;
      return `Q${i + 1}. ${q.q}\n   Réponse : ${LET[u]}. ${q.opts[u]}\n   Correcte : ${LET[q.ans]}. ${q.opts[q.ans]}\n   ${ok ? '✅ Correcte' : '❌ Incorrecte'}`;
    }).join('\n\n');
    // Variables envoyées au modèle EmailJS (identiques pour les 3 QCM)
    payload = {
      qcm: C.id, certificat: C.certificat, poste: C.poste,
      prenom: who.prenom, nom: who.nom, date,
      score: `${correct}/${N}`, note20: `${note20}/20`, seuil: `${C.passMark}/20`,
      resultat: passed ? 'RÉUSSI' : 'ÉCHEC', reponses
    };
    if (C.sendOnlyIfPassed && !passed) { renderResult(false); return; }
    send();
  }

  async function send() {
    show('send');
    try {
      emailjs.init(EMAILJS.publicKey);
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, payload);
      renderResult(true);
    } catch (e) { console.error('EmailJS :', e); show('error'); }
  }
  $('b-retry').onclick = send;
  $('b-skip').onclick = () => renderResult(false);

  function renderResult(sent) {
    const status = sent
      ? 'Votre résultat a bien été transmis à l\'ICR. Vous n\'avez rien d\'autre à envoyer.'
      : (C.sendOnlyIfPassed && !passed
          ? 'Seuil non atteint : rien n\'a été transmis. Vous pouvez recommencer.'
          : '⚠️ Votre résultat n\'a PAS été transmis. Notez-le et communiquez-le vous-même à l\'ICR.');
    let h = '';
    if (C.showScore) {
      h += `<div class="results-score-20">${note20}<span> / 20</span></div>
        <div class="results-score-raw">${correct} bonnes réponses sur ${N}</div>
        <div class="results-verdict ${passed ? 'pass' : 'fail'}">${passed ? 'Seuil de réussite atteint' : 'Seuil de réussite non atteint'} (${C.passMark}/20)</div>`;
    } else {
      h += `<div class="qcm-title">Merci, ${esc(who.prenom)} !</div>
        <p class="qcm-msg">Votre QCM a été enregistré. Aucun score n'est communiqué : l'évaluation est réalisée par l'ICR, qui reviendra vers vous.</p>`;
    }
    h += `<div class="results-honor"><p><strong>Transmission :</strong> ${status}</p></div>`;
    if (C.showScore && C.showCorrection) {
      h += '<div class="results-review">' + quiz.map((q, i) => {
        const ok = ans[i] === q.ans;
        return `<div class="review-item ${ok ? 'correct' : 'incorrect'}"><div class="review-q">${i + 1}. ${esc(q.q)}</div>
          <div class="review-your">Votre réponse : <span class="${ok ? 'tag-ok' : 'tag-ko'}">${esc(q.opts[ans[i]])}</span></div>
          ${ok ? '' : `<div class="review-correct-answer">Bonne réponse : <strong>${esc(q.opts[q.ans])}</strong></div>`}</div>`;
      }).join('') + '</div>';
    }
    h += '<button class="btn btn-outline" id="b-restart" style="padding:.6rem 1.5rem;font-size:.8rem;margin-top:1rem">Recommencer le questionnaire</button>';
    $('s-result').innerHTML = h;
    $('b-restart').onclick = () => location.reload();
    show('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  show('intro');
})();
