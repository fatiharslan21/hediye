import { getStore } from '@netlify/blobs';

export function sevgiliStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || '';

  if (siteID && token) {
    return getStore({ name: 'sevgili-site', siteID, token });
  }

  return getStore('sevgili-site');
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
