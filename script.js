window.onload = () => {
  setTimeout(() => {
    const loading_screen = document.querySelector(".loading_screen");

    loading_screen.style.display = "none";
  }, 4000);

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
  const auth = firebase.auth();
  const vapidKey =
    "BB2wOXEkSLSAzyQ-503SObS2eMXoZXk-f2S6NtNJm6XYs-cDqVEBk65GjJldZxdHJiiA5YIKmbvBbmqllXCFtdA";
  
  // coding started
  
  const help_button = document.querySelector(".help");
  const submit_button = document.querySelector(".submit");
  const namee = document.querySelector(".name");
  const classs = document.querySelector(".class");
  const section = document.querySelector(".section");
  const email = document.querySelector(".email");
  const statuss = document.querySelector(".progress");
  const file = document.querySelector(".masterpiece");
  const phone = document.querySelector(".phone");
  var fileName;
  var token;
  var progress;
  var uploadedFileName;
  var fileSize;
  var defaultPass = "student123";
  
  // checks if local storage has values
  
  function checkLocalStorage() {
    if (localStorage.getItem("email") && localStorage.getItem("password")) {
      swal({
        title: "Sign In Successful",
        text: "You have successfully signed in.",
        icon: "success",
      });
  
      window.location.replace("http://127.0.0.1:5500/profile/index.html");
    } else {
      console.log("NEW STUDENT");
    }
  }
  
  checkLocalStorage();
  
  // loads a help alert
  
  help_button.addEventListener("click", () => {
    swal(
      "Choose File Help",
      "Upload your masterpiece here.\nFor gaming, submit your best gameplay.\nFor programming, upload your top code in ZIP format.\nIf you opt for photo/video editing or Blender, upload your finest work. \nRemember, plagiarism results in immediate rejection. Files must be in ZIP format."
    );
  });
  
  // checks if value is null
  
  function valueCheck() {
    if (
      namee.value == "" ||
      classs.value == "" ||
      section.value == "" ||
      email.value == "" ||
      phone.value == "" ||
      !file.value
    ) {
     return swal("Please fill all the fields.");
    } else {
      console.log("Filled all fields");
    }
  }
  
  const messaging = firebase.messaging();
  messaging.getToken(messaging, {
    vapidKey: vapidKey,
  });
  
  function requestPermission() {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    });
  }
  
  requestPermission();
  
  function getTokenn() {
    messaging.getToken({ vapidKey: vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          token = currentToken;
          console.log(currentToken);
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
  
    messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      // ...
    });
  }
  
  getTokenn();
  
  // user sign in with email and password
  
  async function singInUsers() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, defaultPass)
      .then((userCredentials) => {
        localStorage.setItem("email", email.value);
        localStorage.setItem("password", defaultPass);
        console.log(userCredentials);
      })
      .catch((error) => {
        const errorCode = error.message;
        console.log(errorCode);
      });
  }
  
  // gets file and uploads it to the storage
  
  async function getFile() {
    const uploaded_file = file.files[0];
  
    fileName = uploaded_file.name;
    fileSize = uploaded_file.size / 1024 / 1024;
  
    const storageRef = firebase.storage().ref(
      `${document.querySelector(".sec_inp").value}/` +
        namee.value +
        classs.value +
        fileName
    );
    var sec_inp_value = document.querySelector(".sec_inp");
    localStorage.setItem("storage_ref", sec_inp_value.value+"/"+namee.value+classs.value+fileName);
    localStorage.setItem("file_name", fileName);
    const uploadTask = storageRef.child(`${namee.value +
      classs.value +
      fileName}`).put(uploaded_file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        statuss.innerHTML = "Uploading " + progress + "%";
        uploadedFileName = snapshot.ref.name;
      },
      (error) => {
        reject(error);
      },
      () => {
        statuss.innerHTML = "✅ Successfully uploaded";
  
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          // uploads all data to firestore
          messaging.getToken({ vapidKey: vapidKey })
            .then((currentToken) => {
              if (currentToken) {
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
          const db = firebase.firestore();
          const sector = document.querySelector(".sec_inp");
          console.log("Second Token: " + token);
          setTimeout(async () => {
            var tok = localStorage.getItem("fcm_token");
            console.log("Second Token: " + tok);
  
            db.collection(`${sector.value}`).doc(namee.value+classs.value+section.value)
              .set({
                name: namee.value,
                class: classs.value,
                section: section.value,
                email: email.value,
                password: defaultPass,
                asset: downloadURL,
                fcm_token: tok,
                sector: sector.value,
                phone: phone.value,
                selection_status: "pending",
              })
              .then(() => {
                localStorage.setItem("collection_reference", sector.value);
                localStorage.setItem("document_id", namee.value+classs.value+section.value);
  
                window.location.replace(
                  "http://127.0.0.1:5500/profile/index.html"
                );
              });
          }, 2000);
        });
        swal("Your submission has been received.");
      }
    );
  }
  
  // final function run after the participate button is clicked
  
  submit_button.addEventListener("click", () => {
    valueCheck();
    singInUsers();
    getFile();
  });
  
}