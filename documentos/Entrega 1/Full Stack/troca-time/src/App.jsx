import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Cabecalho from './components/Cabecalho.jsx'
import ChatIA from './components/ChatIA.jsx'

// Importações de páginas
import DetalheEvento from './pages/adm/eventos/DetalheEvento.jsx'
import Evento from './pages/adm/eventos/Evento.jsx'
import PaginaVazia from './pages/adm/eventos/PaginaVazia.jsx'
import Home from './pages/adm/Home/index.jsx'
import PerfilOrganizador from './pages/adm/organizadores/PerfilOrganizador.jsx'
import AdmHome from './pages/adm/Home/index.jsx'
import Login from './pages/auth/Login'
import CadastroFormulario from './pages/auth/Cadastro/CadastroFormulario'
import CadastroAgradecimento from './pages/auth/Cadastro/CadastroAgradecimento'
import HomeFornecedor from './pages/fornecedor/Home/index.jsx'
import HomeOrganizador from './pages/adm/organizadores/PerfilOrganizador.jsx'

function LayoutAutenticado() {
  return (
    <>
      <Cabecalho />
      <Outlet />
      <ChatIA />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<CadastroFormulario />} />
        <Route path="/cadastro/obrigado" element={<CadastroAgradecimento />} />

        <Route element={<LayoutAutenticado />}>
          <Route path="/home" element={<Home />} />
          <Route path="/eventos" element={<Evento />} />
          <Route path="/eventos/:id" element={<DetalheEvento />} />
          <Route path="/fornecedores" element={<HomeFornecedor titulo="Fornecedores" />} />
          <Route path="/organizadores" element={<HomeOrganizador titulo="Organizadores" />} />
            <Route path="/organizadores/:id" element={<PerfilOrganizador />} />
          <Route path="/perfil" element={<PaginaVazia titulo="Perfil" />} />
          <Route path="/adm" element={<AdmHome />} />
        </Route>

        <Route path="*" element={<PaginaVazia titulo="Página não encontrada" />} />
      </Routes>
    </BrowserRouter>
  )
}