importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBtgCtppNvC4FnyO8AluG1Xwzdt-AbVyqk",
  authDomain: "inverbot-40dd9.firebaseapp.com",
  projectId: "inverbot-40dd9",
  storageBucket: "inverbot-40dd9.firebasestorage.app",
  messagingSenderId: "364372333431",
  appId: "1:364372333431:web:3ceda14c06f0ca93418772"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'images/IMG-20261023-WA0039.jpg',
    badge: 'images/IMG-20261023-WA0039.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
