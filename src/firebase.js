// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2pkzjem6Mq375rwCvA_RB30KiaxK5vB4",
  authDomain: "nammaapp-12ad8.firebaseapp.com",
  projectId: "nammaapp-12ad8",
  storageBucket: "nammaapp-12ad8.firebasestorage.app",
  messagingSenderId: "830465293241",
  appId: "1:830465293241:web:bb129777d9a6bfd0fad468",
  measurementId: "G-KEK3679XG8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 1. Export the auth 

// Initialize Analytics (optional, but good to keep if you have it)
const analytics = getAnalytics(app);

// 2. Initialize Cloud Firestore and export it
// This creates the 'db' instance that your other components need to import.
// The 'export' keyword is the most important part of the fix.
export const db = getFirestore(app);