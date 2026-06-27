import styles from './Loader.module.css'

//spinner reutilizable con un texto opcional
export const Loader = ({ text }) => {
    return (
        <div className={styles.loader}>
            <div className={styles.spinner} />
            {text && <p className={styles.text}>{text}</p>}
        </div>
    )
}
