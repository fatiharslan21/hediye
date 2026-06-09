import { sevgiliStore, json, withTimeout } from './_store.mjs';

const MAX_BODY_SIZE = 4.2 * 1024 * 1024;

export default async (request) => {
  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method Not Allowed' }, 405);
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || 'emre';
  const incomingPassword = request.headers.get('x-admin-password') || '';

  if (incomingPassword !== expectedPassword) {
    return json({ ok: false, message: 'Şifre yanlış.' }, 401);
  }

  const bodyText = await request.text();
  const bodyBytes = new TextEncoder().encode(bodyText).length;

  if (!bodyText || bodyBytes > MAX_BODY_SIZE) {
    return json({
      ok: false,
      message: 'Dosya çok büyük. İlk denemede fotoğrafsız kaydet, sonra fotoğrafları tek tek ekle.',
      bodyBytes
    }, 413);
  }

  try {
    const data = JSON.parse(bodyText);
    const clean = {
      title: String(data.title || '').slice(0, 80),
      subtitle: String(data.subtitle || '').slice(0, 160),
      mainImage: String(data.mainImage || ''),
      gallery: Array.isArray(data.gallery) ? data.gallery.slice(0, 4).map(x => String(x || '')) : ['', '', '', ''],
      letter: String(data.letter || '').slice(0, 8000),
      theme: ['green', 'pink', 'night', 'cream'].includes(data.theme) ? data.theme : 'green',
      musicEnabled: Boolean(data.musicEnabled),
      updatedAt: new Date().toISOString()
    };

    const store = sevgiliStore();
    await withTimeout(store.setJSON('site-data', clean), 10000, 'Netlify Blobs 10 saniyede cevap vermedi. Deploy ayarını ve Functions logunu kontrol et.');

    return json({ ok: true, message: 'Kaydedildi.', updatedAt: clean.updatedAt, bodyBytes });
  } catch (error) {
    return json({
      ok: false,
      message: 'Kaydedilemedi.',
      detail: String(error?.message || error),
      hint: 'V4 pakette token şart değil. Repo köküne yükleyip Clear cache and deploy site yaptıktan sonra tekrar dene.'
    }, 500);
  }
};
