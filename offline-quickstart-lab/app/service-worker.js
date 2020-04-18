const cacheName = 'cache-v1'
const preCacheResources = [
    '/',
    'index.html',
    'styles/main.css',
    'images/space1.jpg',
    'images/space2.jpg',
    'images/space3.jpg'
]


self.addEventListener('install',  event =>{
    console.log('Installation')
    event.defaultPrevented
    self.skipWaiting()
  console.log('Service worker install event')
  event.waitUntil(
      caches.open(cacheName)
      .then(cache => {return cache.addAll(preCacheResources)})
  )
})

self.addEventListener('activate', event=>{
    console.log(' Service worker Activate event')
})

self.addEventListener('fetch', event =>{
    console.log('Fetch event request: ', event.request.url)
    event.respondWith( caches.match(event.request)
    .then(cachedResponse => {
        if(cachedResponse){ return cachedResponse}
        else { return fetch(event.request)}
    }))
})