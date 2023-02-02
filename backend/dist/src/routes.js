"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.routes = void 0;
var express_1 = __importDefault(require("express"));
var ProductController_1 = __importDefault(require("./controllers/ProductController"));
var UserController_1 = __importDefault(require("./controllers/UserController"));
var OrderController_1 = __importDefault(require("./controllers/OrderController"));
var PaymentController_1 = __importDefault(require("./controllers/PaymentController"));
var CorreiosController_1 = __importDefault(require("./controllers/CorreiosController"));
var utils_1 = require("./utils");
var PostBackController_1 = __importDefault(require("./controllers/PostBackController"));
var routes = express_1["default"].Router();
exports.routes = routes;
//api seed
routes.get('/api/seedP', ProductController_1["default"].insert);
routes.get('/api/seedU', UserController_1["default"].insert);
// Products section
routes.get('/api/products', ProductController_1["default"].store);
routes.get("/api/products/:id", ProductController_1["default"].index);
routes.get('/api/products/slug/:slug', ProductController_1["default"].slug);
// Users section
routes.post('/api/users/signin', UserController_1["default"].signin);
routes.post('/api/users/signup', UserController_1["default"].signup);
routes.put('/api/users/profile', utils_1.isAuth, UserController_1["default"].profile);
// Correios section
routes.post('/api/correios/precoprazo', CorreiosController_1["default"].precoprazo);
// Orders section
routes.post('/api/orders', utils_1.isAuth, OrderController_1["default"].insert);
routes.get('/api/orders/mine', utils_1.isAuth, OrderController_1["default"].mine);
routes.get("/api/orders/:id", utils_1.isAuth, OrderController_1["default"].find);
routes.put("/api/orders/:id", utils_1.isAuth, OrderController_1["default"].updatePrice);
// Payment section
routes.get('/api/orders/:id/transaction', utils_1.isAuth, PaymentController_1["default"].transaction);
routes.post('/api/orders/:id/pay', utils_1.isAuth, PaymentController_1["default"].create);
routes.post('/api/webhook/pagarme', PostBackController_1["default"].pagarme);
//# sourceMappingURL=routes.js.map