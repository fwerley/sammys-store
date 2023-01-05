import { Order, Transaction } from "@prisma/client";
import { randomUUID } from "crypto";
import { prismaClient } from "../database/prismaClient";
import PagarmeProvider from "../providers/pagarmeProvider";
import { IPaymentProvider, ProcessParams } from "./IPaymentProvider";

/**
 * Cria uma transação baseado no gatway utilizado
 * @param  {ProcessParams} params 
 * @returns {Promise<Transaction>}
 */

const gatwayPay:IPaymentProvider = new PagarmeProvider()

async function transactionService(params: ProcessParams) {    

    // const transaction = await prismaClient.transaction.create({
    //     data: {
    //        orderId: params.orderCode,
    //        code: randomUUID(),
    //        installments: params.installments,   
    //     }
    // });
    
    gatwayPay.process(params)

    // return transaction = ;
}

export default transactionService;