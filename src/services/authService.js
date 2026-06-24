import ENVIRONMENT from '../config/environment'
export async function login(email, password) {

    const response_http = await fetch(
        ENVIRONMENT.URL_API + '/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(
            {
                email: email,
                password: password
            }
        )
    }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new Error(response.message)
    }
    return response


}

export async function register(name, email, password) {

    const response_http = await fetch(
        ENVIRONMENT.URL_API + '/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(
            {
                name: name,
                email: email,
                password: password
            }
        )
    }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new Error(response.message)
    }
    return response

}

//pide el mail de restablecimiento (le manda el link al correo)
export async function resetPasswordRequest(email) {

    const response_http = await fetch(
        ENVIRONMENT.URL_API + '/api/auth/reset-password-request', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(
            {
                email: email
            }
        )
    }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new Error(response.message)
    }
    return response

}

//confirma el cambio de contraseña usando el token que vino en el link del mail
export async function resetPasswordConfirm(token, newPassword) {

    const response_http = await fetch(
        ENVIRONMENT.URL_API + '/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
            {
                newPassword: newPassword
            }
        )
    }
    )
    const response = await response_http.json()
    if (!response.ok) {
        throw new Error(response.message)
    }
    return response

}