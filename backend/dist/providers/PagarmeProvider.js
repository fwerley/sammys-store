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
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
const moment_1 = __importDefault(require("moment"));
const prismaClient_1 = require("../database/prismaClient");
const PagarmeClient_1 = require("./PagarmeClient");
class PagarmeProvider {
    process(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prismaClient_1.prismaClient.order.findUnique({
                where: {
                    id: params.orderCode,
                },
                include: {
                    orderItems: true,
                    orderPrice: true,
                    user: true,
                    shippingAddress: true
                }
            });
            if (!order) {
                throw `Order ${order} was not found`;
            }
            let clientType = cpf_cnpj_validator_1.cpf.isValid(order.user.document) ? 'individual' : 'company';
            const address = {
                line_1: order.shippingAddress.address,
                line_2: order.shippingAddress.number,
                zip_code: order.shippingAddress.postalCode,
                city: order.shippingAddress.city,
                state: order.shippingAddress.federativeUnity,
                country: 'BR'
            };
            const phones = {
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
            const customer = {
                name: order.user.name,
                type: clientType,
                email: order.user.email,
                // document: order.user.document!,
                document: order.user.document.replace(/[^?0-9]/g, ""),
                //Adress
                address,
                //Phones
                phones
            };
            const shipping = {
                amount: order.orderPrice.shippingPrice * 100,
                description: "Entregar com urgencia",
                recipient_name: order.shippingAddress.fullName,
                recipient_phone: order.shippingAddress.number,
                //O endereço de entrega pode não ser o endereço de cadastro do usuario
                //Adress - CONSERTAR NO TYPES DO PAGARME , POIS O ENDEREÇO DE CADASTRO NÃO É NECESSARIAMENTE O ENDEREÇO DE ENTREGA
                address
            };
            let items = yield Promise.all(order.orderItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                let arrayItems;
                let dbProduct = yield prismaClient_1.prismaClient.product.findUnique({
                    where: {
                        id: item.productId
                    }
                });
                arrayItems = {
                    amount: item.quantity * dbProduct.price * 100,
                    description: dbProduct.name,
                    quantity: item.quantity,
                    code: item.productId
                };
                return arrayItems;
            })));
            const billetParams = [{
                    boleto: {
                        bank: '001',
                        document_number: "ID TRANSACTION",
                        instructions: 'Pagar até a data limite',
                        due_at: new Date((0, moment_1.default)().add(3, "days").toISOString()),
                        //  document_number: transaction.code,
                        type: 'BDP',
                        statement_descriptor: "Sammys Store"
                    },
                    amount: order.orderPrice.totalPrice * 100,
                    payment_method: 'boleto'
                }];
            const creditCardParams = [{
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
                        statement_descriptor: `Sammys Store`
                    },
                    amount: Math.trunc(order.orderPrice.totalPrice * 100),
                    payment_method: 'credit_card'
                }];
            let payments;
            switch (params.paymentType) {
                case 'CREDIT_CARD':
                    payments = creditCardParams;
                    break;
                case 'BILLET':
                    payments = billetParams;
                    break;
                default:
                    throw `PaymentType ${params.paymentType} not found.`;
            }
            try {
                let data = {
                    customer,
                    shipping,
                    items,
                    payments
                };
                const response = yield PagarmeClient_1.basePagarme.post("orders", data);
                const returnStatus = {
                    transactionId: response.data.id,
                    status: this.translateStatus(response.data.status),
                    card: params.paymentType == "CREDIT_CARD" ? {
                        id: response.data.charges[0].last_transaction.card.id
                    } : undefined,
                    billet: params.paymentType == "BILLET" ? {
                        barcode: response.data.charges[0].last_transaction.barcode,
                        url: response.data.charges[0].last_transaction.url,
                    } : undefined,
                    processorResponse: JSON.stringify(response.data)
                };
                return returnStatus;
            }
            catch (errors) {
                console.debug(errors.response.data.errors);
                throw `Error creating transaction.`;
            }
        });
    }
    updatestatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prismaClient_1.prismaClient.transaction.findUnique({
                where: {
                    code: params.code
                }
            });
            if (!transaction) {
                throw `Transaction ${params.code} not found.`;
            }
            const status = this.translateStatus(params.providerStatus);
            if (!status) {
                throw `Status is empty.`;
            }
            const transactionUpdated = yield prismaClient_1.prismaClient.transaction.update({
                where: {
                    code: params.code
                },
                data: {
                    status
                }
            });
            return transactionUpdated;
        });
    }
    translateStatus(status) {
        const statusMap = {
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
            viewed: "PENDING",
        };
        return statusMap[status];
    }
}
exports.default = PagarmeProvider;
// export default PagarmeProvider
//# sourceMappingURL=PagarmeProvider.js.map