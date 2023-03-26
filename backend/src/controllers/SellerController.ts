import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export default {
    async find(req: Request, res: Response) {
        const { id: idSeller } = req.params;
        const seller = await prismaClient.seller.findUnique({
            where: {
                id: idSeller
            }
        })
        if (seller) {
            res.send(seller)
        } else {
            res.status(404).send({ message: 'Loja não encontrada' })
        }
    }
}