import React from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'

export const RegisterScreen = () => {
    const {
        sendRequest: sendRequestRegister,
        loading: registerLoading,
        error: registerError,
        response: registerResponse
    } = useRequest()

    const initial_form_state = {
        name: '',
        email: '',
        password: ''
    }

    function onSubmit(formData) {
        sendRequestRegister(
            () => register(formData.name, formData.email, formData.password)
        )
    }

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    //el registro no devuelve token, primero hay que verificar el mail
    //asi que en vez de redirigir muestro el mensaje de revisa tu correo
    if (registerResponse?.ok) {
        return (
            <div className="auth-container">
                <h1>¡Casi listo!</h1>
                <p>
                    Te enviamos un correo a <strong>{formState.email}</strong> con un enlace
                    para verificar tu cuenta. Revisá tu bandeja de entrada (y el spam) y
                    hacé clic en el enlace para activar tu cuenta.
                </p>
                <p>Una vez verificada, ya podés <Link to={'/login'}>iniciar sesión</Link>.</p>
            </div>
        )
    }

    return (
        <div className="auth-container">
            <h1>Crear cuenta</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        id='name'
                        name='name'
                        type='text'
                        value={formState.name}
                        onChange={handleChange}
                    />
                </div>
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
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={formState.password}
                        onChange={handleChange}
                    />
                </div>

                <button disabled={registerLoading}>
                    {
                        registerLoading
                            ? 'Creando cuenta...'
                            : 'Registrarme'
                    }
                </button>
                {
                    registerError && !registerLoading &&
                    <>
                        <br />
                        <span className="form-error">Error: {registerError}</span>
                    </>
                }
            </form>
            <p>¿Ya tenés cuenta? <Link to={'/login'}>Iniciá sesión</Link></p>
        </div>
    )
}
