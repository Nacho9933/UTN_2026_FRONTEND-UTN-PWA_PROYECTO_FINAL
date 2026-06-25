import styles from './FormField.module.css'

//campo de formulario: label + input + error opcional. el resto de props van al input
export const FormField = ({ label, id, error, ...inputProps }) => {
    return (
        <div className={styles.field}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <input id={id} className={styles.input} {...inputProps} />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}
