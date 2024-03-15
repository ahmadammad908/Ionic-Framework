// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNiqXB3DNeyV4ZiMbfcb_ZutxALNtQh20",
  authDomain: "tech-sea-8db64.firebaseapp.com",
  projectId: "tech-sea-8db64",
  storageBucket: "tech-sea-8db64.appspot.com",
  messagingSenderId: "40829949277",
  appId: "1:40829949277:web:b36e987d57343483abc4b4",
  measurementId: "G-SWDSWM2WFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);