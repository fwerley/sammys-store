import { Transaction } from "@prisma/client";
import { randomUUID } from "crypto";
import { prismaClient } from "../database/prismaClient";
import PagarmeProvider from "../providers/pagarmeProvider";
import { IPaymentProvider, ProcessParams } from "./IPaymentProvider";

/**
 * Cria uma transação baseado no gatway utilizado
 * @param  {ProcessParams} params 
 * @returns {Promise<Transaction>}
 */

const gatwayPay: IPaymentProvider = new PagarmeProvider()

async function transactionService(params: ProcessParams): Promise<Transaction> {

    try {
        const transaction = await prismaClient.transaction.create({
            data: {
                orderId: params.orderCode,
                code: randomUUID(),
                installments: params.installments,
            }
        });
        const response = await gatwayPay.process(params)
        const updateTransaction = await prismaClient.transaction.update({
            where: {
                id: transaction.id
            },
            data: {
                transactionId: response.transactionId,
                status: response.status,
                processorResponse: response.processorResponse
            }
        })
        return updateTransaction
    } catch (error) {
        console.debug(error)
        return Promise.reject(error)
    }
}



export default transactionService;