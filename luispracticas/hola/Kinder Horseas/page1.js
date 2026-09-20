import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';

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
const db = getFirestore(app);

let currentSelectedHorse = null;
let currentUser = null;
let currentRowCount = 5;
let horses = [];

const DARK_BLUE = "#0a2e5c";
const LIGHTER_BLUE = "#1a4a7a";

const COLUMN_WIDTH = 100;
const NAME_COLUMN_WIDTH = 180;
const MOVE_COLUMN_WIDTH = 80;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "homepage.html";
    });

    document.getElementById("addHorseBtn").addEventListener("click", async () => {
        const name = prompt("Nombre del caballo (estudiante):");
        if (name && name.trim()) {
            await addDoc(collection(db, "horses"), {
                name: name.trim(),
                userId: currentUser.uid,
                position: 1
            });
            loadHorses();
        }
    });

    document.getElementById("updateRowsBtn").addEventListener("click", () => {
        const newCount = parseInt(document.getElementById("rowCount").value);
        if (newCount >= 1 && newCount <= 25) {
            currentRowCount = newCount;
            updateTableLayout();
            displayHorses();
        } else {
            alert("El número de carreras debe estar entre 1 y 25");
        }
    });

    document.querySelectorAll(".mood-option").forEach(option => {
        option.addEventListener("click", async () => {
            const mood = parseInt(option.getAttribute("data-mood"));
            if (currentSelectedHorse) {
                await saveAttendance(currentSelectedHorse.id, currentSelectedHorse.name, mood);
                hideMoodModal();
                alert(`Asistencia registrada para ${currentSelectedHorse.name}`);
            }
        });
    });

    document.getElementById("closeModalBtn").addEventListener("click", () => {
        hideMoodModal();
    });

    document.getElementById("moodModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("moodModal")) {
            hideMoodModal();
        }
    });
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        currentUser = user;
        const userEmailSpan = document.getElementById("userEmailDisplay");
        if (userEmailSpan) {
            userEmailSpan.textContent = user.email;
        }
        loadHorses();
    }
});

async function saveAttendance(horseId, horseName, mood) {
    const today = new Date().toISOString().split('T')[0];
    try {
        await addDoc(collection(db, "attendance"), {
            horseId: horseId,
            horseName: horseName,
            date: today,
            mood: mood,
            userId: currentUser.uid
        });
        console.log("Attendance saved successfully");
    } catch (error) {
        console.error("Error saving attendance:", error);
    }
}

function showMoodModal(horse) {
    currentSelectedHorse = horse;
    document.getElementById("moodStudentName").innerHTML = `Estudiante: <strong>${horse.name}</strong>`;
    document.getElementById("moodModal").style.display = "flex";
}

function hideMoodModal() {
    document.getElementById("moodModal").style.display = "none";
    currentSelectedHorse = null;
}

async function loadHorses() {
    try {
        const querySnapshot = await getDocs(collection(db, "horses"));
        horses = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === currentUser.uid) {
                horses.push({ id: doc.id, ...data });
            }
        });
        updateTableLayout();
        displayHorses();
    } catch (error) {
        console.error("Error loading horses:", error);
    }
}

function updateTableLayout() {
    const headerContainer = document.getElementById("tableHeader");
    if (!headerContainer) return;
    
    let gridTemplateColumns = `${NAME_COLUMN_WIDTH}px `;
    for (let i = 1; i <= currentRowCount; i++) {
        gridTemplateColumns += `${COLUMN_WIDTH}px `;
    }
    gridTemplateColumns += `${MOVE_COLUMN_WIDTH}px`;
    
    headerContainer.style.gridTemplateColumns = gridTemplateColumns;
    
    headerContainer.innerHTML = '';
    
    const nameHeader = document.createElement("div");
    nameHeader.className = "table-header-cell";
    nameHeader.textContent = "Nombre (click para asistencia)";
    headerContainer.appendChild(nameHeader);
    
    for (let i = 1; i <= currentRowCount; i++) {
        const posHeader = document.createElement("div");
        posHeader.className = "table-header-cell";
        posHeader.textContent = `${i}`;
        headerContainer.appendChild(posHeader);
    }
    
    const moveHeader = document.createElement("div");
    moveHeader.className = "table-header-cell";
    moveHeader.textContent = "Mover";
    headerContainer.appendChild(moveHeader);
}

async function updateHorsePosition(horseId, newPosition) {
    if (newPosition < 1 || newPosition > currentRowCount) return;
    const horseRef = doc(db, "horses", horseId);
    await updateDoc(horseRef, {
        position: newPosition
    });
    loadHorses();
}

