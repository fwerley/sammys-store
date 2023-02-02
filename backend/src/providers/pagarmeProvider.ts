import { Transaction } from "@prisma/client";
import { cpf } from "cpf-cnpj-validator";
import moment from 'moment';
import { Address, CustomerInput, ItemInput, PaymentParams, Payments, Phones, ShippingInput } from "pagarme";
import { prismaClient } from "../database/prismaClient";
import { IPaymentProvider, ProcessParams, StatusTransaction, StatusType, UpdateParams } from "../services/IPaymentProvider";
import { basePagarme } from "./pagarmeClient";

class PagarmeProvider implements IPaymentProvider {

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
      document: order.user.document!.replace(/[^?0-9]/g, ""),
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
        status: this.translateStatus(response.data.status),
        card: params.paymentType == "CREDIT_CARD" ? {
          id: response.data.charges[0].last_transaction.card.id
        } : undefined,
        billet: params.paymentType == "BILLET" ? {
          barcode: response.data.charges[0].last_transaction.barcode,
          url: response.data.charges[0].last_transaction.url,
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

    const status = this.translateStatus(params.providerStatus)

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

  translateStatus(status: string): any {
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

}

export default PagarmeProvider