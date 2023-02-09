import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const generateToken = (user: User) => {
  const keySecret = '' + process.env.JWT_SECRET;
  return jwt.sign(user, keySecret, {
    expiresIn: '30d',
  });
};


export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); //Bearer XXXXXXX
    jwt.verify(
      token,
      '' + process.env.JWT_SECRET,
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Token inválido' });
        } else {
          req.user = (<any>decode);
          next();
        }
      }
    )
  } else {
    res.status(401).send({ message: 'Não existe um token associado ao usuario' })
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({message: 'Token Admin inválido'});
  }
}