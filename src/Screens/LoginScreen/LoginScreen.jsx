import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import { login } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import { AuthContext } from '../../context/AuthContext'
import { FormField } from '../../components/ui/FormField/FormField'
import { Button } from '../../components/ui/Button/Button'

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

    function onSubmit(formData) {
        sendRequestLogin(
            () => login(formData.email, formData.password)
        )
    }

    //si el login fue exitoso, sincronizo el token y voy al home
    useEffect(() => {
        if (loginRequestResponse?.ok) {
            syncroLogin(loginRequestResponse?.data?.access_token)
            navigate('/home')
        }
    }, [loginRequestResponse])

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    return (
        <div className="auth-container">
            <h1>Iniciar sesion</h1>

            <form onSubmit={handleSubmit}>
                <FormField
                    label="Email:"
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                />
                <FormField
                    label="Contraseña:"
                    id="password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                />

                <Button disabled={loginRequestLoading || loginRequestResponse?.ok}>
                    {loginRequestLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
                </Button>
                {loginRequestError && !loginRequestLoading && (
                    <span className="form-error">Error: {loginRequestError}</span>
                )}
            </form>
            <p>Si no tienes cuenta <Link to={'/register'}>Registrate</Link></p>
            <p><Link to={'/forgot-password'}>¿Olvidaste tu contraseña?</Link></p>
        </div>
    )
}
