importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAUSZuDcpz9q7nBhWgM6r8MlNsZquz7DYE",
  authDomain: "sajsvaranasi-96d45.firebaseapp.com",
  projectId: "sajsvaranasi-96d45",
  storageBucket: "sajsvaranasi-96d45.appspot.com",
  messagingSenderId: "47085187951",
  appId: "1:47085187951:web:55fe7b500f14ddaab86e9a",
  measurementId: "G-0RNJF8MW3B",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
