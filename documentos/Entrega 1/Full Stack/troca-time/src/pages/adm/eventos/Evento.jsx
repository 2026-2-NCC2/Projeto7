import { useMemo, useState } from 'react'
import ListaEventos from '../../../components/ListaEventos.jsx';
import { eventos } from  '../../../dados/eventos.js';


export default function Home() {
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento)=> {
      const busca = evento.nome.toLowerCase().includes(search.toLowerCase());
      let botao= true;
      if (filter === 'aprovados'){
        botao = evento.status === 'aprovado';
      }else if (filter === 'reprovados') {
        botao = evento.status === 'reprovado';
      }
      return busca && botao;
    });
  }, [search, filter]);

  return (
    <main className="events-page">

      <label className="search-box">
        <span className="sr-only">Buscar eventos</span>
        <input value={search} 
        onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" />
        </label>
      <div className="filters" aria-label="Filtrar eventos">
        {['aprovados', 'reprovados', 'todos'].map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={filter === item ? `filter ${item} selected` : `filter ${item}`}
          >
            {item[0].toUpperCase() + item.slice(1)} 
          </button>
        ))}
      </div>
      <ListaEventos eventos={eventosFiltrados} filtro={filter} />
    </main>
  )
}
