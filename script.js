
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const dropZone = document.getElementById('dropZone');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisPlaceholder = document.getElementById('analysisPlaceholder');
const analysisResult = document.getElementById('analysisResult');
const emotionBar = document.getElementById('emotionBar');

let currentFile = null;

imageInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  currentFile = file;
  previewImage.src = URL.createObjectURL(file);
  dropZone.classList.add('has-image');
  analyzeBtn.disabled = false;
});

['dragenter','dragover'].forEach(evt => dropZone?.addEventListener(evt, e => {
  e.preventDefault(); dropZone.style.borderColor = '#a51f2b';
}));
['dragleave','drop'].forEach(evt => dropZone?.addEventListener(evt, e => {
  e.preventDefault(); dropZone.style.borderColor = '';
}));
dropZone?.addEventListener('drop', e => {
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  currentFile = file;
  previewImage.src = URL.createObjectURL(file);
  dropZone.classList.add('has-image');
  analyzeBtn.disabled = false;
});

const analyses = [
  {title:'Lecture poétique : lumière & mouvement', text:"Cette image peut évoquer un passage vers l'avenir. L'IA repère une ambiance visuelle forte et propose une interprétation centrée sur l'espoir, la continuité et la capacité de transformer le réel.", emotion:88, theme:'Espoir', mood:'Lumineuse', keys:['espoir','avenir','mouvement','renaissance']},
  {title:'Lecture poétique : mémoire & identité', text:"L'image semble porter des éléments liés à la mémoire et au patrimoine. L'interprétation proposée met en avant le lien entre lieu, identité et transmission entre générations.", emotion:81, theme:'Mémoire', mood:'Contemplative', keys:['mémoire','identité','patrimoine','transmission']},
  {title:'Lecture poétique : liberté & horizon', text:"Les lignes, l'espace et la composition de l'image peuvent être lus comme des symboles d'ouverture. L'IA propose une lecture autour de la liberté, du choix et de l'horizon.", emotion:85, theme:'Liberté', mood:'Inspirante', keys:['liberté','horizon','choix','création']}
];

analyzeBtn?.addEventListener('click', () => {
  if (!currentFile) return;
  dropZone.classList.add('scanning');
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyse en cours…';
  setTimeout(() => {
    dropZone.classList.remove('scanning');
    analysisPlaceholder.style.display = 'none';
    analysisResult.style.display = 'block';
    const a = analyses[Math.floor(Math.random()*analyses.length)];
    document.getElementById('resultTitle').textContent = a.title;
    document.getElementById('resultText').textContent = a.text;
    document.getElementById('emotionValue').textContent = a.emotion + '%';
    document.getElementById('themeValue').textContent = a.theme;
    document.getElementById('moodValue').textContent = a.mood;
    const kw = document.getElementById('keywords');
    kw.innerHTML = a.keys.map(k => `<span>${k}</span>`).join('');
    emotionBar.style.width = '0';
    requestAnimationFrame(() => setTimeout(() => emotionBar.style.width = a.emotion + '%', 80));
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyser à nouveau";
  }, 2200);
});

const moodData = {
  espoir: {
    title:'Tozeur : mémoire & horizon',
    text:"Choisis une ambiance pour voir comment un même paysage peut transmettre plusieurs lectures poétiques.",
    generated:"Un paysage lumineux devient un symbole de continuité : le passé nourrit la création du futur."
  },
  memoire: {
    title:'Tozeur : traces & mémoire',
    text:"Le lieu devient une archive vivante. Les textures, les rues et l'architecture racontent ce que les générations transmettent.",
    generated:"La mémoire n'est pas immobile : elle voyage d'une génération à l'autre et donne du sens au présent."
  },
  liberte: {
    title:'Tozeur : espace & liberté',
    text:"L'horizon et l'ouverture du paysage servent ici de métaphore visuelle pour la liberté et la capacité de choisir son chemin.",
    generated:"L'espace ouvert suggère la liberté : avancer, imaginer et construire sans oublier ses racines."
  }
};
document.querySelectorAll('.mood').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.mood').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = moodData[btn.dataset.mood];
  document.getElementById('experienceTitle').textContent = d.title;
  document.getElementById('experienceText').textContent = d.text;
  document.getElementById('generatedText').textContent = d.generated;
}));

document.querySelectorAll('.analyze-poet').forEach(btn => btn.addEventListener('click', () => {
  document.querySelector('#experience').scrollIntoView({behavior:'smooth'});
  const key = btn.dataset.poet;
  if (key === 'chebbi') document.querySelector('[data-mood="espoir"]').click();
  if (key === 'tozeur') document.querySelector('[data-mood="memoire"]').click();
  if (key === 'medina') document.querySelector('[data-mood="liberte"]').click();
}));

const chatBody = document.getElementById('chatBody');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function answerQuestion(q){
  const ql = q.toLowerCase();
  if (ql.includes('patrimoine') || ql.includes('importante')) return "La poésie conserve des idées, des émotions et des façons de voir le monde. Dans ce projet, elle devient un moyen de relier patrimoine tunisien, jeunesse et création numérique.";
  if (ql.includes('thème') || ql.includes('themes')) return "On peut rencontrer des thèmes comme l'espoir, la liberté, l'identité, la mémoire, l'amour du pays, la nature et la condition humaine.";
  if (ql.includes('ia') || ql.includes('jeunes')) return "L'IA peut simplifier l'explication, proposer des mots-clés, créer des visualisations et rendre l'exploration plus interactive. Ici, ces fonctions sont présentées sous forme de prototype pédagogique.";
  return "Je peux t'aider à analyser un thème, expliquer un symbole ou montrer comment l'IA peut rendre la poésie plus accessible. Essaie une question sur l'espoir, la liberté, la mémoire ou le patrimoine.";
}
function sendMessage(q){
  if(!q.trim()) return;
  chatBody.insertAdjacentHTML('beforeend', `<div class="message user">${q.replace(/[<>]/g,'')}</div>`);
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(()=>{
    chatBody.insertAdjacentHTML('beforeend', `<div class="message bot">${answerQuestion(q)}</div>`);
    chatBody.scrollTop = chatBody.scrollHeight;
  },450);
}
chatForm?.addEventListener('submit', e => {
  e.preventDefault(); const q = chatInput.value; chatInput.value=''; sendMessage(q);
});
document.querySelectorAll('.quick-questions button').forEach(b => b.addEventListener('click',()=>sendMessage(b.dataset.question)));


// Ya Tounes El Khadhra — interactive poem reveal
const poemRevealBtn = document.getElementById("poemRevealBtn");
const poemText = document.getElementById("poemText");
if (poemRevealBtn && poemText) {
  poemRevealBtn.addEventListener("click", () => {
    const revealed = poemText.classList.toggle("revealed");
    poemRevealBtn.textContent = revealed ? "↺ Masquer le poème" : "✦ Révéler le poème";
  });
}
