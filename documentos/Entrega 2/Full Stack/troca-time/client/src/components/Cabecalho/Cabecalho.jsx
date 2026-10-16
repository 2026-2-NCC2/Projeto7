import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '@/assets/logo_navbar_web.png'
import styles from './Cabecalho.module.css'

const LINKS = [
    { rotulo: 'Home', caminho: '/home' },
    { rotulo: 'Eventos', caminho: '/eventos' },
    { rotulo: 'Fornecedores', caminho: '/fornecedores' },
    { rotulo: 'Organizadores', caminho: '/organizadores/1' },
]

function Cabecalho() {
    const [perfilAberto, setPerfilAberto] = useState(false)

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
                {LINKS.map((link) => (
                    <NavLink
                        key={link.caminho}
                        to={link.caminho}
                        className={({ isActive }) =>
                            isActive ? `${styles.link} ${styles.ativo}` : styles.link
                        }
                    >
                        {link.rotulo}
                    </NavLink>
                ))}
            </nav>

            <div className={styles.perfil}>
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
            </div>
        </header>
    )
}

export default Cabecalho
