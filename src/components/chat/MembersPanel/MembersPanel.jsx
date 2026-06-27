import { useContext, useEffect, useState } from 'react'
import { useParams, useOutletContext, useNavigate } from 'react-router'
import { Users, Search, UserPlus, ShieldCheck, Crown, MessageSquare } from 'lucide-react'
import useForm from '../../../hooks/useForm'
import useRequest from '../../../hooks/useRequest'
import { getMembers, inviteMember, updateMemberRole, removeMember } from '../../../services/memberService'
import { AuthContext } from '../../../context/AuthContext'
import { Button } from '../../ui/Button/Button'
import { Loader } from '../../ui/Loader/Loader'
import { EmptyState } from '../../ui/EmptyState/EmptyState'
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import styles from './MembersPanel.module.css'

const ROLES = { OWNER: 'dueño', ADMIN: 'admin', USER: 'usuario' }

//color de avatar consistente por usuario (mismo hash que en MessagesPanel)
function avatarColorIndex(id) {
    const texto = String(id || '')
    let hash = 0
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % 6
}

//clase del badge segun el rol
const roleClasses = {
    [ROLES.OWNER]: 'roleOwner',
    [ROLES.ADMIN]: 'roleAdmin',
    [ROLES.USER]: 'roleUser'
}

export const MembersPanel = () => {
    useDocumentTitle('Miembros')
    const { workspace_id } = useParams()
    const { role } = useOutletContext()
    const { userData } = useContext(AuthContext)
    const navigate = useNavigate()

    const [query, setQuery] = useState('')

    const {
        sendRequest: sendRequestMembers,
        loading: membersLoading,
        error: membersError,
        response: membersResponse
    } = useRequest()
    const { sendRequest: sendRequestInvite, loading: inviteLoading, error: inviteError, response: inviteResponse } = useRequest()
    const { sendRequest: sendRequestRole, response: roleResponse } = useRequest()
    const { sendRequest: sendRequestRemove, response: removeResponse } = useRequest()

    useEffect(() => {
        sendRequestMembers(() => getMembers(workspace_id))
    }, [workspace_id])

    //si invite, cambie rol o expulse, refresco la lista
    useEffect(() => {
        if (inviteResponse?.ok || roleResponse?.ok || removeResponse?.ok) {
            sendRequestMembers(() => getMembers(workspace_id))
        }
    }, [inviteResponse, roleResponse, removeResponse])

    function onInvite(formData) {
        if (!formData.email.trim()) return
        sendRequestInvite(() => inviteMember(workspace_id, formData.email, formData.role))
        setFormState({ email: '', role: ROLES.USER })
    }

    function onChangeRole(memberId, newRole) {
        sendRequestRole(() => updateMemberRole(workspace_id, memberId, newRole))
    }

    function onRemove(memberId) {
        if (!window.confirm('¿Seguro que querés expulsar a este miembro?')) return
        sendRequestRemove(() => removeMember(workspace_id, memberId))
    }

    //abre (o crea) un mensaje directo con ese miembro, pasando su nombre por state
    function startDM(member) {
        navigate(`/workspace/${workspace_id}/dm/${member.user_id}`, {
            state: { name: member.user_nombre, email: member.user_email }
        })
    }

    const { formState, handleChange, handleSubmit, setFormState } = useForm({ email: '', role: ROLES.USER }, onInvite)

    const members = membersResponse?.data?.members || []
    const canManage = role === ROLES.OWNER || role === ROLES.ADMIN

    const filtered = members.filter((m) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (m.user_nombre || '').toLowerCase().includes(q) || (m.user_email || '').toLowerCase().includes(q)
    })

    return (
        <div className={styles.panel}>
            {/* ===== encabezado estilo Slack ===== */}
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.titleWrap}>
                        <Users size={18} className={styles.titleIcon} />
                        <h2 className={styles.title}>Miembros</h2>
                        {!membersLoading && !membersError && (
                            <span className={styles.countPill}>{members.length}</span>
                        )}
                    </div>
                </div>
                <div className={styles.searchWrap}>
                    <Search size={15} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.search}
                        placeholder="Buscar miembro por nombre o email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className={styles.content}>
                {membersLoading && <Loader text="Cargando miembros..." />}
                {membersError && (
                    <EmptyState
                        variant="error"
                        icon={<Users size={28} />}
                        title="No pudimos cargar los miembros"
                        description={membersError}
                        actionLabel="Reintentar"
                        onAction={() => sendRequestMembers(() => getMembers(workspace_id))}
                    />
                )}

                {!membersLoading && !membersError && (
                    filtered.length === 0 ? (
                        <EmptyState
                            icon={<Users size={28} />}
                            title={query ? 'Sin resultados' : 'Todavía no hay miembros'}
                            description={query ? `Nadie coincide con "${query}".` : 'Invitá a alguien para empezar a colaborar.'}
                        />
                    ) : (
                        <ul className={styles.list}>
                            {filtered.map((member) => {
                                const isMe = member.user_id === userData?.id
                                const isOwner = member.member_rol === ROLES.OWNER
                                const isAdmin = member.member_rol === ROLES.ADMIN
                                const initial = (member.user_nombre || 'U').charAt(0).toUpperCase()
                                const colorClass = styles['avatarColor' + avatarColorIndex(member.user_id)]
                                const RoleIcon = isOwner ? Crown : isAdmin ? ShieldCheck : null
                                return (
                                    <li key={member.member_id} className={styles.item}>
                                        <div className={`${styles.avatar} ${colorClass}`}>{initial}</div>
                                        <div className={styles.info}>
                                            <div className={styles.nameRow}>
                                                <strong className={styles.name}>{member.user_nombre}</strong>
                                                {isMe && <span className={styles.youBadge}>vos</span>}
                                                <span className={`${styles.role} ${styles[roleClasses[member.member_rol]] || ''}`}>
                                                    {RoleIcon && <RoleIcon size={11} />}
                                                    {member.member_rol}
                                                </span>
                                            </div>
                                            <span className={styles.email}>{member.user_email}</span>
                                        </div>

                                        {!isMe && (
                                            <div className={styles.actions}>
                                                <Button size="sm" variant="subtle" className={styles.msgBtn} onClick={() => startDM(member)}>
                                                    <MessageSquare size={14} /> Mensaje
                                                </Button>
                                                {canManage && !isOwner && (
                                                    <>
                                                        <select
                                                            value={member.member_rol}
                                                            onChange={(e) => onChangeRole(member.member_id, e.target.value)}
                                                        >
                                                            <option value={ROLES.USER}>usuario</option>
                                                            <option value={ROLES.ADMIN}>admin</option>
                                                        </select>
                                                        <Button size="sm" variant="danger" onClick={() => onRemove(member.member_id)}>Expulsar</Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    )
                )}

                {canManage && (
                    <form onSubmit={handleSubmit} className={styles.inviteForm}>
                        <h3 className={styles.inviteTitle}><UserPlus size={17} /> Invitar a alguien</h3>
                        <p className={styles.hint}>El usuario tiene que estar registrado. Le llega un mail para aceptar la invitación.</p>
                        <div className={styles.inviteRow}>
                            <input
                                id='email'
                                name='email'
                                type='email'
                                placeholder='email@ejemplo.com'
                                value={formState.email}
                                onChange={handleChange}
                                className={styles.inviteInput}
                            />
                            <select id='role' name='role' value={formState.role} onChange={handleChange}>
                                <option value={ROLES.USER}>usuario</option>
                                <option value={ROLES.ADMIN}>admin</option>
                            </select>
                            <Button disabled={inviteLoading}>{inviteLoading ? 'Enviando...' : 'Invitar'}</Button>
                        </div>
                        {inviteError && !inviteLoading && <span className="form-error">{inviteError}</span>}
                        {inviteResponse?.ok && <span className="invite-success">{inviteResponse.message}</span>}
                    </form>
                )}
            </div>
        </div>
    )
}
