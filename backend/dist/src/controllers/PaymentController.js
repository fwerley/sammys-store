"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prismaClient_1 = require("../database/prismaClient");
var libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
var cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
var Yup = __importStar(require("yup"));
var TransactionServide_1 = __importDefault(require("../services/TransactionServide"));
/**
 * Controller responsavel por lincar a criação de uma transação de compra, com todos os dados necessarios para registrar a requisição
 * @param {Request} req
 * @param {Response} res
 */
exports["default"] = {
    create: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, _a, paymentType, installments, customerName, customerEmail, customerMobile, customerDocument, billingAddress, billingNumber, billingNeighborhood, billingCity, billingState, billingZipCode, creditCardNumber, creditCardExpiration, creditCardHolderName, creditCardCvv, schema, order, service, statusTransaction, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderId = req.params.id;
                        _a = req.body, paymentType = _a.paymentType, installments = _a.installments, customerName = _a.customerName, customerEmail = _a.customerEmail, customerMobile = _a.customerMobile, customerDocument = _a.customerDocument, billingAddress = _a.billingAddress, billingNumber = _a.billingNumber, billingNeighborhood = _a.billingNeighborhood, billingCity = _a.billingCity, billingState = _a.billingState, billingZipCode = _a.billingZipCode, creditCardNumber = _a.creditCardNumber, creditCardExpiration = _a.creditCardExpiration, creditCardHolderName = _a.creditCardHolderName, creditCardCvv = _a.creditCardCvv;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        schema = Yup.object({
                            // orderCode: Yup.string().required(),
                            paymentType: Yup.mixed().oneOf(["BILLET", "CREDIT_CARD"]).required(),
                            installments: Yup.number().min(1).when("paymentType", function (paymentType, schema) { return paymentType === "CREDIT_CARD" ? schema.max(12) : schema.max(1); }),
                            customerName: Yup.string().required(),
                            customerEmail: Yup.string().required().email(),
                            customerMobile: Yup.string()
                                .required()
                                .test("is-valid-mobile", "${path} is not a number", function (value) {
                                return (0, libphonenumber_js_1["default"])(value, "BR").isValid();
                            }),
                            customerDocument: Yup.string()
                                .required()
                                .test("is-valid-document", "${path} is not a valid CPF / CNPJ", function (value) {
                                return cpf_cnpj_validator_1.cpf.isValid(value) || cpf_cnpj_validator_1.cnpj.isValid(value);
                            }),
                            billingAddress: Yup.string().required(),
                            billingNumber: Yup.string().required(),
                            billingNeighborhood: Yup.string().required(),
                            billingCity: Yup.string().required(),
                            billingState: Yup.string().required(),
                            billingZipCode: Yup.string().required(),
                            creditCardNumber: Yup.string().when("paymentType", function (paymentType, schema) {
                                return paymentType === "CREDIT_CARD" ? schema.required() : schema;
                            }),
                            creditCardExpiration: Yup.string().when("paymentType", function (paymentType, schema) {
                                return paymentType === "CREDIT_CARD" ? schema.required() : schema;
                            }),
                            creditCardHolderName: Yup.string().when("paymentType", function (paymentType, schema) {
                                return paymentType === "CREDIT_CARD" ? schema.required() : schema;
                            }),
                            creditCardCvv: Yup.string().when("paymentType", function (paymentType, schema) {
                                return paymentType === "CREDIT_CARD" ? schema.required() : schema;
                            })
                        });
                        return [4 /*yield*/, schema.isValid(req.body)];
                    case 2:
                        if (!(_b.sent())) {
                            return [2 /*return*/, res.status(400).send({
                                    error: "Por favor, verifique os dados enviados e tente novamente"
                                })];
                        }
                        return [4 /*yield*/, prismaClient_1.prismaClient.order.findUnique({
                                where: {
                                    id: orderId
                                },
                                include: {
                                    user: true
                                }
                            })];
                    case 3:
                        order = _b.sent();
                        if (!order) {
                            return [2 /*return*/, res.status(404).send({ message: "Order not found" })];
                        }
                        return [4 /*yield*/, (0, TransactionServide_1["default"])({
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
                                customer: __assign(__assign({}, order.user), { document: customerDocument }),
                                installments: installments,
                                orderCode: order.id,
                                paymentType: paymentType
                            })];
                    case 4:
                        service = _b.sent();
                        statusTransaction = service.status;
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
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        res.status(400).send({ message: 'Erro ao criar a transação: ' + error_1 });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    transaction: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var orderId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderId = req.params.id;
                        return [4 /*yield*/, prismaClient_1.prismaClient.transaction.findUnique({
                                where: {
                                    orderId: orderId
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            res.status(200).send(result);
                        }
                        else {
                            res.status(404).send({ message: 'Transação não encontrado' });
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=PaymentController.js.map