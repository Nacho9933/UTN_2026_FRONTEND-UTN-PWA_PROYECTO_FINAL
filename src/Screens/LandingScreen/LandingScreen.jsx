import { useNavigate } from 'react-router'
import { Button } from '../../components/ui/Button/Button'
import styles from './LandingScreen.module.css'
import useDocumentTitle from '../../hooks/useDocumentTitle'

export const LandingScreen = () => {
    useDocumentTitle()
    const navigate = useNavigate()

    return (
        <div className={styles.landing}>
            {/* barra de arriba con marca y accesos */}
            <header className={styles.nav}>
                <span className={styles.brand}>💬 Slack</span>
                <div className={styles.navActions}>
                    <Button variant="subtle" onClick={() => navigate('/login')}>Ingresar</Button>
                    <Button onClick={() => navigate('/register')}>Crear cuenta</Button>
                </div>
            </header>

            {/* seccion principal */}
            <main className={styles.hero}>
                <h1 className={styles.title}>
                    Donde el trabajo <span className={styles.highlight}>fluye</span>
                </h1>
                <p className={styles.subtitle}>
                    Organizá a tu equipo en espacios de trabajo, creá canales por tema
                    y conversá en tiempo real. Todo en un solo lugar.
                </p>
                <div className={styles.heroActions}>
                    <Button onClick={() => navigate('/register')}>Empezar gratis</Button>
                    <Button variant="subtle" onClick={() => navigate('/login')}>Ya tengo cuenta</Button>
                </div>
            </main>

            {/* tarjetas que muestran de que va la app */}
            <section className={styles.features}>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>🏢</span>
                    <h3>Espacios de trabajo</h3>
                    <p>Creá un espacio para cada equipo o proyecto y sumá a tus compañeros.</p>
                </div>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>#️⃣</span>
                    <h3>Canales</h3>
                    <p>Organizá las conversaciones por tema para que nada se pierda.</p>
                </div>
                <div className={styles.featureCard}>
                    <span className={styles.featureIcon}>💬</span>
                    <h3>Mensajes</h3>
                    <p>Hablá con tu equipo en tiempo real, editá y borrá lo que mandás.</p>
                </div>
            </section>
        </div>
    )
}
