"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bcrypt_1 = __importDefault(require("bcrypt"));
var data = {
    users: [
        {
            name: 'Yelrew',
            email: 'user@example.com',
            password: bcrypt_1["default"].hashSync('123456', 10),
            isAdmin: false
        },
        {
            name: 'Werley',
            email: 'admin@example.com',
            password: bcrypt_1["default"].hashSync('123456', 10),
            isAdmin: true
        },
        {
            name: 'Jeferson Nunes',
            email: 'jfnunes@host.com',
            password: bcrypt_1["default"].hashSync('123456', 10),
            isAdmin: false
        },
    ]
};
exports["default"] = data;
//# sourceMappingURL=dataUsers.js.map