import { Link, useParams } from 'react-router-dom'
import { eventos } from "../../../dados/eventos.js"

export default function DetalheEvento() {
  const { id } = useParams()
  const evento = eventos.find((item) => item.id === Number(id))
  return <main className="empty-page"><h1>{evento?.nome || 'Evento não encontrado'}</h1><p>Esta é a página de detalhes do evento.</p><Link to="/eventos">Voltar para eventos</Link></main>
}