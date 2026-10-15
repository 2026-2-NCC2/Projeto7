import Campo from '@/components/Campo/Campo'
import styles from './GrupoOpcoes.module.css'

// opcoes: [{ id, rotulo }]
function GrupoOpcoes({ nome, rotulo, opcoes, valor, onChange, erro }) {
    return (
        <Campo rotulo={rotulo} erro={erro}>
            <div className={styles.opcoes}>
                {opcoes.map((opcao) => (
                    <label
                        key={opcao.id}
                        className={`${styles.opcao} ${valor === opcao.id ? styles.ativa : ''}`}
                    >
                        <input
                            type='radio'
                            name={nome}
                            value={opcao.id}
                            checked={valor === opcao.id}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        {opcao.rotulo}
                    </label>
                ))}
            </div>
        </Campo>
    )
}

export default GrupoOpcoes
