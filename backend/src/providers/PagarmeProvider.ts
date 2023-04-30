import { Transaction } from "@prisma/client";
import { cpf } from "cpf-cnpj-validator";
import parsePhoneNumber from 'libphonenumber-js';
import moment from 'moment';
import { Address, CustomerInput, ItemInput, PaymentParams, Payments, Phones, ShippingInput } from "pagarme";
import { prismaClient } from "../database/prismaClient";
import { IPaymentProvider, ProcessParams, StatusTransaction, UpdateParams } from "../services/IPaymentProvider";
import { translateStatus } from "../utils";
import { basePagarme } from "./PagarmeClient";

export default class PagarmeProvider implements IPaymentProvider {

  async process(params: ProcessParams): Promise<StatusTransaction> {

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
    const addressUser = await prismaClient.user.findUnique({
      where: {
        id: order?.user.id
      },
      include: {
        ShippingAddress: {
          where: {
            default: true
          }
        }
      }
    })

    if (!order) {
      throw `Order ${order} was not found`;
    }

    let clientType = cpf.isValid(order.user.document!) ? 'individual' : 'company'

    const address: Address = {
      country: 'BR',
      state: order.shippingAddress.federativeUnity,
      city: order.shippingAddress.city,
      zip_code: order.shippingAddress.postalCode,
      line_1: `${order.shippingAddress.address}, ${order.shippingAddress.number}`,
      line_2: order.shippingAddress.neighborhood || '',
    }

    const phoneNumber = parsePhoneNumber(order.user.mobile || '')

    const phones: Phones = {
      home_phone: {
        country_code: '55',
        area_code: '88',
        number: '981522160'
      },
      mobile_phone: {
        country_code: phoneNumber?.country || '55',
        area_code: phoneNumber?.nationalNumber?.slice(0, 2) || '88',
        number: order.user.mobile?.slice(2) || '981522160'
      }
    }

    const customer: CustomerInput = {
      //Adress
      address: addressUser?.ShippingAddress && addressUser?.ShippingAddress.length > 0 ? {
        country: 'BR',
        state: addressUser.ShippingAddress[0].federativeUnity,
        city: addressUser.ShippingAddress[0].city,
        zip_code: addressUser.ShippingAddress[0].postalCode,
        line_1: addressUser.ShippingAddress[0].address + ', ' + addressUser.ShippingAddress[0].number,
        line_2: addressUser.ShippingAddress[0].neighborhood || '',
      } : address,
      name: order.user.name,
      type: clientType,
      email: order.user.email,
      // document: order.user.document!,
      document: params.customer.document!.replace(/[^?0-9]/g, ""),
      document_type: clientType === 'individual' ? 'CPF' : 'CNPJ',
      //Phones
      phones
    }

    const shipping: ShippingInput = {
      //O endereço de entrega pode não ser o endereço de cadastro do usuario    
      address,
      amount: order.orderPrice.shippingPrice * 100,
      description: `Enviado pela Sammy's Store para ${order.shippingAddress.fullName}`,
      recipient_name: order.shippingAddress.fullName,
      recipient_phone: order.shippingAddress.phoneNumber || '88981522160',
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

    const pixParams: Payments[] = [{
      pix: {
        expires_in: 60 * 25
      },
      amount: order.orderPrice.totalPrice * 100,
      payment_method: 'pix'
    }]

    const billetParams: Payments[] = [{
      boleto: {
        bank: '001',
        document_number: "",
        instructions: 'Pagar em até três',
        due_at: new Date(moment().add(3, "days").toISOString()),
        //  document_number: transaction.code,
        type: 'BDP',
        statement_descriptor: "Sammys Store"
      },
      amount: order.orderPrice.totalPrice * 100,
      payment_method: 'boleto'
    }]

    const creditCardParams: Payments[] = [{
      credit_card: {
        card: {
          billing_address: address,
          number: params.creditCard!.number.replace(/[^?0-9]/g, ""),
          holder_name: params.creditCard!.holderName,
          exp_month: params.creditCard!.expiration.split("/")[0],
          exp_year: params.creditCard!.expiration.split("/")[1],
          cvv: params.creditCard!.cvv
        },
        operation_type: "auth_and_capture",
        recurrence: false,
        installments: params.installments,
        statement_descriptor: `Sammys Store`
      },
      amount: Math.trunc(order.orderPrice.totalPrice * 100),
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
      case 'PIX':
        payments = pixParams
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

      const returnStatus: StatusTransaction = {
        transactionId: response.data.id,
        status: translateStatus(response.data.status),
        card: params.paymentType == "CREDIT_CARD" ? {
          id: response.data.charges[0].last_transaction.card.id
        } : undefined,
        billet: params.paymentType == "BILLET" ? {
          barcode: response.data.charges[0].last_transaction.line,
          url: response.data.charges[0].last_transaction.url,
        } : undefined,
        pix: params.paymentType == "PIX" ? {
          qr_code: response.data.charges[0].last_transaction.qr_code,
          url: response.data.charges[0].last_transaction.qr_code_url,
        } : undefined,
        processorResponse: JSON.stringify(response.data)
      }
      return returnStatus;

    } catch (errors: any) {
      console.debug(errors.response.data.errors)
      throw `Error creating transaction.`
    }

  }

  async updatestatus(params: UpdateParams): Promise<Transaction> {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        code: params.code
      }
    })

    if (!transaction) {
      throw `Transaction ${params.code} not found.`
    }

    const status = translateStatus(params.providerStatus)

    if (!status) {
      throw `Status is empty.`
    }

    const transactionUpdated = await prismaClient.transaction.update({
      where: {
        code: params.code
      },
      data: {
        status
      }
    })

    return transactionUpdated;
  }

}

// export default PagarmeProvider