import { getStore } from '@netlify/blobs';

export function sevgiliStore() {
  // Netlify üzerinde çalışan Function'larda Blobs bağlantısını otomatik context ile kurduruyoruz.
  // Token/SiteID elle vermek bazı hesaplarda POST isteğini beklemede bırakabiliyor.
  return getStore({ name: 'sevgili-site' });
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export function withTimeout(promise, ms = 10000, label = 'İşlem zaman aşımına uğradı') {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(label)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
