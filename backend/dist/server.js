import express from 'express';
import path from 'path';
import { routes } from './routes';
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
var __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get("*", function (req, res) {
    return res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
});
app.use(function (err, req, res, next) {
    res.status(500).send({ message: err.message });
});
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Server at http://localhost:".concat(port));
});
//# sourceMappingURL=server.js.map