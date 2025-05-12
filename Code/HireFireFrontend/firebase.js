// Import the functions you need from the SDKs you need
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACcbBRQCNPpHzSt1bvu6P_R4U594Urcz4",
  authDomain: "hirefire-d7e5a.firebaseapp.com",
  projectId: "hirefire-d7e5a",
  storageBucket: "hirefire-d7e5a.firebasestorage.app",
  messagingSenderId: "373385976771",
  appId: "1:373385976771:web:2a684f31568c267e1dbb76",
  measurementId: "G-4K4LEVE7XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db