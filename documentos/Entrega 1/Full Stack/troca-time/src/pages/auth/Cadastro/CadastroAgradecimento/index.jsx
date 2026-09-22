import { useNavigate } from 'react-router-dom'
import Botao from '../../../../components/Botao'
import Logo from '../../../../components/Logo'
import Card from '../../../../components/Card'

const STATUS = {
    pendente: { rotulo: 'Pendente', classe: 'status-pendente' },
    aprovado: { rotulo: 'Aprovado', classe: 'status-aprovado' },
    recusado: { rotulo: 'Recusado', classe: 'status-recusado' },
}

function CadastroAgradecimento({ status = 'pendente' }) {
    const atual = STATUS[status]
    const navegar = useNavigate()

    function voltar() {
        navegar('/')
    }

    return (
        <div className='container'>
            <Logo />
            <h1>Obrigado por se cadastrar!</h1>

            <span className='texto-destaque'>
                Seus dados foram enviados para um administrador da TrocaTicket avaliar :)
            </span>

            <span className='texto-padrao'>Status do Cadastro:</span>
            <Card>
                <span className={`status-valor ${atual.classe}`}>{atual.rotulo}</span>
            </Card>

            <div className='acoes acoes-centro'>
                <Botao type='button' onClick={voltar}>Voltar ←</Botao>
            </div>
        </div>
    )
}

export default CadastroAgradecimento
