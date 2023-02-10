import type { PaymentMethod } from '@types';
import type { AxiosError } from 'axios';

export type IProxy = [
    () => void,
    {
        loading: boolean;
        error?: AxiosError | null;
    }
];

export type IProxyPostTransaction<T> = [
    (transactionItems: T, paymentMethod: PaymentMethod, totalPrice: number, date: Date) => void,
    {
        loading: boolean;
        error?: AxiosError | null;
    }
];

export type IProxyId = [
    (id: number) => void,
    {
        loading: boolean;
        error?: AxiosError | null;
    }
];

export type IProxyPost<T> = [
    (data: T) => void,
    {
        loading: boolean;
        error?: AxiosError | null;
    }
];

export type IProxyParam<T> = [
    (data?: T) => void,
    {
        loading: boolean;
        error?: AxiosError | null;
    }
];

export type QueryType = {
    datetime__gt: string;
    datetime__lt: string;
};
