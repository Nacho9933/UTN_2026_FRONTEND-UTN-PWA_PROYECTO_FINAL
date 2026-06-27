import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
    ChevronDown, Settings, Trash2, SquarePen, Search,
    MessagesSquare, Headphones, Send, Contact, Star, Hash, MessageCircle, LayoutGrid
} from 'lucide-react'
import { Button } from '../../ui/Button/Button'
import { createChannel, updateChannel, deleteChannel } from '../../../services/channelService'
import { updateWorkspace, deleteWorkspace } from '../../../services/workspaceService'
import styles from './Sidebar.module.css'

const ROLES = { OWNER: 'dueño', ADMIN: 'admin' }

//items de navegacion al estilo Slack — todavia decorativos (sin feature real detras)
const NAV_ITEMS = [
    { icon: MessagesSquare, label: 'Hilos de tus conversaciones' },
    { icon: Headphones, label: 'Juntas' },
    { icon: Send, label: 'Borradores y enviados' },
    { icon: Contact, label: 'Directorios' }
]

//color de avatar consistente por usuario (mismo hash que en los paneles)
function avatarColorIndex(id) {
    const texto = String(id || '')
    let hash = 0
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % 6
}

export const Sidebar = ({ workspace, channels, conversations = [], role, workspaceId, reloadChannels, reloadWorkspace, onClose }) => {
    const navigate = useNavigate()
    const [adding, setAdding] = useState(false)
    const [newName, setNewName] = useState('')
    const [query, setQuery] = useState('')
    const [channelsOpen, setChannelsOpen] = useState(true)
    const [dmsOpen, setDmsOpen] = useState(true)

    const canManageChannels = role === ROLES.OWNER || role === ROLES.ADMIN
    const canEditWorkspace = role === ROLES.OWNER || role === ROLES.ADMIN
    const canDeleteWorkspace = role === ROLES.OWNER

    async function handleCreateChannel(event) {
        event.preventDefault()
        if (!newName.trim()) return
        try {
            await createChannel(workspaceId, newName.trim(), '')
            setNewName('')
            setAdding(false)
            reloadChannels()
        } catch (err) {
            alert(err.message)
        }
    }

    async function handleRenameChannel(channel) {
        const nombre = window.prompt('Nuevo nombre del canal:', channel.nombre)
        if (!nombre || !nombre.trim()) return
        try {
            await updateChannel(workspaceId, channel._id, nombre.trim(), channel.descripcion || '')
            reloadChannels()
        } catch (err) {
            alert(err.message)
        }
    }

    async function handleDeleteChannel(channel) {
        if (!window.confirm(`¿Borrar el canal "${channel.nombre}"?`)) return
        try {
            await deleteChannel(workspaceId, channel._id)
            reloadChannels()
            navigate(`/workspace/${workspaceId}`)
        } catch (err) {
            alert(err.message)
        }
    }

    async function handleRenameWorkspace() {
        const nombre = window.prompt('Nuevo nombre del espacio:', workspace?.nombre)
        if (!nombre || !nombre.trim()) return
        try {
            await updateWorkspace(workspaceId, nombre.trim(), workspace?.descripcion || '')
            reloadWorkspace()
        } catch (err) {
            alert(err.message)
        }
    }

    async function handleDeleteWorkspace() {
        if (!window.confirm('¿Borrar este espacio de trabajo? No se puede deshacer.')) return
        try {
            await deleteWorkspace(workspaceId)
            navigate('/home')
        } catch (err) {
            alert(err.message)
        }
    }

    const filtered = channels.filter((c) => c.nombre.toLowerCase().includes(query.trim().toLowerCase()))

    return (
        <aside className={styles.sidebar}>
            {/* encabezado del workspace: nombre + chevron + acciones */}
            <div className={styles.wsHeader}>
                <button className={styles.wsNameBtn} onClick={canEditWorkspace ? handleRenameWorkspace : undefined} title={workspace?.nombre}>
                    <span className={styles.wsName}>{workspace?.nombre || '...'}</span>
                    <ChevronDown size={16} className={styles.chevron} />
                </button>
                <div className={styles.wsActions}>
                    {canDeleteWorkspace && (
                        <button onClick={handleDeleteWorkspace} title="Borrar espacio"><Trash2 size={16} /></button>
                    )}
                    {canEditWorkspace && (
                        <button onClick={handleRenameWorkspace} title="Renombrar espacio"><Settings size={17} /></button>
                    )}
                    {canManageChannels && (
                        <button onClick={() => setAdding((a) => !a)} title="Nuevo canal"><SquarePen size={16} /></button>
                    )}
                </div>
            </div>

            {/* buscador (filtra canales) */}
            <div className={styles.searchWrap}>
                <Search size={15} className={styles.searchIcon} />
                <input
                    className={styles.search}
                    placeholder="Buscar un canal..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className={styles.scroll}>
                {/* navegacion estilo Slack (decorativa por ahora) */}
                <nav className={styles.navList}>
                    {NAV_ITEMS.map(({ icon: Icon, label }) => (
                        <button key={label} className={styles.navItem} title="Próximamente">
                            <Icon size={18} className={styles.navIcon} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                {/* favoritos (decorativo) */}
                <div className={styles.group}>
                    <div className={styles.groupHeader}>
                        <Star size={16} className={styles.navIcon} />
                        <span className={styles.groupTitle}>Favoritos</span>
                    </div>
                    <p className={styles.groupHint}>Arrastrá y soltá información importante aquí</p>
                </div>

                {/* canales (real, colapsable + filtrable) */}
                <div className={styles.group}>
                    <button className={styles.groupHeader} onClick={() => setChannelsOpen((o) => !o)}>
                        <ChevronDown size={14} className={`${styles.groupChevron} ${channelsOpen ? '' : styles.collapsed}`} />
                        <Hash size={15} className={styles.navIcon} />
                        <span className={styles.groupTitle}>Canales</span>
                        <span className={styles.count}>{channels.length}</span>
                        {canManageChannels && (
                            <span
                                className={styles.addInline}
                                onClick={(e) => { e.stopPropagation(); setAdding((a) => !a) }}
                                title="Agregar canal"
                            >＋</span>
                        )}
                    </button>

                    {channelsOpen && (
                        <nav className={styles.channelList}>
                            {filtered.map((channel) => (
                                <div key={channel._id} className={styles.channelRow}>
                                    <NavLink
                                        to={`/workspace/${workspaceId}/channels/${channel._id}`}
                                        className={({ isActive }) => isActive ? `${styles.channel} ${styles.channelActive}` : styles.channel}
                                        onClick={onClose}
                                        title={channel.nombre}
                                    >
                                        <span className={styles.hash}>#</span>{channel.nombre}
                                    </NavLink>
                                    {canManageChannels && (
                                        <span className={styles.iconBtns}>
                                            <button onClick={() => handleRenameChannel(channel)} title="Renombrar">✏️</button>
                                            <button onClick={() => handleDeleteChannel(channel)} title="Borrar">🗑️</button>
                                        </span>
                                    )}
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <p className={styles.noChannels}>{query ? 'Sin resultados' : 'Sin canales todavía'}</p>
                            )}
                        </nav>
                    )}

                    {adding && (
                        <form onSubmit={handleCreateChannel} className={styles.addForm}>
                            <input
                                autoFocus
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="nombre-del-canal"
                                className={styles.addInput}
                            />
                            <Button size="sm" type="submit">Crear</Button>
                        </form>
                    )}
                </div>

                {/* mensajes directos (conversaciones reales) */}
                <div className={styles.group}>
                    <button className={styles.groupHeader} onClick={() => setDmsOpen((o) => !o)}>
                        <ChevronDown size={14} className={`${styles.groupChevron} ${dmsOpen ? '' : styles.collapsed}`} />
                        <MessageCircle size={15} className={styles.navIcon} />
                        <span className={styles.groupTitle}>Mensajes directos</span>
                    </button>

                    {dmsOpen && (
                        <nav className={styles.channelList}>
                            {conversations.map((conv) => {
                                const u = conv.usuario
                                const initial = (u?.nombre || 'U').charAt(0).toUpperCase()
                                const colorClass = styles['dmColor' + avatarColorIndex(u?._id)]
                                return (
                                    <NavLink
                                        key={u?._id}
                                        to={`/workspace/${workspaceId}/dm/${u?._id}`}
                                        state={{ name: u?.nombre, email: u?.email }}
                                        className={({ isActive }) => isActive ? `${styles.dmRow} ${styles.dmActive}` : styles.dmRow}
                                        onClick={onClose}
                                        title={u?.nombre}
                                    >
                                        <span className={`${styles.dmAvatar} ${colorClass}`}>{initial}</span>
                                        <span className={styles.dmName}>{u?.nombre}</span>
                                    </NavLink>
                                )
                            })}
                            {conversations.length === 0 && (
                                <p className={styles.groupHint}>Iniciá un mensaje directo desde la sección Miembros.</p>
                            )}
                        </nav>
                    )}
                </div>

                {/* aplicaciones (decorativo) */}
                <div className={styles.group}>
                    <div className={styles.groupHeader}>
                        <LayoutGrid size={15} className={styles.navIcon} />
                        <span className={styles.groupTitle}>Aplicaciones</span>
                    </div>
                    <div className={styles.appRow}>
                        <span className={styles.slackDot} />
                        Slack
                    </div>
                </div>
            </div>
        </aside>
    )
}
