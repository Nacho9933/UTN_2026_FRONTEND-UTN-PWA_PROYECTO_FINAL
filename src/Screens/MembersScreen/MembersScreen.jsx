import React, { useContext, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { getMembers, inviteMember, updateMemberRole, removeMember } from '../../services/memberService'
import { AuthContext } from '../../context/AuthContext'

//roles tal cual los maneja el backend
const ROLES = {
    OWNER: 'dueño',
    ADMIN: 'admin',
    USER: 'usuario'
}

export const MembersScreen = () => {
    const { workspace_id } = useParams()
    const { userData } = useContext(AuthContext)

    //consulta para traer los miembros
    const {
        sendRequest: sendRequestMembers,
        loading: membersLoading,
        error: membersError,
        response: membersResponse
    } = useRequest()

    //consulta para invitar
    const {
        sendRequest: sendRequestInvite,
        loading: inviteLoading,
        error: inviteError,
        response: inviteResponse
    } = useRequest()

    //consultas para cambiar rol y expulsar
    const { sendRequest: sendRequestRole, response: roleResponse } = useRequest()
    const { sendRequest: sendRequestRemove, response: removeResponse } = useRequest()

    //apenas entro pido los miembros
    useEffect(() => {
        sendRequestMembers(() => getMembers(workspace_id))
    }, [workspace_id])

    //si invite, cambie un rol o expulse a alguien, refresco la lista
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

    function onChangeRole(memberId, role) {
        sendRequestRole(() => updateMemberRole(workspace_id, memberId, role))
    }

    function onRemove(memberId) {
        if (!window.confirm('¿Seguro que querés expulsar a este miembro?')) return
        sendRequestRemove(() => removeMember(workspace_id, memberId))
    }

    const { formState, handleChange, handleSubmit, setFormState } = useForm(
        { email: '', role: ROLES.USER },
        onInvite
    )

    const members = membersResponse?.data?.members || []

    //busco mi membresia para saber mi rol y decidir si puedo administrar
    const myMembership = members.find((m) => m.user_id === userData?.id)
    const canManage = myMembership?.member_rol === ROLES.OWNER || myMembership?.member_rol === ROLES.ADMIN

    return (
        <div className="screen-container">
            <p><Link to={`/workspace/${workspace_id}`}>← Volver al espacio de trabajo</Link></p>

            <h1>Miembros</h1>

            {/* lista de miembros */}
            {membersLoading && <p>Cargando miembros...</p>}
            {membersError && <p className="error-text">⚠️ {membersError}</p>}
            {!membersLoading && !membersError && (
                <ul className="members-list">
                    {members.map((member) => {
                        const isMe = member.user_id === userData?.id
                        const isOwner = member.member_rol === ROLES.OWNER
                        return (
                            <li key={member.member_id} className="member-item">
                                <strong>{member.user_nombre}</strong>
                                {isMe && <span className="member-me-badge"> (vos)</span>}
                                <span className="member-email"> — {member.user_email}</span>
                                <span className="member-role"> [{member.member_rol}]</span>

                                {/* solo dueño/admin pueden tocar a otros (no al dueño ni a si mismos) */}
                                {canManage && !isOwner && !isMe && (
                                    <span className="member-actions">
                                        <select
                                            value={member.member_rol}
                                            onChange={(e) => onChangeRole(member.member_id, e.target.value)}
                                        >
                                            <option value={ROLES.USER}>usuario</option>
                                            <option value={ROLES.ADMIN}>admin</option>
                                        </select>
                                        <button onClick={() => onRemove(member.member_id)} className="btn-small btn-danger">Expulsar</button>
                                    </span>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}

            {/* form para invitar, solo si puedo administrar */}
            {canManage && (
                <form onSubmit={handleSubmit} className="invite-form">
                    <h3>Invitar a alguien</h3>
                    <p className="invite-hint">El usuario tiene que estar registrado. Le llega un mail para aceptar la invitación.</p>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            id='email'
                            name='email'
                            type='email'
                            value={formState.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="role">Rol:</label>
                        <select id='role' name='role' value={formState.role} onChange={handleChange}>
                            <option value={ROLES.USER}>usuario</option>
                            <option value={ROLES.ADMIN}>admin</option>
                        </select>
                    </div>
                    <button disabled={inviteLoading}>
                        {inviteLoading ? 'Enviando...' : 'Enviar invitación'}
                    </button>
                    {inviteError && !inviteLoading && (
                        <>
                            <br />
                            <span className="form-error">Error: {inviteError}</span>
                        </>
                    )}
                    {inviteResponse?.ok && (
                        <>
                            <br />
                            <span className="invite-success">{inviteResponse.message}</span>
                        </>
                    )}
                </form>
            )}
        </div>
    )
}
