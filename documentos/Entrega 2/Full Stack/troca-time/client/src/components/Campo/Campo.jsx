import Texto from '@/components/Texto/Texto'
import styles from './Campo.module.css'

// Sem children: renderiza um input com label.
// Com children: usa o mesmo rótulo e mensagem de erro em volta de outro conteúdo (ex.: GrupoOpcoes).
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
