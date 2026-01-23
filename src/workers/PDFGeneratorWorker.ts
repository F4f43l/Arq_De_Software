import { atualizarStatus, obterPedido } from "../domain/Order";

export async function workerGerarPDF(idPedido: string) {
  const pedido = obterPedido(idPedido);
  if (!pedido) return;

  try {
    console.log(`✓ Gerando PDF...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`✓ PDF criado!`);
    atualizarStatus(idPedido, "completo");
  } catch (erro: any) {
    console.log(`❌ Erro: ${erro.message}`);
    atualizarStatus(idPedido, "falho", erro.message);
  }
}
