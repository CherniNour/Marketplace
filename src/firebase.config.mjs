// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIxCpaLZXmHpJpErGPcrglJb-vmdCFs1I",
  authDomain: "el-hanout-57170.firebaseapp.com",
  projectId: "el-hanout-57170",
  storageBucket: "el-hanout-57170.appspot.com", // Corrected
  messagingSenderId: "68114908546",
  appId: "1:68114908546:web:1e7474039ff254ac80bb9b",
  measurementId: "G-3KRBXBSSLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app);