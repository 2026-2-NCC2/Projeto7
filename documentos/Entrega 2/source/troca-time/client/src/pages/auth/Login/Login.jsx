import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAuth from '@/layouts/LayoutAuth/LayoutAuth'
import Card from '@/components/Card/Card'
import Campo from '@/components/Campo/Campo'
import Acoes from '@/components/Acoes/Acoes'
import Botao from '@/components/Botao/Botao'
import { validarEmail } from '@/utils/validacoes'
import { api } from '@/utils/api'

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

    async function submit(e) {
        e.preventDefault()

        const errosLogin = validar()
        setErros(errosLogin)

        if (Object.keys(errosLogin).length > 0) {
            return
        }

        try {
            const usuario = await api('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
            })
            localStorage.setItem('usuario_id', usuario.id)
            localStorage.setItem('usuario_nome', usuario.nome)
            localStorage.setItem('tipo_usuario', usuario.tipo_usuario)
            const destinos = {
                adm: '/adm',
                organizador: '/organizador/eventos',
                fornecedor: '/fornecedor/oportunidades',
            }
            navegar(destinos[usuario.tipo_usuario] ?? '/', { replace: true })
        } catch (erro) {
            alert(erro.message)
        }
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
