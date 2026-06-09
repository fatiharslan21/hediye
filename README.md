# Sevgili Site - Şifreli Admin V3

Admin panel: `/admin.html`
Şifre: `emre`

## En önemli kurulum

ZIP'in içindeki dosyalar GitHub reposunun KÖK dizininde olmalı. Yani repo içinde direkt şunlar görünmeli:

- index.html
- admin.html
- package.json
- netlify.toml
- netlify/functions/

Eğer repo içinde ayrıca `sevgili-site-sifreli-netlify-v3/` klasörü açıp dosyaları onun içine koyarsan Netlify Functions düzgün çalışmayabilir.

## Netlify ayarı

Netlify > Site settings > Build & deploy:

- Build command: boş bırak veya `npm install`
- Publish directory: `.`
- Functions directory: `netlify/functions`

## Test

Deploy sonrası bunu aç:

`https://SITE-ADIN.netlify.app/api/health`

Şunu görmelisin:

```json
{"ok":true,"message":"Netlify Function çalışıyor."}
```

Sonra admin panelden hiçbir foto seçmeden sadece başlığı değiştirip Save de.

## Hâlâ Kaydedilemedi hatası olursa

Bu durumda Function çalışıyor ama Netlify Blobs otomatik context alamıyor demektir. Şunu yap:

1. Netlify > User settings > Applications > Personal access tokens bölümünden token oluştur.
2. Netlify > Site settings > General > Project information kısmından Project ID değerini kopyala.
3. Netlify > Site settings > Environment variables içine ekle:
   - `NETLIFY_AUTH_TOKEN` = oluşturduğun token
   - `NETLIFY_SITE_ID` = Project ID
   - İstersen `ADMIN_PASSWORD` = admin şifren
4. Redeploy yap.

