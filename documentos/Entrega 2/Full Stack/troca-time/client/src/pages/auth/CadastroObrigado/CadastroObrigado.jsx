import { useNavigate } from 'react-router-dom'
import LayoutAuth from '@/layouts/LayoutAuth/LayoutAuth'
import Card from '@/components/Card/Card'
import Acoes from '@/components/Acoes/Acoes'
import Botao from '@/components/Botao/Botao'
import Texto from '@/components/Texto/Texto'
import styles from './CadastroObrigado.module.css'

const STATUS = {
    pendente: { rotulo: 'Pendente', classe: styles.pendente },
    aprovado: { rotulo: 'Aprovado', classe: styles.aprovado },
    recusado: { rotulo: 'Recusado', classe: styles.recusado },
}

function CadastroObrigado({ status = 'pendente' }) {
    const atual = STATUS[status]
    const navegar = useNavigate()

    return (
        <LayoutAuth titulo='Obrigado por se cadastrar!'>
            <Texto variante='destaque'>
                Seus dados foram enviados para um administrador da TrocaTicket avaliar :)
            </Texto>

            <Texto>Status do Cadastro:</Texto>
            <Card>
                <span className={`${styles.status} ${atual.classe}`}>{atual.rotulo}</span>
            </Card>

            <Acoes alinhamento='centro'>
                <Botao type='button' onClick={() => navegar('/')}>
                    Voltar ←
                </Botao>
            </Acoes>
        </LayoutAuth>
    )
}

export default CadastroObrigado
