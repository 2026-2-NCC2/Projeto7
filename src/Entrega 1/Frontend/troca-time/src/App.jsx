import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import CadastroFormulario from './pages/auth/Cadastro/CadastroFormulario'
import CadastroAgradecimento from './pages/auth/Cadastro/CadastroAgradecimento'
import Home from './pages/adm/Home'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/cadastro' element={<CadastroFormulario />} />
            <Route path='/cadastro/obrigado' element={<CadastroAgradecimento />} />
            <Route path='/adm' element={<Home />} />
        </Routes>
    )
}

export default App
