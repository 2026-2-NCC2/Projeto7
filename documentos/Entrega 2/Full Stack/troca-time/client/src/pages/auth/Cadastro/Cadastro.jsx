import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutAuth from '@/layouts/LayoutAuth/LayoutAuth'
import Card from '@/components/Card/Card'
import Campo from '@/components/Campo/Campo'
import GrupoOpcoes from '@/components/GrupoOpcoes/GrupoOpcoes'
import Acoes from '@/components/Acoes/Acoes'
import Botao from '@/components/Botao/Botao'
import Texto from '@/components/Texto/Texto'
import { validarEmail, validarCpf, validarCnpj } from '@/utils/validacoes'
import { api } from '@/utils/api'

const PERFIS = [
    { id: 'fornecedor', rotulo: 'Fornecedor' },
    { id: 'organizador', rotulo: 'Organizador' },
]

function Cadastro() {
    const [tipoPerfil, setTipoPerfil] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
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

        if (!validarEmail(email)) {
            errosCadastro.email = 'E-mail inválido'
        }

        const digitosTelefone = telefone.replace(/\D/g, '')
        if (digitosTelefone.length !== 10 && digitosTelefone.length !== 11) {
            errosCadastro.telefone = 'Telefone inválido'
        }

        if (!cpfOuCnpj.trim()) {
            errosCadastro.cpfOuCnpj = ehFornecedor ? 'Informe o CNPJ' : 'Informe o CPF ou CNPJ'
        } else if (ehFornecedor && !validarCnpj(cpfOuCnpj)) {
            errosCadastro.cpfOuCnpj = 'CNPJ inválido'
        } else if (!ehFornecedor && !validarCnpj(cpfOuCnpj) && !validarCpf(cpfOuCnpj)) {
            errosCadastro.cpfOuCnpj = 'CPF ou CNPJ inválido'
        }

        if (senha.length < 8) {
            errosCadastro.senha = 'A senha precisa de no mínimo 8 caracteres'
        }

        if (senha !== confirmarSenha) {
            errosCadastro.confirmarSenha = 'As senhas não conferem'
        }

        return errosCadastro
    }

    async function submit(e) {
        e.preventDefault()

        const errosCadastro = validar()
        setErros(errosCadastro)

        if (Object.keys(errosCadastro).length > 0) {
            return
        }

        try {
            await api('/auth/cadastro', {
                method: 'POST',
                body: JSON.stringify({
                    tipo_usuario: tipoPerfil,
                    nome,
                    email,
                    telefone,
                    cpf_cnpj: cpfOuCnpj,
                    senha,
                    confirmacao_senha: confirmarSenha,
                }),
            })
            navegar('/cadastro/obrigado')
        } catch (erro) {
            alert(erro.message)
        }
    }

    return (
        <LayoutAuth titulo='Cadastro'>
            <Card elemento='form' onSubmit={submit}>
                <GrupoOpcoes
                    nome='tipoPerfil'
                    rotulo='*Escolha seu tipo de perfil:'
                    opcoes={PERFIS}
                    valor={tipoPerfil}
                    onChange={setTipoPerfil}
                    erro={erros.tipoPerfil}
                />

                <Campo
                    id='nome'
                    rotulo='*Nome:'
                    type='text'
                    placeholder='digite o nome da empresa ou representante'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    erro={erros.nome}
                />

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
                    id='telefone'
                    rotulo='*Telefone:'
                    type='tel'
                    placeholder='(11) 99999-9999'
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    erro={erros.telefone}
                />

                <Campo
                    id='cpfOuCnpj'
                    rotulo={ehFornecedor ? '*CNPJ:' : '*CPF/CNPJ:'}
                    type='text'
                    placeholder={
                        ehFornecedor ? 'AA.AAA.AAA/AAAA-DV' : 'AA.AAA.AAA/AAAA-DV ou 000.000.000-00'
                    }
                    value={cpfOuCnpj}
                    onChange={(e) => setCpfOuCnpj(e.target.value)}
                    erro={erros.cpfOuCnpj}
                />

                <Campo
                    id='senha'
                    rotulo='*Senha:'
                    type='password'
                    placeholder='mínimo de 8 caracteres'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    erro={erros.senha}
                />

                <Campo
                    id='confirmarSenha'
                    rotulo='*Confirme sua senha:'
                    type='password'
                    placeholder='********'
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    erro={erros.confirmarSenha}
                />

                <Acoes alinhamento='centro'>
                    <Botao type='submit'>Enviar formulário de cadastro →</Botao>
                </Acoes>

                <Texto variante='obs'>
                    Seus dados serão enviados para um administrador avaliá-los
                </Texto>
            </Card>
        </LayoutAuth>
    )
}

export default Cadastro
