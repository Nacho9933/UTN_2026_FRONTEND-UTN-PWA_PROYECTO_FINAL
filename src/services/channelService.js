import ENVIRONMENT from '../config/environment';
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../context/AuthContext';

//trae los canales de un workspace
export async function getChannels(workspaceId) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al obtener los canales");
    }

    return response;
}

//crea un canal dentro del workspace
export async function createChannel(workspaceId, nombre, descripcion) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels`, {
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
        throw new Error(response.message || "Error al crear el canal");
    }

    return response;
}

//edita el nombre o la descripcion de un canal (admin u owner)
export async function updateChannel(workspaceId, channelId, nombre, descripcion) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels/${channelId}`, {
        method: 'PUT',
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
        throw new Error(response.message || "Error al editar el canal");
    }

    return response;
}

//borra un canal (admin u owner)
export async function deleteChannel(workspaceId, channelId) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels/${channelId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al borrar el canal");
    }

    return response;
}
