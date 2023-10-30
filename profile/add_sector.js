const sector = document.querySelector(".sectorr");
const add_button = document.querySelector(".add");


var arr = [];


add_button.addEventListener("click", function(){
    let preSector = localStorage.getItem("pre_sector");

    if(arr.includes(preSector)){
        console.log("Presector value already exists");

        if(arr.includes(sector.value)){
            console.log("Sector value already exists");
        } else {
           arr.push(" "+sector.value);
        }
        
    } else {
        arr.push(preSector)

        if(arr.includes(" "+sector.value)){
            console.log("Sector value already exists");
        } else {
           arr.push(" "+sector.value);
        }
    }

    console.log(arr);
    localStorage.setItem("all_sector", arr);
    localStorage.setItem("updated_sectors", true);

    const db = firebase.firestore();


    const colRef = localStorage.getItem("collection_reference");
    const docRef = localStorage.getItem("document_id");
    const allSectorArray = localStorage.getItem("all_sector");

    const userRef = db.collection(colRef).doc(docRef);

    userRef.set({
            sector: allSectorArray
    }, {merge: true});


    setTimeout(() => {
        location.reload();
    }, 1000);
});

