import React from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { resetPasswordRequest } from '../../services/authService'

export const ForgotPasswordScreen = () => {
    const {
        sendRequest: sendRequestReset,
        loading: resetLoading,
        error: resetError,
        response: resetResponse
    } = useRequest()

    function onSubmit(formData) {
        sendRequestReset(() => resetPasswordRequest(formData.email))
    }

    const { formState, handleChange, handleSubmit } = useForm({ email: '' }, onSubmit)

    //si salio bien muestro un mensaje generico (no digo si el mail existe o no)
    if (resetResponse?.ok) {
        return (
            <div>
                <h1>Revisá tu correo</h1>
                <p>
                    Si tenés una cuenta asociada a ese email, te enviamos un enlace para
                    restablecer tu contraseña. Revisá tu bandeja de entrada (y el spam).
                </p>
                <p><Link to={'/login'}>Volver al login</Link></p>
            </div>
        )
    }

    return (
        <div>
            <h1>¿Olvidaste tu contraseña?</h1>
            <p>Ingresá tu email y te mandamos un enlace para restablecerla.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        value={formState.email}
                        onChange={handleChange}
                    />
                </div>

                <button disabled={resetLoading}>
                    {resetLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>
                {resetError && !resetLoading && (
                    <>
                        <br />
                        <span className="form-error">Error: {resetError}</span>
                    </>
                )}
            </form>
            <p><Link to={'/login'}>Volver al login</Link></p>
        </div>
    )
}
