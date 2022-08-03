import { Product } from '@prisma/client';
import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export default {
  async insert(req: Request, res: Response) {
    const { id: orderId } = req.params;
    const order = await prismaClient.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        orderPrice: true,
        paymentResult: true,
      },
    });
  },
};
