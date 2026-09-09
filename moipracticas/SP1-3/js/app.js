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
 *  REFERENCIAS AL DOM
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
    uploadAvatar: document.getElementById('upload-avatar'),
    githubUsername: document.getElementById('github-username'),
    githubFetchBtn: document.getElementById('github-fetch-btn'),
    githubStatus: document.getElementById('github-status'),
};

/**
 * GENERADOR DEL SELECTOR DE AVATARES
 */
const initAvatarSelector = () => {
    const totalAvatares = 12;
    for (let i = 0; i < totalAvatares; i++) {
        const rutaImagen = `src/assets/Avatares${i}.png`;
        const img = document.createElement('img');
        img.src = rutaImagen;
        img.alt = `Avatar ${i}`;
        img.className = 'avatar-option';
        img.dataset.url = rutaImagen;

        img.addEventListener('click', () => {
            state.cardData.avatarUrl = rutaImagen;
            renderCard();
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
                state.cardData.avatarUrl = event.target.result;
                renderCard();
                // Deseleccionar avatares predeterminados
                const avatares = dom.avatarSelector.querySelectorAll('.avatar-option');
                avatares.forEach(img => img.classList.remove('selected'));
                // Limpiar estado de GitHub (si se sube imagen manual)
                dom.githubStatus.textContent = '';
                dom.githubStatus.className = 'github-status';
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    });
};

/**
 * OBTENER DATOS DE GITHUB
 */
const fetchGitHubUser = async (username) => {
    if (!username.trim()) {
        dom.githubStatus.textContent = 'Por favor, ingresa un nombre de usuario.';
        dom.githubStatus.className = 'github-status error';
        return;
    }

    dom.githubStatus.textContent = 'Buscando...';
    dom.githubStatus.className = 'github-status';

    try {
        const response = await fetch(`https://api.github.com/users/${username.trim()}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuario no encontrado en GitHub.');
            } else {
                throw new Error('Error al conectar con GitHub.');
            }
        }
        const data = await response.json();

        // Actualizar estado con los datos obtenidos
        state.cardData.name = data.name || data.login || '';
        state.cardData.bio = data.bio || '';
        state.cardData.avatarUrl = data.avatar_url || state.cardData.avatarUrl;

        // Actualizar los inputs manuales
        dom.inputName.value = state.cardData.name;
        dom.inputBio.value = state.cardData.bio;

        // Deseleccionar avatares predeterminados
        const avatares = dom.avatarSelector.querySelectorAll('.avatar-option');
        avatares.forEach(img => img.classList.remove('selected'));

        // Mensaje de éxito
        dom.githubStatus.textContent = `✅ Perfil de ${data.login} cargado correctamente.`;
        dom.githubStatus.className = 'github-status success';

        // Renderizar la tarjeta
        renderCard();

    } catch (error) {
        dom.githubStatus.textContent = `❌ ${error.message}`;
        dom.githubStatus.className = 'github-status error';
    }
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

    // Actualizar selección en la cuadrícula de avatares (solo para avatares locales)
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

    // Búsqueda en GitHub al hacer clic en el botón
    dom.githubFetchBtn.addEventListener('click', () => {
        fetchGitHubUser(dom.githubUsername.value);
    });

    // Búsqueda al presionar Enter en el campo de usuario
    dom.githubUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchGitHubUser(dom.githubUsername.value);
        }
    });
};

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 */
document.addEventListener('DOMContentLoaded', () => {
    initAvatarSelector();
    setupManualEvents();
    setupImageUpload();
    renderCard();
});