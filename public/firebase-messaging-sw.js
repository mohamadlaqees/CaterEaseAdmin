// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker
// with the same config from your app
const firebaseConfig = {
  apiKey: "AIzaSyAJ5h3U6geJ_sab2sPT013xzDx_h4An-iI",
  authDomain: "cater-5d36c.firebaseapp.com",
  projectId: "cater-5d36c",
  storageBucket: "cater-5d36c.firebasestorage.app",
  messagingSenderId: "1315919509",
  appId: "1:1315919509:web:e369c4b5d0c0710f68ad9c",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
