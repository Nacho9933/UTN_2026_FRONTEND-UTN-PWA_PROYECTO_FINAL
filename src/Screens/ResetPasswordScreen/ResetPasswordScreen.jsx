import React, { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { resetPasswordConfirm } from '../../services/authService'

export const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams()
    //el backend manda el link con ?token=...
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [validationError, setValidationError] = useState(null)

    const {
        sendRequest: sendRequestConfirm,
        loading: confirmLoading,
        error: confirmError,
        response: confirmResponse
    } = useRequest()

    //si no hay token en la url no tiene sentido estar aca
    if (!token) {
        return <Navigate to={'/login'} />
    }

    function onSubmit(event) {
        event.preventDefault()
        setValidationError(null)

        if (password.length < 6) {
            setValidationError('La contraseña debe tener al menos 6 caracteres')
            return
        }
        if (password !== repeatPassword) {
            setValidationError('Las contraseñas no coinciden')
            return
        }

        sendRequestConfirm(() => resetPasswordConfirm(token, password))
    }

    //si salio bien aviso y mando al login
    if (confirmResponse?.ok) {
        return (
            <div>
                <h1>¡Contraseña actualizada!</h1>
                <p>Ya podés <Link to={'/login'}>iniciar sesión</Link> con tu nueva contraseña.</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Restablecer contraseña</h1>

            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="password">Nueva contraseña:</label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="repeatPassword">Repetir contraseña:</label>
                    <input
                        id='repeatPassword'
                        name='repeatPassword'
                        type='password'
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                </div>

                <button disabled={confirmLoading}>
                    {confirmLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>

                {validationError && (
                    <>
                        <br />
                        <span className="form-error">{validationError}</span>
                    </>
                )}
                {confirmError && !confirmLoading && (
                    <>
                        <br />
                        <span className="form-error">Error: {confirmError}</span>
                    </>
                )}
            </form>
        </div>
    )
}
