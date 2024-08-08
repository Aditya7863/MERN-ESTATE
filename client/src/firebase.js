// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c2862.firebaseapp.com",
  projectId: "mern-estate-c2862",
  storageBucket: "mern-estate-c2862.appspot.com",
  messagingSenderId: "278974244363",
  appId: "1:278974244363:web:b7ec1ab66beffb31bf890e"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);