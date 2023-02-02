import jwt from 'jsonwebtoken';
export var generateToken = function (user) {
    var keySecret = '' + process.env.JWT_SECRET;
    return jwt.sign(user, keySecret, {
        expiresIn: '30d',
    });
};
export var isAuth = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (authorization) {
        var token = authorization.slice(7, authorization.length); //Bearer XXXXXXX
        jwt.verify(token, '' + process.env.JWT_SECRET, function (err, decode) {
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
//# sourceMappingURL=utils.js.map