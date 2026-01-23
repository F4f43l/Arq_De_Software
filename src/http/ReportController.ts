import { Request, Response, Router } from "express";
import { criarPedido, obterPedido } from "../domain/Order";
import { publish } from "../infra/EventBus";

const router = Router();

router.get("/relatorio/:n", (req: Request, res: Response) => {
  try {
    const n = Number(req.params.n);
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ erro: "Email obrigatório" });
    }

    if (n <= 0 || n > 10) {
      return res.status(400).json({ erro: "N deve ser 1-10" });
    }

    const pedido = criarPedido(email, n);
    publish("process:fetch", { idPedido: pedido.id });

    res.status(202).json({
      mensagem: "Pedido criado",
      idPedido: pedido.id,
      status: pedido.status
    });
  } catch (erro: any) {
    res.status(500).json({ erro: "Erro" });
  }
});

router.get("/status/:idPedido", (req: Request, res: Response) => {
  const { idPedido } = req.params;
  const pedido = obterPedido(idPedido);

  if (!pedido) {
    return res.status(404).json({ erro: "Pedido não encontrado" });
  }

  res.status(200).json(pedido);
});

export { router };
