
export class EventoDto {
    constructor({
      id,
      nome,
      status,
      status_aprovacao,
      descricao,
      data_hora,
      local,
      nome_organizador
    }) {
      this.id = id;
      this.nome = nome;
      this.status = status;
      this.status_aprovacao = status_aprovacao;
      this.descricao = descricao;
      this.data_hora = data_hora;
      this.local = local;
      this.nome_organizador = nome_organizador;
    } // mudar e bater com o banco certinho
  }

export class ListarEventosResponseDto {
  constructor(eventos) {
    this.eventos = eventos.map(
      evento => new EventoDto(evento)
    );
  }
}
