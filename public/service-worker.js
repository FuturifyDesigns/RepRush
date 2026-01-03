const CACHE_NAME = 'reprush-v15'
const urlsToCache = [
  '/RepRush/',
  '/RepRush/index.html',
  '/RepRush/reprush-logo.png',
  '/RepRush/reprush-favicon.png',
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('RepRush: Cache opened')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('RepRush: Cache install failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('RepRush: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip Supabase API calls - always use network
  if (event.request.url.includes('supabase.co')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache the fetched response
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
      .catch(() => {
        // Network failed, return offline page if available
        return caches.match('/RepRush/index.html')
      })
  )
})

// Background sync for offline workout logging (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workouts') {
    event.waitUntil(syncWorkouts())
  }
})

async function syncWorkouts() {
  // This will be implemented when we add offline workout logging
  console.log('RepRush: Syncing offline workouts...')
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New achievement unlocked!',
    icon: '/RepRush/reprush-favicon.png',
    badge: '/RepRush/reprush-favicon.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ]
  }

  event.waitUntil(
    self.registration.showNotification('RepRush', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/RepRush/profile')
    )
  }
})
