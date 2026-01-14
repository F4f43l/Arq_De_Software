import { describe, it, expect, vi } from 'vitest';
import { ReportServiceImpl } from './ReportServiceImpl';
import { InvalidReportSizeError } from './InvalidReportSizeError';

describe('ReportService', () => {
  it('deve lançar InvalidReportSizeError se n for negativo', () => {
    // Mock das dependências
    const mailerMock = { send: vi.fn() };
    const loggerMock = { info: vi.fn(), log: vi.fn() };
    
    const service = new ReportServiceImpl(loggerMock as any, mailerMock as any);

    expect(() => service.generateAndSend('rafa@teste.com', -5)).rejects.toThrow(InvalidReportSizeError);
  });

  it('deve lançar InvalidReportSizeError se n for maior que 10', () => {
    const mailerMock = { send: vi.fn() };
    const loggerMock = { info: vi.fn(), log: vi.fn() };
    
    const service = new ReportServiceImpl(loggerMock as any, mailerMock as any);

    expect(() => service.generateAndSend('rafa@teste.com', 15)).rejects.toThrow(InvalidReportSizeError);
  });

  it('deve chamar o método send do mailer em caso de sucesso', async () => {
    const mailerMock = { send: vi.fn().mockResolvedValue(undefined) };
    const loggerMock = { info: vi.fn(), log: vi.fn() };
    
    const service = new ReportServiceImpl(loggerMock as any, mailerMock as any);

    await service.generateAndSend('rafa@teste.com', 5);

    // Verifica se o mailer foi chamado com o e-mail correto
    expect(mailerMock.send).toHaveBeenCalledWith(
      'rafa@teste.com',
      'Relatório Gerado',
      expect.any(String)
    );
  });

  it('deve chamar o logger ao iniciar e finalizar a geração', async () => {
    const mailerMock = { send: vi.fn().mockResolvedValue(undefined) };
    const loggerMock = { info: vi.fn(), log: vi.fn() };
    
    const service = new ReportServiceImpl(loggerMock as any, mailerMock as any);

    await service.generateAndSend('rafa@teste.com', 3);

    // Verifica se o logger foi chamado
    expect(loggerMock.info).toHaveBeenCalledWith('Iniciando geração de relatório');
    expect(loggerMock.info).toHaveBeenCalledWith('Relatório enviado com sucesso');
  });
});