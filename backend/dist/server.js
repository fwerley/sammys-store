"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var routes_1 = require("./src/routes");
var app = (0, express_1["default"])();
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use(routes_1.routes);
var __dirname = path_1["default"].resolve();
app.use(express_1["default"].static(path_1["default"].join(__dirname, '/frontend/build')));
app.get("*", function (req, res) {
    return res.sendFile(path_1["default"].join(__dirname, '/frontend/build/index.html'));
});
app.use(function (err, req, res, next) {
    res.status(500).send({ message: err.message });
});
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server at http://localhost:".concat(port));
});
//# sourceMappingURL=server.js.map