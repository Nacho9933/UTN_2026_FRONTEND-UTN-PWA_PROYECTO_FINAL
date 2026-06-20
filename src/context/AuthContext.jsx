import { jwtDecode } from "jwt-decode"
import { createContext, useEffect, useState } from "react"


export const AuthContext = createContext({
    isLogged: false,
    userData: null,
    login: () => { },
    logout: () => { }
})

export const AUTH_TOKEN_LOCALSTORAGE_KEY = 'auth_token'


export const AuthContextProvider = ({ children }) => {

    const auth_token = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
    const [isLogged, setIsLogged] = useState(Boolean(auth_token))
    const [userData, setUserData] = useState(null)

    function login(auth_token) {
        localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, auth_token)
        setIsLogged(true)
    }

    function logout() {
        localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
        setIsLogged(false)
        setUserData(false)
    }

    function loadUserSession() {
        if (auth_token) {
            const payload = jwtDecode(auth_token)
            setUserData({
                email: payload.email,
                fecha_creacion: payload.fecha_creacion,
                id: payload.id,
                nombre: payload.nombre
            })
        }
    }

    useEffect(
        () => {
            loadUserSession()
        },
        [auth_token]
    )

    const providerValues = {
        isLogged,
        userData,
        login,
        logout
    }
    return (
        <AuthContext.Provider value={
            providerValues
        }>
            {children}
        </AuthContext.Provider>
    )
}