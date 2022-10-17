import type { PaymentMethod } from '@types';
import type { AxiosError } from 'axios';

export type IProxy = [
    () => void,
    {
        loading: boolean
        error?: AxiosError | null
    }
];

export type IProxyPost<T> = [
    (transactionItems: T, paymentMethod: PaymentMethod, totalPrice: number, date: Date) => void,
    {
        loading: boolean
        error?: AxiosError | null
    }
];

