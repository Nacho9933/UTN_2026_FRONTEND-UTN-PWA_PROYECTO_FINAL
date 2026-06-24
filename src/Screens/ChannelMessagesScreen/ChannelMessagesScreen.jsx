import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { getMessages, createMessage, updateMessage, deleteMessage } from '../../services/messageService'
import { AuthContext } from '../../context/AuthContext'

export const ChannelMessagesScreen = () => {
    const { workspace_id, channel_id } = useParams()
    const { userData } = useContext(AuthContext)

    //para saber que mensaje estoy editando y el texto del input de edicion
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

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

    //consulta para editar un mensaje
    const {
        sendRequest: sendRequestUpdate,
        response: updateResponse
    } = useRequest()

    //consulta para borrar un mensaje
    const {
        sendRequest: sendRequestDelete,
        response: deleteResponse
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

    //cuando se edita o se borra, vuelvo a pedir la lista
    useEffect(() => {
        if (updateResponse?.ok) {
            setEditingId(null)
            sendRequestMessages(() => getMessages(workspace_id, channel_id))
        }
    }, [updateResponse])

    useEffect(() => {
        if (deleteResponse?.ok) {
            sendRequestMessages(() => getMessages(workspace_id, channel_id))
        }
    }, [deleteResponse])

    function onSend(formData) {
        if (!formData.contenido.trim()) return
        sendRequestCreate(
            () => createMessage(workspace_id, channel_id, formData.contenido)
        )
    }

    //arranco a editar: guardo el id y precargo el texto actual
    function startEdit(msg) {
        setEditingId(msg._id)
        setEditText(msg.contenido)
    }

    function saveEdit(messageId) {
        if (!editText.trim()) return
        sendRequestUpdate(
            () => updateMessage(workspace_id, channel_id, messageId, editText)
        )
    }

    function onDelete(messageId) {
        if (!window.confirm('¿Seguro que querés borrar este mensaje?')) return
        sendRequestDelete(
            () => deleteMessage(workspace_id, channel_id, messageId)
        )
    }

    const { formState, handleChange, handleSubmit, setFormState } = useForm(
        { contenido: '' },
        onSend
    )

    const messages = messagesResponse?.data?.messages || []

    return (
        <div className="screen-container">
            <p><Link to={`/workspace/${workspace_id}`}>← Volver al espacio de trabajo</Link></p>

            <h1>Mensajes</h1>

            {/* lista de mensajes */}
            {messagesLoading && <p>Cargando mensajes...</p>}
            {messagesError && <p className="error-text">⚠️ {messagesError}</p>}
            {!messagesLoading && !messagesError && (
                <div className="messages-list">
                    {messages.length === 0 ? (
                        <p className="empty-text">Todavía no hay mensajes. ¡Escribí el primero!</p>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.fk_user_id?._id === userData?.id
                            return (
                                <div key={msg._id} className="message-item">
                                    <strong>{msg.fk_user_id?.nombre || 'Usuario'}</strong>
                                    {isMine && <span className="message-mine-badge"> (vos)</span>}
                                    <span className="message-date">
                                        {new Date(msg.fecha_creacion).toLocaleString()}
                                    </span>

                                    {/* si estoy editando este mensaje muestro el input, sino el texto */}
                                    {editingId === msg._id ? (
                                        <div className="message-edit-row">
                                            <input
                                                type='text'
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="message-edit-input"
                                            />
                                            <button onClick={() => saveEdit(msg._id)}>Guardar</button>
                                            <button onClick={() => setEditingId(null)}>Cancelar</button>
                                        </div>
                                    ) : (
                                        <div>{msg.contenido}</div>
                                    )}

                                    {/* solo muestro editar/borrar en mis mensajes */}
                                    {isMine && editingId !== msg._id && (
                                        <div className="message-actions">
                                            <button onClick={() => startEdit(msg)} className="btn-small">Editar</button>
                                            <button onClick={() => onDelete(msg._id)} className="btn-small btn-danger">Borrar</button>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* form para mandar mensaje */}
            <form onSubmit={handleSubmit} className="message-form">
                <input
                    name='contenido'
                    type='text'
                    placeholder='Escribí un mensaje...'
                    value={formState.contenido}
                    onChange={handleChange}
                    className="message-input"
                />
                <button disabled={createLoading}>
                    {createLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
            {createError && !createLoading && (
                <span className="form-error">Error: {createError}</span>
            )}
        </div>
    )
}
