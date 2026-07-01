import { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import { FormField } from '../../components/ui/FormField/FormField'
import { Button } from '../../components/ui/Button/Button'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export const RegisterScreen = () => {
    useDocumentTitle('Crear cuenta')
    const {
        sendRequest: sendRequestRegister,
        loading: registerLoading,
        error: registerError,
        response: registerResponse
    } = useRequest()

    const [matchError, setMatchError] = useState('')

    const initial_form_state = {
        name: '',
        email: '',
        password: '',
        password2: ''
    }

    function onSubmit(formData) {
        //valido que las dos contraseñas coincidan antes de mandar al backend
        if (formData.password !== formData.password2) {
            setMatchError('Las contraseñas no coinciden')
            return
        }
        setMatchError('')
        sendRequestRegister(
            () => register(formData.name, formData.email, formData.password)
        )
    }

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    //el registro no devuelve token, primero hay que verificar el mail
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
                <FormField label="Nombre:" id="name" name="name" type="text" value={formState.name} onChange={handleChange} />
                <FormField label="Email:" id="email" name="email" type="email" value={formState.email} onChange={handleChange} />
                <FormField label="Contraseña:" id="password" name="password" type="password" value={formState.password} onChange={handleChange} withToggle />
                <FormField
                    label="Repetir contraseña:"
                    id="password2"
                    name="password2"
                    type="password"
                    value={formState.password2}
                    onChange={(e) => { handleChange(e); if (matchError) setMatchError('') }}
                    withToggle
                    error={matchError}
                />

                <Button disabled={registerLoading}>
                    {registerLoading ? 'Creando cuenta...' : 'Registrarme'}
                </Button>
                {registerError && !registerLoading && (
                    <span className="form-error">Error: {registerError}</span>
                )}
            </form>
            <p>¿Ya tenés cuenta? <Link to={'/login'}>Iniciá sesión</Link></p>
        </div>
    )
}
