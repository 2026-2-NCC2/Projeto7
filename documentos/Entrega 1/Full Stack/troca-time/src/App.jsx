import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LayoutAutenticado from '@/layouts/LayoutAutenticado/LayoutAutenticado'
import Login from '@/pages/auth/Login/Login'
import Cadastro from '@/pages/auth/Cadastro/Cadastro'
import CadastroObrigado from '@/pages/auth/CadastroObrigado/CadastroObrigado'
import HomeAdm from '@/pages/adm/HomeAdm/HomeAdm'
import Eventos from '@/pages/adm/Eventos/Eventos'
import DetalheEvento from '@/pages/adm/DetalheEvento/DetalheEvento'
import PerfilOrganizador from '@/pages/adm/PerfilOrganizador/PerfilOrganizador'
import HomeFornecedores from '@/pages/fornecedor/HomeFornecedores/HomeFornecedores'
import PaginaVazia from '@/pages/PaginaVazia/PaginaVazia'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cadastro' element={<Cadastro />} />
                <Route path='/cadastro/obrigado' element={<CadastroObrigado />} />

                <Route element={<LayoutAutenticado />}>
                    <Route path='/home' element={<HomeAdm />} />
                    <Route path='/adm' element={<HomeAdm />} />
                    <Route path='/eventos' element={<Eventos />} />
                    <Route path='/eventos/:id' element={<DetalheEvento />} />
                    <Route path='/fornecedores' element={<HomeFornecedores />} />
                    <Route path='/organizadores' element={<PerfilOrganizador />} />
                    <Route path='/organizadores/:id' element={<PerfilOrganizador />} />
                    <Route path='/perfil' element={<PaginaVazia titulo='Perfil' />} />
                </Route>

                <Route path='*' element={<PaginaVazia titulo='Página não encontrada' />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
