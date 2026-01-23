import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { router } from "./http/ReportController";
import { subscribe } from "./infra/EventBus";
import { workerFetcher } from "./workers/FetcherWorker";
import { workerGerarPDF } from "./workers/PDFGeneratorWorker";
import { workerDLQ } from "./workers/DLQWorker";

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

subscribe("process:fetch", (d: any) => workerFetcher(d.idPedido));
subscribe("process:gen_pdf", (d: any) => workerGerarPDF(d.idPedido));
subscribe("process:failed", (d: any) => workerDLQ(d.idPedido));

const port = process.env.APP_PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
