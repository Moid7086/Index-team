import model from './model.js';

class Controller {
    constructor() {
        model.subscribe(this.onModelChange.bind(this));
    }

    onModelChange(state) {
        this.updateDOMGranular(state);
    }

    updateDOMGranular(state) {
        const likesElement = document.getElementById('likes-count');
        if (likesElement) {
            likesElement.textContent = state.likes;
        }
    }

    handleLikeClick() {
        model.incrementLikes();
    }

    renderView(route) {
        const content = document.getElementById('app-content');
        
        if (route === '#profile') {
            content.innerHTML = `
                <div class="card">
                    <h2>Perfil de Usuario</h2>
                    <p>Nombre registrado: <strong>${model.state.user}</strong></p>
                </div>
            `;
        } else {
            content.innerHTML = `
                <div class="card">
                    <h2>Bienvenido a Kinder Horseas</h2>
                    <p>Módulo interactivo con actualización reactiva.</p>
                    <p>Me Gustas: <span id="likes-count" style="font-weight:bold; color:#e74c3c;">${model.state.likes}</span></p>
                    <button id="like-btn">Dar "Me gusta"</button>
                </div>
            `;
            
            document.getElementById('like-btn').addEventListener('click', () => {
                this.handleLikeClick();
            });
        }
    }
}

export default new Controller();