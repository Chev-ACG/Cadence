# Deploying Cadence

Cadence is a static site (HTML/CSS/JS, ~164KB). It runs on any web server.

## Build

```sh
npm install
node build.mjs
```

Output goes to `dist/`. That's everything you need to serve.

## Option 1 — Docker (recommended)

```sh
docker build -t cadence .
docker run -d -p 80:80 --name cadence cadence
```

The image runs nginx with gzip and SPA-style fallback already configured.

## Option 2 — Upload to an existing nginx/Apache server

```sh
# on your machine
node build.mjs

# upload to the server
rsync -avz --delete dist/ user@your-server:/var/www/cadence/
```

Minimal nginx server block (see `nginx.conf` for the full version):

```nginx
server {
  listen 80;
  server_name cadence.example.com;
  root /var/www/cadence;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
}
```

Reload: `sudo nginx -t && sudo systemctl reload nginx`.

## Option 3 — Any object store with static hosting

The `dist/` folder also drops cleanly into S3 + CloudFront, GCS, R2, Azure Blob,
or any CDN that serves static files. Set `index.html` as the index document.

## TLS

Use Caddy, Traefik, or `certbot --nginx` for Let's Encrypt certificates. The
app makes no assumptions about origin.
