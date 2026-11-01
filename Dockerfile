# Crystal Gems! — static container image
# The game is a browser app, so the container only has to serve files; that is
# what makes it run identically on Windows, macOS and Linux (Docker Desktop on
# the first two, native Docker on Linux).
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Crystal Gems!" \
      org.opencontainers.image.description="Fan-made Steven Universe action battler — single-file build" \
      org.opencontainers.image.licenses="Fan project, non-commercial"

# Smaller, cached nginx config: gzip the big single-file build.
RUN printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  gzip on;' \
  '  gzip_types text/html text/css application/javascript;' \
  '  gzip_min_length 1024;' \
  '  location / { try_files $uri $uri/ =404; }' \
  '}' > /etc/nginx/conf.d/default.conf

COPY Crystal-Gems.html /usr/share/nginx/html/index.html
COPY src /usr/share/nginx/html/src
COPY assets /usr/share/nginx/html/assets
COPY docs /usr/share/nginx/html/docs

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

EXPOSE 80
