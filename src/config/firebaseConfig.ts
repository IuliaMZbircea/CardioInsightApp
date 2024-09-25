import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import axios from 'axios';


const firebaseConfig = {
  apiKey: "AIzaSyBguQQZzseZxhCgUjed4kCgmEukHplmF_4",
  authDomain: "cardioinsightmobileapp.firebaseapp.com",
  projectId: "cardioinsightmobileapp",
  storageBucket: "cardioinsightmobileapp.appspot.com",
  messagingSenderId: "564981538941",
  appId: "1:564981538941:web:b38db7e6fb72f799665114",
  measurementId: "G-GGHYVN1X0P"
};



export const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const firestore_db = getFirestore(app);
export const perf = getPerformance(app);