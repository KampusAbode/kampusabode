'client side'

// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


// Initialize Firebase with config directly
firebase.initializeApp({
  apiKey: "AIzaSyDsz5edn22pVbHW-2kzt2dFG_MjKXplRnc",
  authDomain: "kampusabode-ee982.firebaseapp.com",
  projectId: "kampusabode-ee982",
  storageBucket: "kampusabode-ee982.appspot.com",
  messagingSenderId: "406379589668",
  appId: "1:406379589668:web:4a4da002716938b2baa8b1npm run dev",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
