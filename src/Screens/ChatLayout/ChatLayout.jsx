import { useEffect, useState } from 'react'
import { Outlet, Navigate, Link, useParams, useOutletContext } from 'react-router'
import useRequest from '../../hooks/useRequest'
import { getWorkspaceById } from '../../services/workspaceService'
import { getChannels } from '../../services/channelService'
import { getConversations } from '../../services/directMessageService'
import { IconRail } from '../../components/chat/IconRail/IconRail'
import { Sidebar } from '../../components/chat/Sidebar/Sidebar'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import styles from './ChatLayout.module.css'

export const ChatLayout = () => {
    const { workspace_id } = useParams()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const { sendRequest: reqWorkspace, response: workspaceResponse, error: workspaceError } = useRequest()
    const { sendRequest: reqChannels, response: channelsResponse } = useRequest()
    const { sendRequest: reqConversations, response: conversationsResponse } = useRequest()

    useEffect(() => {
        reqWorkspace(() => getWorkspaceById(workspace_id))
        reqChannels(() => getChannels(workspace_id))
        reqConversations(() => getConversations())
    }, [workspace_id])

    function reloadChannels() {
        reqChannels(() => getChannels(workspace_id))
    }
    function reloadWorkspace() {
        reqWorkspace(() => getWorkspaceById(workspace_id))
    }
    function reloadConversations() {
        reqConversations(() => getConversations())
    }

    const workspace = workspaceResponse?.data?.workspace
    const role = workspaceResponse?.data?.membership?.rol
    const channels = channelsResponse?.data?.channels || []
    const conversations = conversationsResponse?.data?.conversations || []

    if (workspaceError) {
        return (
            <div className={styles.errorState}>
                <div className={styles.emptyIcon}>🚫</div>
                <h2>No pudiste acceder a este espacio</h2>
                <p>{workspaceError}</p>
                <p><Link to={'/home'}>← Volver a mis espacios</Link></p>
            </div>
        )
    }

    return (
        <div className={styles.layout}>
            {/* wrapper del sidebar: icon rail + canal panel, se mueven juntos en mobile */}
            <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <IconRail
                    workspace={workspace}
                    workspaceId={workspace_id}
                    role={role}
                />
                <Sidebar
                    workspace={workspace}
                    channels={channels}
                    conversations={conversations}
                    role={role}
                    workspaceId={workspace_id}
                    reloadChannels={reloadChannels}
                    reloadWorkspace={reloadWorkspace}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

            <main className={styles.main}>
                <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">☰</button>
                <Outlet context={{ workspace, channels, conversations, role, workspaceId: workspace_id, reloadChannels, reloadConversations }} />
            </main>
        </div>
    )
}

export const ChatEmpty = () => {
    const { channels, workspaceId, workspace } = useOutletContext()
    useDocumentTitle(workspace?.nombre)

    if (channels.length > 0) {
        return <Navigate to={`/workspace/${workspaceId}/channels/${channels[0]._id}`} replace />
    }

    return (
        <div className={styles.empty}>
            <div className={styles.emptyIcon}>#️⃣</div>
            <h2>Todavía no hay canales</h2>
            <p>Creá el primer canal desde la barra de la izquierda para empezar a chatear.</p>
        </div>
    )
}
