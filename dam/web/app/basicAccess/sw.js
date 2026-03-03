// Nombre del caché (puedes cambiarlo cuando actualices tu app)
const CACHE_NAME = 'utility-v1';

// Evento de instalación: útil para precachear recursos básicos si quisieras
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
});

// Evento de activación: limpia cachés antiguos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
});

// ESTE ES EL PASO CLAVE: El manejador de peticiones.
// Aunque no cachees nada complejo, este evento DEBE existir.
self.addEventListener('fetch', (event) => {
  // Aquí podrías implementar estrategias de caché, 
  // por ahora solo deja que la petición pase normal.
  event.respondWith(fetch(event.request));
});