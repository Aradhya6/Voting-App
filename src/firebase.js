// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCu33m5KTR4FSnAr5taWyJwmECsd-YoTmM",
    authDomain: "voting-app-43097.firebaseapp.com",
    projectId: "voting-app-43097",
    storageBucket: "voting-app-43097.appspot.com", // ✅ Fixed .app to .appspot.com
    messagingSenderId: "354780923863",
    appId: "1:354780923863:web:dd282291cadb4e1a392d92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Export all
export { auth, provider, db, storage };
