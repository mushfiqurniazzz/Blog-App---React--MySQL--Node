// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_APIKEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTHDOMAIN,
    projectId: import.meta.env.VITE_REACT_APP_PROJECTID,
    storageBucket: import.meta.env.VITE_REACT_APP_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_REACT_APP_APPID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);