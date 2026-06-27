import ENVIRONMENT from '../config/environment';
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../context/AuthContext';

//lista las conversaciones del usuario (un item por persona con la que hablo, con el ultimo mensaje)
export async function getConversations() {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/direct-messages/conversations`;

    const response_http = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al obtener las conversaciones");
    }

    return response;
}

//trae la conversacion con otro usuario (mensajes paginados y en orden cronologico)
export async function getConversation(userId, page = 1, limit = 20) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/direct-messages/${userId}?page=${page}&limit=${limit}`;

    const response_http = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al obtener la conversación");
    }

    return response;
}

//envia un mensaje directo a otro usuario
export async function sendDirectMessage(userId, contenido) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/direct-messages/${userId}`;

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

//edita un mensaje directo (solo el autor)
export async function updateDirectMessage(messageId, contenido) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/direct-messages/${messageId}`;

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

//borra un mensaje directo (solo el autor)
export async function deleteDirectMessage(messageId) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const url = `${ENVIRONMENT.URL_API}/api/direct-messages/${messageId}`;

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
