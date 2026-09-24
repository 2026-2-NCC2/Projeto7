import { Link } from 'react-router-dom'
import React from 'react';
import show from '../assets/show.jpg.webp'

export default function CartaoEvento({ evento }) {
  return (
    <article className="event-card">
      <div className="event-poster" aria-label={`Imagem do evento ${evento.nome}`} role="img">
        <span>
          <img src={show} alt="Foto de show" style={{ height: '100px' }}/></span>
      </div>
      <div className="event-content">
        <h2>{evento.nome}</h2>
        <div className="event-details">
          <p><b>DATA E HORA:</b> {evento.data}</p>
          <p><b>LOCAL:</b> {evento.local}</p>
          <p><b>ORGANIZADOR:</b> {evento.organizador}</p>
          <p><b>FORNECEDORES:</b> {evento.fornecedor}</p>
        </div>
        <Link className="see-more" to={`/eventos/${evento.id}`}>Ver mais</Link>
      </div>
    </article>
  )
}