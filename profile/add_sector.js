const sector = document.querySelector(".sectorr");
const add_button = document.querySelector(".add");


var arr = [];


add_button.addEventListener("click", function(){
    let preSector = localStorage.getItem("pre_sector");

    console.log(preSector);

    

    if(arr.includes(" "+preSector)){
        console.log("Presector value already exists");
        if(arr.includes(" "+sector.value)){
            console.log("Sector value already exists");
        } else {
           arr.push(" "+sector.value);
        }

        console.log(arr);
        
    } else {
        arr.push(" "+preSector);
        console.log("Value added.");

        if(arr.includes(" "+sector.value)){
            console.log("Sector value already exists");
        } else {
           arr.push(" "+sector.value);
        }
        console.log(arr);
    }

    localStorage.setItem("all_sectors", arr);
    // localStorage.setItem("updated_sectors", true);

    const db = firebase.firestore();


    const colRef = localStorage.getItem("collection_reference");
    const docRef = localStorage.getItem("document_id");
    const allSectorString = localStorage.getItem("all_sectors");
    const allSectorArray = allSectorString.split(',').map(item => item.trim());
    let uniqueArr = Array.from(new Set(allSectorArray));
    console.log(uniqueArr);

    const userRef = db.collection(colRef).doc(docRef);

    userRef.set({
            sector: uniqueArr
    }, {merge: true});


    setTimeout(() => {
        location.reload();
    }, 1000);
});

