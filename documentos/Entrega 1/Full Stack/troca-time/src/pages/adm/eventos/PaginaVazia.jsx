import { Link } from 'react-router-dom'

export default function PaginaVazia({ titulo }) {
  return <main className="empty-page"><Link to="/eventos">Voltar para eventos</Link></main>
}