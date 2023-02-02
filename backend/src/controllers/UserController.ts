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
          mobile: user.mobile,
          isAdmin: user.isAdmin,
          document: user.document,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email ou senha inválido' });
  },

  async signup(req: Request, res: Response) {
    const { name, email } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);

    const creatUser = await prismaClient.user.create({
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
      token: generateToken(creatUser),
    });
  },

  async profile(req: Request, res: Response) {
    const { name, email, password } = req.body;

    var dataUser = {
      name: name || req.user?.name,
      email: email || req.user?.email,
    }
    if (password){
      Object.assign(dataUser, {password: bcrypt.hashSync(password, 10)})
    }

    try {
      const updatedUser = await prismaClient.user.update({        
        where: {
          id: req.user?.id
        },
        data: dataUser,
      });
      res.send({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }catch (err) {
      res.status(404).send({message: 'Usuário não encontrado'});
      console.log(err)
    }
  },
};
