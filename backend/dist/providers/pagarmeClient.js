"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePagarme = void 0;
const axios_1 = __importDefault(require("axios"));
exports.basePagarme = axios_1.default.create({
    baseURL: 'https://api.pagar.me/core/v5/',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ' + Buffer.from('' + process.env.PAGARME_API_KEY + ':').toString('base64')
    }
});
//# sourceMappingURL=PagarmeClient.js.map