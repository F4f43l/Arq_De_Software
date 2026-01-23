export const pedidos: any = {};

export function criarPedido(email: string, n: number) {
  const id = Date.now().toString();
  pedidos[id] = {
    id: id,
    email: email,
    n: n,
    status: "pendente",
    erro: null
  };
  return pedidos[id];
}

export function obterPedido(id: string) {
  return pedidos[id];
}

export function atualizarStatus(id: string, novoStatus: string, erro: string = null) {
  if (pedidos[id]) {
    pedidos[id].status = novoStatus;
    if (erro) {
      pedidos[id].erro = erro;
    }
  }
}
