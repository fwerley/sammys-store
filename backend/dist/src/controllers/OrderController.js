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
Object.defineProperty(exports, "__esModule", { value: true });
var prismaClient_1 = require("../database/prismaClient");
exports.default = {
    insert: function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, orderPrice, paymentMethod, shippingAddress, orderItems, shippingPrice, taxPrice, priceItems, createOrder;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = req.body, orderPrice = _b.orderPrice, paymentMethod = _b.paymentMethod, shippingAddress = _b.shippingAddress, orderItems = _b.orderItems;
                        shippingPrice = orderPrice.shippingPrice;
                        taxPrice = orderPrice.taxPrice;
                        return [4 /*yield*/, orderItems.reduce(function (price, item) { return __awaiter(_this, void 0, void 0, function () {
                                var nPrice, countPrice;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, price];
                                        case 1:
                                            nPrice = _a.sent();
                                            return [4 /*yield*/, prismaClient_1.prismaClient.product.findUnique({
                                                    where: {
                                                        id: item.id,
                                                    },
                                                })];
                                        case 2:
                                            countPrice = _a.sent();
                                            if (countPrice) {
                                                return [2 /*return*/, nPrice + countPrice.price * item.quantity];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve(0))];
                    case 1:
                        priceItems = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.order.create({
                                data: {
                                    orderItems: {
                                        createMany: {
                                            data: orderItems.map(function (item) { return ({
                                                quantity: item.quantity,
                                                productId: item.id,
                                            }); }),
                                        },
                                    },
                                    shippingAddress: {
                                        create: shippingAddress,
                                    },
                                    orderPrice: {
                                        create: {
                                            itemsPrice: priceItems,
                                            shippingPrice: shippingPrice,
                                            taxPrice: taxPrice,
                                            totalPrice: priceItems + shippingPrice + taxPrice,
                                        },
                                    },
                                    paymentMethod: paymentMethod,
                                    user: {
                                        connect: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
                                    }
                                },
                            })];
                    case 2:
                        createOrder = _c.sent();
                        res.status(201).json({ order: createOrder });
                        return [2 /*return*/];
                }
            });
        });
    },
    mine: function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.order.findMany({
                            where: {
                                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
                            },
                            include: {
                                orderPrice: true
                            }
                        })];
                    case 1:
                        orders = _b.sent();
                        res.send(orders);
                        return [2 /*return*/];
                }
            });
        });
    },
    find: function (req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var idOrder, order;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        idOrder = req.params.id;
                        return [4 /*yield*/, prismaClient_1.prismaClient.order.findUnique({
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
                            })];
                    case 1:
                        order = _b.sent();
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
                        return [2 /*return*/];
                }
            });
        });
    },
    updatePrice: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idOrder, _a, taxPrice, totalPrice, order, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        idOrder = req.params.id;
                        _a = req.body, taxPrice = _a.taxPrice, totalPrice = _a.totalPrice;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prismaClient_1.prismaClient.order.update({
                                where: {
                                    id: idOrder,
                                },
                                data: {
                                    orderPrice: {
                                        update: {
                                            taxPrice: taxPrice,
                                            totalPrice: totalPrice
                                        }
                                    }
                                }
                            })];
                    case 2:
                        order = _b.sent();
                        res.status(201).json({ message: "Taxa de compra atualizado" });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        res.status(401).send({ message: 'Requisição não autorizada' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=OrderController.js.map