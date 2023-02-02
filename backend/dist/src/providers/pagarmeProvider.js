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
var cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
var moment_1 = __importDefault(require("moment"));
var prismaClient_1 = require("../database/prismaClient");
var pagarmeClient_1 = require("./pagarmeClient");
var PagarmeProvider = /** @class */ (function () {
    function PagarmeProvider() {
    }
    PagarmeProvider.prototype.process = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var order, clientType, address, phones, customer, shipping, items, billetParams, creditCardParams, payments, data, response, returnStatus, errors_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.order.findUnique({
                            where: {
                                id: params.orderCode
                            },
                            include: {
                                orderItems: true,
                                orderPrice: true,
                                user: true,
                                shippingAddress: true
                            }
                        })];
                    case 1:
                        order = _a.sent();
                        if (!order) {
                            throw "Order ".concat(order, " was not found");
                        }
                        clientType = cpf_cnpj_validator_1.cpf.isValid(order.user.document) ? 'individual' : 'company';
                        address = {
                            line_1: order.shippingAddress.address,
                            line_2: order.shippingAddress.number,
                            zip_code: order.shippingAddress.postalCode,
                            city: order.shippingAddress.city,
                            state: order.shippingAddress.federativeUnity,
                            country: 'BR'
                        };
                        phones = {
                            home_phone: {
                                country_code: '55',
                                area_code: '21',
                                number: '000000000'
                            },
                            mobile_phone: {
                                country_code: '55',
                                area_code: '21',
                                number: '000000000'
                            }
                        };
                        customer = {
                            name: order.user.name,
                            type: clientType,
                            email: order.user.email,
                            // document: order.user.document!,
                            document: order.user.document.replace(/[^?0-9]/g, ""),
                            //Adress
                            address: address,
                            //Phones
                            phones: phones
                        };
                        shipping = {
                            amount: order.orderPrice.shippingPrice * 100,
                            description: "Entregar com urgencia",
                            recipient_name: order.shippingAddress.fullName,
                            recipient_phone: order.shippingAddress.number,
                            //O endereço de entrega pode não ser o endereço de cadastro do usuario
                            //Adress - CONSERTAR NO TYPES DO PAGARME , POIS O ENDEREÇO DE CADASTRO NÃO É NECESSARIAMENTE O ENDEREÇO DE ENTREGA
                            address: address
                        };
                        return [4 /*yield*/, Promise.all(order.orderItems.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var arrayItems, dbProduct;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prismaClient_1.prismaClient.product.findUnique({
                                                where: {
                                                    id: item.productId
                                                }
                                            })];
                                        case 1:
                                            dbProduct = _a.sent();
                                            arrayItems = {
                                                amount: item.quantity * dbProduct.price * 100,
                                                description: dbProduct.name,
                                                quantity: item.quantity,
                                                code: item.productId
                                            };
                                            return [2 /*return*/, arrayItems];
                                    }
                                });
                            }); }))];
                    case 2:
                        items = _a.sent();
                        billetParams = [{
                                boleto: {
                                    bank: '001',
                                    document_number: "ID TRANSACTION",
                                    instructions: 'Pagar até a data limite',
                                    due_at: new Date((0, moment_1["default"])().add(3, "days").toISOString()),
                                    //  document_number: transaction.code,
                                    type: 'BDP',
                                    statement_descriptor: "Sammys Store"
                                },
                                amount: order.orderPrice.totalPrice * 100,
                                payment_method: 'boleto'
                            }];
                        creditCardParams = [{
                                credit_card: {
                                    card: {
                                        billing_address: address,
                                        number: params.creditCard.number.replace(/[^?0-9]/g, ""),
                                        holder_name: params.creditCard.holderName,
                                        exp_month: params.creditCard.expiration.split("/")[0],
                                        exp_year: params.creditCard.expiration.split("/")[1],
                                        cvv: params.creditCard.cvv
                                    },
                                    operation_type: "auth_and_capture",
                                    recurrence: false,
                                    installments: params.installments,
                                    statement_descriptor: "Sammys Store"
                                },
                                amount: Math.trunc(order.orderPrice.totalPrice * 100),
                                payment_method: 'credit_card'
                            }];
                        switch (params.paymentType) {
                            case 'CREDIT_CARD':
                                payments = creditCardParams;
                                break;
                            case 'BILLET':
                                payments = billetParams;
                                break;
                            default:
                                throw "PaymentType ".concat(params.paymentType, " not found.");
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        data = {
                            customer: customer,
                            shipping: shipping,
                            items: items,
                            payments: payments
                        };
                        return [4 /*yield*/, pagarmeClient_1.basePagarme.post("orders", data)];
                    case 4:
                        response = _a.sent();
                        returnStatus = {
                            transactionId: response.data.id,
                            status: this.translateStatus(response.data.status),
                            card: params.paymentType == "CREDIT_CARD" ? {
                                id: response.data.charges[0].last_transaction.card.id
                            } : undefined,
                            billet: params.paymentType == "BILLET" ? {
                                barcode: response.data.charges[0].last_transaction.barcode,
                                url: response.data.charges[0].last_transaction.url
                            } : undefined,
                            processorResponse: JSON.stringify(response.data)
                        };
                        return [2 /*return*/, returnStatus];
                    case 5:
                        errors_1 = _a.sent();
                        console.debug(errors_1.response.data.errors);
                        throw "Error creating transaction.";
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PagarmeProvider.prototype.updatestatus = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, status, transactionUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.transaction.findUnique({
                            where: {
                                code: params.code
                            }
                        })];
                    case 1:
                        transaction = _a.sent();
                        if (!transaction) {
                            throw "Transaction ".concat(params.code, " not found.");
                        }
                        status = this.translateStatus(params.providerStatus);
                        if (!status) {
                            throw "Status is empty.";
                        }
                        return [4 /*yield*/, prismaClient_1.prismaClient.transaction.update({
                                where: {
                                    code: params.code
                                },
                                data: {
                                    status: status
                                }
                            })];
                    case 2:
                        transactionUpdated = _a.sent();
                        return [2 /*return*/, transactionUpdated];
                }
            });
        });
    };
    PagarmeProvider.prototype.translateStatus = function (status) {
        var statusMap = {
            processing: "PROCESSING",
            waiting_payment: "PENDING",
            authorized: "PENDING",
            paid: "APPROVED",
            refused: "REFUSED",
            pending_refund: "REFUNDED",
            refunded: "REFUNDED",
            canceled: "REFUNDED",
            chargedback: "CHARGBACK",
            failed: "ERROR",
            with_error: "ERROR",
            partial_void: "ERROR",
            error_on_refunding: "ERROR",
            authorized_pending_capture: "PROCESSING",
            not_authorized: "REFUSED",
            captured: "APPROVED",
            partial_capture: "PROCESSING",
            waiting_capture: "PROCESSING",
            voided: "REFUSED",
            generated: "PROCESSING",
            viewed: "PENDING"
        };
        return statusMap[status];
    };
    return PagarmeProvider;
}());
exports["default"] = PagarmeProvider;
//# sourceMappingURL=pagarmeProvider.js.map