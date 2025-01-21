// We don't know yet whether we will use firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAx60thj2O_vM_xnwtYU9PNGO-s3f5B1_o",
    authDomain: "and-agenda.firebaseapp.com",
    projectId: "and-agenda",
    storageBucket: "and-agenda.firebasestorage.app",
    messagingSenderId: "1032746206215",
    appId: "1:1032746206215:web:caff2bd0332d2a52fdd6a2",
    measurementId: "G-Z5Q4W2BEFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);