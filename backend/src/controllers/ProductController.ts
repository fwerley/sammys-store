import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import data from '../data';

export default {
  async insert(req: Request, res: Response) {
    await prismaClient.product.deleteMany({});
    const createdProducts = await prismaClient.product.createMany({
      data: data.products,
    });
    res.json(createdProducts);
  },

  async store(req: Request, res: Response) {
    const products = await prismaClient.product.findMany({});
    res.json(products);
  },

  async categories(req: Request, res: Response) {
    const categories = await prismaClient.product.groupBy({
     by: ["category"]    
    });
    res.json(categories);
  },

  async slug(req: Request, res: Response) {
    const slugParam = req.params.slug;
    const result = await prismaClient.product.findFirst({
      where: {
        slug: slugParam,
      },
    });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: 'Produto não encontrado' });
    }
  },

  async index(req: Request, res: Response) {
    const { id } = req.params;
    const product = await prismaClient.product.findUnique({
      where: { id: id },
    });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Produto não encontrado' });
    }
  },

  // async delete(req: Request, res: Response) {
  //     const { id } = req.params
  //     const post = await prismaClient.post.delete({
  //         where: { id: String(id) },
  //     })
  //     res.json(post)
  // }
};
