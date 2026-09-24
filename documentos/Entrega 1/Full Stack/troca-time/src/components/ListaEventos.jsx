import React from 'react';
import CartaoEvento from './CartaoEvento.jsx'; 

export default function ListaEventos({ eventos, filtro }) {
  if (!eventos || eventos.length === 0) {
    return <p className="events-empty">Nenhum evento encontrado.</p>
  }

  return (
    <section className="events-list" aria-label={`Eventos ${filtro}`}>
      {eventos.map((evento) => <CartaoEvento evento={evento} key={evento.id} />)}
    </section>
  )
}