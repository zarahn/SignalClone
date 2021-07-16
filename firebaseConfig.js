import firebase from 'firebase';
// import 'firebase/firestore';
// import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCQch-Vn8zIlDeQYla_Sw0mn752KT-madM",
    authDomain: "wkphc-signal-clone-yt.firebaseapp.com",
    projectId: "wkphc-signal-clone-yt",
    storageBucket: "wkphc-signal-clone-yt.appspot.com",
    messagingSenderId: "1016517747837",
    appId: "1:1016517747837:web:c3918087f212c82273fd14"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
