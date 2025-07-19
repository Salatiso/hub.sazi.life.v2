// hub.sazi.life.v2/assets/js/firebase-config.js

// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration from the provided file
const firebaseConfig = {
  apiKey: "AIzaSyD_pRVkeVzciCPowxsj44NRVlbyZvFPueI",
  authDomain: "lifecv-d2724.firebaseapp.com",
  projectId: "lifecv-d2724",
  storageBucket: "lifecv-d2724.appspot.com",
  messagingSenderId: "1039752653127",
  appId: "1:1039752653127:web:54afa09b21c98ef231c462",
  measurementId: "G-BDCNHBQTR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
