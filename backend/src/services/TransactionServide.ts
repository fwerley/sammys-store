import { Transaction } from "@prisma/client";
import { randomUUID } from "crypto";
import { prismaClient } from "../database/prismaClient";
import { ProcessParams } from "./ITransactionService";


// async function transactionService(params: ProcessParams): Promise<string> {
async function transactionService(params: ProcessParams): Promise<Transaction> {    
    const order = await prismaClient.order.findUnique({
        where: {
            id: params.orderCode,
        }
    });
    if (!order) {
        throw `Order ${order} was not found`;
    }

    const transaction = await prismaClient.transaction.create({
        data: {
           orderId: params.orderCode,
           code: randomUUID(),
           installments: params.installments,   
        }
    })
    
    return transaction;
}

export default transactionService;