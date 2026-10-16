import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAuth from '@/layouts/LayoutAuth/LayoutAuth'
import Card from '@/components/Card/Card'
import Campo from '@/components/Campo/Campo'
import Acoes from '@/components/Acoes/Acoes'
import Botao from '@/components/Botao/Botao'
import { validarEmail } from '@/utils/validacoes'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erros, setErros] = useState({})
    const navegar = useNavigate()

    function validar() {
        const errosLogin = {}

        if (!validarEmail(email)) {
            errosLogin.email = 'E-mail inválido'
        }

        if (!senha) {
            errosLogin.senha = 'Senha inválida'
        }

        return errosLogin
    }

    function submit(e) {
        e.preventDefault()

        const errosLogin = validar()
        setErros(errosLogin)

        if (Object.keys(errosLogin).length > 0) {
            return
        }

        navegar('/adm')
    }

    return (
        <LayoutAuth titulo='Acesse sua conta :)'>
            <Card elemento='form' onSubmit={submit}>
                <Campo
                    id='email'
                    rotulo='*E-mail:'
                    type='email'
                    placeholder='exemplo@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    erro={erros.email}
                />

                <Campo
                    id='senha'
                    rotulo='*Senha:'
                    type='password'
                    placeholder='********'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    erro={erros.senha}
                />

                <Acoes>
                    <Botao type='submit'>Entrar →</Botao>
                    <Botao variante='link' type='button' onClick={() => navegar('/cadastro')}>
                        Cadastre-se
                    </Botao>
                </Acoes>
            </Card>
        </LayoutAuth>
    )
}

export default Login
