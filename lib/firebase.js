// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6MlPy5Gi0lJD6IrUfWOJMMmOiWvEKp5Q",
  authDomain: "wedsnap-1c9b9.firebaseapp.com",
  projectId: "wedsnap-1c9b9",
  storageBucket: "wedsnap-1c9b9.firebasestorage.app",
  messagingSenderId: "39539970443",
  appId: "1:39539970443:web:f1f2132ef9b7a5cb36df8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app , {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };