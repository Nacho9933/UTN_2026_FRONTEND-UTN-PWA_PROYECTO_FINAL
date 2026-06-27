import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { Plus, ArrowRight, FolderOpen, AlertTriangle } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { WorkspacesContext } from '../../context/WorkspacesContext'
import { Loader } from '../../components/ui/Loader/Loader'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import styles from './HomeScreen.module.css'

//mapeo el rol que manda el backend a la clase del badge
const roleClasses = {
  'dueño': styles.roleOwner,
  'admin': styles.roleAdmin,
  'usuario': styles.roleUser
}

export const HomeScreen = () => {
  useDocumentTitle('Mis espacios')
  const { logout, userData } = useContext(AuthContext)
  const { workspaces, loading, error, refetch } = useContext(WorkspacesContext)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (!userData) {
    return <Loader text="Cargando perfil de usuario..." />
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <svg className={styles.brandIcon} viewBox="0 0 2447.6 2452.5" xmlns="http://www.w3.org/2000/svg">
            <g clipRule="evenodd" fillRule="evenodd">
              <path fill="#36C5F0" d="M897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8V245.2C1142.3 109.9 1032.7.1 897.4 0zm0 654H244.8C109.5 654.1 0 763.9.1 899.2.1 1034.6 109.6 1144.4 244.9 1144.5h652.5c135.3-.1 244.9-109.9 244.8-245.3-.1-135.3-109.6-245.1-244.8-245.2z"/>
              <path fill="#2EB67D" d="M2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.4 109.4 245.2 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"/>
              <path fill="#ECB22E" d="M1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v244.9c-.1 135.4 109.5 245.2 244.8 245.5zm0-654.1h652.5c135.3-.1 244.9-109.9 244.8-245.2-.1-135.4-109.6-245.2-244.9-245.3h-652.4c-135.3.1-244.9 109.9-244.8 245.3.1 135.3 109.6 245.1 244.8 245.2z"/>
              <path fill="#E01E5A" d="M0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2H244.8C109.5 1308.1 0 1417.9 0 1553.2zm652.7 0v654c-.2 135.4 109.4 245.2 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.4-109.4-245.2-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1z"/>
            </g>
          </svg>
          <span className={styles.brandText}>Slack</span>
        </div>
        <h1 className={styles.title}>¡Hola de nuevo!</h1>
        <p className={styles.subtitle}>Creá un nuevo espacio de trabajo o elegí uno existente.</p>

        <button className={styles.createBtn} onClick={() => navigate('/workspace/new')}>
          <span className={styles.plusBox}><Plus size={22} strokeWidth={2.5} /></span>
          <span className={styles.createText}>Creá un nuevo espacio de trabajo</span>
        </button>

        <div className={styles.divider}>
          <span>O continuá a espacios de trabajo existentes</span>
        </div>

        <div className={styles.readyRow}>
          <div className={styles.readyInfo}>
            <p className={styles.readyTitle}>Listos para comenzar</p>
            <p className={styles.readyEmail}>{userData.email}</p>
          </div>
          <button className={styles.logoutLink} onClick={handleLogout}>Cerrar sesión</button>
        </div>

        {loading && <Loader text="Cargando tus espacios de trabajo..." />}

        {error && (
          <EmptyState
            variant="error"
            icon={<AlertTriangle size={28} />}
            title="No pudimos cargar tus espacios"
            description={error}
            actionLabel="Reintentar"
            onAction={refetch}
          />
        )}

        {!loading && !error && (
          workspaces.length === 0 ? (
            <EmptyState
              icon={<FolderOpen size={28} />}
              title="Todavía no pertenecés a ningún espacio"
              description="Creá tu primer espacio para empezar a colaborar con tu equipo."
            />
          ) : (
            <div className={styles.wsList}>
              {workspaces.map((membership) => (
                <button
                  key={membership.member_id}
                  className={styles.wsCard}
                  onClick={() => navigate(`/workspace/${membership.workspace_id}`)}
                >
                  <div className={styles.wsLogo}>
                    {membership.workspace_nombre ? membership.workspace_nombre.substring(0, 2).toUpperCase() : 'WS'}
                  </div>
                  <div className={styles.wsInfo}>
                    <h3 className={styles.wsName}>{membership.workspace_nombre}</h3>
                    <span className={`${styles.roleBadge} ${roleClasses[membership.member_rol] || ''}`}>
                      {membership.member_rol}
                    </span>
                  </div>
                  <ArrowRight size={20} className={styles.arrow} />
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
