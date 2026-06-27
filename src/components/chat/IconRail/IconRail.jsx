import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Home, Hash, Users } from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import styles from './IconRail.module.css'

export const IconRail = ({ workspace, workspaceId, role }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { userData } = useContext(AuthContext)

    const isInMembers = location.pathname.includes('/members')
    const isInChannel = location.pathname.includes('/channels/')

    const wsInitial = (workspace?.nombre || '?').charAt(0).toUpperCase()
    const userInitial = (userData?.nombre || 'U').charAt(0).toUpperCase()

    return (
        <div className={styles.rail}>
            <div className={styles.top}>
                <div className={styles.wsLogo} title={workspace?.nombre}>{wsInitial}</div>
            </div>

            <nav className={styles.nav}>
                <button className={styles.item} onClick={() => navigate('/home')} title="Inicio">
                    <Home size={20} strokeWidth={1.8} />
                    <span>Inicio</span>
                </button>
                <button className={`${styles.item} ${isInChannel ? styles.active : ''}`} title="Canales">
                    <Hash size={20} strokeWidth={1.8} />
                    <span>Canales</span>
                </button>
                <button
                    className={`${styles.item} ${isInMembers ? styles.active : ''}`}
                    onClick={() => navigate(`/workspace/${workspaceId}/members`)}
                    title="Miembros"
                >
                    <Users size={20} strokeWidth={1.8} />
                    <span>Miembros</span>
                </button>
            </nav>

            <div className={styles.bottom}>
                <div className={styles.userAvatar} title={userData?.nombre}>{userInitial}</div>
            </div>
        </div>
    )
}
