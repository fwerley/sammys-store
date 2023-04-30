import { ShippingAddress, Status, Transaction, User } from "@prisma/client";

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
    creditCard?: CreditCard;
    document?: string;
}

interface StatusType<TValue> {
    [key: string]: TValue;
}

type BilletStatus = {
    url: string;
    barcode: string;
}

type PixStatus = {
    url: string;
    qr_code: string;
}

type CardStatus = {
    id: string;
}

type StatusTransaction = {
    transactionId: string;
    status: Status;
    billet?: BilletStatus;
    pix?: PixStatus;
    card?: CardStatus;
    processorResponse: string;
}

type UpdateParams = {
    code: string;
    providerStatus: string;
}

interface IPaymentProvider {
    process(params: ProcessParams): Promise<StatusTransaction>;
    updatestatus(params: UpdateParams): Promise<Transaction>;
}

export {
    StatusTransaction,
    IPaymentProvider,
    ProcessParams,
    UpdateParams,
    StatusType
}