function getCheckerboardColor(rowIndex, colIndex) {
    const isEven = (rowIndex + colIndex) % 2 === 0;
    return isEven ? DARK_BLUE : LIGHTER_BLUE;
}

function displayHorses() {
    const container = document.getElementById("horsesList");
    if (!container) return;
    
    container.innerHTML = "";
    
    let gridTemplateColumns = `${NAME_COLUMN_WIDTH}px `;
    for (let i = 1; i <= currentRowCount; i++) {
        gridTemplateColumns += `${COLUMN_WIDTH}px `;
    }
    gridTemplateColumns += `${MOVE_COLUMN_WIDTH}px`;

    horses.forEach((horse, horseIndex) => {
        const row = document.createElement("div");
        row.className = "horse-row";
        row.style.gridTemplateColumns = gridTemplateColumns;

        const nameCell = document.createElement("div");
        nameCell.className = "horse-cell";
        nameCell.textContent = horse.name;
        nameCell.style.backgroundColor = "#4CAF50";
        nameCell.style.color = "white";
        nameCell.style.fontWeight = "bold";
        nameCell.style.textAlign = "left";
        nameCell.style.justifyContent = "flex-start";
        nameCell.style.cursor = "pointer";
        nameCell.addEventListener("click", () => {
            showMoodModal(horse);
        });
        row.appendChild(nameCell);

        for (let colIndex = 0; colIndex < currentRowCount; colIndex++) {
            const positionNumber = colIndex + 1;
            const posCell = document.createElement("div");
            posCell.className = "horse-cell";
            
            const checkerboardColor = getCheckerboardColor(horseIndex, colIndex);
            posCell.style.backgroundColor = checkerboardColor;
            
            if (horse.position === positionNumber) {
                posCell.textContent = "🐴";
                posCell.style.fontSize = "2rem";
                posCell.style.border = "2px solid gold";
                posCell.style.boxShadow = "inset 0 0 0 2px gold";
            } else {
                posCell.textContent = "~";
                posCell.style.color = "#a8c8e8";
                posCell.style.fontSize = "1.2rem";
            }
            row.appendChild(posCell);
        }

        const moveCell = document.createElement("div");
        moveCell.className = "horse-cell";
        const moveCellColor = getCheckerboardColor(horseIndex, currentRowCount);
        moveCell.style.backgroundColor = moveCellColor;
        moveCell.style.display = "flex";
        moveCell.style.gap = "5px";
        
        const leftBtn = document.createElement("button");
        leftBtn.textContent = "◀";
        leftBtn.className = "move-btn";
        leftBtn.disabled = horse.position <= 1;
        leftBtn.style.padding = "5px 10px";
        leftBtn.style.cursor = "pointer";
        leftBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (horse.position > 1) {
                updateHorsePosition(horse.id, horse.position - 1);
            }
        });
        
        const rightBtn = document.createElement("button");
        rightBtn.textContent = "▶";
        rightBtn.className = "move-btn";
        rightBtn.disabled = horse.position >= currentRowCount;
        rightBtn.style.padding = "5px 10px";
        rightBtn.style.cursor = "pointer";
        rightBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (horse.position < currentRowCount) {
                updateHorsePosition(horse.id, horse.position + 1);
            }
        });

        const profileBtn = document.createElement("button");
        profileBtn.textContent = "👤";
        profileBtn.className = "move-btn";
        profileBtn.style.padding = "5px 8px";
        profileBtn.style.cursor = "pointer";
        profileBtn.title = "Ver perfil";
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            window.location.href = `profile.html?id=${horse.id}&name=${encodeURIComponent(horse.name)}`;
        });
        
        moveCell.appendChild(leftBtn);
        moveCell.appendChild(rightBtn);
        moveCell.appendChild(profileBtn);
        row.appendChild(moveCell);
        
        container.appendChild(row);
    });

    if (horses.length === 0) {
        const emptyRow = document.createElement("div");
        emptyRow.className = "horse-row";
        emptyRow.style.gridTemplateColumns = gridTemplateColumns;
        const emptyCell = document.createElement("div");
        emptyCell.className = "horse-cell";
        emptyCell.style.gridColumn = `1 / span ${currentRowCount + 2}`;
        emptyCell.style.textAlign = "center";
        emptyCell.style.justifyContent = "center";
        emptyCell.style.backgroundColor = "#0a2e5c";
        emptyCell.style.color = "white";
        emptyCell.style.padding = "20px";
        emptyCell.textContent = "No hay caballos. Agrega uno con el botón + Agregar Caballo";
        emptyRow.appendChild(emptyCell);
        container.appendChild(emptyRow);
    }
}