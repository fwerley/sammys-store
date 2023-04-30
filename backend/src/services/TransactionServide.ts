import { Transaction } from "@prisma/client";
import { randomUUID } from "crypto";
import { prismaClient } from "../database/prismaClient";
import PagarmeProvider from "../providers/PagarmeProvider";
import { IPaymentProvider, ProcessParams } from "./IPaymentProvider";

/**
 * Cria uma transação baseado no gatway utilizado
 * @param  {ProcessParams} params 
 * @returns {Promise<Transaction>}
 */

const gatwayPay: IPaymentProvider = new PagarmeProvider()

async function transactionService(params: ProcessParams): Promise<Transaction> {
    try {

        const response = await gatwayPay.process(params);

        const createOrUpdateTransanction = await prismaClient.order.update({
            where: {
                id: params.orderCode
            },
            data: {
                transaction: {
                    upsert: {
                        create: {
                            code: randomUUID(),
                            installments: params.installments,
                            transactionId: response.transactionId,
                            status: response.status,
                            barCode: response.billet
                                ? response.billet.barcode
                                : response.pix ? response.pix.qr_code : '',
                            urlBillet: response.billet
                                ? response.billet.url
                                : response.pix ? response.pix.url : '',
                            cardId: response.card?.id,
                            processorResponse: response.processorResponse

                        },
                        update: {
                            // code: randomUUID(),
                            installments: params.installments,
                            transactionId: response.transactionId,
                            status: response.status,
                            processorResponse: response.processorResponse
                        }
                    }
                }
            },
            include: {
                transaction: true
            }
        })

        return createOrUpdateTransanction.transaction!

    } catch (error) {
        console.debug(error)
        return Promise.reject(error)
    }
}



export default transactionService;