function somenteDigitos(texto) {
    return texto.replace(/\D/g, '')
}

export function validarEmail(email) {
    return email.includes('@')
}

export function validarCpf(documento) {
    return somenteDigitos(documento).length === 11
}

export function validarCnpj(documento) {
    return somenteDigitos(documento).length === 14
}
