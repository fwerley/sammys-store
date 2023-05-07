import { Order, OrderItem, PriceOrder, Product, ShippingAddress, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';
import nodemailer from 'nodemailer';

import { StatusType } from './services/IPaymentProvider';
import { google } from 'googleapis';

export const generateToken = (user: User) => {
  const keySecret = '' + process.env.JWT_SECRET;
  return jwt.sign(user, keySecret, {
    expiresIn: '30d',
  });
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); //Bearer XXXXXXX
    jwt.verify(
      token,
      '' + process.env.JWT_SECRET,
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Token inválido' });
        } else {
          req.user = (<any>decode);
          next();
        }
      }
    )
  } else {
    res.status(401).send({ message: 'Não existe um token associado ao usuario' })
  }
}

export const oauth2Client = (req: Request, res: Response) =>
  new google.auth.OAuth2(
    '' + process.env.GOOGLE_CLIENT_ID,
    '' + process.env.GOOGLE_CLIENT_SECRET,
    /*
     * This is where Google will redirect the user after they
     * give permission to your application
     */
    `${req.protocol}://${req.get('host')}` + '/api/auth_oauth/signin',
  );

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Token Admin inválido' });
  }
}

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: 'Token Vendedor inválido' });
  }
}

export const isSellerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: 'Token Admin/Seller inválido' });
  }
}

export const baseUrl = () => {
  return process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
      ? 'http://localhost:3000'
      : 'https://sammy-store.onrender.com'
}

// Não está sendo usado mais o mailgum
export const mailgun = () => mg({
  apiKey: '' + process.env.MAILGUN_API_KEY,
  domain: '' + process.env.MAILGUN_DOMAIN
})

// Usado como dev. Tem um plano para production Mailtrap
export const mailtrap = nodemailer.createTransport({
  host: '' + process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: '' + process.env.MAILTRAP_USER,
    pass: '' + process.env.MAILTRAP_PASS,
  }
});

export const formatCoin = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: 'currency', currency: "BRL" }).format(value);
}

export const translateStatus = (status: string): any => {
  const statusMap: StatusType<string> = {
    processing: "PROCESSING",
    waiting_payment: "PENDING",
    authorized: "PENDING",
    paid: "APPROVED",
    refused: "REFUSED",
    pending_refund: "REFUNDED",
    refunded: "REFUNDED",
    canceled: "REFUNDED",
    chargedback: "CHARGBACK",
    failed: "ERROR",
    with_error: "ERROR",
    partial_void: "ERROR",
    error_on_refunding: "ERROR",
    authorized_pending_capture: "PROCESSING",
    not_authorized: "REFUSED",
    captured: "APPROVED",
    partial_capture: "PROCESSING",
    waiting_capture: "PROCESSING",
    voided: "REFUSED",
    generated: "PROCESSING",
    viewed: "PENDING",
  }

  return statusMap[status]
}

export const translatePaymentMethod = (status: string): any => {
  const statusMap: StatusType<string> = {
    CREDIT_CARD: "Cartão de crédito",
    BILLET: "Boleto",
    PIX: "PIX",
  }

  return statusMap[status]
}

export const decodeQR = async (dataImg: string) => {
  
}

export const payOrderEmailTemplate = (order: (
  Order & {
    user: User;
    orderPrice: PriceOrder;
    shippingAddress: ShippingAddress;
  }), products: (OrderItem & {
    product: Product;
  })[]) => {
  return `
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Maven+Pro:wght@600&display=swap" rel="stylesheet">
    <style>
      html * {
        font-family: 'Inter', sans-serif;
        font-family: 'Maven Pro', sans-serif;
      }
    </style>
    </head>
  <h1>Obrigado por comprar na nossa loja</h1>
    <p>Olá ${order.user.name},</p>
    <p>Nós começamos a preparar seu pedido para o envio.</p>
    <h2>[Pedido ${order.id}] (${order.createdAt.toString().substring(0, 10)})</h2>
    <table>
      <thead>
        <tr>
          <th><strong>Produto</strong></th>
          <th align="center"><strong>Quantidade</strong></th>
          <th><strong align="right">Preço</strong></th>
        </tr>
      </thead>
      <tbody style="margin-bottom: 4px">
        ${products.map((item) => `
          <tr>
            <td>${item.product.name}</td>
            <td align="center">${item.quantity}</td>
            <td align="right">${formatCoin(item.product.price)}</td>
          </tr>
        `).join('\n')}
      </tbody>      
      <tfoot>
        <tr>
          <td colspan="2">Preço dos items</td>
          <td align="right">${formatCoin(order.orderPrice.itemsPrice)}</td>
        </tr>
        <tr>
          <td colspan="2">Valor de envio</td>
          <td align="right">${formatCoin(order.orderPrice.shippingPrice)}</td>
        </tr>
        <tr>
          <td colspan="2">Taxa</td>
          <td align="right">${formatCoin(order.orderPrice.taxPrice)}</td>
        </tr>
        <tr style="border-top: 1px dashed #ccc">
        <td colspan="2" style="font-weight:bold">Total</td>
        <td align="right" style="font-weight:bold">${formatCoin(order.orderPrice.totalPrice)}</td>
        </tr>
        <tr>
          <td colspan="2">Forma de pagamento</td>
          <td align="right">${translatePaymentMethod(order.paymentMethod)}</td>
        </tr>
      </tfoot>
    </table>

    <h2>Endereço de envio</h2>
    <p>
    ${order.shippingAddress.fullName}, <br/>
    ${order.shippingAddress.address}, 
    ${order.shippingAddress.number}<br/>
    ${order.shippingAddress.neighborhood}, <br/>
    ${order.shippingAddress.city}, <br/>
    ${order.shippingAddress.federativeUnity}, <br/>
    ${order.shippingAddress.postalCode}
    </p>
    <hr/>
    <p>
      Obtigado por comprar com a gente.
    </p>
  `
}