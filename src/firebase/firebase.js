import firebase from 'firebase/app'
import 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCp6hai4CfXv-qzH8MX0ov-ZycMPnT9kl0",
    authDomain: "cs353-g20.firebaseapp.com",
    projectId: "cs353-g20",
    storageBucket: "cs353-g20.appspot.com",
    messagingSenderId: "279849994602",
    appId: "1:279849994602:web:c364d9b7a82868c1947d13",
    measurementId: "G-1Y3YDGL72Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export {
    firebase as default
};