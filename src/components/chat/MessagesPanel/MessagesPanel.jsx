import { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useOutletContext } from 'react-router'
import {
    Hash, ChevronDown, UserPlus, Headphones, Search, MoreVertical,
    MessageSquareText, Plus,
    Bold, Italic, Strikethrough, Link2, List, ListOrdered, TextQuote, Code, Code2,
    AtSign, Smile, Paperclip, Mic, Video, SendHorizontal,
    UsersRound, LayoutTemplate, Blocks
} from 'lucide-react'
import useForm from '../../../hooks/useForm'
import useRequest from '../../../hooks/useRequest'
import useLiveMessages from '../../../hooks/useLiveMessages'
import { getMessages, createMessage, updateMessage, deleteMessage } from '../../../services/messageService'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../ui/Button/Button'
import { Loader } from '../../ui/Loader/Loader'
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import styles from './MessagesPanel.module.css'

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

//color de avatar consistente por usuario (hash del id -> indice de color)
function avatarColorIndex(id) {
    const texto = String(id || '')
    let hash = 0
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % 6
}

//tarjetas de onboarding decorativas (replica visual de Slack)
const ONBOARDING_CARDS = [
    { icon: UsersRound, cls: 'cardPink', title: 'Invita socios externos', text: 'Agregá clientes y colaboradores' },
    { icon: LayoutTemplate, cls: 'cardAmber', title: 'Comienza con una plantilla', text: 'Explorá las plantillas del canal' },
    { icon: Blocks, cls: 'cardBlue', title: 'Conecta tus aplicaciones', text: 'Traé tu trabajo a Slack' }
]

