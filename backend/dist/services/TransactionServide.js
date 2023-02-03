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
const crypto_1 = require("crypto");
const prismaClient_1 = require("../database/prismaClient");
const PagarmeProvider_1 = __importDefault(require("../providers/PagarmeProvider"));
/**
 * Cria uma transação baseado no gatway utilizado
 * @param  {ProcessParams} params
 * @returns {Promise<Transaction>}
 */
const gatwayPay = new PagarmeProvider_1.default();
function transactionService(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield gatwayPay.process(params);
            const createOrUpdateTransanction = yield prismaClient_1.prismaClient.order.update({
                where: {
                    id: params.orderCode
                },
                data: {
                    transaction: {
                        upsert: {
                            create: {
                                code: (0, crypto_1.randomUUID)(),
                                installments: params.installments,
                                transactionId: response.transactionId,
                                status: response.status,
                                processorResponse: response.processorResponse
                            },
                            update: {
                                code: (0, crypto_1.randomUUID)(),
                                installments: params.installments,
                                transactionId: response.transactionId,
                                status: response.status,
                                processorResponse: response.processorResponse
                            }
                        }
                    }
                },
                include: {
                    transaction: true
                }
            });
            return createOrUpdateTransanction.transaction;
        }
        catch (error) {
            console.debug(error);
            return Promise.reject(error);
        }
    });
}
exports.default = transactionService;
//# sourceMappingURL=TransactionServide.js.map