"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const Yup = __importStar(require("yup"));
const TransactionServide_1 = __importDefault(require("../services/TransactionServide"));
/**
 * Controller responsavel por lincar a criação de uma transação de compra, com todos os dados necessarios para registrar a requisição
 * @param {Request} req
 * @param {Response} res
 */
exports.default = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: orderId } = req.params;
            // TODO: Reavaliar os tipos para Customer e Billing, retirar do prisma a tipagem
            const { paymentType, installments, customerName, customerEmail, customerMobile, customerDocument, billingAddress, billingNumber, billingNeighborhood, billingCity, billingState, billingZipCode, creditCardNumber, creditCardExpiration, creditCardHolderName, creditCardCvv } = req.body;
            try {
                const schema = Yup.object({
                    // orderCode: Yup.string().required(),
                    paymentType: Yup.mixed().oneOf(["BILLET", "CREDIT_CARD"]).required(),
                    installments: Yup.number().min(1).when("paymentType", (paymentType, schema) => paymentType === "CREDIT_CARD" ? schema.max(12) : schema.max(1)),
                    customerName: Yup.string().required(),
                    customerEmail: Yup.string().required().email(),
                    customerMobile: Yup.string()
                        .required()
                        .test("is-valid-mobile", "${path} is not a number", (value) => (0, libphonenumber_js_1.default)(value, "BR").isValid()),
                    customerDocument: Yup.string()
                        .required()
                        .test("is-valid-document", "${path} is not a valid CPF / CNPJ", (value) => cpf_cnpj_validator_1.cpf.isValid(value) || cpf_cnpj_validator_1.cnpj.isValid(value)),
                    billingAddress: Yup.string().required(),
                    billingNumber: Yup.string().required(),
                    billingNeighborhood: Yup.string().required(),
                    billingCity: Yup.string().required(),
                    billingState: Yup.string().required(),
                    billingZipCode: Yup.string().required(),
                    creditCardNumber: Yup.string().when("paymentType", (paymentType, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                    creditCardExpiration: Yup.string().when("paymentType", (paymentType, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                    creditCardHolderName: Yup.string().when("paymentType", (paymentType, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                    creditCardCvv: Yup.string().when("paymentType", (paymentType, schema) => paymentType === "CREDIT_CARD" ? schema.required() : schema),
                });
                if (!(yield schema.isValid(req.body))) {
                    return res.status(400).send({
                        error: "Por favor, verifique os dados enviados e tente novamente"
                    });
                }
                const order = yield prismaClient_1.prismaClient.order.findUnique({
                    where: {
                        id: orderId,
                    },
                    include: {
                        user: true
                    },
                });
                if (!order) {
                    return res.status(404).send({ message: "Order not found" });
                }
                const service = yield (0, TransactionServide_1.default)({
                    billing: {
                        address: billingAddress,
                        city: billingCity,
                        federativeUnity: billingState,
                        fullName: customerName,
                        postalCode: billingZipCode,
                        number: billingNumber,
                        neighborhood: billingNeighborhood,
                        createdAt: new Date(),
                        id: "pkpojpo",
                        updatedAt: new Date(),
                        userId: ""
                    },
                    creditCard: {
                        cvv: creditCardCvv,
                        expiration: creditCardExpiration,
                        holderName: creditCardHolderName,
                        number: creditCardNumber
                    },
                    customer: Object.assign(Object.assign({}, order.user), { document: customerDocument }),
                    installments,
                    orderCode: order.id,
                    paymentType
                });
                const statusTransaction = service.status;
                switch (statusTransaction) {
                    case 'APPROVED':
                        res.status(201).json({ message: 'Pagamento aprovado', payment: service });
                        break;
                    case 'PENDING':
                        res.status(202).json({ message: 'Pagamento em análise', payment: service });
                        break;
                    case 'PROCESSING':
                        res.status(202).json({ message: 'Pagamento em análise', payment: service });
                        break;
                    case 'STARTED':
                        res.status(202).json({ message: 'Pagamento em análise', payment: service });
                        break;
                    default:
                        res.status(200).json({ message: "Transação criada." });
                }
            }
            catch (error) {
                res.status(400).send({ message: 'Erro ao criar a transação: ' + error });
            }
        });
    },
    transaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: orderId } = req.params;
            const result = yield prismaClient_1.prismaClient.transaction.findUnique({
                where: {
                    orderId,
                },
            });
            if (result) {
                res.status(200).send(result);
            }
            else {
                res.status(404).send({ message: 'Transação não encontrado' });
            }
        });
    }
};
//# sourceMappingURL=PaymentController.js.map