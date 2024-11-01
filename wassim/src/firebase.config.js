// Import the functions you need from the SDKs you need
//DStWLloW06XNzP2JBmvAsvWEZWy1
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDnBQi5al22OIlPg9jmS04Uv1gZqdAzWjg",
  authDomain: "el-hanout.firebaseapp.com",
  projectId: "el-hanout",
  storageBucket: "el-hanout.firebasestorage.app",
  messagingSenderId: "992145972102",
  appId: "1:992145972102:web:d1c668633572a2cef8aa07",
  measurementId: "G-T4T62G91VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()