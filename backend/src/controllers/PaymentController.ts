import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import parsePhoneNumber from 'libphonenumber-js';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import * as Yup from 'yup';
import transactionService from '../services/TransactionServide';
import { mailgun, mailtrap, payOrderEmailTemplate } from '../utils';
/**
 * Controller responsavel por lincar a criação de uma transação de compra, com todos os dados necessarios para registrar a requisição
 * @param {Request} req
 * @param {Response} res
 */
export default {
  async create(req: Request, res: Response) {
    const { id: orderId } = req.params;

    // TODO: Reavaliar os tipos para Customer e Billing, retirar do prisma a tipagem

    const {
      paymentType,
      installments,
      customerName,
      customerEmail,
      customerMobile,
      customerDocument,
      billingAddress,
      billingNumber,
      billingNeighborhood,
      billingCity,
      billingState,
      billingZipCode,
      creditCardNumber,
      creditCardExpiration,
      creditCardHolderName,
      creditCardCvv
    } = req.body;
    try {

      const schema = Yup.object({
        // orderCode: Yup.string().required(),
        paymentType: Yup.mixed().oneOf(["BILLET", "CREDIT_CARD", "PIX"]).required(),
        installments: Yup.number().min(1).when("paymentType", (paymentType, schema) => paymentType === "CREDIT_CARD" ? schema.max(12) : schema.max(1)),
        customerName: Yup.string().required(),
        customerEmail: Yup.string().required().email(),
        customerMobile: customerMobile ? Yup.string()
          .required()
          .test("is-valid-mobile", "${path} is not a number", (value) =>
            parsePhoneNumber(value!, "BR")!.isValid()) : Yup.string(),
        customerDocument: Yup.string()
          .required()
          .test("is-valid-document", "${path} is not a valid CPF / CNPJ", (value) =>
            cpf.isValid(value!) || cnpj.isValid(value!)
          ),
        billingAddress: Yup.string().required(),
        billingNumber: Yup.string().required(),
        billingNeighborhood: Yup.string().required(),
        billingCity: Yup.string().required(),
        billingState: Yup.string().required(),
        billingZipCode: Yup.string().required(),
        creditCardNumber: Yup.string().when("paymentType", (paymentType, schema) =>
          paymentType === "CREDIT_CARD" ? schema.required() : schema
        ),
        creditCardExpiration: Yup.string().when("paymentType", (paymentType, schema) =>
          paymentType === "CREDIT_CARD" ? schema.required() : schema
        ),
        creditCardHolderName: Yup.string().when("paymentType", (paymentType, schema) =>
          paymentType === "CREDIT_CARD" ? schema.required() : schema
        ),
        creditCardCvv: Yup.string().when("paymentType", (paymentType, schema) =>
          paymentType === "CREDIT_CARD" ? schema.required() : schema
        ),
      })

      if (!(await schema.isValid(req.body))) {
        return res.status(400).send({
          message: "Por favor, verifique os dados enviados ou seus dados de cadastro e tente novamente."
        })
      }

      const products = await prismaClient.orderItem.findMany({
        where: {
          orderId: orderId
        },
        include: {
          product: true
        }
      })

      const order = await prismaClient.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          user: true,
          orderPrice: true,
          shippingAddress: true
        },
      });
      if (!order) {
        return res.status(404).send({ message: "Order not found" })
      }
      
      const service = await transactionService({
        billing: {
          address: billingAddress,
          city: billingCity,
          federativeUnity: billingState,
          fullName: customerName,
          postalCode: billingZipCode,
          number: billingNumber,
          neighborhood: billingNeighborhood,
          createdAt: new Date(),
          default: null,
          phoneNumber: null,
          id: 'null',
          updatedAt: new Date(),
          userId: ""
        },
        creditCard: {
          cvv: creditCardCvv,
          expiration: creditCardExpiration,
          holderName: creditCardHolderName,
          number: creditCardNumber
        },
        customer: {
          ...order.user,
          document: customerDocument
          //mobile: parsePhoneNumber(order.user.mobile!, "BR")!.format('E.164').toString()
        },
        installments,
        orderCode: order.id,
        paymentType
      })

      const statusTransaction = service.status;
      switch (statusTransaction) {
        case 'APPROVED':
          res.status(201).json({ message: 'Pagamento aprovado', payment: service })
          break;
        case 'PENDING':
          res.status(202).json({ message: 'Pagamento em análise', payment: service })
          break;
        case 'PROCESSING':
          res.status(202).json({ message: 'Pagamento em análise', payment: service })
          break;
        case 'STARTED':
          res.status(202).json({ message: 'Pagamento em análise', payment: service })
          break;
        default:
          res.status(200).json({ message: "Transação criada." })
      }

      mailtrap.sendMail({
        from: "Sammy's Store <noreplay@sammystore.com.br>",
        to: `${order.user.name} <${order.user.email}>`,
        subject: `Sammy's Store - Novo pedido`,
        html: payOrderEmailTemplate(order, products)
      }, (err, body) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(body)
        }
      })

    } catch (error) {
      res.status(400).send({ message: 'Erro ao criar a transação: ' + error })
    }
  },

  async delivered(req: Request, res: Response) {
    const { id: idOrder } = req.params
    try {
      await prismaClient.order.update({
        where: {
          id: idOrder
        },
        data: {
          deliveredAt: new Date().toJSON()
        }
      });
      res.send({ message: 'Pedido envaido' })
    } catch (error) {
      res.status(404).send({ message: 'Pedido não encontrado' })
    }
  },

  async transaction(req: Request, res: Response) {
    const { id: orderId } = req.params

    const result = await prismaClient.transaction.findUnique({
      where: {
        orderId,
      },
    });

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: 'Transação não encontrado' });
    }

  }
};
