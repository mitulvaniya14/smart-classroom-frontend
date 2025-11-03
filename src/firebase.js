// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // If you're using Realtime DB
import { getAuth } from "firebase/auth"; // optional
import { getFirestore } from "firebase/firestore"; // optional

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX8rjGOoUzYa6kXP-bkU0GMxM9kTRueC4",
  authDomain: "smart-classroom-finder-d7f1f.firebaseapp.com",
  databaseURL: "https://smart-classroom-finder-d7f1f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-classroom-finder-d7f1f",
  storageBucket: "smart-classroom-finder-d7f1f.firebasestorage.app",
  messagingSenderId: "848097026511",
  appId: "1:848097026511:web:b07f8b10f3589f152d72ba",
  measurementId: "G-VKW3XF1DNY"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export what you need
export const db = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
