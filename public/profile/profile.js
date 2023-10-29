const namee = document.querySelector(".name");
const classs = document.querySelector(".cl");
const email = document.querySelector(".em");
const phone = document.querySelector(".phonee");
const section = document.querySelector(".sec");
const sector = document.querySelector(".set");
const statuss = document.querySelector(".sp");
const message = document.querySelector(".message");
const assets = document.querySelector(".assets");

const vapidKey =
  "BA-IbSiApcxBZJ5Ht0EB3EnaJGb0f_YSzMhM06jFVegBB8Evq-pcTuI1OYiqP7_sC-DWRJhja-gJTbni6_8s54g";

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
const db = firebase.firestore();

function checkUser() {
  if (!localStorage.getItem("hasCheckedUser")) {
    if (localStorage.getItem("email") && localStorage.getItem("password")) {
      window.location.replace("http://127.0.0.1:5500/profile/index.html");
    } else {
      window.location.replace("http://127.0.0.1:5500/index.html");
    }

    // Set the flag to indicate that the function has been executed
    localStorage.setItem("hasCheckedUser", true);
  }
}

checkUser();

// initializing messaging

const messaging = firebase.messaging();

messaging.getToken({
  vapidKey: vapidKey,
});

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission == "granted") {
      console.log("Notification permission granted.");
    } else {
      console.log("Notification permission denied.");
    }
  });
}

requestPermission();

function getTokenn() {
  messaging
    .getToken({ vapidKey: vapidKey })
    .then((currentToken) => {
      if (currentToken) {
        console.log(currentToken);
        localStorage.setItem("fcm_token", currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });

  messaging.onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // ...
  });
}

getTokenn();

// updates fcm token

async function updateFCMtoken() {
  if (!localStorage.getItem("updatedFCMTokenn")) {
    const colRef = localStorage.getItem("collection_reference");
    const docRef = localStorage.getItem("document_id");
    const updatedToken = localStorage.getItem("fcm_token");
    const userRef = db.collection(colRef).doc(docRef);

    userRef.updateDoc({
      fcm_token: updatedToken,
    });

    localStorage.setItem("updatedFCMTokenn", true);
  }
}

updateFCMtoken();

async function getDataFromFirestore() {
  let collectionReference = localStorage.getItem("collection_reference");
  let documentID = localStorage.getItem("document_id");

  const docRef = db.collection(collectionReference).doc(documentID);
  docRef.get().then((doc) => {
    if (doc.exists) {
      const nm = doc.data().name;
      const st = doc.data().selection_status;

      namee.innerHTML = nm.split(" ")[0];
      classs.innerHTML = `
      <i class="fa-solid fa-circle-check "></i> ${doc.data().class}
      `;
      email.innerHTML = `<i class="fa-solid fa-circle-check "></i> ${
        doc.data().email
      }`;
      phone.innerHTML = `
      <i class="fa-solid fa-circle-check "></i> ${doc.data().phone}
      `;
      section.innerHTML = `
      <i class="fa-solid fa-circle-check "></i> ${doc.data().section}
      `;
      sector.innerHTML = `
      <i class="fa-solid fa-circle-check "></i> ${doc.data().sector}
      `;
      statuss.innerHTML = `<i class="fa-solid fa-circle fa-beat-fade sta"></i> <span class="txt">${st.toUpperCase()}</span> 
      `;
      assets.innerHTML = `
      <h3>Assets</h4>
      <a href="${doc.data().asset}" target="_blank">Asset Link</a>
      `;

      const tx = document.querySelector(".txt");
      let sta = document.querySelector(".sta");
      console.log(tx.innerHTML);
      if (tx.innerHTML == "SELECTED") {
        sta.style.color = "white";
        sta.setAttribute("class", "fa-solid fa-champagne-glasses fa-bounce");
        statuss.style.color = "green";
        console.log(tx, statuss);
      }
    } else {
      console.log("No such document!");
    }
  });
}

getDataFromFirestore();