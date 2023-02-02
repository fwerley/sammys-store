"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.basePagarme = void 0;
var axios_1 = __importDefault(require("axios"));
exports.basePagarme = axios_1["default"].create({
    baseURL: 'https://api.pagar.me/core/v5/',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic ' + Buffer.from('' + process.env.PAGARME_API_KEY + ':').toString('base64')
    }
});
//# sourceMappingURL=pagarmeClient.js.map