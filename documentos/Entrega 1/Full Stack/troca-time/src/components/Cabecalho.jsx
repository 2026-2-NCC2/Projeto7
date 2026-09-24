import { Link, NavLink } from 'react-router-dom'
import React from 'react';
import logo from '../assets/logo_navbar_web.png';

export default function Cabecalho() {
  const navItems = [
    ['Home', '/home'], ['Eventos', '/eventos'], ['Fornecedores', '/fornecedores'], ['Organizadores', '/organizadores'],
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
      <Link className="profile-link" to="/perfil">Perfil</Link>
    </header>
  )
}