export const MessagesPanel = () => {
    const { workspace_id, channel_id } = useParams()
    const { channels } = useOutletContext()
    const { userData } = useContext(AuthContext)

    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

    const bottomRef = useRef(null)
    const composerRef = useRef(null)

    const {
        messages,
        loading: messagesLoading,
        error: messagesError,
        refresh: refreshMessages
    } = useLiveMessages(() => getMessages(workspace_id, channel_id), [workspace_id, channel_id])
    const { sendRequest: sendRequestCreate, loading: createLoading, error: createError, response: createResponse } = useRequest()
    const { sendRequest: sendRequestUpdate, response: updateResponse } = useRequest()
    const { sendRequest: sendRequestDelete, response: deleteResponse } = useRequest()

    //al entrar o cambiar de canal enfoco el input (los mensajes los trae useLiveMessages)
    useEffect(() => {
        composerRef.current?.focus()
    }, [workspace_id, channel_id])

    useEffect(() => {
        if (createResponse?.ok) {
            refreshMessages()
            setFormState({ contenido: '' })
        }
    }, [createResponse])

    useEffect(() => {
        if (updateResponse?.ok) {
            setEditingId(null)
            refreshMessages()
        }
    }, [updateResponse])

    useEffect(() => {
        if (deleteResponse?.ok) {
            refreshMessages()
        }
    }, [deleteResponse])

    //cuando cambia la cantidad de mensajes, bajo el scroll al ultimo
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length])

    function onSend(formData) {
        if (!formData.contenido.trim()) return
        sendRequestCreate(() => createMessage(workspace_id, channel_id, formData.contenido))
    }

    function startEdit(msg) {
        setEditingId(msg._id)
        setEditText(msg.contenido)
    }

    function saveEdit(messageId) {
        if (!editText.trim()) return
        sendRequestUpdate(() => updateMessage(workspace_id, channel_id, messageId, editText))
    }

    function onDelete(messageId) {
        if (!window.confirm('¿Seguro que querés borrar este mensaje?')) return
        sendRequestDelete(() => deleteMessage(workspace_id, channel_id, messageId))
    }

    const { formState, handleChange, handleSubmit, setFormState } = useForm({ contenido: '' }, onSend)

    const channel = channels.find((c) => c._id === channel_id)
    const channelName = channel?.nombre || 'canal'
    const firstName = (userData?.nombre || '').split(' ')[0] || 'de nuevo'
    const canSend = formState.contenido.trim().length > 0

    useDocumentTitle(channel ? `#${channel.nombre}` : 'Canal')

    return (
        <div className={styles.panel}>
            {/* ===== encabezado del canal ===== */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <button className={styles.chTitle} title={channelName}>
                        <Hash size={17} className={styles.chHash} />
                        <span className={styles.chName}>{channelName}</span>
                        <ChevronDown size={15} className={styles.chChevron} />
                    </button>
                    <div className={styles.headerActions}>
                        <button className={styles.inviteBtn} title="Próximamente">
                            <UserPlus size={15} />
                            <span>Invitar</span>
                        </button>
                        <button className={styles.iconBtn} title="Próximamente"><Headphones size={17} /></button>
                        <button className={styles.iconBtn} title="Próximamente"><Search size={17} /></button>
                        <button className={styles.iconBtn} title="Próximamente"><MoreVertical size={17} /></button>
                    </div>
                </div>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.tabActive}`}>
                        <MessageSquareText size={14} /> Mensajes
                    </button>
                    <button className={styles.tab} title="Próximamente">
                        <Plus size={14} /> Agregar canvas
                    </button>
                </div>
            </header>

            {/* ===== zona de mensajes ===== */}
            <div className={styles.messages}>
                {messagesLoading && <Loader text="Cargando mensajes..." />}
                {messagesError && <p className="error-text">⚠️ {messagesError}</p>}

                {!messagesLoading && !messagesError && (
                    <>
                        {/* hero de bienvenida (comienzo del canal) */}
                        <div className={styles.welcome}>
                            <div className={styles.wave}>👋</div>
                            <h1 className={styles.welcomeTitle}>
                                ¡Te damos la bienvenida al canal <span className={styles.wHash}>#</span>{channelName}, {firstName}!
                            </h1>
                            <p className={styles.welcomeText}>
                                Los canales mantienen el trabajo centrado en un tema específico. Conservá acá todos
                                los mensajes y archivos relacionados para que cualquiera del equipo pueda acceder.
                            </p>

                            {messages.length === 0 && (
                                <div className={styles.cards}>
                                    {ONBOARDING_CARDS.map((card) => {
                                        const Icon = card.icon
                                        return (
                                            <button key={card.title} className={`${styles.card} ${styles[card.cls]}`} title="Próximamente">
                                                <div className={styles.cardIcon}><Icon size={20} /></div>
                                                <div className={styles.cardBody}>
                                                    <h3>{card.title}</h3>
                                                    <p>{card.text}</p>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* canal vacio: divisor "Hoy" + linea de sistema */}
                        {messages.length === 0 && (
                            <>
                                <div className={styles.dateDivider}><span>Hoy</span></div>
                                <div className={styles.systemLine}>
                                    <span className={styles.systemDot} />
                                    <span>
                                        <strong>{userData?.nombre || 'Vos'}</strong> se unió a{' '}
                                        <span className={styles.sHash}>#</span>{channelName}.
                                    </span>
                                </div>
                            </>
                        )}

                        {messages.map((msg, index) => {
                            const isMine = msg.fk_user_id?._id === userData?.id
                            const initial = (msg.fk_user_id?.nombre || 'U').charAt(0).toUpperCase()

                            const prev = messages[index - 1]
                            const sameDay = prev && new Date(msg.fecha_creacion).toDateString() === new Date(prev.fecha_creacion).toDateString()
                            const showDateDivider = index === 0 || !sameDay

                            //agrupo si el anterior es del mismo autor, dentro de 5 min y mismo dia
                            const sameAuthor = prev && prev.fk_user_id?._id === msg.fk_user_id?._id
                            const within5min = prev && (new Date(msg.fecha_creacion) - new Date(prev.fecha_creacion)) < 5 * 60 * 1000
                            const grouped = sameAuthor && within5min && sameDay

                            const colorClass = styles['avatarColor' + avatarColorIndex(msg.fk_user_id?._id)]

                            return (
                                <Fragment key={msg._id}>
                                    {showDateDivider && (
                                        <div className={styles.dateDivider}><span>{formatDateDivider(msg.fecha_creacion)}</span></div>
                                    )}

                                    <div className={`${styles.message} ${grouped ? styles.grouped : ''}`}>
                                        {grouped ? (
                                            <span className={styles.timeGutter}>{formatTimeShort(msg.fecha_creacion)}</span>
                                        ) : (
                                            <div className={`${styles.avatar} ${colorClass}`}>{initial}</div>
                                        )}

                                        <div className={styles.body}>
                                            {!grouped && (
                                                <div className={styles.meta}>
                                                    <strong className={styles.author}>{msg.fk_user_id?.nombre || 'Usuario'}</strong>
                                                    {isMine && <span className={styles.youBadge}>vos</span>}
                                                    <span className={styles.date}>{formatTime(msg.fecha_creacion)}</span>
                                                </div>
                                            )}

                                            {editingId === msg._id ? (
                                                <div className={styles.editRow}>
                                                    <input
                                                        type='text'
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className={styles.editInput}
                                                    />
                                                    <Button size="sm" onClick={() => saveEdit(msg._id)}>Guardar</Button>
                                                    <Button size="sm" variant="cancel" onClick={() => setEditingId(null)}>Cancelar</Button>
                                                </div>
                                            ) : (
                                                <p className={styles.text}>{msg.contenido}</p>
                                            )}

                                            {isMine && editingId !== msg._id && (
                                                <div className={styles.actions}>
                                                    <Button size="sm" variant="subtle" onClick={() => startEdit(msg)}>Editar</Button>
                                                    <Button size="sm" variant="danger" onClick={() => onDelete(msg._id)}>Borrar</Button>
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

            {/* ===== composer enriquecido ===== */}
            <form onSubmit={handleSubmit} className={styles.composerForm}>
                <div className={styles.composerBox}>
                    <div className={styles.formatBar}>
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><Bold size={15} /></button>
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><Italic size={15} /></button>
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><Strikethrough size={15} /></button>
                        <span className={styles.fmtSep} />
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><Link2 size={15} /></button>
                        <span className={styles.fmtSep} />
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><List size={15} /></button>
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><ListOrdered size={15} /></button>
                        <span className={styles.fmtSep} />
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><TextQuote size={15} /></button>
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><Code size={15} /></button>
                        <button type="button" className={styles.fmtBtn} title="Próximamente"><Code2 size={15} /></button>
                    </div>

                    <input
                        ref={composerRef}
                        name='contenido'
                        type='text'
                        placeholder={`Enviar un mensaje a #${channelName}`}
                        value={formState.contenido}
                        onChange={handleChange}
                        className={styles.composerInput}
                    />

                    <div className={styles.composerActions}>
                        <div className={styles.composerLeft}>
                            <button type="button" className={styles.fmtBtn} title="Próximamente"><Plus size={18} /></button>
                            <button type="button" className={styles.fmtBtn} title="Próximamente"><Smile size={17} /></button>
                            <button type="button" className={styles.fmtBtn} title="Próximamente"><AtSign size={17} /></button>
                            <button type="button" className={styles.fmtBtn} title="Próximamente"><Paperclip size={17} /></button>
                            <button type="button" className={styles.fmtBtn} title="Próximamente"><Mic size={17} /></button>
                            <button type="button" className={styles.fmtBtn} title="Próximamente"><Video size={17} /></button>
                        </div>
                        <button type="submit" className={`${styles.sendBtn} ${canSend ? styles.sendActive : ''}`} disabled={createLoading || !canSend}>
                            <SendHorizontal size={16} />
                        </button>
                    </div>
                </div>
                {createError && !createLoading && <span className="form-error">{createError}</span>}
            </form>
        </div>
    )
}
