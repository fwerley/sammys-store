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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../database/prismaClient");
const PagarmeProvider_1 = __importDefault(require("../providers/PagarmeProvider"));
var gatwayPay;
exports.default = {
    pagarme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            gatwayPay = new PagarmeProvider_1.default();
            const { data: { status, id }, type } = req.body;
            console.log(`Chargeback: STATUS -> ${status} |  ID -> ${id} | TYPE -> ${type}`);
            try {
                switch (type.split('.')[0]) {
                    case 'order':
                        const transaction = yield prismaClient_1.prismaClient.transaction.findUnique({
                            where: {
                                transactionId: id
                            }
                        });
                        if (!transaction) {
                            return res.status(404).json();
                        }
                        const transactionUpdated = yield gatwayPay.updatestatus({ code: transaction.code, providerStatus: status });
                        if (transactionUpdated.status === "APPROVED") {
                            yield prismaClient_1.prismaClient.transaction.update({
                                where: {
                                    id: transaction.id
                                },
                                data: {
                                    paidAt: new Date().toISOString()
                                }
                            });
                            yield prismaClient_1.prismaClient.order.update({
                                where: {
                                    id: transactionUpdated.orderId
                                },
                                data: {
                                    isPaid: true,
                                }
                            });
                        }
                        res.status(200).send("Status atualizado");
                        break;
                    default:
                        return;
                }
            }
            catch (error) {
                console.debug("Error Update Status: ", error);
                res.status(500).json({ error: "Internal server error" });
            }
            res.status(200).end();
        });
    }
};
//# sourceMappingURL=PostBackControler.js.map