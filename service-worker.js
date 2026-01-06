const CACHE_NAME = 'my-cache-v2';
const ASSETS_TO_CACHE = [
  "/offline.html",
  "/logical calculation.html",
  "/logical calculater.html",
  "/snake game.html",
  "/geometrical calculator.html",
  "/ox.html",
  "/second dama.html",
  "/index.html",
  "/mind game.html",
  "/water body.html",
  "/quadratic draw.html",
  "/fd.html",
  "/style.css",
  "/fc.html",
  "/menu.html",
  "/online second dama.html",
  "/online dama.html",
  "/Physics.html",
  "/Guess.html",
  "/Lodo king.html",
  "/name relation.html",
  "/analog clock.html",
  "/Ecalendar.html",
  "/about.html",
  "/qf.html",
  "/checker.html",
  "/dama.html",
  "/calendar.html",
  "/factorization-in.html",
  "/click game.html",
  "/checkerl.html",
  "/calculate.html",
  "/date.html",
  "/com.html",
  "/Cssc/css of chess.css",
  "/css/style.css",
  "/css/dama.css",
  "/img/backgrounddiv.jpg",
  "/img/sitting.jpg",
  "/img/audiooff.jpg",
  "/img/audioon.jpg",
  "/JavaScript/dama.js",
  "/JavaScript/chess.js",
  "/JavaScript/chessdouble.js",
  "/JavaScript/chessLong.js",
  "/JavaScript/checker.js",
  "/JavaScript/decoration.js",
  "/JavaScript/turn to back.js",
  "/Online Ludo/Manage Players.html",
  "/Online Ludo/index.html",
  "/Online Ludo/online ludo.html",
  "/Online Ludo/ludo.jpg",
  "/Online Ludo/ludo roll.mp3",
  "/Online Ludo/ludo game move.mp3",
  "/audio/happy.mp3",
  "/audio/enjoy.mp3",
  "/audio/volume_.mp3",
  "/audio/mathematics classical .mp3",
  "/audio/ashenf.mp3",
  "/Image/finger print.jpg",
  "/Image/about.jpg",
  "/Image/cal.jpg",
  "/Image/lodoking.jpg",
  "/Image/Snake game.jpg",
  "/Image/lo.cl.jpg",
  "/Image/checker.jpg",
  "/Image/dama.jpg",
  "/Image/chess.jpg",
  "/Image/clup.jpg",
  "/Image/off.jpg",
  "/Image/on.jpg",
  "/Image/mind game image.jpg",
  "/Image/que.jpg",
  "/Image/qr.png",
  "/Image/Name relation.jpg",
  "/Image/Setting.jpg",
  "/Image/Game.jpg",
  "/Image/Physics.jpg",
  "/Image/Enjoy.jpg",
  "/Image/calendar.jpg",
  "/Image/ox.jpeg"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Helper: return cached response, falling back to network, then offline page
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass non-HTTP(s) requests (like chrome-extension://) and analytics endpoints if desired
  if (!url.protocol.startsWith('http')) return;

  // For navigation requests, try network first (to get updates), then cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          // Put a copy in the cache for future offline use
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return resp;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // For other requests, try cache first, then network, then fallback to cache
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // Optionally cache fetched asset for future
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => {
        // If request expects an image, return a placeholder from cache if present
        if (event.request.destination === 'image') {
          return caches.match('/icon.png') || caches.match('/favicon.ico');
        }
      });
    })
  );
});
