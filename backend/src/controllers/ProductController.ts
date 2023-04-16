import { query, Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { Prisma } from '@prisma/client'; '@prisma/client';
import dataSellers from '../dataSellers';
import data from '../data';

const PAGE_SIZE = 3;

export default {
  async insert(req: Request, res: Response) {
    await prismaClient.product.deleteMany({});
    await prismaClient.seller.deleteMany({});

    const createSellers = await prismaClient.seller.createMany({
      data: dataSellers.sellers
    })
    const createdProducts = await prismaClient.product.createMany({
      data: data.products,
    });
    res.json(createdProducts);
  },

  async create(req: Request, res: Response) {

    const createdProduct = await prismaClient.product.create({
      data: {
        name: 'Sample name ' + Date.now(),
        seller: req.user?.id,
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
    const { name, slug, price, image, images, sizes, colors, variants, category, countInStock, brand, description } = req.body;
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
          images,
          sizes,
          colors,
          variants,
          category,
          countInStock,
          brand,
          description
        }
      });
      res.send({ message: 'Produto atualizado', product })
    } catch (error) {
      res.status(404).send({ message: 'Produto não encontrado \n' + error })
    }

  },

  async delete(req: Request, res: Response) {
    const { id: idProduct } = req.params;
    try {
      await prismaClient.product.delete({
        where: {
          id: idProduct
        }
      });
      res.send({ message: 'Peoduto deletado' });
    } catch (error) {
      res.status(404).send({ message: 'Produto não encontrado', error })
    }
  },

  async store(req: Request, res: Response) {
    const products = await prismaClient.product.findMany({
      include: {
        seller: {
          select: {
            name: true
          }
        }
      }
    });
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
      ? { createdAt: 'desc' }
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
    const seller = <string>query.seller || {};
    const pageSize = Number(query.pageSize) || PAGE_SIZE;

    const countProducts = await prismaClient.product.count({
      where: {
        sellerId: seller
      }
    });

    const products = await prismaClient.product.findMany({
      where: {
        sellerId: seller
      },
      skip: pageSize * (page - 1),
      take: pageSize,
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.send({ products, countProducts, page, pages: Math.ceil(countProducts / pageSize) })

  },

  async categories(req: Request, res: Response) {
    const categories = await prismaClient.product.groupBy({
      by: ["category"]
    });
    res.json(categories);
  },

  async slugSEO(req: Request, res: Response) {
    const slugParam = req.params.slugSEO;
    const data = await prismaClient.product.findUnique({
      where: {
        slug: slugParam
      },
      select: {
        name: true,
        image: true,
        description: true
      }
    });
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: 'Produto não encontrado' });
    }
  },

  async slug(req: Request, res: Response) {
    const slugParam = req.params.slug;
    const result = await prismaClient.product.findFirst({
      where: {
        slug: slugParam,
      },
      include: {
        reviews: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        seller: {
          select: {
            description: true,
            logo: true,
            name: true,
            numReviews: true,
            rating: true
          }
        }
      }
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

  async review(req: Request, res: Response) {

    interface IReview {
      comment: string
      rating: number
    }
    const { id: idProduct } = req.params;
    const dataReview: IReview = req.body;

    const product = await prismaClient.product.findUnique({
      where: { id: idProduct },
      include: {
        reviews: true
      }
    });
    if (product) {
      if (product.reviews.find((x) => x.name === req.user?.name)) {
        return res.status(400).send({ message: 'Você já avaliou este produto' })
      }
      const review = await prismaClient.reviewProduct.create({
        data: {
          comment: dataReview.comment,
          rating: Number(dataReview.rating),
          name: req.user?.name,
          Product: {
            connect: {
              id: idProduct
            }
          }
        }
      })
      product.reviews.push(review);
      let numReviews = product.reviews.length;
      let rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
      const producUpdate = await prismaClient.product.update({
        where: {
          id: idProduct
        },
        data: {
          numReviews,
          rating
        },
        include: {
          reviews: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
      res.status(201).send({
        message: 'Avaliação criada',
        product: producUpdate,
      });
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
