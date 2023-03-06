import { Order, OrderItem, PriceOrder, Product, ShippingAddress, User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';
import { StatusType } from './services/IPaymentProvider';

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

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Token Admin inválido' });
  }
}

export const mailgun = () => mg({
  apiKey: '' + process.env.MAILGUN_API_KEY,
  domain: '' + process.env.MAILGUN_DOMAIN
})

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

export const payOrderEmailTemplate = (order: (
  Order & {
    user: User;
    orderPrice: PriceOrder;
    shippingAddress: ShippingAddress;
  }), products: (OrderItem & {
    product: Product;
})[]) => {
  return `<h1>Obrigado por comprar na nossa loja</h1>
    <p>Olá ${order.user.name},</p>
    <p>Nós começamos a preparar seu pedido para o envio.</p>
    <h2>[Pedido ${order.id}] (${order.createdAt.toString().substring(0,10)})</h2>
    <table>
      <thead>
        <tr>
          <th><strong>Produto</strong></th>
          <th><strong>Quantidade</strong></th>
          <th><strong align="right">Preço</strong></th>
        </tr>
      </thead>
      <tbody>
        ${products.map((item) => `
          <tr>
            <td>${item.product.name}</td>
            <td>${item.quantity}</td>
            <td>${formatCoin(item.product.price)}</td>
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
        <td colspan="2"><strong>Total</strong></td>
        <td align="right"><strong>${formatCoin(order.orderPrice.totalPrice)}</strong></td>
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
    ${order.shippingAddress.address}, <br/>
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