import Container from '@/components/Container/Container'
import Logo from '@/components/Logo/Logo'
import Titulo from '@/components/Titulo/Titulo'

// Molde das telas de login e cadastro: logo + título + conteúdo centralizado
function LayoutAuth({ titulo, children }) {
    return (
        <Container>
            <Logo />
            <Titulo>{titulo}</Titulo>
            {children}
        </Container>
    )
}

export default LayoutAuth
