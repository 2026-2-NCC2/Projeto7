import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Botao from '../../../components/Botao'
import Logo from '../../../components/Logo'
import Card from '../../../components/Card'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erros, setErros] = useState({})
    const navegar = useNavigate()

    function validar() {
        const errosLogin = {}

        if (!email || !email.includes('@')) {
            errosLogin.email = 'E-mail inválido'
        }

        if (!senha) {
            errosLogin.senha = 'Senha inválida'
        }

        return errosLogin
    }

    function submit(e) {
        e.preventDefault()
        console.log('email:', email, 'senha:', senha)

        const errosLogin = validar()
        setErros(errosLogin)

        if (Object.keys(errosLogin).length > 0) {
            return
        }

        navegar('/adm')
    }

    return (
        <div className='container'>
            <Logo />
            <h1>Acesse sua conta :)</h1>

            <Card elemento='form' onSubmit={submit}>

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
                    <label className='input-name' htmlFor='senha'>*Senha:</label>
                    <input
                        id='senha'
                        name='senha'
                        type='password'
                        placeholder='********'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className={erros.senha ? 'input-invalido' : ''}
                    />
                    {erros.senha ? <span className='texto-input-mensagem-erro'>{erros.senha}</span> : ''}
                </div>

                <div className='acoes'>
                    <Botao type='submit'>Entrar →</Botao>
                    <Botao variante='link' type='button' onClick={() => navegar('/cadastro')}>
                        Cadastre-se
                    </Botao>
                </div>
            </Card>
        </div>
    )
}

export default Login
