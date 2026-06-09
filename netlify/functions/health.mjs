import { json } from './_store.mjs';

export default async () => {
  return json({
    ok: true,
    message: 'Netlify Function çalışıyor.',
    hasSiteId: Boolean(process.env.NETLIFY_SITE_ID || process.env.SITE_ID),
    hasToken: Boolean(process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN),
    time: new Date().toISOString()
  });
};
