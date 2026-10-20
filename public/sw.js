self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.matchAll({type:'window'}).then(async windows=>{for(const client of windows){if(client.url.startsWith(self.registration.scope))return client.focus();}return self.clients.openWindow(self.registration.scope);}));});
