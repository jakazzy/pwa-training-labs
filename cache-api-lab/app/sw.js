const staticCacheName = 'pages-cache-v3'
const filesToCache = [
    '/',
    'images/still_life_medium.jpg',
    'pages/offline.html',
    'pages/404.html',
    'index.html',
    'style/main.css'
]

self.addEventListener('install', event=>{
    console.log('Service worker installed')
    event.waitUntil(
        caches.open(staticCacheName).then(cache => cache.addAll(filesToCache))
    )
})

self.addEventListener('activate', event =>{
    console.log('activating new service worker...')
    const cacheWhiteList = [staticCacheName]

    event.waitUntil(
        caches.keys().then(cachesNames =>{
            return Promise.all(
                cachesNames.map( cacheName =>{
                    if( cacheWhiteList.indexOf(cacheName === -1)){
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', event=>{
    console.log('fetch event for: ',event.request.url)
    event.respondWith(
        caches.match(event.request)
        .then(response =>{
            if(response){
                console.log('Found ', event.request.url, ' in cache')
                return response
            }
            console.log('Network request for ', event.request.url)
            return fetch(event.request)
            .then(response => {
                // TODO 5 - Respond with custom 404 page
                if(response.status === 404){
                    return fetch('pages/404.html')
                }
                // -----------
                return caches.open(staticCacheName).then(cache => {
                  cache.put(event.request.url, response.clone());
                  return response;
                });
              });
        
        })
        .catch(err => {
            fetch('pages/offline.html')
            console.log('error: ', err)
        })
    )
})