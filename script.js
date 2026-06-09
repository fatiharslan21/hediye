const fallback = {
  title: 'Bizim Hikayemiz',
  subtitle: 'Seninle her an biraz daha güzel',
  mainImage: '',
  gallery: ['', '', '', ''],
  letter: 'Buraya ona yazmak istediğin uzun yazıyı admin panelinden girebilirsin.',
  theme: 'green',
  musicEnabled: true
};

async function loadSite() {
  try {
    const res = await fetch('/api/get-site', { cache: 'no-store' });
    if (!res.ok) throw new Error('API yok');
    return await res.json();
  } catch (_) {
    try {
      const local = localStorage.getItem('site-preview-data');
      return local ? JSON.parse(local) : fallback;
    } catch { return fallback; }
  }
}

function setImage(img, src, placeholder) {
  if (src) {
    img.src = src;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
  } else {
    img.removeAttribute('src');
    img.style.display = 'none';
    if (placeholder) placeholder.style.display = 'grid';
  }
}

function applyTheme(theme) {
  document.body.classList.remove('theme-pink', 'theme-night', 'theme-cream');
  if (theme && theme !== 'green') document.body.classList.add(`theme-${theme}`);
}

function softChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + i * .16);
    gain.gain.linearRampToValueAtTime(.16, ctx.currentTime + i * .16 + .03);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + i * .16 + .8);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * .16);
    osc.stop(ctx.currentTime + i * .16 + .85);
  });
}

loadSite().then(data => {
  document.title = data.title || fallback.title;
  document.getElementById('title').textContent = data.title || fallback.title;
  document.getElementById('subtitle').textContent = data.subtitle || fallback.subtitle;
  document.getElementById('letterText').textContent = data.letter || fallback.letter;
  applyTheme(data.theme || 'green');
  setImage(document.getElementById('mainImage'), data.mainImage, document.getElementById('mainPlaceholder'));
  (data.gallery || []).slice(0,4).forEach((src, i) => {
    const img = document.getElementById(`gallery${i}`);
    const label = img?.nextElementSibling;
    setImage(img, src, label);
  });
  const btn = document.getElementById('soundButton');
  btn.style.display = data.musicEnabled ? 'inline-flex' : 'none';
  btn.addEventListener('click', () => { softChime(); btn.textContent = 'ses çaldı 💚'; });
});
