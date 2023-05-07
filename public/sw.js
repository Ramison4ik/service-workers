const CACHE = 'service-worker-cache';
const timeout = 400;

self.addEventListener('install', (event) => {
  console.log('Установлен');
});

self.addEventListener('activate', (event) => {
  console.log('Активирован');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fromNetwork(event.request, timeout)
      .catch((err) => {
        console.log(`Error: ${err.message()}`);
        return fromCache(event.request);
      }));
});

// Запрос ограничееный по времени
const fromNetwork = (request, timeout) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      resolve(response);
    }, reject);
  });
};

const fromCache = (request) => {
  return caches.open(CACHE).then((cache) =>
      cache.match(request).then((matching) =>
          matching || Promise.reject('no-match')
      ));
};
