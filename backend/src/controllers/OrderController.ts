import { OrderItem } from '@prisma/client';
import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

export default {
  async insert(req: Request, res: Response) {
    const { orderPrice, paymentMethod, shippingAddress, orderItems } = req.body;

    let shippingPrice = orderPrice.shippingPrice;
    let taxPrice = orderPrice.taxPrice;

    // Verificação backend do produto. Evitar fraudes na alteração manual do preço dos itens
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
        }
      },
    });
    res.status(201).json({ order: createOrder });
  },

  async store(req: Request, res: Response) {
    const orders = await prismaClient.order.findMany({
      include: {
        user: {
          select: {
            name: true
          }
        },
        orderPrice: {
          select: {
            totalPrice: true,
            updatedAt: true
          }
        }
      }
    })
    res.send(orders);
  },

  async summary(req: Request, res: Response) {
    const orders = await prismaClient.priceOrder.aggregate({
      _sum: {
        totalPrice: true
      },
      _count: true
    });

    const users = await prismaClient.user.aggregate({
      _count: true
    });

    const dailyOrders = await prismaClient.priceOrder.groupBy({
      by: ['createdAt'],
      _sum: {
        totalPrice: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const productCategories = await prismaClient.product.groupBy({
      by: ['category'],
      _count: true

    });

    res.send({ orders, users, dailyOrders, productCategories })
  },

  async mine(req: Request, res: Response) {
    const orders = await prismaClient.order.findMany({
      where: {
        userId: req.user?.id
      },
      include: {
        orderPrice: true
      }
    });
    res.send(orders);
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
        shippingAddress: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    if (order) {
      if (order.user.id === req.user?.id || req.user?.isAdmin) {
        res.send(order);
      } else {
        res.status(401).send({ message: 'Requisição não autorizada' });
      }
    } else {
      res.status(404).send({ message: 'Ordem não encontrada' });
    }
  },

  async updatePrice(req: Request, res: Response) {
    const idOrder = req.params.id;
    const { taxPrice, totalPrice } = req.body;
    try {
      const order = await prismaClient.order.update({
        where: {
          id: idOrder,
        },
        data: {
          orderPrice: {
            update: {
              taxPrice,
              totalPrice
            }
          }
        }
      });
      res.status(201).json({ message: "Taxa de compra atualizado" })
    } catch (error) {
      res.status(401).send({ message: 'Requisição não autorizada' });
    }
  },

  async delete(req: Request, res: Response) {
    const { id: orderId } = req.params;
    try {
      const order = await prismaClient.order.delete({
        where: {
          id: orderId
        },
        include: {
          orderItems: true,
          orderPrice: true,
          shippingAddress: true,
          transaction: true
        }
      });

      await prismaClient.priceOrder.delete({
        where: {
          id: order.orderPrice.id
        }
      })

      res.send({ message: 'Pedido deletado' })
    } catch (error) {
      console.log(error)
      res.status(404).send({ message: 'Pedido não encontrado', error });
    }
  }
};
