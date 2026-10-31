import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '@/assets/logo_navbar_web.png'
import styles from './Cabecalho.module.css'

const LINKS_ADMIN = [
    { rotulo: 'Home', caminho: '/home' },
    { rotulo: 'Eventos', caminho: '/eventos' },
    { rotulo: 'Fornecedores', caminho: '/fornecedores' },
    { rotulo: 'Organizadores', caminho: '/organizadores/1' },
]
const LINKS_ORGANIZADOR = [
    { rotulo: 'Meus eventos', caminho: '/organizador/eventos' },
    { rotulo: 'Novo evento', caminho: '/organizador/eventos/novo' },
    { rotulo: 'Fornecedores', caminho: '/organizador/fornecedores' },
]
const LINKS_FORNECEDOR = [
    { rotulo: 'Oportunidades', caminho: '/fornecedor/oportunidades' },
    { rotulo: 'Minhas propostas', caminho: '/fornecedor/propostas' },
]

function Cabecalho() {
    const [perfilAberto, setPerfilAberto] = useState(false)
    const { pathname } = useLocation()
    const perfil = pathname.startsWith('/organizador/')
        ? 'organizador'
        : pathname.startsWith('/fornecedor/')
            ? 'fornecedor'
            : 'admin'
    const links = perfil === 'organizador'
        ? LINKS_ORGANIZADOR
        : perfil === 'fornecedor'
            ? LINKS_FORNECEDOR
            : LINKS_ADMIN

    function fecharPerfil() {
        setPerfilAberto(false)
    }

    return (
        <header className={styles.cabecalho}>
            <Link className={styles.marca} to='/' aria-label='Troca Ticket - início'>
                <span aria-hidden='true'>
                    <img className={styles.marcaImagem} src={logo} alt='Logo Troca Ticket' />
                </span>
                <span>TROCA TICKET</span>
            </Link>

            <nav className={styles.navegacao} aria-label='Navegação principal'>
                {links.map((link) => (
                    <NavLink
                        key={link.caminho}
                        to={link.caminho}
                        end={perfil !== 'admin'}
                        className={({ isActive }) =>
                            isActive ? `${styles.link} ${styles.ativo}` : styles.link
                        }
                    >
                        {link.rotulo}
                    </NavLink>
                ))}
            </nav>

            {perfil === 'admin' && <div className={styles.perfil}>
                <button
                    className={styles.perfilBotao}
                    type='button'
                    aria-expanded={perfilAberto}
                    onClick={() => setPerfilAberto((aberto) => !aberto)}
                >
                    Perfil
                </button>
                {perfilAberto && (
                    <div className={styles.perfilMenu}>
                        <Link to='/perfil' onClick={fecharPerfil}>
                            Minha conta
                        </Link>
                        <Link to='/perfil' onClick={fecharPerfil}>
                            Configurações
                        </Link>
                        <Link to='/' onClick={fecharPerfil}>
                            Sair
                        </Link>
                    </div>
                )}
            </div>}
        </header>
    )
}

export default Cabecalho
