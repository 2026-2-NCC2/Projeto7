export function validarCpf(documento) {
    const digitos = documento.replace(/\D/g, '')
    return digitos.length === 11
}

export function validarCnpj(documento) {
    const digitos = documento.replace(/\D/g, '')
    return digitos.length === 14
}
