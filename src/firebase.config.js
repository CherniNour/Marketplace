// Import the functions you need from the SDKs you need
//ruYOwX5rrLWoYIq4cEpQT9hybej2 #user id



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIxCpaLZXmHpJpErGPcrglJb-vmdCFs1I",
  authDomain: "el-hanout-57170.firebaseapp.com",
  projectId: "el-hanout-57170",
  storageBucket: "el-hanout-57170.firebasestorage.app",
  messagingSenderId: "68114908546",
  appId: "1:68114908546:web:1e7474039ff254ac80bb9b",
  measurementId: "G-3KRBXBSSLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app);
