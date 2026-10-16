import * as repository from "../../repositories/eventos";

export async function listarEventosService() {
    const eventos = repository.listarEventosRepository();
    
    const eventosResponse = 
}