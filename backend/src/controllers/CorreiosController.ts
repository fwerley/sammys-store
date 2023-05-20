import {
  PrecoPrazoRequest,
  PrecoPrazoResponse,
  calcularPrecoPrazo,
  rastrearEncomendas
} from 'correios-brasil';
import { Request, Response } from 'express';

export default {
  async precoprazo(req: Request, res: Response) {
    const {
      sCepOrigem,
      sCepDestino,
      nVlPeso,
      nCdFormato,
      nVlComprimento,
      nVlAltura,
      nVlLargura,
      nVlDiametro
    } = req.body;

    const nCdServico: Array<string> = req.body.nCdServico;

    const args: PrecoPrazoRequest = {
      sCepOrigem,
      sCepDestino,
      nVlPeso,
      nCdFormato,
      nVlComprimento,
      nVlAltura,
      nVlLargura,
      nCdServico,
      nVlDiametro
    };
    try {
      const response: Array<PrecoPrazoResponse> = await calcularPrecoPrazo(args)
      res.status(200).send(response);
    } catch (e) {
      res.status(400).send({ message: 'Verifique o CEP de destino e tente novamente' })
    }
  },

  async rastreamento(req: Request, res: Response) {
    const codRastreio = req.params.code
    // https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/caminhao-cor.png
    try {
      const response = await rastrearEncomendas([codRastreio]);
      res.send(response[0].eventos)
    } catch (error) {
      res.status(400).send({ message: 'Objeto não encontrado' })
    }
  }
}