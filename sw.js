/* DayQuest Service Worker - Offline-first caching for PWA */

var CACHE_NAME = "dayquest-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./design/design-tokens.css",
  "./src/app.js"
];

/* Install: cache all app assets */
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

/* Activate: clear old caches */
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      var toDelete = [];
      for (var i = 0; i < names.length; i++) {
        if (names[i] !== CACHE_NAME) toDelete.push(names[i]);
      }
      return caches.delete(toDelete);
    })
  );
  self.clients.claim();
});

/* Fetch: cache-first strategy, fallback to network */
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      }).catch(function() {
        /* Offline: return cached index.html for navigation requests */
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return null;
      });
    })
  );
});
