self.addEventListener('fetch', function(event) {
  // Service Worker activo para Inverbot PWA
});

// Manejar el clic en la notificación para abrir directo el panel de administración
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          client.focus();
          client.postMessage({ action: 'abrirAdmin' });
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/?openAdmin=type');
      }
    })
  );
});
