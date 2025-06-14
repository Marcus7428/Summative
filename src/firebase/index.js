import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyARDHag2p9PS0pykVb6WYktYMN8R50PS0Y",
    authDomain: "ics4u-a7c65.firebaseapp.com",
    projectId: "ics4u-a7c65",
    storageBucket: "ics4u-a7c65.firebasestorage.app",
    messagingSenderId: "930476932288",
    appId: "1:930476932288:web:1e18cab91d6fd8daf00125"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };