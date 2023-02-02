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
var prismaClient_1 = require("../database/prismaClient");
var pagarmeProvider_1 = __importDefault(require("../providers/pagarmeProvider"));
var gatwayPay;
exports["default"] = {
    pagarme: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, status, id, type, _c, transaction, transactionUpdated, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        gatwayPay = new pagarmeProvider_1["default"]();
                        _a = req.body, _b = _a.data, status = _b.status, id = _b.id, type = _a.type;
                        console.log("Chargeback: STATUS -> ".concat(status, " |  ID -> ").concat(id, " | TYPE -> ").concat(type));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 10, , 11]);
                        _c = type.split('.')[0];
                        switch (_c) {
                            case 'order': return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 8];
                    case 2: return [4 /*yield*/, prismaClient_1.prismaClient.transaction.findUnique({
                            where: {
                                transactionId: id
                            }
                        })];
                    case 3:
                        transaction = _d.sent();
                        if (!transaction) {
                            return [2 /*return*/, res.status(404).json()];
                        }
                        return [4 /*yield*/, gatwayPay.updatestatus({ code: transaction.code, providerStatus: status })];
                    case 4:
                        transactionUpdated = _d.sent();
                        if (!(transactionUpdated.status === "APPROVED")) return [3 /*break*/, 7];
                        return [4 /*yield*/, prismaClient_1.prismaClient.transaction.update({
                                where: {
                                    id: transaction.id
                                },
                                data: {
                                    paidAt: new Date().toISOString()
                                }
                            })];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.order.update({
                                where: {
                                    id: transactionUpdated.orderId
                                },
                                data: {
                                    isPaid: true
                                }
                            })];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        res.status(200).send("Status atualizado");
                        return [3 /*break*/, 9];
                    case 8: return [2 /*return*/];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_1 = _d.sent();
                        console.debug("Error Update Status: ", error_1);
                        res.status(500).json({ error: "Internal server error" });
                        return [3 /*break*/, 11];
                    case 11:
                        res.status(200).end();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=PostBackController.js.map