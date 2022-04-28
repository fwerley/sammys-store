import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
// import asyncHandler  from 'express-async-handler';
import { prismaClient } from '../database/prismaClient';
import dataUsers from '../dataUsers';
import { generateToken } from '../utils';

export default {
  async insert(req: Request, res: Response) {
    await prismaClient.user.deleteMany({});
    const createdUsers = await prismaClient.user.createMany({
      data: dataUsers.users,
    });
    res.json(createdUsers);
  },

  async signin(req: Request, res: Response) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email ou senha inválido' });
  },
};
