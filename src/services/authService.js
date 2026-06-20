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

export async function register(email, password, username) {

    const response_http = await fetch(
        ENVIRONMENT.URL_API + '/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(
            {
                email: email,
                password: password,
                username: username
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