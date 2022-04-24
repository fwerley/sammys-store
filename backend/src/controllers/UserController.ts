import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import dataUsers from '../dataUsers';

export default {
  async insert(req: Request, res: Response) {
    await prismaClient.user.deleteMany({});
    const createdUsers = await prismaClient.user.createMany({
      data: dataUsers.users,
    });
    res.json(createdUsers);
  },
};
