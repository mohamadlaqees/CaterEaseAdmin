// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAJ5h3U6geJ_sab2sPT013xzDx_h4An-iI",
  authDomain: "cater-5d36c.firebaseapp.com",
  projectId: "cater-5d36c",
  storageBucket: "cater-5d36c.firebasestorage.app",
  messagingSenderId: "1315919509",
  appId: "1:1315919509:web:e369c4b5d0c0710f68ad9c",
  measurementId: "G-34QZQZTYME",
};

const app = initializeApp(firebaseConfig);

// Initialize Cloud Messaging
export const messaging = getMessaging(app);
