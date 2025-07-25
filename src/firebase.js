// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCu33m5KTR4FSnAr5taWyJwmECsd-YoTmM",
    authDomain: "voting-app-43097.firebaseapp.com",
    projectId: "voting-app-43097",
    storageBucket: "voting-app-43097.appspot.com",  // ✅ fixed this line
    messagingSenderId: "354780923863",
    appId: "1:354780923863:web:dd282291cadb4e1a392d92"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
