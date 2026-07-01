import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './FormField.module.css'

//campo de formulario: label + input + error opcional. el resto de props van al input
//withToggle: muestra un boton de ojo para ver/ocultar la contraseña (solo en type="password")
export const FormField = ({ label, id, error, withToggle = false, type = 'text', ...inputProps }) => {
    const [visible, setVisible] = useState(false)
    const isPassword = withToggle && type === 'password'
    const inputType = isPassword && visible ? 'text' : type

    return (
        <div className={styles.field}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <div className={styles.inputWrap}>
                <input
                    id={id}
                    type={inputType}
                    className={`${styles.input} ${isPassword ? styles.hasToggle : ''}`}
                    {...inputProps}
                />
                {isPassword && (
                    <button
                        type="button"
                        tabIndex={-1}
                        className={styles.toggle}
                        onClick={() => setVisible((v) => !v)}
                        title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                )}
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}
