import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { createWorkspace } from '../../services/workspaceService'
import { WorkspacesContext } from '../../context/WorkspacesContext'
import { FormField } from '../../components/ui/FormField/FormField'
import { Button } from '../../components/ui/Button/Button'
import styles from './NewWorkspaceScreen.module.css'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export const NewWorkspaceScreen = () => {
    useDocumentTitle('Nuevo espacio')
    const navigate = useNavigate()
    const { refetch } = useContext(WorkspacesContext)
    const {
        sendRequest: sendRequestCreate,
        loading: createLoading,
        error: createError,
        response: createResponse
    } = useRequest()

    const initial_form_state = {
        nombre: '',
        descripcion: ''
    }

    function onSubmit(formData) {
        sendRequestCreate(
            () => createWorkspace(formData.nombre, formData.descripcion)
        )
    }

    const { formState, handleChange, handleSubmit } = useForm(initial_form_state, onSubmit)

    //si se creo bien, refresco la lista y vuelvo al home
    useEffect(() => {
        if (createResponse?.ok) {
            refetch()
            navigate('/home')
        }
    }, [createResponse])

    return (
        <div className={styles.container}>
            <h1>Nuevo espacio de trabajo</h1>
            <p className={styles.subtitle}>Creá un espacio para tu equipo o proyecto.</p>

            <form onSubmit={handleSubmit}>
                <FormField label="Nombre:" id="nombre" name="nombre" type="text" value={formState.nombre} onChange={handleChange} />
                <FormField label="Descripción (opcional):" id="descripcion" name="descripcion" type="text" value={formState.descripcion} onChange={handleChange} />

                <Button disabled={createLoading}>
                    {createLoading ? 'Creando...' : 'Crear espacio'}
                </Button>
                {createError && !createLoading && (
                    <span className="form-error">Error: {createError}</span>
                )}
            </form>
            <Link to={'/home'} className={styles.back}>← Volver al inicio</Link>
        </div>
    )
}
