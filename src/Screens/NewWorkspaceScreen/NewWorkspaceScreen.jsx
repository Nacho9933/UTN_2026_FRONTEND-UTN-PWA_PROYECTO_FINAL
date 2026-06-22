import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { createWorkspace } from '../../services/workspaceService'
import { WorkspacesContext } from '../../context/WorkspacesContext'

export const NewWorkspaceScreen = () => {
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

    // Al crear con éxito: refrescamos la lista compartida y volvemos al Home.
    useEffect(() => {
        if (createResponse?.ok) {
            refetch()
            navigate('/home')
        }
    }, [createResponse])

    return (
        <div>
            <h1>Nuevo espacio de trabajo</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        id='nombre'
                        name='nombre'
                        type='text'
                        value={formState.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción (opcional):</label>
                    <input
                        id='descripcion'
                        name='descripcion'
                        type='text'
                        value={formState.descripcion}
                        onChange={handleChange}
                    />
                </div>

                <button disabled={createLoading}>
                    {
                        createLoading
                            ? 'Creando...'
                            : 'Crear espacio'
                    }
                </button>
                {
                    createError && !createLoading &&
                    <>
                        <br />
                        <span style={{ color: 'red' }}>Error: {createError}</span>
                    </>
                }
            </form>
            <p><Link to={'/home'}>Volver al inicio</Link></p>
        </div>
    )
}
