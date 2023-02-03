"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.routes);
const __dirname = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(__dirname, '/frontend/build')));
app.get("*", (req, res) => res.sendFile(path_1.default.join(__dirname, '/frontend/build/index.html')));
app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map