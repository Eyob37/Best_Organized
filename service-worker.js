const CACHE_NAME = 'my-cache-v3';
const OFFLINE_PAGE = '/offline.html';
const INDEX_PAGE = '/index.html';

// Static assets to cache on install
const STATIC_ASSETS = [
  INDEX_PAGE,
  OFFLINE_PAGE,
  "/style.css",
  "/css/style.css",
  "/css/dama.css",
  "/Cssc/css of chess.css",
  // Add other critical assets here
];

// Dynamic assets to cache (all HTML pages mentioned)
const DYNAMIC_ASSETS = [
  "/logical calculation.html",
  "/logical calculater.html",
  "/snake game.html",
  "/geometrical calculator.html",
  "/ox.html",
  "/second dama.html",
  "/mind game.html",
  "/water body.html",
  "/quadratic draw.html",
  "/fd.html",
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
  "/about.html"
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS.concat(DYNAMIC_ASSETS));
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle all requests
self.addEventListener('fetch', event => {
  // Skip non-GET requests and non-http(s) requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      // Try network first for fresh content
      fetch(event.request)
        .then(response => {
          // Clone the response to cache it
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone))
            .catch(error => {
              console.error('Failed to cache response:', error);
            });
          return response;
        })
        .catch(error => {
          // Network failed, try cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If specific page not in cache, try index.html
              return caches.match(INDEX_PAGE);
            });
        })
    );
    return;
  }

  // Handle other requests (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache if not a successful response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone and cache the response
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache))
              .catch(error => {
                console.error('Failed to cache asset:', error);
              });

            return networkResponse;
          })
          .catch(error => {
            // If it's an image, you could return a placeholder
            if (event.request.destination === 'image') {
              // Try to return cached placeholder images
              return caches.match('/Image/off.jpg') || 
                     caches.match('/Image/on.jpg');
            }
            
            // For other failed requests, return appropriate fallback
            if (event.request.destination === 'style') {
              return caches.match('/style.css');
            }
            
            // Return nothing for other failed requests
            return new Response('', {
              status: 408,
              statusText: 'Network request failed'
            });
          });
      })
  );
});

// Background sync for offline data (optional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Periodic sync for updating content (optional)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/index.html')
  );
});

self.registration.showNotification('Hello Eyob 👋', {
  body: 'Your app is working offline!',
  icon: '/icons/icon-192.png',
  badge: '/icons/icon-72.png',
  vibrate: [100, 50, 100],
  tag: 'offline-notification'
});