var isClicked = false;

function displayFridges() {
    let cardTemplate = document.getElementById("fridgeCardTemplate");
    if (isClicked === false) {
        isClicked = true;
        db.collection("users").doc(userId).collection("fridges").get().then((allFridges) => {
            allFridges.forEach((doc) => {
                var fridgeName = doc.data().fridgeName;
                console.log(fridgeName);

                let newcard = cardTemplate.content.cloneNode(true).firstElementChild;

                // Update fridge name on card
                newcard.querySelector('.card-title').innerHTML = fridgeName;

                //attach to gallery, Example: "fridges-go-here"
                document.getElementById("fridges-go-here").appendChild(newcard);
            })
        })
    }
}

// Write fridge info from form to firebase (Not Functional atm)
var fridgeForm = document.getElementById('myForm-j');
fridgeForm.addEventListener('submit', function () {
    const docRef = db.collection("users").doc(userId);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            var fridgesRef = db.collection("users").doc(userId).collection("fridges");
            var fridgeNameInput = document.getElementById("fridgeName").value;
            var fridgeIDInput = document.getElementById("fridgeID").value;

            console.log(fridgesRef);
            console.log(fridgeNameInput);

            fridgesRef.doc(fridgeIDInput).set({
                fridgeName: fridgeNameInput
            })
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });

            // .then(function () {
            //     //console.log('Document written with ID: ', docRef.id);
            //     // Reload the page after the write is successful
            //     // location.reload(); // This will trigger a page refresh
            // })
            // .catch(function (error) {
            //     console.error('Error adding document: ', error);
            // });


            // Clear the form fields
            document.getElementById('fridgeName').value = '',
                document.getElementById('fridgeID').value = '';
            closeForm();
        }
    })
});

function getItemsInFridge() {
    db.collection("fridges").doc(getFridgeId()).collection("food").get().then(allFood => {
        allFood.forEach(doc => {
            console.log(doc.id);
        });
    });
}

function displayFridgeList() {
    var fridgeList = document.getElementById("fridges-go-here");
    if (fridgeList.style.display === "flex") {
        fridgeList.style.display = "none";
    }
    else {
        fridgeList.style.display = "flex";
    }
}