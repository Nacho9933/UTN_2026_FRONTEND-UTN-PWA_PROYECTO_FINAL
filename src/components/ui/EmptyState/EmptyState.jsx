import { Button } from '../Button/Button'
import styles from './EmptyState.module.css'

//estado vacio/error reutilizable en toda la app
//props: icon (nodo, ej <Users/>), title, description, action (label+onClick), variant ('empty' | 'error')
export const EmptyState = ({ icon, title, description, actionLabel, onAction, variant = 'empty' }) => {
    return (
        <div className={`${styles.box} ${variant === 'error' ? styles.error : ''}`}>
            {icon && <div className={styles.icon}>{icon}</div>}
            {title && <h4 className={styles.title}>{title}</h4>}
            {description && <p className={styles.desc}>{description}</p>}
            {actionLabel && onAction && (
                <Button size="sm" variant={variant === 'error' ? 'danger' : undefined} onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}
