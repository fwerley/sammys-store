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

  async store(req: Request, res: Response) {
    const users = await prismaClient.user.findMany({});
    res.send(users)
  },

  async find(req: Request, res: Response) {
    const { id: userId } = req.params;
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }, include: {
        seller: true
      }
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Usuário não encontrado' });
    }

  },

  async update(req: Request, res: Response) {
    const { id: userId } = req.params;
    const { name, email, isAdmin, isSeller } = req.body;
    try {
      await prismaClient.user.update({
        where: {
          id: userId
        },
        data: {
          name,
          email,
          isAdmin,
          isSeller
        }
      });
      res.status(202).send({ message: 'Usuario atualizado' });
    } catch (err) {
      res.status(404).send({ message: 'Usuário não encontrado' });
    }

  },

  async delete(req: Request, res: Response) {
    const { id: userId } = req.params;

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId
      }
    })

    if (user?.email === 'admin@example.com') {
      res.status(400).send({ message: 'Você não pode deletar o Administrador' });
      return;
    }

    try {
      await prismaClient.user.delete({
        where: {
          id: userId
        }
      });
      res.send({ message: 'Usuário deletado' });
      console.log(true)
    } catch (err) {
      res.status(404).send({ message: 'Erro ao deletar o usuário' });
    }

  },

  async signin(req: Request, res: Response) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: req.body.email,
      }, include: {
        seller: true
      }
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          seller: user.isSeller ? user.seller : {},
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
      isSeller: creatUser.isSeller,
      token: generateToken(creatUser),
    });
  },

  async profile(req: Request, res: Response) {

    interface ISeller {
      name: string
      logo: string
      description: string
    }

    const { name, email, password, sellerName, sellerLogo, sellerDescription } = req.body;

    var dataUser = {
      name: name || req.user?.name,
      email: email || req.user?.email,
    }
    if (password) {
      Object.assign(dataUser, { password: bcrypt.hashSync(password, 10) })
    }

    var dataSeller: ISeller

    try {
      if (req.user?.isSeller) {
        const idSeller: string = req.user.seller.id
        dataSeller = {
          name: sellerName || req.user.seller.name,
          logo: sellerLogo || req.user.seller.logo,
          description: sellerDescription || req.user.seller.description
        }
        await prismaClient.seller.update({
          where: {
            id: idSeller
          },
          data: dataSeller
        })
      }
      const updatedUser = await prismaClient.user.update({
        where: {
          id: req.user?.id
        },
        data: dataUser,
        include: {
          seller: true
        }
      });
      res.send({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        seller: updatedUser.isSeller ? updatedUser.seller : {},
        document: updatedUser.document,
        token: generateToken(updatedUser),
      });
    } catch (err) {
      res.status(404).send({ message: 'Usuário não encontrado' });
      console.log(err)
    }
  },
};
