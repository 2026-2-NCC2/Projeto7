import { Link, NavLink } from 'react-router-dom'
import React, { useState } from 'react';
import logo from '../assets/logo_navbar_web.png';

export default function Cabecalho() {
  const [profileOpen, setProfileOpen] = useState(false)
  const navItems = [
    ['Home', '/home'], ['Eventos', '/eventos'], ['Fornecedores', '/fornecedores'], ['Organizadores', '/organizadores/1'],
  ]

  return (
    <header className="header">
      <Link className="brand" to="/" aria-label="Troca Ticket - início">
        <span className="brand-mark" aria-hidden="true">
          <img src={logo} alt="Logo Troca Ticket" style={{ height: '100px' }}/>
          </span>
        <span>TROCA TICKET</span>
      </Link>
      <nav className="navigation" aria-label="Navegação principal">
        {navItems.map(([label, path]) => (
          <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="profile-menu">
        <button className="profile-link" type="button" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>Perfil</button>
        {profileOpen && (
          <div className="profile-dropdown">
            <Link to="/perfil" onClick={() => setProfileOpen(false)}>Minha conta</Link>
            <Link to="/perfil" onClick={() => setProfileOpen(false)}>Configurações</Link>
            <Link to="/" onClick={() => setProfileOpen(false)}>Sair</Link>
          </div>
        )}
      </div>
    </header>
  )
}
