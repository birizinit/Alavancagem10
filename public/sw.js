const CACHE_NAME = "wall-street-trade-pro-v2"
const urlsToCache = ["/manifest.json", "/icon-192.jpg", "/icon-512.jpg"]

self.addEventListener("install", (event) => {
  // Força a atualização imediata do Service Worker
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("activate", (event) => {
  // Limpa caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Toma controle imediato de todas as páginas
  return self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // NÃO fazer cache de páginas HTML - sempre buscar da rede
  if (
    url.pathname === "/" ||
    url.pathname.endsWith(".html") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_webpack/") ||
    url.pathname.includes("hot-update") ||
    url.pathname.includes("webpack") ||
    url.pathname.includes(".well-known")
  ) {
    // Sempre buscar da rede para conteúdo dinâmico
    return
  }

  // Apenas cachear arquivos estáticos (imagens, manifest)
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return
  }

  // Cache apenas para arquivos estáticos específicos
  if (url.pathname.endsWith(".jpg") || url.pathname.endsWith(".png") || url.pathname.endsWith(".json")) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then((response) => {
          // Cachear a resposta para uso futuro
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
      })
    )
  }
})
