import styles from './Button.module.css'

//boton reutilizable. variant: primary | danger | subtle | cancel. size: md | sm
export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
    const classes = [
        styles.btn,
        styles[variant],
        size === 'sm' && styles.small,
        className
    ].filter(Boolean).join(' ')

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    )
}
