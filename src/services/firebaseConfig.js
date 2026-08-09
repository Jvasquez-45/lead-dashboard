// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-afGMw0UbP05b6pSdS85AMqaLCXfnk6s",
  authDomain: "lead-de614.firebaseapp.com",
  projectId: "lead-de614",
  storageBucket: "lead-de614.firebasestorage.app",
  messagingSenderId: "609376972212",
  appId: "1:609376972212:web:da82cba48fa18e9cfc16e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
