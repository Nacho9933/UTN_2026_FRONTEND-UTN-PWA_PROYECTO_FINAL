import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useOutletContext, useLocation } from 'react-router'
import {
    Phone, Video, Search, MoreVertical,
    Bold, Italic, Strikethrough, Link2, List, ListOrdered, TextQuote, Code, Code2,
    AtSign, Smile, Paperclip, Mic, SendHorizontal, Plus
} from 'lucide-react'
import useForm from '../../../hooks/useForm'
import useRequest from '../../../hooks/useRequest'
import { getConversation, sendDirectMessage, updateDirectMessage, deleteDirectMessage } from '../../../services/directMessageService'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../ui/Button/Button'
import { Loader } from '../../ui/Loader/Loader'
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import msg from '../MessagesPanel/MessagesPanel.module.css'
import styles from './DMPanel.module.css'

//fecha completa y legible para el encabezado de cada mensaje
function formatTime(dateStr) {
    const date = new Date(dateStr)
    const esHoy = new Date().toDateString() === date.toDateString()
    const hora = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    if (esHoy) return `hoy a las ${hora}`
    return `${date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })} a las ${hora}`
}

//solo la hora, para los mensajes agrupados
function formatTimeShort(dateStr) {
    return new Date(dateStr).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

//texto del separador de dia: Hoy / Ayer / 15 de junio
function formatDateDivider(dateStr) {
    const date = new Date(dateStr)
    const hoy = new Date()
    const ayer = new Date()
    ayer.setDate(hoy.getDate() - 1)
    if (date.toDateString() === hoy.toDateString()) return 'Hoy'
    if (date.toDateString() === ayer.toDateString()) return 'Ayer'
    const opts = { day: 'numeric', month: 'long' }
    if (date.getFullYear() !== hoy.getFullYear()) opts.year = 'numeric'
    return date.toLocaleDateString('es-AR', opts)
}

//color de avatar consistente por usuario (mismo hash que en MessagesPanel)
function avatarColorIndex(id) {
    const texto = String(id || '')
    let hash = 0
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % 6
}

export const DMPanel = () => {
    const { user_id } = useParams()
    const { conversations, reloadConversations } = useOutletContext()
    const { userData } = useContext(AuthContext)
    const location = useLocation()

    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

    const bottomRef = useRef(null)
    const composerRef = useRef(null)

    const {
        sendRequest: sendRequestMessages,
        loading: messagesLoading,
        error: messagesError,
        response: messagesResponse
    } = useRequest()
    const { sendRequest: sendRequestCreate, loading: createLoading, error: createError, response: createResponse } = useRequest()
    const { sendRequest: sendRequestUpdate, response: updateResponse } = useRequest()
    const { sendRequest: sendRequestDelete, response: deleteResponse } = useRequest()

    //al entrar o cambiar de conversacion pido los mensajes y enfoco el input
    useEffect(() => {
        sendRequestMessages(() => getConversation(user_id))
        composerRef.current?.focus()
    }, [user_id])

    useEffect(() => {
        if (createResponse?.ok) {
            sendRequestMessages(() => getConversation(user_id))
            reloadConversations?.()
            setFormState({ contenido: '' })
        }
    }, [createResponse])

    useEffect(() => {
        if (updateResponse?.ok) {
            setEditingId(null)
            sendRequestMessages(() => getConversation(user_id))
        }
    }, [updateResponse])

    useEffect(() => {
        if (deleteResponse?.ok) {
            sendRequestMessages(() => getConversation(user_id))
            reloadConversations?.()
        }
    }, [deleteResponse])

    const messages = messagesResponse?.data?.messages || []

    //cuando cambia la cantidad de mensajes, bajo el scroll al ultimo
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    function onSend(formData) {
        if (!formData.contenido.trim()) return
        sendRequestCreate(() => sendDirectMessage(user_id, formData.contenido))
    }

    function startEdit(m) {
        setEditingId(m._id)
        setEditText(m.contenido)
    }

    function saveEdit(messageId) {
        if (!editText.trim()) return
        sendRequestUpdate(() => updateDirectMessage(messageId, editText))
    }

    function onDelete(messageId) {
        if (!window.confirm('¿Seguro que querés borrar este mensaje?')) return
        sendRequestDelete(() => deleteDirectMessage(messageId))
    }

    const { formState, handleChange, handleSubmit, setFormState } = useForm({ contenido: '' }, onSend)

    //resuelvo el otro usuario: 1) lista de conversaciones  2) state de navegacion  3) algun mensaje suyo
    const fromConv = conversations?.find((c) => c.usuario?._id === user_id)?.usuario
    const fromState = location.state
    const fromMsg = messages.find((m) => m.fk_sender_id?._id === user_id)?.fk_sender_id
    const otherName = fromConv?.nombre || fromState?.name || fromMsg?.nombre || 'Mensaje directo'
    const otherEmail = fromConv?.email || fromState?.email || fromMsg?.email || ''
    const otherInitial = otherName.charAt(0).toUpperCase()
    const otherColor = msg['avatarColor' + avatarColorIndex(user_id)]
    const firstName = otherName.split(' ')[0]
    const canSend = formState.contenido.trim().length > 0

    useDocumentTitle(otherName !== 'Mensaje directo' ? otherName : 'Mensaje directo')

    return (
        <div className={msg.panel}>
            {/* ===== encabezado del DM (usuario) ===== */}
            <header className={styles.header}>
                <div className={styles.headerUser}>
                    <div className={`${styles.headerAvatar} ${otherColor}`}>
                        {otherInitial}
                        <span className={styles.presenceDot} />
                    </div>
                    <div className={styles.userMeta}>
                        <span className={styles.userName}>{otherName}</span>
                        {otherEmail && <span className={styles.userEmail}>{otherEmail}</span>}
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.iconBtn} title="Próximamente"><Phone size={17} /></button>
                    <button className={styles.iconBtn} title="Próximamente"><Video size={17} /></button>
                    <button className={styles.iconBtn} title="Próximamente"><Search size={17} /></button>
                    <button className={styles.iconBtn} title="Próximamente"><MoreVertical size={17} /></button>
                </div>
            </header>

            {/* ===== zona de mensajes ===== */}
            <div className={msg.messages}>
                {messagesLoading && <Loader text="Cargando mensajes..." />}
                {messagesError && <p className="error-text">⚠️ {messagesError}</p>}

                {!messagesLoading && !messagesError && (
                    <>
                        {/* hero de bienvenida (comienzo de la conversacion) */}
                        <div className={msg.welcome}>
                            <div className={`${styles.welcomeAvatar} ${otherColor}`}>{otherInitial}</div>
                            <h1 className={msg.welcomeTitle}>{otherName}</h1>
                            <p className={msg.welcomeText}>
                                Este es el comienzo de tu conversación directa con <strong>{firstName}</strong>.
                                Solo ustedes dos pueden ver estos mensajes.
                            </p>
                        </div>

                        {messages.length === 0 && (
                            <div className={msg.dateDivider}><span>Hoy</span></div>
                        )}

                        {messages.map((m, index) => {
                            const isMine = m.fk_sender_id?._id === userData?.id
                            const senderName = m.fk_sender_id?.nombre || (isMine ? userData?.nombre : otherName) || 'Usuario'
                            const initial = senderName.charAt(0).toUpperCase()

                            const prev = messages[index - 1]
                            const sameDay = prev && new Date(m.fecha_creacion).toDateString() === new Date(prev.fecha_creacion).toDateString()
                            const showDateDivider = index === 0 || !sameDay

                            //agrupo si el anterior es del mismo autor, dentro de 5 min y mismo dia
                            const sameAuthor = prev && prev.fk_sender_id?._id === m.fk_sender_id?._id
                            const within5min = prev && (new Date(m.fecha_creacion) - new Date(prev.fecha_creacion)) < 5 * 60 * 1000
                            const grouped = sameAuthor && within5min && sameDay

                            const colorClass = msg['avatarColor' + avatarColorIndex(m.fk_sender_id?._id)]

                            return (
                                <Fragment key={m._id}>
                                    {showDateDivider && (
                                        <div className={msg.dateDivider}><span>{formatDateDivider(m.fecha_creacion)}</span></div>
                                    )}

                                    <div className={`${msg.message} ${grouped ? msg.grouped : ''}`}>
                                        {grouped ? (
                                            <span className={msg.timeGutter}>{formatTimeShort(m.fecha_creacion)}</span>
                                        ) : (
                                            <div className={`${msg.avatar} ${colorClass}`}>{initial}</div>
                                        )}

                                        <div className={msg.body}>
                                            {!grouped && (
                                                <div className={msg.meta}>
                                                    <strong className={msg.author}>{senderName}</strong>
                                                    {isMine && <span className={msg.youBadge}>vos</span>}
                                                    <span className={msg.date}>{formatTime(m.fecha_creacion)}</span>
                                                </div>
                                            )}

                                            {editingId === m._id ? (
                                                <div className={msg.editRow}>
                                                    <input
                                                        type='text'
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className={msg.editInput}
                                                    />
                                                    <Button size="sm" onClick={() => saveEdit(m._id)}>Guardar</Button>
                                                    <Button size="sm" variant="cancel" onClick={() => setEditingId(null)}>Cancelar</Button>
                                                </div>
                                            ) : (
                                                <p className={msg.text}>{m.contenido}</p>
                                            )}

                                            {isMine && editingId !== m._id && (
                                                <div className={msg.actions}>
                                                    <Button size="sm" variant="subtle" onClick={() => startEdit(m)}>Editar</Button>
                                                    <Button size="sm" variant="danger" onClick={() => onDelete(m._id)}>Borrar</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Fragment>
                            )
                        })}
                    </>
                )}
                <div ref={bottomRef} />
            </div>

            {/* ===== composer enriquecido (reutiliza estilos de MessagesPanel) ===== */}
            <form onSubmit={handleSubmit} className={msg.composerForm}>
                <div className={msg.composerBox}>
                    <div className={msg.formatBar}>
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><Bold size={15} /></button>
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><Italic size={15} /></button>
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><Strikethrough size={15} /></button>
                        <span className={msg.fmtSep} />
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><Link2 size={15} /></button>
                        <span className={msg.fmtSep} />
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><List size={15} /></button>
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><ListOrdered size={15} /></button>
                        <span className={msg.fmtSep} />
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><TextQuote size={15} /></button>
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><Code size={15} /></button>
                        <button type="button" className={msg.fmtBtn} title="Próximamente"><Code2 size={15} /></button>
                    </div>

                    <input
                        ref={composerRef}
                        name='contenido'
                        type='text'
                        placeholder={`Enviar un mensaje a ${firstName}`}
                        value={formState.contenido}
                        onChange={handleChange}
                        className={msg.composerInput}
                    />

                    <div className={msg.composerActions}>
                        <div className={msg.composerLeft}>
                            <button type="button" className={msg.fmtBtn} title="Próximamente"><Plus size={18} /></button>
                            <button type="button" className={msg.fmtBtn} title="Próximamente"><Smile size={17} /></button>
                            <button type="button" className={msg.fmtBtn} title="Próximamente"><AtSign size={17} /></button>
                            <button type="button" className={msg.fmtBtn} title="Próximamente"><Paperclip size={17} /></button>
                            <button type="button" className={msg.fmtBtn} title="Próximamente"><Mic size={17} /></button>
                        </div>
                        <button type="submit" className={`${msg.sendBtn} ${canSend ? msg.sendActive : ''}`} disabled={createLoading || !canSend}>
                            <SendHorizontal size={16} />
                        </button>
                    </div>
                </div>
                {createError && !createLoading && <span className="form-error">{createError}</span>}
            </form>
        </div>
    )
}
