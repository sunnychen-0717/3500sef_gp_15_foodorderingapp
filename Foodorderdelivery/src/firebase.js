// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkJbGv1_NJct9V_8NQjWomhjI6rLKVxDE",
  authDomain: "food-delivery-2230b.firebaseapp.com",
  projectId: "food-delivery-2230b",
  storageBucket: "food-delivery-2230b.firebasestorage.app",
  messagingSenderId: "438027766162",
  appId: "1:438027766162:web:3d24e5e72136fe5550594b",
  measurementId: "G-Z27RN7KY0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);