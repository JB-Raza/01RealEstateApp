// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-c0c26.firebaseapp.com",
  projectId: "real-estate-c0c26",
  storageBucket: "real-estate-c0c26.firebasestorage.app",
  messagingSenderId: "997069845853",
  appId: "1:997069845853:web:0047cf59812d5afef564b4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);