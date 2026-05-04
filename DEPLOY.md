# Deploying Cadence

Cadence builds to **a single self-contained `dist/index.html` file** (~122 KB).
HTML, CSS, React, and all app JS are inlined. No external assets except the
Geist webfont (loaded from Google Fonts at runtime).

## Build

```sh
npm install
npm run build
```

Output: `dist/index.html`. That one file is the entire app.

## Deploy

Pick whichever fits your server:

### Drop it onto any web server

```sh
scp dist/index.html user@your-server:/var/www/html/index.html
```

Works with nginx, Apache, Caddy, Lighttpd — anything that serves static files.
No config required beyond the default document root.

### Docker (nginx)

```sh
docker build -t cadence .
docker run -d -p 80:80 --restart unless-stopped --name cadence cadence
```

### Object storage / CDN

Upload `dist/index.html` to S3, GCS, R2, Azure Blob, or any static host. Set it
as the index document. Done.

### Local preview

```sh
npm run serve   # http://localhost:8080
```

Or just open `dist/index.html` directly in a browser — it works from `file://`
too (the only network requests are React UMD already inlined and the Google
Fonts stylesheet).

## TLS

Front it with Caddy, Traefik, Cloudflare, or `certbot --nginx` — no app-level
configuration.
