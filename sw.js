/**
 * STEVEN UNIVERSE GAME — SERVICE WORKER
 * Caches all game assets for 100% offline play on Android & Xiaomi devices.
 */

const CACHE_NAME = 'su-game-v1';
const ASSETS_TO_CACHE = [
  './',
  './Steven%20Universe%20Game.html',
  './game.html',
  './Steven-Universe-Mobile.html',
  './game.css',
  './game.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache pre-fetch warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback to cached main HTML if offline
        return caches.match('./Steven%20Universe%20Game.html');
      });
    })
  );
});
