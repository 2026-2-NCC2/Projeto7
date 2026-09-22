import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Botao from '../../../../components/Botao'
import Logo from '../../../../components/Logo'
import Card from '../../../../components/Card'
import {validarCpf, validarCnpj} from '../../../../helpers/helpers'

const PERFIS = [
    { id: 'fornecedor', rotulo: 'Fornecedor' },
    { id: 'organizador', rotulo: 'Organizador' },
]

function CadastroFormulario() {
    const [tipoPerfil, setTipoPerfil] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [cpfOuCnpj, setCpfOuCnpj] = useState('')
    const [erros, setErros] = useState({})
    const navegar = useNavigate()

    const ehFornecedor = tipoPerfil === 'fornecedor'

    function validar() {
        const errosCadastro = {}

        if (!tipoPerfil) {
            errosCadastro.tipoPerfil = 'Escolha um tipo de perfil'
        }

        if (!nome.trim()) {
            errosCadastro.nome = 'Informe o nome'
        }

        if (!email || !email.includes('@')) {
            errosCadastro.email = 'E-mail inválido'
        }

        if (!cpfOuCnpj.trim()) {
            errosCadastro.cpfOuCnpj = ehFornecedor ? 'Informe o CNPJ' : 'Informe o CPF ou CNPJ'
        }else if (ehFornecedor && !validarCnpj(cpfOuCnpj)) {
            errosCadastro.cpfOuCnpj = 'CNPJ inválido'
        } else if (!ehFornecedor && !validarCnpj(cpfOuCnpj) && !validarCpf(cpfOuCnpj)) {
            errosCadastro.cpfOuCnpj = 'CNPJ ou CNPJ inválido'
        }

        if (senha.length < 8) {
            errosCadastro.senha = 'A senha precisa de no mínimo 8 caracteres'
        }

        if (senha !== confirmarSenha) {
            errosCadastro.confirmarSenha = 'As senhas não conferem'
        }

        return errosCadastro
    }

    function submit(e) {
        e.preventDefault()

        const errosCadastro = validar()
        setErros(errosCadastro)

        if (Object.keys(errosCadastro).length > 0) {
            return
        }

        console.log('cadastro:', { tipoPerfil, nome, email, cpfOuCnpj })
        navegar('/cadastro/obrigado')
    }

    return (
        <div className='container'>
            <Logo />
            <h1>Cadastro</h1>

            <Card elemento='form' onSubmit={submit}>
                <div className="input-campo">
                    <span className='input-name'>*Escolha seu tipo de perfil:</span>
                    <div className='opcoes'>
                        {PERFIS.map((item) => (
                            <label
                                key={item.id}
                                className={`opcao ${tipoPerfil === item.id ? 'opcao-ativa' : ''}`}
                            >
                                <input
                                    type='radio'
                                    name='tipoPerfil'
                                    value={item.id}
                                    checked={tipoPerfil === item.id}
                                    onChange={(e) => setTipoPerfil(e.target.value)}
                                />
                                {item.rotulo}
                            </label>
                        ))}
                    </div>
                    {erros.tipoPerfil ? <span className='texto-input-mensagem-erro'>{erros.tipoPerfil}</span> : ''}
                </div>

                <div className="input-campo">
                    <label className='input-name' htmlFor='nome'>*Nome:</label>
                    <input
                        id='nome'
                        name='nome'
                        type='text'
                        placeholder='digite o nome da empresa ou representante'
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className={erros.nome ? 'input-invalido' : ''}
                    />
                    {erros.nome ? <span className='texto-input-mensagem-erro'>{erros.nome}</span> : ''}
                </div>
                
                <div className="input-campo">
                    <label className='input-name' htmlFor='email'>*E-mail:</label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        placeholder='exemplo@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={erros.email ? 'input-invalido' : ''}
                    />
                    {erros.email ? <span className='texto-input-mensagem-erro'>{erros.email}</span> : ''}
                </div>
                
                <div className="input-campo">
                    <label className='input-name' htmlFor='cpfOuCnpj'>
                        {ehFornecedor ? '*CNPJ:' : '*CPF/CNPJ:'}
                    </label>
                    <input
                        id='cpfOuCnpj'
                        name='cpfOuCnpj'
                        type='text'
                        placeholder={ehFornecedor ? 'AA.AAA.AAA/AAAA-DV' : 'AA.AAA.AAA/AAAA-DV ou 000.000.000-00'}
                        value={cpfOuCnpj}
                        onChange={(e) => setCpfOuCnpj(e.target.value)}
                        className={erros.cpfOuCnpj ? 'input-invalido' : ''}
                    />
                    {erros.cpfOuCnpj ? <span className='texto-input-mensagem-erro'>{erros.cpfOuCnpj}</span> : ''}
                </div>
                
                <div className="input-campo">
                    <label className='input-name' htmlFor='senha'>*Senha:</label>
                    <input
                        id='senha'
                        name='senha'
                        type='password'
                        placeholder='mínimo de 8 caracteres'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className={erros.senha ? 'input-invalido' : ''}
                    />
                    {erros.senha ? <span className='texto-input-mensagem-erro'>{erros.senha}</span> : ''}
                </div>

                <div className="input-campo">
                    <label className='input-name' htmlFor='confirmarSenha'>*Confirme sua senha:</label>
                    <input
                        id='confirmarSenha'
                        name='confirmarSenha'
                        type='password'
                        placeholder='********'
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className={erros.confirmarSenha ? 'input-invalido' : ''}
                    />
                    {erros.confirmarSenha ? <span className='texto-input-mensagem-erro'>{erros.confirmarSenha}</span> : ''}
                </div>


                <div className='acoes acoes-centro'>
                    <Botao type='submit'>Enviar formulário de cadastro →</Botao>
                </div>

                <span className='texto-obs'>
                    Seus dados serão enviados para um administrador avalia-los
                </span>
            </Card>
        </div>
    )
}

export default CadastroFormulario
