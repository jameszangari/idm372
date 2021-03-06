var CACHE_NAME = 'version-1'; // bump this version when you make changes.
// Put all your urls that you want to cache in this array
var urlsToCache = [
    '/login',
    '/tos',
    '/privacy',
    '/register/profile',
    '/register/anthem',
    '/register/playlist',
    '/register/genres',
    '/register/connected',
    '/register/looking-for',
    '/register/bio',
    '/register/images',
    '/browse',
    '/chat/browse',
    '/chat/view',
    '/favicons/apple-icon.png'
];

// Install the service worker and open the cache and add files mentioned in array to cache
self.addEventListener('install', function (event) {
    console.log('Service Worker: Installing....');

    event.waitUntil(

        // Open the cache
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');

                // Add files to the cache
                return cache.addAll(urlsToCache);
            })
    );
});


// keep fetching the requests from the user
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) return response;
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('Service Worker: Activating....');
    var cacheWhitelist = []; // add cache names which you do not want to delete
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});