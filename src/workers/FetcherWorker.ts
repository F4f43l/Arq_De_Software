import { atualizarStatus, obterPedido } from "../domain/Order";

export async function workerFetcher(idPedido: string) {
  const pedido = obterPedido(idPedido);
  if (!pedido) return;

  try {
    if (Math.random() < 0.3) {
      throw new Error("API fora do ar");
    }
    console.log(`Buscando dados...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Dados obtidos!`);
    atualizarStatus(idPedido, "completo");
  } catch (erro: any) {
    console.log(`Erro: ${erro.message}`);
    atualizarStatus(idPedido, "falho", erro.message);
  }
}
