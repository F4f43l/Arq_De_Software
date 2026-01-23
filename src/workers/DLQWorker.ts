import { obterPedido } from "../domain/Order";

export async function workerDLQ(idPedido: string) {
  const pedido = obterPedido(idPedido);
  if (!pedido) return;

  console.log(`\n⚠️  [ERRO] Pedido ${idPedido} falhou!`);
  console.log(`   Email: ${pedido.email}`);
  console.log(`   Erro: ${pedido.erro}\n`);
}
