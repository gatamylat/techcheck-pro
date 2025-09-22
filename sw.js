/**
 * Service Worker для TechCheck Pro
 * Обеспечивает работу офлайн и кэширование
 */

const CACHE_NAME = 'techcheck-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/base.css',
    '/desktop.css',
    '/mobile.css',
    '/_app.js',
    '/_config.js',
    '/_router.js',
    '/_state.js',
    '/BaseModule.js',
    '/knowledge-base.js',
    '/checklist.js',
    '/wiki.js',
    '/stories.js',
    '/statistics.js',
    '/llm-check.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});