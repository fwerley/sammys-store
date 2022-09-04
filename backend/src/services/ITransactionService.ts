import { ShippingAddress, User } from "@prisma/client";

type CreditCard = {
    number: string;
    expiration: string;
    holderName: string;
    cvv: string;
}

type ProcessParams = {
    orderCode: string;
    paymentType: string;
    installments: number;
    customer: User;
    billing: ShippingAddress;
    creditCard: CreditCard;
}

interface ITransactionService {
    (params: ProcessParams): Promise<string>;
}

export {
    ITransactionService,
    ProcessParams
}