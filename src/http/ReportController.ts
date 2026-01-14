import { Request, Response, Router } from "express";
import { container } from "../infra/container";
import { TYPES } from "../types";
import { ReportService } from "../domain/ReportService";
import { InvalidReportSizeError } from "../domain/InvalidReportSizeError";

const router = Router();

router.get("/relatorio/:n", async (req: Request, res: Response) => {
  try {
    const n = Number(req.params.n);
    const email = req.query.email as string;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    const service = container.get<ReportService>(TYPES.ReportService);
    await service.generateAndSend(email, n);

    res.status(200).json({ message: "Relatório enviado com sucesso" });
  } catch (error) {
    if (error instanceof InvalidReportSizeError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export { router };
