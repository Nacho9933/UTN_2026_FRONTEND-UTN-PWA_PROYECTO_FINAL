import ENVIRONMENT from '../config/environment';
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../context/AuthContext';

/**
 * Obtiene la lista de workspaces asociados al usuario autenticado.
 * @returns {Promise<Object>} Respuesta de la API con la lista de workspaces.
 */
export async function getWorkspaces() {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);
    
    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al obtener los espacios de trabajo");
    }

    return response;
}

/**
 * Crea un nuevo espacio de trabajo. El usuario autenticado queda como owner.
 * @param {string} nombre - Nombre del espacio de trabajo (obligatorio).
 * @param {string} descripcion - Descripción del espacio (opcional).
 * @returns {Promise<Object>} Respuesta de la API con el workspace creado.
 */
export async function createWorkspace(nombre, descripcion) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion
        })
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al crear el espacio de trabajo");
    }

    return response;
}
