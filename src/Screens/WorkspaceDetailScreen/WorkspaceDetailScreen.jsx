import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById, updateWorkspace, deleteWorkspace } from '../../services/workspaceService'
import { getChannels, createChannel, updateChannel, deleteChannel } from '../../services/channelService'

//roles tal cual los maneja el backend
const ROLES = {
    OWNER: 'dueño',
    ADMIN: 'admin',
    USER: 'usuario'
}

export const WorkspaceDetailScreen = () => {
    const { workspace_id } = useParams()
    const navigate = useNavigate()

    //estado para editar el workspace (nombre y descripcion)
    const [editingWorkspace, setEditingWorkspace] = useState(false)
    const [wsNombre, setWsNombre] = useState('')
    const [wsDescripcion, setWsDescripcion] = useState('')

    //estado para editar un canal (cual y con que valores)
    const [editingChannelId, setEditingChannelId] = useState(null)
    const [chNombre, setChNombre] = useState('')
    const [chDescripcion, setChDescripcion] = useState('')

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

    //consultas para editar/borrar workspace y canal
    const { sendRequest: sendRequestUpdateWs, response: updateWsResponse, error: updateWsError } = useRequest()
    const { sendRequest: sendRequestDeleteWs, response: deleteWsResponse, error: deleteWsError } = useRequest()
    const { sendRequest: sendRequestUpdateCh, response: updateChResponse } = useRequest()
    const { sendRequest: sendRequestDeleteCh, response: deleteChResponse } = useRequest()

    //apenas entro pido el workspace y sus canales
    useEffect(() => {
        sendRequestWorkspace(() => getWorkspaceById(workspace_id))
        sendRequestChannels(() => getChannels(workspace_id))
    }, [workspace_id])

    //si se creo o edito un canal vuelvo a pedir la lista
    useEffect(() => {
        if (createChannelResponse?.ok) {
            sendRequestChannels(() => getChannels(workspace_id))
        }
    }, [createChannelResponse])

    useEffect(() => {
        if (updateChResponse?.ok) {
            setEditingChannelId(null)
            sendRequestChannels(() => getChannels(workspace_id))
        }
    }, [updateChResponse])

    useEffect(() => {
        if (deleteChResponse?.ok) {
            sendRequestChannels(() => getChannels(workspace_id))
        }
    }, [deleteChResponse])

    //si edite el workspace, refresco su info y cierro el modo edicion
    useEffect(() => {
        if (updateWsResponse?.ok) {
            setEditingWorkspace(false)
            sendRequestWorkspace(() => getWorkspaceById(workspace_id))
        }
    }, [updateWsResponse])

    //si borre el workspace, vuelvo al home
    useEffect(() => {
        if (deleteWsResponse?.ok) {
            navigate('/home')
        }
    }, [deleteWsResponse])

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

    //mi rol en este workspace lo manda el backend, lo uso para decidir que botones mostrar
    const myRole = workspaceResponse?.data?.membership?.rol
    const canEditWorkspace = myRole === ROLES.ADMIN || myRole === ROLES.OWNER
    const canDeleteWorkspace = myRole === ROLES.OWNER //borrar workspace es solo del dueño
    const canManageChannels = myRole === ROLES.ADMIN || myRole === ROLES.OWNER

    //arranco a editar el workspace: precargo los valores actuales
    function startEditWorkspace() {
        setWsNombre(workspace.nombre)
        setWsDescripcion(workspace.descripcion || '')
        setEditingWorkspace(true)
    }

    function saveWorkspace() {
        if (!wsNombre.trim()) return
        sendRequestUpdateWs(() => updateWorkspace(workspace_id, wsNombre, wsDescripcion))
    }

    function onDeleteWorkspace() {
        if (!window.confirm('¿Seguro que querés borrar este espacio de trabajo? Esta acción no se puede deshacer.')) return
        sendRequestDeleteWs(() => deleteWorkspace(workspace_id))
    }

    //arranco a editar un canal
    function startEditChannel(channel) {
        setEditingChannelId(channel._id)
        setChNombre(channel.nombre)
        setChDescripcion(channel.descripcion || '')
    }

    function saveChannel(channelId) {
        if (!chNombre.trim()) return
        sendRequestUpdateCh(() => updateChannel(workspace_id, channelId, chNombre, chDescripcion))
    }

    function onDeleteChannel(channelId) {
        if (!window.confirm('¿Seguro que querés borrar este canal?')) return
        sendRequestDeleteCh(() => deleteChannel(workspace_id, channelId))
    }

    return (
        <div className="screen-container">
            <p><Link to={'/home'}>← Volver a mis espacios</Link></p>

            {/* info del workspace */}
            {workspaceLoading && <p>Cargando espacio de trabajo...</p>}
            {workspaceError && <p className="error-text">⚠️ {workspaceError}</p>}
            {workspace && (
                <header className="workspace-header">
                    {editingWorkspace ? (
                        <div>
                            <input
                                type='text'
                                value={wsNombre}
                                onChange={(e) => setWsNombre(e.target.value)}
                                placeholder='Nombre'
                                className="workspace-edit-input"
                            />
                            <input
                                type='text'
                                value={wsDescripcion}
                                onChange={(e) => setWsDescripcion(e.target.value)}
                                placeholder='Descripción'
                                className="workspace-edit-input"
                            />
                            <button onClick={saveWorkspace}>Guardar</button>
                            <button onClick={() => setEditingWorkspace(false)} className="btn-cancel">Cancelar</button>
                            {updateWsError && <span className="form-error">{updateWsError}</span>}
                        </div>
                    ) : (
                        <div>
                            <h1>{workspace.nombre}</h1>
                            <p>{workspace.descripcion || 'Sin descripción'}</p>
                            {canEditWorkspace && <button onClick={startEditWorkspace}>Editar espacio</button>}
                            {canDeleteWorkspace && <button onClick={onDeleteWorkspace} className="btn-danger">Borrar espacio</button>}
                            {deleteWsError && <span className="form-error">{deleteWsError}</span>}
                        </div>
                    )}
                </header>
            )}

            <p><Link to={`/workspace/${workspace_id}/members`}>👥 Ver miembros</Link></p>

            <h2>Canales</h2>

            {/* lista de canales */}
            {channelsLoading && <p>Cargando canales...</p>}
            {channelsError && <p className="error-text">⚠️ {channelsError}</p>}
            {!channelsLoading && !channelsError && (
                channels.length === 0 ? (
                    <p>Todavía no hay canales. ¡Creá el primero!</p>
                ) : (
                    <ul>
                        {channels.map((channel) => (
                            <li key={channel._id} className="channel-item">
                                {editingChannelId === channel._id ? (
                                    <span className="channel-edit-row">
                                        <input
                                            type='text'
                                            value={chNombre}
                                            onChange={(e) => setChNombre(e.target.value)}
                                            className="channel-edit-input"
                                        />
                                        <input
                                            type='text'
                                            value={chDescripcion}
                                            onChange={(e) => setChDescripcion(e.target.value)}
                                            placeholder='Descripción'
                                            className="channel-edit-input"
                                        />
                                        <button onClick={() => saveChannel(channel._id)}>Guardar</button>
                                        <button onClick={() => setEditingChannelId(null)}>Cancelar</button>
                                    </span>
                                ) : (
                                    <span>
                                        <Link to={`/workspace/${workspace_id}/channels/${channel._id}`}>
                                            <strong># {channel.nombre}</strong>
                                        </Link>
                                        {channel.descripcion && <span> — {channel.descripcion}</span>}
                                        {canManageChannels && <button onClick={() => startEditChannel(channel)} className="btn-small btn-subtle">Editar</button>}
                                        {canManageChannels && <button onClick={() => onDeleteChannel(channel._id)} className="btn-small btn-danger">Borrar</button>}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )
            )}

            {/* form para crear canal */}
            <form onSubmit={handleSubmit} className="new-channel-form">
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
                        <span className="form-error">Error: {createChannelError}</span>
                    </>
                )}
            </form>
        </div>
    )
}
