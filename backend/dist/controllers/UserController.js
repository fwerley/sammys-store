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
const bcrypt_1 = __importDefault(require("bcrypt"));
// import asyncHandler  from 'express-async-handler';
const prismaClient_1 = require("../database/prismaClient");
const dataUsers_1 = __importDefault(require("../dataUsers"));
const utils_1 = require("../utils");
exports.default = {
    insert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.prismaClient.user.deleteMany({});
            const createdUsers = yield prismaClient_1.prismaClient.user.createMany({
                data: dataUsers_1.default.users,
            });
            res.json(createdUsers);
        });
    },
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.prismaClient.user.findFirst({
                where: {
                    email: req.body.email,
                },
            });
            if (user) {
                if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
                    res.send({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        mobile: user.mobile,
                        isAdmin: user.isAdmin,
                        document: user.document,
                        token: (0, utils_1.generateToken)(user),
                    });
                    return;
                }
            }
            res.status(401).send({ message: 'Email ou senha inválido' });
        });
    },
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email } = req.body;
            const password = bcrypt_1.default.hashSync(req.body.password, 10);
            const creatUser = yield prismaClient_1.prismaClient.user.create({
                data: {
                    name,
                    email,
                    password,
                },
            });
            res.send({
                id: creatUser.id,
                name: creatUser.name,
                email: creatUser.email,
                isAdmin: creatUser.isAdmin,
                token: (0, utils_1.generateToken)(creatUser),
            });
        });
    },
    profile(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            var dataUser = {
                name: name || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name),
                email: email || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.email),
            };
            if (password) {
                Object.assign(dataUser, { password: bcrypt_1.default.hashSync(password, 10) });
            }
            try {
                const updatedUser = yield prismaClient_1.prismaClient.user.update({
                    where: {
                        id: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id
                    },
                    data: dataUser,
                });
                res.send({
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                    token: (0, utils_1.generateToken)(updatedUser),
                });
            }
            catch (err) {
                res.status(404).send({ message: 'Usuário não encontrado' });
                console.log(err);
            }
        });
    },
};
//# sourceMappingURL=UserController.js.map