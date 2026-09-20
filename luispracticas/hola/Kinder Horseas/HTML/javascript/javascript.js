/* =========================================
   NAVEGACIÓN BASADA EN HASH (#)
   ========================================= */
import controller from './controller.js';

// Función para cambiar módulos de la página sin recargar
function router() {
    // Obtiene el hash actual de la URL. Si no hay, redirige por defecto a #home
    let hash = window.location.hash || '#home';
    
    // Le pide al controlador renderizar la interfaz gráfica según el hash
    controller.renderView(hash);
}

// Escucha del modelo de eventos de navegador para detectar el cambio de hash
window.addEventListener('hashchange', router);

// Ejecuta el router al cargar la aplicación web por primera vez
window.addEventListener('DOMContentLoaded', router);