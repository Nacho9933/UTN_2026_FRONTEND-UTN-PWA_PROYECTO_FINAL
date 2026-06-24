import React, { useContext, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { getMessages, createMessage } from '../../services/messageService'
import { AuthContext } from '../../context/AuthContext'

export const ChannelMessagesScreen = () => {
    const { workspace_id, channel_id } = useParams()
    const { userData } = useContext(AuthContext)

    //consulta para traer los mensajes
    const {
        sendRequest: sendRequestMessages,
        loading: messagesLoading,
        error: messagesError,
        response: messagesResponse
    } = useRequest()

    //consulta para mandar un mensaje
    const {
        sendRequest: sendRequestCreate,
        loading: createLoading,
        error: createError,
        response: createResponse
    } = useRequest()

    //apenas entro pido los mensajes del canal
    useEffect(() => {
        sendRequestMessages(() => getMessages(workspace_id, channel_id))
    }, [workspace_id, channel_id])

    //si se mando, refresco la lista y limpio el input
    useEffect(() => {
        if (createResponse?.ok) {
            sendRequestMessages(() => getMessages(workspace_id, channel_id))
            setFormState({ contenido: '' })
        }
    }, [createResponse])

    function onSend(formData) {
        if (!formData.contenido.trim()) return
        sendRequestCreate(
            () => createMessage(workspace_id, channel_id, formData.contenido)
        )
    }

    const { formState, handleChange, handleSubmit, setFormState } = useForm(
        { contenido: '' },
        onSend
    )

    const messages = messagesResponse?.data?.messages || []

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <p><Link to={`/workspace/${workspace_id}`}>← Volver al espacio de trabajo</Link></p>

            <h1>Mensajes</h1>

            {/* lista de mensajes */}
            {messagesLoading && <p>Cargando mensajes...</p>}
            {messagesError && <p style={{ color: 'red' }}>⚠️ {messagesError}</p>}
            {!messagesLoading && !messagesError && (
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '12px', minHeight: '200px', marginBottom: '16px' }}>
                    {messages.length === 0 ? (
                        <p style={{ color: '#888' }}>Todavía no hay mensajes. ¡Escribí el primero!</p>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.fk_user_id?._id === userData?.id
                            return (
                                <div key={msg._id} style={{ marginBottom: '10px' }}>
                                    <strong>{msg.fk_user_id?.nombre || 'Usuario'}</strong>
                                    {isMine && <span style={{ color: '#4a90d9' }}> (vos)</span>}
                                    <span style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>
                                        {new Date(msg.fecha_creacion).toLocaleString()}
                                    </span>
                                    <div>{msg.contenido}</div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* form para mandar mensaje */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                    name='contenido'
                    type='text'
                    placeholder='Escribí un mensaje...'
                    value={formState.contenido}
                    onChange={handleChange}
                    style={{ flex: 1, padding: '8px' }}
                />
                <button disabled={createLoading}>
                    {createLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            {createError && !createLoading && (
                <span style={{ color: 'red' }}>Error: {createError}</span>
            )}
        </div>
    )
}
