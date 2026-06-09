let adminPassword = '';
let state = {
  title: '', subtitle: '', mainImage: '', gallery: ['', '', '', ''], letter: '', theme: 'green', musicEnabled: true
};

const $ = id => document.getElementById(id);

async function loadCurrent() {
  try {
    const res = await fetch('/api/get-site', { cache: 'no-store' });
    state = await res.json();
  } catch (_) {
    const local = localStorage.getItem('site-preview-data');
    if (local) state = JSON.parse(local);
  }
  fillForm();
}

function fillForm() {
  $('titleInput').value = state.title || '';
  $('subtitleInput').value = state.subtitle || '';
  $('letterInput').value = state.letter || '';
  $('themeInput').value = state.theme || 'green';
  $('musicInput').checked = state.musicEnabled !== false;
  setPreview('mainPreview', state.mainImage);
  (state.gallery || []).slice(0, 4).forEach((src, i) => setPreview(`preview${i}`, src));
}

function setPreview(id, src) {
  const img = $(id);
  if (src) { img.src = src; img.style.display = 'block'; }
  else { img.removeAttribute('src'); img.style.display = 'none'; }
}

function readFileAsDataUrl(file, maxSide = 850, quality = .68) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

$('loginButton').addEventListener('click', async () => {
  const pass = $('passwordInput').value.trim();
  if (!pass) return;
  adminPassword = pass;
  $('loginBox').classList.add('hidden');
  $('editorBox').classList.remove('hidden');
  await loadCurrent();
});

$('passwordInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') $('loginButton').click();
});

$('mainImageInput').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  state.mainImage = await readFileAsDataUrl(file);
  setPreview('mainPreview', state.mainImage);
});

document.querySelectorAll('.galleryInput').forEach(input => {
  input.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    const index = Number(e.target.dataset.index);
    state.gallery[index] = await readFileAsDataUrl(file);
    setPreview(`preview${index}`, state.gallery[index]);
  });
});

$('saveButton').addEventListener('click', async () => {
  const message = $('saveMessage');
  message.textContent = 'Kaydediliyor...';
  const payload = {
    title: $('titleInput').value.trim(),
    subtitle: $('subtitleInput').value.trim(),
    mainImage: state.mainImage || '',
    gallery: state.gallery || ['', '', '', ''],
    letter: $('letterInput').value.trim(),
    theme: $('themeInput').value,
    musicEnabled: $('musicInput').checked
  };

  localStorage.setItem('site-preview-data', JSON.stringify(payload));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('/api/save-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const result = await res.json();
    if (!res.ok || !result.ok) throw new Error((result.message || 'Kaydedilemedi') + (result.detail ? ' | Detay: ' + result.detail : '') + (result.hint ? ' | İpucu: ' + result.hint : ''));
    state = payload;
    message.textContent = 'Kaydedildi ✅ Siteyi açınca güncel halini göreceksin.';
  } catch (error) {
    message.textContent = 'Kaydetme sunucuya gitmedi. Bu tarayıcıda önizleme kaydedildi. Hata: ' + (error.name === 'AbortError' ? 'İstek 15 saniye bekledi ve zaman aşımına düştü.' : error.message) + ' | Netlify > Functions > saveSite logunu kontrol et.';
  }
});
