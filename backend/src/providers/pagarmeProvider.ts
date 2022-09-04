import { Transaction } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";
import { ITransactionService, ProcessParams } from "../services/ITransactionService";

export default {
    async process(params: ProcessParams) {
       
        const order = await prismaClient.order.findUnique({
            where: {
              id: params.orderCode,
            },
            include: {
              orderItems: {
                include: {
                  product: true,
                },
              },
              orderPrice: true,
              paymentResult: true,
              user: true
            },
        });
        const billetParams = {
            payment_method: "boleto",
            boleto: {
                instructions: "Pagar até o vencimento",
                due_at: new Date().setDate(new Date().getDate()+4),
                document_number: order?.user.document,
                type: "BDP" 
            }
            // amount: order?.orderPrice.totalPrice! * 100,

        }
        
        const transactionParams = {

        }
    }
}