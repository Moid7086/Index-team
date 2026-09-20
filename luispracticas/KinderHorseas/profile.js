import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';

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

let currentUser = null;
let currentStudentId = null;
let currentAttendanceRecords = [];

function getStudentIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function getMoodInfo(mood) {
    const moods = {
        1: { text: "Muy mal", img: "resources/images/mood1.png" },
        2: { text: "Mal", img: "resources/images/mood2.png" },
        3: { text: "Normal", img: "resources/images/mood3.png" },
        4: { text: "Bien", img: "resources/images/mood4.png" },
        5: { text: "Excelente", img: "resources/images/mood5.png" }
    };
    return moods[mood] || { text: "Desconocido", img: "" };
}

// Load notes from Firestore
async function loadNotes() {
    if (!currentStudentId) return;
    
    try {
        const notesRef = doc(db, "studentNotes", `${currentStudentId}_${currentUser.uid}`);
        const notesSnap = await getDoc(notesRef);
        
        if (notesSnap.exists()) {
            const notes = notesSnap.data().notes || "";
            document.getElementById("notesDisplay").textContent = notes || "No hay notas para este estudiante.";
        } else {
            document.getElementById("notesDisplay").textContent = "No hay notas para este estudiante.";
        }
    } catch (error) {
        console.error("Error loading notes:", error);
        document.getElementById("notesDisplay").textContent = "Error al cargar notas.";
    }
}

// Save notes to Firestore
async function saveNotes(notes) {
    if (!currentStudentId) return;
    
    try {
        const notesRef = doc(db, "studentNotes", `${currentStudentId}_${currentUser.uid}`);
        await setDoc(notesRef, {
            studentId: currentStudentId,
            userId: currentUser.uid,
            notes: notes,
            updatedAt: new Date().toISOString()
        });
        alert("Notas guardadas correctamente");
        loadNotes(); // Reload to refresh display
    } catch (error) {
        console.error("Error saving notes:", error);
        alert("Error al guardar las notas");
    }
}

// Show edit notes modal
function showEditNotesModal() {
    const currentNotes = document.getElementById("notesDisplay").textContent;
    const notesToEdit = (currentNotes === "No hay notas para este estudiante." || currentNotes === "Cargando notas..." || currentNotes === "Error al cargar notas.") 
        ? "" 
        : currentNotes;
    document.getElementById("notesEditTextarea").value = notesToEdit;
    document.getElementById("notesEditModal").style.display = "flex";
}

// Close edit notes modal
function closeNotesEditModal() {
    document.getElementById("notesEditModal").style.display = "none";
}

// Load mood history
async function loadMoodHistory() {
    if (!currentStudentId) return;
    
    const attendanceQuery = query(
        collection(db, "attendance"),
        where("horseId", "==", currentStudentId),
        where("userId", "==", currentUser.uid)
    );
    
    const querySnapshot = await getDocs(attendanceQuery);
    currentAttendanceRecords = [];
    querySnapshot.forEach((doc) => {
        currentAttendanceRecords.push({
            id: doc.id,
            ...doc.data()
        });
    });
    
    currentAttendanceRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    displayMoodHistory();
}

function displayMoodHistory() {
    const tbody = document.getElementById("moodHistoryBody");
    
    if (currentAttendanceRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No hay registros de estado de ánimo aún</td></tr>';
        return;
    }
    
    tbody.innerHTML = "";
    currentAttendanceRecords.forEach(record => {
        const row = tbody.insertRow();
        const moodInfo = getMoodInfo(record.mood);
        
        const dateCell = row.insertCell(0);
        dateCell.textContent = record.date;
        
        const moodCell = row.insertCell(1);
        const img = document.createElement("img");
        img.src = moodInfo.img;
        img.alt = moodInfo.text;
        img.className = "mood-img";
        img.onerror = () => {
            img.outerHTML = moodInfo.text;
        };
        moodCell.appendChild(img);
        moodCell.appendChild(document.createTextNode(" " + moodInfo.text));
        
        const actionCell = row.insertCell(2);
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.className = "edit-mood-btn";
        editBtn.addEventListener("click", () => {
            openEditModal(record);
        });
        actionCell.appendChild(editBtn);
    });
}

function openEditModal(record) {
    document.getElementById("editDate").textContent = `Fecha: ${record.date}`;
    document.getElementById("editModal").style.display = "flex";
    document.getElementById("editModal").dataset.editId = record.id;
}

async function updateMood(attendanceId, newMood) {
    const attendanceRef = doc(db, "attendance", attendanceId);
    await updateDoc(attendanceRef, {
        mood: newMood
    });
    await loadMoodHistory();
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
    document.getElementById("editModal").dataset.editId = "";
}

document.addEventListener("DOMContentLoaded", () => {
    // Back button
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "page1.html";
    });
    
    // Edit notes button
    document.getElementById("editNotesBtn").addEventListener("click", () => {
        showEditNotesModal();
    });
    
    // Save notes button
    document.getElementById("saveNotesEditBtn").addEventListener("click", async () => {
        const newNotes = document.getElementById("notesEditTextarea").value;
        await saveNotes(newNotes);
        closeNotesEditModal();
    });
    
    // Cancel notes edit button
    document.getElementById("cancelNotesEditBtn").addEventListener("click", () => {
        closeNotesEditModal();
    });
    
    // Close notes modal when clicking outside
    document.getElementById("notesEditModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("notesEditModal")) {
            closeNotesEditModal();
        }
    });
    
    // Edit mood options
    document.querySelectorAll(".edit-mood-option").forEach(option => {
        option.addEventListener("click", async () => {
            const newMood = parseInt(option.getAttribute("data-mood"));
            const attendanceId = document.getElementById("editModal").dataset.editId;
            if (attendanceId) {
                await updateMood(attendanceId, newMood);
                closeEditModal();
                alert("Estado de ánimo actualizado");
            }
        });
    });
    
    // Cancel edit mood button
    document.getElementById("cancelEditBtn").addEventListener("click", () => {
        closeEditModal();
    });
    
    // Close mood modal when clicking outside
    document.getElementById("editModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("editModal")) {
            closeEditModal();
        }
    });
});

// Authentication check
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        currentUser = user;
        document.getElementById("userEmailDisplay").textContent = user.email;
        
        currentStudentId = getStudentIdFromURL();
        if (!currentStudentId) {
            window.location.href = "page1.html";
            return;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const studentName = urlParams.get('name') || "Estudiante";
        document.getElementById("studentName").textContent = decodeURIComponent(studentName);
        
        loadNotes();
        loadMoodHistory();
    }
});