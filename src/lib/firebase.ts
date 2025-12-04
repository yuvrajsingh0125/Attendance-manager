// src/lib/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth, Auth } from "firebase/auth"; // <-- NEW IMPORT

// Your provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6WlOiIgdG19o-yP-xozjVl85N1m9nGbQ",
  authDomain: "iot-rfid-89e01.firebaseapp.com",
  databaseURL: "https://iot-rfid-89e01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-rfid-89e01",
  storageBucket: "iot-rfid-89e01.firebasestorage.app",
  messagingSenderId: "390086025224",
  appId: "1:390086025224:web:9aec96443919a74702b1bd"
};

// Initialize Firebase App
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Services and Export them with explicit types
export const db: Database = getDatabase(app);
export const auth: Auth = getAuth(app); // <-- EXPORTED AUTH SERVICE