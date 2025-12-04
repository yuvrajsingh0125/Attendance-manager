// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// !! WARNING: Do NOT use this exact config in production. !!
// This configuration contains your actual keys. 
// For production apps, this should be stored securely 
// (e.g., in environment variables).
const firebaseConfig = {
  apiKey: "AIzaSyD6WlOiIgdG19o-yP-xozjVl85N1m9nGbQ",
  authDomain: "iot-rfid-89e01.firebaseapp.com",
  databaseURL: "https://iot-rfid-89e01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-rfid-89e01",
  storageBucket: "iot-rfid-89e01.firebasestorage.app",
  messagingSenderId: "390086025224",
  appId: "1:390086025224:web:9aec96443919a74702b1bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };