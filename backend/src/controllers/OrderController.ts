import { OrderItem } from '@prisma/client';
import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export default {
  async insert(req: Request, res: Response) {
    const { orderPrice, paymentMethod, shippingAddress, orderItems } = req.body;

    // TODO: Mudar futuramente o modo de verificação de preços de entrega
    let shippingPrice = orderPrice.shippingPrice;
    let taxPrice = orderPrice.taxPrice;

    const priceItems = await orderItems.reduce(
      async (price: number, item: OrderItem) => { 
        const nPrice = await price;     
        const countPrice = await prismaClient.product.findUnique({
          where: {
            id: item.id,
          },
        });
        if (countPrice) {
          return nPrice + countPrice.price * item.quantity;
        }
      },
      Promise.resolve(0)
    );

    console.log(priceItems)

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
        orderPrice: {
          create: {
            itemsPrice: priceItems,
            shippingPrice,
            taxPrice,
            totalPrice: priceItems + shippingPrice + taxPrice,
          },
        },
        paymentMethod: paymentMethod,
        user: {
          connect: { id: req.user?.id },
        },
        paymentResult: {
          create: {
            status: 'Pending',
            emailAddress: req.user?.email,
          },
        },
      },
    });
    res.status(201).json({ order: createOrder });
  },

  async find(req: Request, res: Response) {
    const idOrder = req.params.id;
    const order = await prismaClient.order.findUnique({
      where: {
        id: idOrder,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        orderPrice: true,
        paymentResult: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    if (order) {
      if (order.user.id === req.user?.id) {
        res.send(order);
      } else {
        res.status(401).send({ message: 'Requisição não autorizada' });
      }
    } else {
      res.status(404).send({ message: 'Ordem não encontrada' });
    }
  },
};
