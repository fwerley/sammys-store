import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import PagarmeProvider from "../providers/pagarmeProvider";
import { IPaymentProvider } from "../services/IPaymentProvider";

var gatwayPay: IPaymentProvider;

export default {
    async pagarme(req: Request, res: Response) {
        gatwayPay = new PagarmeProvider()
        const { data: { status, id }, type } = req.body
        console.log(`Chargeback: STATUS -> ${status} |  ID -> ${id} | TYPE -> ${type}`)
        try {
            switch (type.split('.')[0]) {
                case 'order':
                    const transaction = await prismaClient.transaction.findUnique({
                        where: {
                            transactionId: id
                        }
                    })
                    if (!transaction) {
                        return res.status(404).json()
                    }
                    const transactionUpdated = await gatwayPay.updatestatus({ code: transaction.code, providerStatus: status })

                    if (transactionUpdated.status === "APPROVED") {
                        await prismaClient.transaction.update({
                            where: {
                                id: transaction.id
                            },
                            data: {
                                paidAt: new Date().toISOString()
                            }
                        })
                        await prismaClient.order.update({
                            where: {
                                id: transactionUpdated.orderId
                            },
                            data: {
                                isPaid: true,
                            }
                        })
                    }

                    res.status(200).send("Status atualizado")
                    break;

                default:
                    return
            }
        } catch (error: any) {
            console.debug("Error Update Status: ", error)
            res.status(500).json({ error: "Internal server error" })
        }
        res.status(200).end()
    }
}