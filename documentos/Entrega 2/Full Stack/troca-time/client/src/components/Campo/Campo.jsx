import Texto from '@/components/Texto/Texto'
import styles from './Campo.module.css'


function Campo({ id, rotulo, erro, children, ...props }) {
    const Rotulo = children ? 'span' : 'label'

    return (
        <div className={styles.campo}>
            <Rotulo className={styles.rotulo} htmlFor={children ? undefined : id}>
                {rotulo}
            </Rotulo>

            {children ?? (
                <input
                    id={id}
                    name={id}
                    className={`${styles.input} ${erro ? styles.invalido : ''}`}
                    {...props}
                />
            )}

            {erro && <Texto variante='erro'>{erro}</Texto>}
        </div>
    )
}

export default Campo
