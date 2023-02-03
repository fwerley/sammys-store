"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const correios_brasil_1 = require("correios-brasil");
exports.default = {
    precoprazo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sCepOrigem, sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nVlDiametro } = req.body;
            const nCdServico = req.body.nCdServico;
            const args = {
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
                (0, correios_brasil_1.calcularPrecoPrazo)(args).then((response) => {
                    res.status(200).send(response);
                });
            }
            catch (e) {
                res.status(400).send({ message: 'Verifique o CEP de destino e tente novamente' });
            }
        });
    }
};
//# sourceMappingURL=CorreiosController.js.map