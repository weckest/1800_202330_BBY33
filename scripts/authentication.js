// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
       callbacks: {
              signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                     // User successfully signed in.
                     // Return type determines whether we continue the redirect automatically
                     // or whether we leave that to developer to handle.
                     //------------------------------------------------------------------------------------------
                     // The code below is modified from default snippet provided by the FB documentation.
                     //
                     // If the user is a "brand new" user, then create a new "user" in your own database.
                     // Assign this user with the name and email provided.
                     // Before this works, you must enable "Firestore" from the firebase console.
                     // The Firestore rules must allow the user to write. 
                     //------------------------------------------------------------------------------------------
                     var user = authResult.user;
                     // startFridgeId(user.uid);                          // get the user object from the Firebase authentication database
                     if (authResult.additionalUserInfo.isNewUser) {         //if new user
                            db.collection("users").doc(user.uid).set({      //write to firestore. We are using the UID for the ID in users collection
                                   name: user.displayName, 
                                   currentFridge: user.uid,                              //"users" collection
                                   email: user.email,                       //with authenticated user's ID (user.uid)
                            }).then(function () {
                                   console.log("New user added to firestore");
                                   //window.location.assign("main.html");       //re-direct to main.html after signup
                            }).catch(function (error) {
                                   console.log("Error adding new user: " + error);
                            });

                            //adds a setting collection to the users document
                            db.collection("users").doc(user.uid).collection("settings").doc("settings").set({
                                   notification: false,
                                   deleteConfirm: true,
                                   expirationNotification: false,
                                   reminder: false,
                                   suggestion: false,
                                   tip: false
                            }).then(function () {
                                   console.log("New user added to firestore");
                                   //window.location.assign("main.html");       //re-direct to main.html after signup
                            }).catch(function (error) {
                                   console.log("Error adding new user: " + error);
                            });
                            
                            db.collection("users").doc(user.uid).collection("shoppingList").doc().set({

                            }).then(function () {
                                   console.log("New user added to firestore");
                                   //window.location.assign("main.html");       //re-direct to main.html after signup
                            }).catch(function (error) {
                                   console.log("Error adding new user: " + error);
                            });

                            db.collection("users").doc(user.uid).collection("autoFill").doc().set({
                                   name: "Something"
                            }).then(function () {
                                   console.log("New user added to firestore");
                                   //window.location.assign("main.html");       //re-direct to main.html after signup
                            }).catch(function (error) {
                                   console.log("Error adding new user: " + error);
                            });

                            db.collection("fridges").doc(user.uid).set({
                                   fridgeName: user.displayName + "\'s fridge",
                                   //users: []
                            })
                            .then(function() {
                                   // write the user.uid into fridge list
                                   db.collection("users").doc(user.uid).collection("fridges").doc(user.uid).set({
                                          fridgeName: user.displayName + "\'s fridge",
                                   });
                                   var foodCollection = db.collection("fridges").doc(user.uid).collection("food");
                                   foodCollection.add({
                                          bbDate: new Date(),
                                          name: "Click + to add item"
                                   });
                                   foodCollection.add({
                                          bbDate: new Date(),
                                          name: "Click trash to delete"
                                   });
                                   foodCollection.add({
                                          bbDate: new Date(),
                                          name: "Click any box to edit"
                                   })
                                   .then(function () {
                                          console.log("New user added to firestore");
                                          window.location.assign("main.html");
                                   })
                                   .catch(function(error) {
                                   console.error("Error: ", error);
                                   })
                            })
                            
                     } else {
                            return true;
                     }
                     return false;
              },
              uiShown: function () {
                     // The widget is rendered.
                     // Hide the loader.
                     document.getElementById('loader').style.display = 'none';
              }
       },
       // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
       signInFlow: 'popup',
       signInSuccessUrl: 'main.html',
       signInOptions: [
              // Leave the lines as is for the providers you want to offer your users.
              //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
              firebase.auth.EmailAuthProvider.PROVIDER_ID,
              //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
       ],
       // Terms of service url.
       tosUrl: '<your-tos-url>',
       // Privacy policy url.
       privacyPolicyUrl: '<your-privacy-policy-url>'
};

ui.start('#firebaseui-auth-container', uiConfig);