import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { router } from "./http/ReportController";

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
