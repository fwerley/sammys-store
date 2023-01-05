import { Transaction } from "@prisma/client";
import { rejects } from "assert";
import { cpf } from "cpf-cnpj-validator";
import { Address, BoletoImputs, CreateTransacaoInput, CreditCardImputs, CustomerInput, ItemInput, PaymentParams, Payments, Phones, ShippingInput } from "pagarme";
import { resolve } from "path";
import { prismaClient } from "../database/prismaClient";
import { IPaymentProvider, ProcessParams } from "../services/IPaymentProvider";
import { basePagarme } from "./pagarmeClient";

// export default {
//     async process(params: ProcessParams) {

//         const order = await prismaClient.order.findUnique({
//             where: {
//               id: params.orderCode,
//             },
//             include: {
//               orderItems: {
//                 include: {
//                   product: true,
//                 },
//               },
//               orderPrice: true,
//               paymentResult: true,
//               user: true
//             },
//         });
//         const billetParams = {
//             payment_method: "boleto",
//             boleto: {
//                 instructions: "Pagar até o vencimento",
//                 due_at: new Date().setDate(new Date().getDate()+4),
//                 document_number: order?.user.document,
//                 type: "BDP" 
//             }
//             // amount: order?.orderPrice.totalPrice! * 100,

//         }

//         const transactionParams = {

//         }
//     }
// }

class PagarmeProvider implements IPaymentProvider {

  async process(params: ProcessParams): Promise<string> {

    const order = await prismaClient.order.findUnique({
      where: {
        id: params.orderCode,
      },
      include: {
        orderItems: true,
        orderPrice: true,
        user: true,
        shippingAddress: true
      }
    });

    if (!order) {
      throw `Order ${order} was not found`;
    }

    let clientType = cpf.isValid(order.user.document!) ? 'individual' : 'company'

    const address: Address = {
      line_1: order.shippingAddress.address,
      line_2: order.shippingAddress.number,
      zip_code: order.shippingAddress.postalCode,
      city: order.shippingAddress.city,
      state: order.shippingAddress.federativeUnity,
      country: 'BR'
    }

    const phones: Phones = {
      home_phone: {
        country_code: '55',
        area_code: '21',
        number: '000000000'
      },
      mobile_phone: {
        country_code: '55',
        area_code: '21',
        number: '000000000'
      }
    }

    const customer: CustomerInput = {
      name: order.user.name,
      type: clientType,
      email: order.user.email,
      // document: order.user.document!,
      document: order.user.document!,
      //Adress
      address,
      //Phones
      phones
    }

    const shipping: ShippingInput = {
      amount: order.orderPrice.shippingPrice * 100,
      description: "Entregar com urgencia",
      recipient_name: order.shippingAddress.fullName,
      recipient_phone: order.shippingAddress.number,
      //O endereço de entrega pode não ser o endereço de cadastro do usuario
      //Adress - CONSERTAR NO TYPES DO PAGARME , POIS O ENDEREÇO DE CADASTRO NÃO É NECESSARIAMENTE O ENDEREÇO DE ENTREGA
      address
    }

    let items = await Promise.all(order.orderItems.map(async (item) => {
      let arrayItems: ItemInput
      let dbProduct = await prismaClient.product.findUnique({
        where: {
          id: item.productId
        }
      });

      arrayItems = {
        amount: item.quantity * dbProduct!.price * 100,
        description: dbProduct!.name,
        quantity: item.quantity,
        code: item.productId
      }

      return arrayItems
    })

    )
    const billetParams: Payments[] = [{
      boleto: {
        bank: '001',
        document_number: "ID TRANSACTION",
        instructions: 'Pagar até a data limite',
        due_at: new Date(new Date().getDay() + 3),
        //  document_number: transaction.code,
        type: 'BDP',
        statement_descriptor: "Sammys Store"
      },
      amount: order.orderPrice.totalPrice * 100,
      payment_method: 'boleto'
    }
    ]

    const creditCardParams: Payments[] = [{
      credit_card: {
        card: {
          billing_address: address,
          number: params.creditCard.number.replace(/[^?0-9]/g, ""),
          holder_name: params.creditCard.holderName,
          exp_month: params.creditCard.expiration.split("/")[0],
          exp_year: params.creditCard.expiration.split("/")[1],
          cvv: params.creditCard.cvv
        },
        operation_type: "auth_and_capture",
        recurrence: false,
        installments: params.installments,
        statement_descriptor: `Sammys Store`
      },
      amount: order.orderPrice.totalPrice * 100,
      payment_method: 'credit_card'
    }]

    let payments: Payments[];

    switch (params.paymentType) {
      case 'CREDIT_CARD':
        payments = creditCardParams
        break;
      case 'BILLET':
        payments = billetParams
        break;
      default:
        throw `PaymentType ${params.paymentType} not found.`
    }

    try {
      let data: PaymentParams = {
        customer,
        shipping,
        items,
        payments
      }
      const response = await basePagarme.post("orders", data)
      console.debug(response.data);
    } catch (errors: any) {
      console.debug(errors.response.data)
    }

    return new Promise((resolve, rejects) => resolve(""))
  }
}

export default PagarmeProvider