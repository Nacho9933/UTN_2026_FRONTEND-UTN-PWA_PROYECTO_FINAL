import ENVIRONMENT from '../config/environment';
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../context/AuthContext';

//trae los mensajes de un canal (vienen paginados y en orden cronologico)
export async function getMessages(workspaceId, channelId, page = 1, limit = 20) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels/${channelId}/messages?page=${page}&limit=${limit}`;

    const response_http = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al obtener los mensajes");
    }

    return response;
}

//manda un mensaje al canal
export async function createMessage(workspaceId, channelId, contenido) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels/${channelId}/messages`;

    const response_http = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contenido: contenido
        })
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al enviar el mensaje");
    }

    return response;
}

//edita un mensaje (solo el autor o un admin)
export async function updateMessage(workspaceId, channelId, messageId, contenido) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels/${channelId}/messages/${messageId}`;

    const response_http = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contenido: contenido
        })
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al editar el mensaje");
    }

    return response;
}

//borra un mensaje (solo el autor o un admin)
export async function deleteMessage(workspaceId, channelId, messageId) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/channels/${channelId}/messages/${messageId}`;

    const response_http = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al borrar el mensaje");
    }

    return response;
}
