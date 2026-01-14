import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { ReportService } from '../domain/ReportService';
import { InvalidReportSizeError } from '../domain/InvalidReportSizeError';

// Simulação do router
const createReportRouter = (reportService: ReportService) => {
  return {
    handleGenerateReport: async (req: Request, res: Response) => {
      try {
        const n = Number(req.params.n);
        const email = req.query.email as string;

        if (!email) {
          return res.status(400).json({ error: 'Email é obrigatório' });
        }

        await reportService.generateAndSend(email, n);

        res.status(200).json({ message: 'Relatório enviado com sucesso' });
      } catch (error) {
        if (error instanceof InvalidReportSizeError) {
          return res.status(400).json({ error: (error as Error).message });
        }

        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  };
};

describe('ReportController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let reportServiceMock: Partial<ReportService>;
  let statusSpy: any;
  let jsonSpy: any;

  beforeEach(() => {
    // Mock do response
    jsonSpy = vi.fn().mockReturnValue({});
    statusSpy = vi.fn().mockReturnValue({ json: jsonSpy });
    
    res = {
      status: statusSpy,
      json: jsonSpy
    };

    // Mock do request
    req = {
      params: {},
      query: {}
    };

    // Mock do serviço
    reportServiceMock = {
      generateAndSend: vi.fn()
    };
  });

  describe('Sucesso (200)', () => {
    it('deve retornar 200 ao gerar relatório com sucesso', async () => {
      req.params = { n: '5' };
      req.query = { email: 'usuario@teste.com' };

      const router = createReportRouter(reportServiceMock as ReportService);
      await router.handleGenerateReport(req as Request, res as Response);

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: 'Relatório enviado com sucesso'
      });
    });

    it('deve chamar o serviço com os parâmetros corretos', async () => {
      req.params = { n: '10' };
      req.query = { email: 'teste@email.com' };

      const router = createReportRouter(reportServiceMock as ReportService);
      await router.handleGenerateReport(req as Request, res as Response);

      expect(reportServiceMock.generateAndSend).toHaveBeenCalledWith(
        'teste@email.com',
        10
      );
    });
  });

  describe('Erro 400 - Bad Request', () => {
    it('deve retornar 400 se email não for fornecido', async () => {
      req.params = { n: '5' };
      req.query = {};

      const router = createReportRouter(reportServiceMock as ReportService);
      await router.handleGenerateReport(req as Request, res as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Email é obrigatório'
      });
    });

    it('deve retornar 400 se o tamanho do relatório for inválido', async () => {
      req.params = { n: '15' };
      req.query = { email: 'usuario@teste.com' };

      // Mock do serviço para lançar erro
      reportServiceMock.generateAndSend = vi.fn().mockRejectedValue(
        new InvalidReportSizeError()
      );

      const router = createReportRouter(reportServiceMock as ReportService);
      await router.handleGenerateReport(req as Request, res as Response);

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Número máximo de registros permitido é 10'
      });
    });
  });

  describe('Erro 500 - Internal Server Error', () => {
    it('deve retornar 500 em caso de erro genérico', async () => {
      req.params = { n: '5' };
      req.query = { email: 'usuario@teste.com' };

      // Mock do serviço para lançar erro genérico
      reportServiceMock.generateAndSend = vi.fn().mockRejectedValue(
        new Error('Erro ao enviar email')
      );

      const router = createReportRouter(reportServiceMock as ReportService);
      await router.handleGenerateReport(req as Request, res as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Erro interno do servidor'
      });
    });

    it('deve retornar 500 quando o mailer falhar', async () => {
      req.params = { n: '3' };
      req.query = { email: 'usuario@teste.com' };

      reportServiceMock.generateAndSend = vi.fn().mockRejectedValue(
        new Error('Falha ao conectar ao servidor de email')
      );

      const router = createReportRouter(reportServiceMock as ReportService);
      await router.handleGenerateReport(req as Request, res as Response);

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        error: 'Erro interno do servidor'
      });
    });
  });
});