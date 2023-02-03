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
const prismaClient_1 = require("../database/prismaClient");
const data_1 = __importDefault(require("../data"));
exports.default = {
    insert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.prismaClient.product.deleteMany({});
            const createdProducts = yield prismaClient_1.prismaClient.product.createMany({
                data: data_1.default.products,
            });
            res.json(createdProducts);
        });
    },
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield prismaClient_1.prismaClient.product.findMany({});
            res.json(products);
        });
    },
    slug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const slugParam = req.params.slug;
            const result = yield prismaClient_1.prismaClient.product.findFirst({
                where: {
                    slug: slugParam,
                },
            });
            if (result) {
                res.send(result);
            }
            else {
                res.status(404).send({ message: 'Produto não encontrado' });
            }
        });
    },
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield prismaClient_1.prismaClient.product.findUnique({
                where: { id: id },
            });
            if (product) {
                res.send(product);
            }
            else {
                res.status(404).send({ message: 'Produto não encontrado' });
            }
        });
    },
    // async delete(req: Request, res: Response) {
    //     const { id } = req.params
    //     const post = await prismaClient.post.delete({
    //         where: { id: String(id) },
    //     })
    //     res.json(post)
    // }
};
//# sourceMappingURL=ProductController.js.map