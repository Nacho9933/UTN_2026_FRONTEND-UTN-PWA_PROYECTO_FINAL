import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById } from '../../services/workspaceService'
import { getChannels, createChannel } from '../../services/channelService'

export const WorkspaceDetailScreen = () => {
    const { workspace_id } = useParams()

    //consulta para la info del workspace
    const {
        sendRequest: sendRequestWorkspace,
        loading: workspaceLoading,
        error: workspaceError,
        response: workspaceResponse
    } = useRequest()

    //consulta para los canales
    const {
        sendRequest: sendRequestChannels,
        loading: channelsLoading,
        error: channelsError,
        response: channelsResponse
    } = useRequest()

    //consulta para crear un canal
    const {
        sendRequest: sendRequestCreateChannel,
        loading: createChannelLoading,
        error: createChannelError,
        response: createChannelResponse
    } = useRequest()

    //apenas entro pido el workspace y sus canales
    useEffect(() => {
        sendRequestWorkspace(() => getWorkspaceById(workspace_id))
        sendRequestChannels(() => getChannels(workspace_id))
    }, [workspace_id])

    //si se creo un canal vuelvo a pedir la lista
    useEffect(() => {
        if (createChannelResponse?.ok) {
            sendRequestChannels(() => getChannels(workspace_id))
        }
    }, [createChannelResponse])

    function onCreateChannel(formData) {
        sendRequestCreateChannel(
            () => createChannel(workspace_id, formData.nombre, formData.descripcion)
        )
    }

    const { formState, handleChange, handleSubmit } = useForm(
        { nombre: '', descripcion: '' },
        onCreateChannel
    )

    const workspace = workspaceResponse?.data?.workspace
    const channels = channelsResponse?.data?.channels || []

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <p><Link to={'/home'}>← Volver a mis espacios</Link></p>

            {/* info del workspace */}
            {workspaceLoading && <p>Cargando espacio de trabajo...</p>}
            {workspaceError && <p style={{ color: 'red' }}>⚠️ {workspaceError}</p>}
            {workspace && (
                <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '12px', marginBottom: '20px' }}>
                    <h1>{workspace.nombre}</h1>
                    <p>{workspace.descripcion || 'Sin descripción'}</p>
                </header>
            )}

            <h2>Canales</h2>

            {/* lista de canales */}
            {channelsLoading && <p>Cargando canales...</p>}
            {channelsError && <p style={{ color: 'red' }}>⚠️ {channelsError}</p>}
            {!channelsLoading && !channelsError && (
                channels.length === 0 ? (
                    <p>Todavía no hay canales. ¡Creá el primero!</p>
                ) : (
                    <ul>
                        {channels.map((channel) => (
                            <li key={channel._id}>
                                <Link to={`/workspace/${workspace_id}/channels/${channel._id}`}>
                                    <strong># {channel.nombre}</strong>
                                </Link>
                                {channel.descripcion && <span> — {channel.descripcion}</span>}
                            </li>
                        ))}
                    </ul>
                )
            )}

            {/* form para crear canal */}
            <form onSubmit={handleSubmit} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <h3>Nuevo canal</h3>
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
                <button disabled={createChannelLoading}>
                    {createChannelLoading ? 'Creando...' : 'Crear canal'}
                </button>
                {createChannelError && !createChannelLoading && (
                    <>
                        <br />
                        <span style={{ color: 'red' }}>Error: {createChannelError}</span>
                    </>
                )}
            </form>
        </div>
    )
}
