import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { WorkspacesContext } from '../../context/WorkspacesContext'
import { useNavigate } from 'react-router'
import './HomeScreen.css'

export const HomeScreen = () => {
  const { logout, userData } = useContext(AuthContext)
  const { workspaces, loading, error, refetch } = useContext(WorkspacesContext)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (!userData) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando perfil de usuario...</p>
      </div>
    )
  }


  return (
    <div className="home-container">
      <header className="home-header">
        <div className="user-profile">
          <span className="avatar">{userData.nombre.charAt(0).toUpperCase()}</span>
          <h2>Bienvenido, <strong>{userData.nombre}</strong></h2>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <main className="home-main">
        <div className="section-title-container">
          <h3>Tus Espacios de Trabajo</h3>
          <button className="btn-create-workspace" onClick={() => navigate('/workspace/new')}>
            + Nuevo Espacio
          </button>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando tus espacios de trabajo...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="error-state">
            <p>⚠️ Error: {error}</p>
            <button className="btn-retry" onClick={refetch}>Reintentar</button>
          </div>
        )}

        {/* Estado de éxito */}
        {!loading && !error && (
          <>
            {workspaces.length === 0 ? (
              // Empty State (Sin workspaces)
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h4>No perteneces a ningún espacio de trabajo</h4>
                <p>Crea tu primer espacio para empezar a colaborar con tu equipo.</p>
                <button className="btn-primary" onClick={() => navigate('/workspace/new')}>
                  Crear un espacio de trabajo
                </button>
              </div>
            ) : (
              // Listado de workspaces
              <div className="workspaces-grid">
                {workspaces.map((membership) => {
                  console.log({ membership })

                  return (
                    <div
                      key={membership.member_id}
                      className="workspace-card"
                      onClick={() => navigate(`/workspace/${membership.workspace_id}`)}
                    >
                      <div className="workspace-card-icon">
                        {membership.workspace_nombre ? membership.workspace_nombre.substring(0, 2).toUpperCase() : 'WS'}
                      </div>
                      <div className="workspace-card-info">
                        <h4>{membership.workspace_nombre}</h4>
                        <p>{membership.workspace_descripcion || 'Sin descripción'}</p>
                        <span className={`role-badge role-${membership.member_rol}`}>
                          {membership.member_rol}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

