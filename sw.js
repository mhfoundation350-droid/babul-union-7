const CACHE = 'babul-app-v2'; // আপডেট দিলেই v3, v4 করে দিবেন
const FILES = [
  '/', 
  '/index.html', 
  '/manifest.json', 
  '/babul-logo.png', // আপনার লোগো
  '/icon-192.png', 
  '/icon-512.png'
];

// 1. Install - নতুন ফাইল Cache করে
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting(); // সাথে নতুন SW চালু করবে
});

// 2. Activate - পুরান Cache ডিলিট করে দিবে
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE) {
          return caches.delete(key); // পুরান v1 ডিলিট
        }
      }))
    )
  );
  self.clients.claim(); // সব পেজ কন্ট্রোল নিয়ে নিবে
});

// 3. Fetch - আগে নেট চেক করবে, না পেলে Cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});