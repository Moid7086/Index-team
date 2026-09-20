import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOpdCF5zudAGEkIlDfbkZ8Z5C4bOqmwf0",
    authDomain: "kinder-seahorses-14c45.firebaseapp.com",
    projectId: "kinder-seahorses-14c45",
    storageBucket: "kinder-seahorses-14c45.firebasestorage.app",
    messagingSenderId: "218282268334",
    appId: "1:218282268334:web:40371dbef2cfed6faa3f3f",
    measurementId: "G-GZ3YRWL5DQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        document.getElementById("userEmailDisplay").textContent = user.email;
    }
});

const buttons = document.querySelectorAll(".menu-btn");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const page = button.getAttribute("data-page");
        window.location.href = page;
    });
});

const cuentaBtn = document.getElementById("cuentaBtn");
if (cuentaBtn) {
    cuentaBtn.addEventListener("click", () => {
        window.location.href = "cuenta.html";
    });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "index.html";
        });
    });
}