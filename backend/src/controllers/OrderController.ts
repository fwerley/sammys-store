import { OrderItem } from '@prisma/client';
import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export default {
  async insert(req: Request, res: Response) {

    const { orderPrice, paymentMethod, shippingAddress, orderItems } = req.body;
    const createOrder = await prismaClient.order.create({
      data: {
        orderItems: {
          createMany: {
            data: orderItems.map((item: OrderItem) => ({
              quantity: item.quantity,
              productId: item.id,
            })),
          },
        },
        shippingAddress: {
          create: shippingAddress,
        },
        orderPrice: { create: orderPrice },
        paymentMethod: paymentMethod,
        user: {
          connect: { id: req.user?.id },
        },
        paymentResult: {
          create: {
            status : 'Pending',
            emailAddress: req.user?.email            
          }
        }
      },
    })
    res.status(201).json({ order: createOrder });
  },
};
