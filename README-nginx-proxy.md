# Nginx proxy and static server for Reddit r/data

This document explains the `nginx.conf` located at the repository root and how to run and test it.

Files
- `nginx.conf` — Nginx configuration. Listens on port 8080 and:
  - Serves static files from the project root.
  - Provides a health endpoint at `/healthz`.
  - Provides a reverse-proxy endpoint at `/reddit` which reads query parameters and forwards to Reddit's JSON API for the r/data subreddit.

How the `/reddit` endpoint works
- Request path: `/reddit`.
- Query parameters the endpoint reads:
  - `sub` - subreddit name, default is `data`.  
  - `type` — which post listing to request (e.g. `hot`, `new`, `top`). Default: `hot`.
  - `limit` — how many posts to request. Default: `36`.
- Upstream URL constructed by nginx:

  https://www.reddit.com/r/{sub}/{type}.json?limit={limit}

  Example: `/reddit?type=new&limit=10` -> `https://www.reddit.com/r/data/new.json?limit=10`

Implementation notes
- The config uses `map` to provide defaults when `sub`, `type` or `limit` are not provided.
- Nginx requires a DNS `resolver` when `proxy_pass` uses variables; the config provides public resolvers (Google and Cloudflare). You can change them to your internal resolvers if needed.
- The config sets `proxy_http_version 1.1` and enables `proxy_ssl_server_name` to ensure TLS SNI is sent for the upstream host.
- Redirects returned by Reddit are rewritten to keep the client under `/reddit`.

Run instructions (Docker Compose)

From the repository root run:

```bash
docker compose up -d
```

Then test:

```bash
# static index (if index.html exists)
curl -i http://localhost:8080/

# health check
curl -i http://localhost:8080/healthz

# Reddit JSON proxy (default params)
curl -i "http://localhost:8080/reddit"

# Reddit JSON proxy with params
curl -i "http://localhost:8080/reddit?sub=data&type=new&limit=5"
```


Notes, caveats and next steps
- Use `/reddit` (no trailing slash). If you want the endpoint to accept `/reddit/` as well I can change the location block to handle both.
- For production use add caching, rate-limiting, and proper logging. Reddit may enforce rate limits or block proxies doing heavy scraping.
- Consider adding CORS headers if you plan to call the endpoint from browser code.
- If you need to expose other subpaths under r/data (for example, comment pages), we can expand the proxy rules to forward path segments.

If you'd like, I can:
- Validate the config by running `nginx -t` inside a container and share the output.
- Add caching or a small `docker-compose.yml` to make local runs easier.
