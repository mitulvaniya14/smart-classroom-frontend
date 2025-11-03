// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // your Firebase config keys
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
