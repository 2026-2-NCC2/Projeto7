// Simula uma chamada de API enquanto o back-end (Entrega 2) não está pronto.
// Quando a API existir, basta trocar as funções dos arquivos de dados por fetch().

const ATRASO_MS = 500

// Para testar a tela de erro, abra a página com ?simularErro no final da URL.
// Ex.: http://localhost:5173/adm?simularErro
function deveFalhar() {
    return new URLSearchParams(window.location.search).has('simularErro')
}

export function responder(dados) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (deveFalhar()) {
                reject(new Error('Falha simulada na API'))
                return
            }
            // structuredClone evita que a tela altere os dados "do servidor" sem querer
            resolve(structuredClone(dados))
        }, ATRASO_MS)
    })
}
