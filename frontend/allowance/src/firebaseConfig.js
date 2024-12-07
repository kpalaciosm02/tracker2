import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAnyBOBeWAy46lor0jhvcde8iMRFyDXUAU",
    authDomain: "allowance-tracker-84ada.firebaseapp.com",
    projectId: "allowance-tracker-84ada",
    storageBucket: "allowance-tracker-84ada.firebasestorage.app",
    messagingSenderId: "1065185727420",
    appId: "1:1065185727420:web:e2ffd8f8be365f6f47d1b9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);