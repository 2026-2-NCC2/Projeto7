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
import OportunidadesFornecedor from '@/pages/fornecedor/Oportunidades/OportunidadesFornecedor'
import DetalhesEventoFornecedor from '@/pages/fornecedor/DetalhesEvento/DetalhesEvento'
import NovaPropostaFornecedor from '@/pages/fornecedor/NovaProposta/NovaProposta'
import PropostasFornecedor from '@/pages/fornecedor/Propostas/Propostas'
import EventosOrganizador from '@/pages/organizador/Eventos/Eventos'
import EventoLayout from '@/pages/organizador/Eventos/EventoLayout'
import VisaoGeralEvento from '@/pages/organizador/Eventos/VisaoGeralEvento'
import ItensCustos from '@/pages/organizador/Eventos/ItensCustos'
import OrcamentoTicket from '@/pages/organizador/Eventos/OrcamentoTicket'
import NovoEvento from '@/pages/organizador/Eventos/NovoEvento'
import PropostasOrganizador from '@/pages/organizador/Propostas/Propostas'
import ListaFornecedoresOrganizador from '@/pages/organizador/Fornecedores/ListaFornecedor'
import DetalheFornecedorOrganizador from '@/pages/organizador/Fornecedores/DetalheFornecedor'
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
                    <Route path='/fornecedor/oportunidades' element={<OportunidadesFornecedor />} />
                    <Route path='/fornecedor/eventos/:eventoId' element={<DetalhesEventoFornecedor />} />
                    <Route path='/fornecedor/eventos/:eventoId/propostas/nova' element={<NovaPropostaFornecedor />} />
                    <Route path='/fornecedor/propostas' element={<PropostasFornecedor />} />
                    <Route path='/organizador/eventos' element={<EventosOrganizador />} />
                    <Route path='/organizador/eventos/novo' element={<NovoEvento />} />
                    <Route path='/organizador/eventos/:eventoId/editar' element={<NovoEvento />} />
                    <Route path='/organizador/eventos/:eventoId' element={<EventoLayout />}>
                        <Route index element={<VisaoGeralEvento />} />
                        <Route path='itens' element={<ItensCustos />} />
                        <Route path='propostas' element={<PropostasOrganizador />} />
                        <Route path='orcamento' element={<OrcamentoTicket />} />
                    </Route>
                    <Route path='/organizador/fornecedores' element={<ListaFornecedoresOrganizador />} />
                    <Route path='/organizador/fornecedores/:fornecedorId' element={<DetalheFornecedorOrganizador />} />
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
