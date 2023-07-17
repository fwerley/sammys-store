import { Request, Response } from "express";
import { startOfWeek, endOfWeek } from 'date-fns';
import { prismaClient } from "../database/prismaClient";
import { firstAndLastDayMonth, subtractMonths } from "../utils";

export default {
    async lastTransactions(req: Request, res: Response) {      
        const sales = await prismaClient.order.findMany({
            include: {
                orderPrice: {
                    select: {
                        totalPrice: true
                    }
                },
                orderItems: {
                    select: {
                        product: {
                            select: {
                                image: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            },
            take: 5,
            orderBy: {
                createdAt: "desc"
            }
        })
        if (sales) {            
            res.send(sales)
        } else {
            res.status(401).send({ message: 'Sem dados das ultimas transações' })
        }
    },
    async salesToday(req: Request, res: Response) {
        let date = new Date();
        let dateLast = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        const sales = await prismaClient.order.findMany({
            where: {
                createdAt: {
                    gte: dateLast,
                    lte: date
                }
            },
            include: {
                orderPrice: {
                    select: {
                        totalPrice: true
                    }
                }
            }
        })
        if (sales) {
            let amount = sales.reduce((acumulate, item) => acumulate + item.orderPrice.totalPrice, 0)
            res.send({ amount })
        } else {
            res.status(401).send({ message: 'Sem dados do dia de hoje' })
        }
    },

    async salesLastWeek(req: Request, res: Response) {
        let date = new Date();
        let dateLast = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        const sales = await prismaClient.order.findMany({
            where: {
                createdAt: {
                    gte: startOfWeek(dateLast, { weekStartsOn: 0 }),
                    lte: endOfWeek(dateLast, { weekStartsOn: 0 })
                }
            },
            include: {
                orderPrice: {
                    select: {
                        totalPrice: true
                    }
                }
            }
        })
        if (sales.length) {
            let amount = sales.reduce((acumulate, item) => acumulate + item.orderPrice.totalPrice, 0)
            res.send({ amount })
        } else {
            res.status(401).send({ message: 'Sem dados do dia da semana passada' })
        }
    },

    async salesLastMonth(req: Request, res: Response) {
        const sales = await prismaClient.order.findMany({
            where: {
                createdAt: {
                    gte: firstAndLastDayMonth(subtractMonths(new Date(), 1)).firstDay,
                    lte: firstAndLastDayMonth(subtractMonths(new Date(), 1)).lastDay
                }
            },
            include: {
                orderPrice: {
                    select: {
                        totalPrice: true
                    }
                }
            }
        })
        if (sales.length) {
            let amount = sales.reduce((acumulate, item) => acumulate + item.orderPrice.totalPrice, 0)
            res.send({ amount })
        } else {
            res.status(401).send({ message: 'Sem dados do mês passado' })
        }
    },
}