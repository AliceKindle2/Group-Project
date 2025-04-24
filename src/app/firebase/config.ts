// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDIu3bZP0YgalBU7_Z-pKxx0M6J905mQcM",
    authDomain: "pcapp-5a64b.firebaseapp.com",
    projectId: "pcapp-5a64b",
    storageBucket: "pcapp-5a64b.firebasestorage.app",
    messagingSenderId: "431726310318",
    appId: "1:431726310318:web:1b299af9b505d32400ce3f",
    measurementId: "G-XSLWWRT8ML"
  };

// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export default firebaseApp;