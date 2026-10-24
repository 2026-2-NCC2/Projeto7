import { Outlet } from 'react-router-dom'
import Cabecalho from '@/components/Cabecalho/Cabecalho'

// Molde das telas depois do login: cabeçalho + página.
function LayoutAutenticado() {
    return (
        <>
            <Cabecalho />
            <Outlet />
        </>
    )
}

export default LayoutAutenticado
