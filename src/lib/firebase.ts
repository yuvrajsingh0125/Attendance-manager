import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Credentials from ESP32 code
const firebaseConfig = {
  apiKey: "AIzaSyBlB7hUTk-6kw6qr57ttkqzzzpSr2zdFVE",
  databaseURL: "https://rfid-fb4d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  // The ESP32 code uses email/password auth, but for the web client we might need
  // to use the same if rules require it, or just rely on public read if rules allow.
  // For now, we'll initialize the app. If we need auth, we'll add it.
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
