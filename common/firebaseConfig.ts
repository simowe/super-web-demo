import firebase from "firebase/app"

if (firebase.apps.length === 0) {
    console.log("Initializing firebase!")

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDmsUbp3J_FXDGW7_7TvkItBMr6zvrSVtA",
        authDomain: "super-web-demo.firebaseapp.com",
        projectId: "super-web-demo",
        storageBucket: "super-web-demo.appspot.com",
        messagingSenderId: "421077060453",
        appId: "1:421077060453:web:f8cf3a469d938bc5616f8c",
    }
    firebase.initializeApp(firebaseConfig)
}
