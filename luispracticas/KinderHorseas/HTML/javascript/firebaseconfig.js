  // Import the functions you need from the SDKs
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js';
  import { getAuth} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
  import { getFirestore} from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDOpdCF5zudAGEkIlDfbkZ8Z5C4bOqmwf0",
    authDomain: "kinder-seahorses-14c45.firebaseapp.com",
    projectId: "kinder-seahorses-14c45",
    storageBucket: "kinder-seahorses-14c45.firebasestorage.app",
    messagingSenderId: "218282268334",
    appId: "1:218282268334:web:40371dbef2cfed6faa3f3f",
    measurementId: "G-GZ3YRWL5DQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig); 
  export const auth = getAuth(app);
  export const db = getFirestore(app);