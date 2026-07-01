import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { resetPasswordConfirm } from '../../services/authService'
import { FormField } from '../../components/ui/FormField/FormField'
import { Button } from '../../components/ui/Button/Button'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export const ResetPasswordScreen = () => {
    useDocumentTitle('Restablecer contraseña')
    const [searchParams] = useSearchParams()
    //el backend manda el link con ?reset_password_token=...
    const token = searchParams.get('reset_password_token')

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
            <div className="auth-container">
                <h1>¡Contraseña actualizada!</h1>
                <p>Ya podés <Link to={'/login'}>iniciar sesión</Link> con tu nueva contraseña.</p>
            </div>
        )
    }

    return (
        <div className="auth-container">
            <h1>Restablecer contraseña</h1>

            <form onSubmit={onSubmit}>
                <FormField label="Nueva contraseña:" id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} withToggle />
                <FormField label="Repetir contraseña:" id="repeatPassword" name="repeatPassword" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} withToggle />

                <Button disabled={confirmLoading}>
                    {confirmLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </Button>
                {validationError && <span className="form-error">{validationError}</span>}
                {confirmError && !confirmLoading && <span className="form-error">Error: {confirmError}</span>}
            </form>
        </div>
    )
}
