/**
 * ESTADO GLOBAL
 */
const state = {
    cardData: {
        name: '',
        bio: '',
        avatarUrl: 'src/assets/Avatares0.png', // Avatar por defecto
        color: '#3b82f6'
    }
};

/**
 *  REFERENCIAS AL DOM ( Document Objet Model )
 */
const dom = {
    inputName: document.getElementById('input-name'),
    inputBio: document.getElementById('input-bio'),
    inputColor: document.getElementById('input-color'),
    form: document.getElementById('profile-form'),
    avatarSelector: document.getElementById('avatar-selector'),
    previewName: document.getElementById('name-preview'),
    previewBio: document.getElementById('bio-preview'),
    previewAvatar: document.getElementById('avatar-preview'),
    previewHeader: document.getElementById('preview-header'),
    viewCreate: document.getElementById('view-create'),
    uploadAvatar: document.getElementById('upload-avatar'), // Referencia al input de subida
};

/**
 * GENERADOR DEL SELECTOR DE AVATARES
 * Crea los 12 elementos <img> dinámicamente.
 */
const initAvatarSelector = () => {
    const totalAvatares = 12; // Del 0 al 11
    for (let i = 0; i < totalAvatares; i++) {
        const rutaImagen = `src/assets/Avatares${i}.png`;
        const img = document.createElement('img');
        img.src = rutaImagen;
        img.alt = `Avatar ${i}`;
        img.className = 'avatar-option';
        // Guardamos la ruta en un atributo de datos para leerlo fácilmente
        img.dataset.url = rutaImagen; 

        // Evento: Al hacer clic en una miniatura, actualizamos el estado global
        img.addEventListener('click', () => {
            state.cardData.avatarUrl = rutaImagen;
            renderCard(); // Forzamos la actualización de la UI
        });

        dom.avatarSelector.appendChild(img);
    }
};

/**
 * FUNCIÓN PARA MANEJAR LA SUBIDA DE IMAGEN PROPIA
 */
const setupImageUpload = () => {
    dom.uploadAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Actualizamos el estado con la imagen subida
                state.cardData.avatarUrl = event.target.result;
                renderCard(); // Actualizamos la UI
                
                // Deseleccionamos cualquier avatar predeterminado
                const avatares = dom.avatarSelector.querySelectorAll('.avatar-option');
                avatares.forEach(img => {
                    img.classList.remove('selected');
                });
            };
            reader.readAsDataURL(file);
        }
        // Resetear el input para permitir subir la misma imagen nuevamente
        e.target.value = '';
    });
};

/**
 *  FUNCIÓN DE RENDERIZADO (Reactividad)
 */
const renderCard = () => {
    dom.previewName.textContent = state.cardData.name || 'Nombre Apellido';
    dom.previewBio.textContent = state.cardData.bio || 'La biografía aparecerá aquí...';
    dom.previewAvatar.src = state.cardData.avatarUrl;
    dom.previewHeader.style.backgroundColor = state.cardData.color;
    dom.inputName.value = state.cardData.name;
    dom.inputBio.value = state.cardData.bio;
    dom.inputColor.value = state.cardData.color;
    // Actualizar visualmente qué avatar está seleccionado en la cuadrícula
    const avatares = dom.avatarSelector.querySelectorAll('.avatar-option');
    avatares.forEach(img => {
        if (img.dataset.url === state.cardData.avatarUrl) {
            img.classList.add('selected');
        } else {
            img.classList.remove('selected');
        }
    });
};

/**
 * EVENTOS MANUALES
 */
const setupManualEvents = () => {
    dom.inputName.addEventListener('input', (e) => {
        state.cardData.name = e.target.value;
        renderCard(); 
    });

    dom.inputBio.addEventListener('input', (e) => {
        state.cardData.bio = e.target.value;
        renderCard();
    });

    dom.inputColor.addEventListener('input', (e) => {
        state.cardData.color = e.target.value;
        renderCard();
    });

    dom.form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
};

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 */
document.addEventListener('DOMContentLoaded', () => {
    initAvatarSelector(); // Inicializamos la cuadrícula de imágenes
    setupManualEvents();
    setupImageUpload(); // Configurar la subida de imágenes
    renderCard();
});