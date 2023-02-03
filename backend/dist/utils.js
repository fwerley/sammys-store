"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.isAuth = exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateToken = function (user) {
    var keySecret = '' + process.env.JWT_SECRET;
    return jsonwebtoken_1["default"].sign(user, keySecret, {
        expiresIn: '30d'
    });
};
exports.generateToken = generateToken;
var isAuth = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (authorization) {
        var token = authorization.slice(7, authorization.length); //Bearer XXXXXXX
        jsonwebtoken_1["default"].verify(token, '' + process.env.JWT_SECRET, function (err, decode) {
            if (err) {
                res.status(401).send({ message: 'Token inválido' });
            }
            else {
                req.user = decode;
                next();
            }
        });
    }
    else {
        res.status(401).send({ message: 'Não existe um token associado ao usuario' });
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=utils.js.map