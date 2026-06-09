import { sevgiliStore, json, withTimeout } from './_store.mjs';

const fallback = {
  title: 'Bizim Hikayemiz',
  subtitle: 'Birlikte yazdığımız en güzel sayfa',
  mainImage: '',
  gallery: ['', '', '', ''],
  letter: 'Buraya admin panelden kendi yazını ekleyebilirsin.',
  theme: 'green',
  musicEnabled: true
};

export default async () => {
  try {
    const store = sevgiliStore();
    const data = await withTimeout(store.get('site-data', { type: 'json' }), 8000, 'Netlify Blobs okuma zaman aşımı.');
    return json(data || fallback);
  } catch (error) {
    return json({ ...fallback, _warning: String(error?.message || error) });
  }
};
