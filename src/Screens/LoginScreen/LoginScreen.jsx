import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../context/AuthContext'

export const LoginScreen = () => {
    const { login: syncroLogin } = useContext(AuthContext)
    const navigate = useNavigate()
    const {
        sendRequest: sendRequestLogin, 
        loading: loginRequestLoading,
        error: loginRequestError, 
        response: loginRequestResponse
    } = useRequest()
    
    const initial_form_state = {
        email: '',
        password: ''
    }

    function onSubmit (formData){
        console.log("un usuario intento iniciar sesion", formData)
        sendRequestLogin(
            () => login(formData.email, formData.password)
        )

    }

    console.log(
        {
            loginRequestLoading,
            loginRequestError,
            loginRequestResponse
        }
    )

    /* 
    controla la ejecucion de una funcionalidad
    */
    useEffect(
        () => {
            //si el login fue exitoso
            if(loginRequestResponse?.ok){
                syncroLogin(loginRequestResponse?.data?.access_token)
                navigate('/home')

            }
        },
        [
            loginRequestResponse //me interesa que mi efecto se ejecute CADA VEZ que cambie mi estado de respuesta
        ]
    )

    const {formState, handleChange, handleSubmit} = useForm(initial_form_state, onSubmit)


    return (
        <div>
            <h1>Iniciar sesion</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input id='email' name='email' type='email' value={formState.email} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input id='password' name='password' type='password' value={formState.password} onChange={handleChange}/>
                </div>

                <button disabled={loginRequestLoading || loginRequestResponse?.ok}>
                    {
                        loginRequestLoading 
                        ? 'Iniciando sesion...'
                        : 'Iniciar sesion'
                    }
                </button>
                {
                    loginRequestError && !loginRequestLoading &&
                    <>
                        <br/>
                        <span style={{color: 'red'}}>Error: {loginRequestError}</span>
                    </>
                }
            </form>
            <p>Si no tienes cuenta <Link to={'/register'}>Registrate</Link></p>
        </div>
    )
}
