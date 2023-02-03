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
const prismaClient_1 = require("../database/prismaClient");
exports.default = {
    insert(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { orderPrice, paymentMethod, shippingAddress, orderItems } = req.body;
            let shippingPrice = orderPrice.shippingPrice;
            let taxPrice = orderPrice.taxPrice;
            // Verificação backend do produto. Evitar fraudes na alteração manual do preço dos itens
            const priceItems = yield orderItems.reduce((price, item) => __awaiter(this, void 0, void 0, function* () {
                const nPrice = yield price;
                const countPrice = yield prismaClient_1.prismaClient.product.findUnique({
                    where: {
                        id: item.id,
                    },
                });
                if (countPrice) {
                    return nPrice + countPrice.price * item.quantity;
                }
            }), Promise.resolve(0));
            const createOrder = yield prismaClient_1.prismaClient.order.create({
                data: {
                    orderItems: {
                        createMany: {
                            data: orderItems.map((item) => ({
                                quantity: item.quantity,
                                productId: item.id,
                            })),
                        },
                    },
                    shippingAddress: {
                        create: shippingAddress,
                    },
                    orderPrice: {
                        create: {
                            itemsPrice: priceItems,
                            shippingPrice,
                            taxPrice,
                            totalPrice: priceItems + shippingPrice + taxPrice,
                        },
                    },
                    paymentMethod: paymentMethod,
                    user: {
                        connect: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                    }
                },
            });
            res.status(201).json({ order: createOrder });
        });
    },
    mine(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield prismaClient_1.prismaClient.order.findMany({
                where: {
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
                },
                include: {
                    orderPrice: true
                }
            });
            res.send(orders);
        });
    },
    find(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const idOrder = req.params.id;
            const order = yield prismaClient_1.prismaClient.order.findUnique({
                where: {
                    id: idOrder,
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    orderPrice: true,
                    shippingAddress: true,
                    user: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (order) {
                if (order.user.id === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    res.send(order);
                }
                else {
                    res.status(401).send({ message: 'Requisição não autorizada' });
                }
            }
            else {
                res.status(404).send({ message: 'Ordem não encontrada' });
            }
        });
    },
    updatePrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idOrder = req.params.id;
            const { taxPrice, totalPrice } = req.body;
            try {
                const order = yield prismaClient_1.prismaClient.order.update({
                    where: {
                        id: idOrder,
                    },
                    data: {
                        orderPrice: {
                            update: {
                                taxPrice,
                                totalPrice
                            }
                        }
                    }
                });
                res.status(201).json({ message: "Taxa de compra atualizado" });
            }
            catch (error) {
                res.status(401).send({ message: 'Requisição não autorizada' });
            }
        });
    }
};
//# sourceMappingURL=OrderController.js.map