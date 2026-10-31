import { Outlet, useLocation } from 'react-router-dom'
import Cabecalho from '@/components/Cabecalho/Cabecalho'
import ChatIA from '@/components/ChatIA/ChatIA'
import ChatConversa from '@/components/ChatConversa/ChatConversa'

// Molde das telas depois do login: cabeçalho + página + chats
function LayoutAutenticado() {
    const { pathname } = useLocation()

    return (
        <>
            <Cabecalho />
            <Outlet />
            <ChatIA />
            {pathname === '/fornecedores' && <ChatConversa />}
        </>
    )
}

export default LayoutAutenticado
