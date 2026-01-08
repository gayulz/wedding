// lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore 데이터베이스를 사용하기 위해 import 합니다.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnAVtFtDOHJzAKiqhC6Wt86VcnFCocLAM",
  authDomain: "by-wedding-db137.firebaseapp.com",
  projectId: "by-wedding-db137",
  storageBucket: "by-wedding-db137.firebasestorage.app",
  messagingSenderId: "484025562296",
  appId: "1:484025562296:web:5d42b7a6fb1b58630a304d",
  measurementId: "G-4GGQ2BS7Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// 다른 컴포넌트에서 Firestore를 사용할 수 있도록 export 합니다.
export const db = getFirestore(app);