import { OrderItem } from '@prisma/client';
import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';

interface IDailyOrders {
  _sum: {
    totalPrice: number | null,
    totalPriceApproved: number | null
  }
  createdAt: Date
}

export default {

  async insert(req: Request, res: Response) {
    const { orderPrice, paymentMethod, seller: sellerId, shippingAddress, orderItems } = req.body;
    let shippingPrice = orderPrice.shippingPrice;
    let taxPrice = orderPrice.taxPrice;
    let installments = orderPrice.installments;
    const {colorsSelect: colors, sizesSelect: sizes, variantsSelect: variants} = orderItems;

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
              sizes,
              colors,
              variants,
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
            installments
          },
        },
        paymentMethod: paymentMethod,
        user: {
          connect: { id: req.user?.id },
        },
        seller: {
          connect: { id: sellerId }
        },
      },
    });
    res.status(201).json({ order: createOrder });
    // res.status(201).json({ order: 'createOrder' });
  },

  async deliver(req: Request, res: Response) {
    const { shippingCompany, trackingCode, linkShipping, link } = req.body;
    const { id: orderId } = req.params;

    try {
      const deliver = await prismaClient.deliveryOrder.create({
        data: {
          shippingCompany,
          trackingCode,
          link,
          order: {
            connect: {
              id: orderId
            }
          }
        },
      });
      await prismaClient.order.update({
        data: {
          isDelivered: true
        },
        where: {
          id: orderId
        }
      })
      res.status(201).send(deliver);
    } catch (error) {
      res.status(400).send({ message: 'Erro no envio dos daods' })
    }

  },

  async store(req: Request, res: Response) {
    const { query } = req
    const seller = <string>query.seller || {};
    const orders = await prismaClient.order.findMany({
      where: {
        sellerId: seller
      },
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
        },
        transaction: {
          select: {
            paidAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
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

    const ordersApproved = await prismaClient.priceOrder.aggregate({
      _sum: {
        totalPrice: true
      },
      _count: true,
      where: {
        Order: {
          isPaid: true
        }
      }
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

    const dailyOrdersOpproved = await prismaClient.priceOrder.groupBy({
      by: ['createdAt'],
      _sum: {
        totalPrice: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      where: {
        Order: {
          isPaid: true
        }
      }
    });

    const productCategories = await prismaClient.product.groupBy({
      by: ['category'],
      _count: true

    });

    let myNewOrdersSum = dailyOrders.map(order => {
      let item = dailyOrdersOpproved.reduce((sum, record) => {
        return (Number(record.createdAt) === Number(order.createdAt)) ? sum + record._sum.totalPrice! : sum
      }, 0)
      const newItem: IDailyOrders = {
        _sum: {
          totalPrice: order._sum.totalPrice,
          totalPriceApproved: item
        },
        createdAt: order.createdAt
      }
      return newItem;
    })

    res.send({ orders, ordersApproved, users, dailyOrders: myNewOrdersSum, productCategories })
  },

  async mine(req: Request, res: Response) {
    const orders = await prismaClient.order.findMany({
      where: {
        userId: req.user?.id
      },
      include: {
        orderPrice: true
      },
      orderBy: {
        createdAt: 'desc'
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
        seller: {
          select: {
            userId: true
          }
        },
        orderPrice: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
          },
        },
        deliveryOrder: {
          select: {
            link: true,
            shippingCompany: true,
            trackingCode: true
          }
        }
      },
    });
    if (order) {
      if (order.user.id === req.user?.id || req.user?.isAdmin || (req.user?.isSeller && req.user?.id === order.seller.userId)) {
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
