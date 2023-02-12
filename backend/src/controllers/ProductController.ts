import { query, Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { Prisma } from '@prisma/client'; '@prisma/client';
import data from '../data';

const PAGE_SIZE = 3;

export default {
  async insert(req: Request, res: Response) {
    await prismaClient.product.deleteMany({});
    const createdProducts = await prismaClient.product.createMany({
      data: data.products,
    });
    res.json(createdProducts);
  },

  async create(req: Request, res: Response) {

    const createdProduct = await prismaClient.product.create({
      data: {
        name: 'Sample name ' + Date.now(),
        slug: 'sample-name-' + Date.now(),
        image: '/images/p1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'sample description'
      }
    });
    res.send({ message: 'Produto criado', product: createdProduct });
  },

  async update(req: Request, res: Response) {

    const productId = req.params.id;
    const { name, slug, price, image, category, countInStock, brand, description } = req.body;
    try {
      const product = await prismaClient.product.update({
        where: {
          id: productId
        },
        data: {
          name,
          slug,
          price,
          image,
          category,
          countInStock,
          brand,
          description
        }
      });
      res.send({ message: 'Produto atualizado', product })
    } catch (error) {
      res.status(404).send({ message: 'Produto não encontrado \n'+error })
    }

  },

  async store(req: Request, res: Response) {
    const products = await prismaClient.product.findMany({});
    res.json({ products });
  },


  async search(req: Request, res: Response) {

    interface IQueryFilter {
      contains?: string;
      mode?: Prisma.QueryMode
    }

    const { query } = req;

    const pageSize = Number(query.pageSize) || PAGE_SIZE;
    const page = Number(query.page) || 1;
    const category = <string>query.category || '';
    const brand = query.brand || '';
    const price = <string>query.price || '';
    const rating = <string>query.rating || '';
    const order = query.order || '';
    const searchQuery = <string>query.query || '';

    const queryFilter: IQueryFilter = searchQuery && searchQuery !== 'all' ?
      {
        contains: searchQuery,
        mode: 'insensitive',
      }
      : {};
    const categoryFilter = category && category !== 'all' ?
      { contains: category }
      : {};
    const brandFilter = brand && brand !== 'all' ?
      { contains: category }
      : undefined;
    const priceFilter = price && price !== 'all' ?
      {
        gt: Number(price.split('-')[0]),
        lte: Number(price.split('-')[1])
      }
      : {};
    const ratingFilter = rating && rating !== 'all' ?
      { gt: Number(rating) }
      : {};
    const orderFilter: Prisma.ProductOrderByWithRelationInput = order === 'newest'
      ? { createdAt: 'asc' }
      : order === 'lowest'
        ? { price: 'asc' }
        : order === 'highest'
          ? { price: 'desc' }
          : order === 'toprated'
            ? { rating: 'desc' }
            : { id: 'desc' }

    const products = await prismaClient.product.findMany({
      where: {
        name: queryFilter,
        category: categoryFilter,
        brand: brandFilter,
        price: priceFilter,
        rating: ratingFilter
      },
      orderBy: orderFilter,
      skip: pageSize * (page - 1),
      take: pageSize
    });

    const countProducts = await prismaClient.product.count({
      where: {
        name: queryFilter,
        category: categoryFilter,
        brand: brandFilter,
        price: priceFilter,
        rating: ratingFilter
      }
    })

    res.json({
      products,
      page,
      countProducts,
      pages: Math.ceil(countProducts / pageSize)
    });
  },

  async admin(req: Request, res: Response) {
    const { query } = req
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || PAGE_SIZE;

    const countProducts = await prismaClient.product.count();

    const products = await prismaClient.product.findMany({
      skip: pageSize * (page - 1),
      take: pageSize
    });

    res.send({ products, countProducts, page, pages: Math.ceil(countProducts / pageSize) })

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
