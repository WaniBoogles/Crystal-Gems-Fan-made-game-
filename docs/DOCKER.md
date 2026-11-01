# 🐳 Running Crystal Gems! in Docker

## What Docker does (and does not) do here

Crystal Gems! is a **browser game** — one HTML file with JavaScript and CSS inlined.
Docker packages *the web server that hands that file to your browser*. It does not run the
game itself, and it will not make the game run faster. What it does give you:

* the **same command on Windows, macOS and Linux** (Docker Desktop on Windows/macOS,
  the `docker` package on Linux);
* no Python/Node/nginx installed on the host, no version drift;
* a clean way to share the build with someone else — `docker compose up` and they play.

## Run it

```bash
docker compose up --build
```

Then open **http://localhost:8080**.

Or without compose:

```bash
docker build -t crystal-gems .
docker run --rm -p 8080:80 crystal-gems
```

Stop it with `Ctrl+C` (compose) or `docker stop crystal-gems`.

## Why it works the same everywhere

The image is `nginx:alpine` plus the built `Crystal-Gems.html`, so the container is ~50 MB and
has no system dependencies. The game itself is already cross-platform: it is plain HTML5 Canvas
and Web Audio, which every modern browser implements. The container just serves it.

## Notes

* Audio needs a user gesture in most browsers — click once in the window, exactly as when
  opening the file locally.
* The container is read-only content; nothing is saved server-side. Progress lives in your
  browser's `localStorage`.
* To serve a newer build, re-run `python3 tools/build.py` and then `docker compose up --build`.
