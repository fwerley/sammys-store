import { calcularPrecoPrazo } from 'correios-brasil';
import { Request, Response } from 'express';

interface PrecoPrazoRequest {
	sCepOrigem: string;
	sCepDestino: string;
	nVlPeso: string;
	nCdFormato: string;
	nVlComprimento: string;
	nVlAltura: string;
	nVlLargura: string;
	nCdServico: Array<string>;
	nVlDiametro: string;
	nCdEmpresa?: string;
	sDsSenha?: string;
	sCdMaoPropria?: string;
	nVlValorDeclarado?: string | number;
	sCdAvisoRecebimento?: string;
	nIndicaCalculo?: string | number;
}

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
          try{
            calcularPrecoPrazo(args).then((response) => {                      
              res.status(200).send(response);
            });
          }catch (e) {
            res.status(400).send({message: 'Verifique o CEP de destino e tente novamente'})
          }
    }
}