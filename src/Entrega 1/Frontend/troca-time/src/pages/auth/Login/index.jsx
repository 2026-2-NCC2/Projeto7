import { useState } from 'react'
import Botao from '../../../components/Botao'
import Logo from '../../../components/Logo'

// TO DO: encaminhar para a página de cadastro OnClick
function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    function submit(e) {
        e.preventDefault()
        console.log('email:', email, ' senha: ', senha)
    }

    return (
        <> 
            <div className="container">
                <Logo />
                <h1>Acesse sua conta :)</h1>
                <form className='formulario' onSubmit={submit}>
                    <label className='input-name' htmlFor='email'>E-mail:</label>
                    <input 
                        id='email'
                        placeholder='exemplo@gmail.com'
                        name='email' 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className='input-name' htmlFor='senha'>Senha:</label>
                    <input 
                        id='senha'
                        placeholder='********'
                        name='senha' 
                        type="password" 
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <div className="acoes">
                        <Botao type='submit'>Entrar →</Botao>
                        <Botao variante='link' type='button'>Cadastre-se</Botao>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login