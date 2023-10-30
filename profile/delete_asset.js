const updateButtt = document.querySelector(".update_buttt");
const new_file = document.querySelector(".new_file");
const statuss = document.querySelector(".update_progress");
var progress;

updateButtt.addEventListener("click", () => {
    if(!new_file.files[0]){
        return swal({
            text: "No file selected"
        });
    }
    const strRef = localStorage.getItem("storage_ref");
    const storageRef = firebase.storage().ref(strRef);
    const fileName = localStorage.getItem("file_name");
    const deleteRef = storageRef.child(fileName);

    console.log(storageRef);

    deleteRef.delete().then(() => {
        console.log("Old storage file deleted successfully...")
    }).catch((error) => {
        swal({
            text: error.message
        })
    });

    const storageReff = firebase.storage().ref(strRef);
    const uploadTask = storageReff.child(fileName).put(new_file.files[0]);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
          progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progress = Math.round(progress);
          statuss.innerHTML = "Uploading " + progress + "%";
        },
        (error) => {
          reject(error);
        },
        () => {
          statuss.innerHTML = "✅ Successfully uploaded";
    
          uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
            // uploads all data to firestore
            localStorage.setItem("new_file", downloadURL);
            });
        });
});