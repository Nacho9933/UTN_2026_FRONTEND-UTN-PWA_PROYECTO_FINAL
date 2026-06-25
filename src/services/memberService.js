import ENVIRONMENT from '../config/environment';
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../context/AuthContext';

//trae los miembros aceptados de un workspace
export async function getMembers(workspaceId) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/members`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al obtener los miembros");
    }

    return response;
}

//invita a un usuario por email (le manda un mail para aceptar o rechazar)
export async function inviteMember(workspaceId, invitedEmail, role) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/members`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            invited_email: invitedEmail,
            role: role
        })
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al invitar al usuario");
    }

    return response;
}

//cambia el rol de un miembro (admin o usuario)
export async function updateMemberRole(workspaceId, memberId, role) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            role: role
        })
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al cambiar el rol");
    }

    return response;
}

//expulsa a un miembro del workspace
export async function removeMember(workspaceId, memberId) {
    const token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY);

    if (!token) {
        throw new Error("No hay un token de sesión activo");
    }

    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const response = await response_http.json();

    if (!response.ok) {
        throw new Error(response.message || "Error al expulsar al miembro");
    }

    return response;
}
