import { endpoints } from '@utils/endpoints';
import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyId, IProxyPost } from '@proxiesTypes';
import type { Drink } from '@types';
import type { AxiosError, AxiosResponse } from 'axios';

export function getDrinks(setItem: (value: Drink[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Drink[]>(endpoints.v1.drink);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        setItem(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

export function getDrinkById(setItem: (value: Drink) => void): IProxyId {
    const [{ error, loading }, get] = useAxios<Drink>('');

    const getDataAsync = async (id: number): Promise<void> => {
        setItem({ name: '' });
        const { data } = await get({}, `${endpoints.v1.drink}${id}`);
        setItem(data);
    };

    const getData = (id: number): void => {
        getDataAsync(id).catch(() => { });
    };

    return [getData, { loading, error }];
}

export function postDrink(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Drink> {
    const [{ error, loading }, post] = useAxios<Drink>(endpoints.v1.drink, { method: 'POST' });

    const postAsync = async (data: Drink): Promise<void> => {
        const response = await post({ data });
        callback?.(response);
    };

    const postData = (data: Drink): void => {
        postAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [postData, { loading, error }];
}

export function putDrink(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Drink> {
    const [{ error, loading }, put] = useAxios<Drink>('', { method: 'PUT' });

    const putAsync = async (data: Drink): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, `${endpoints.v1.drink}${id as number}`);
        callback?.(response);
    };

    const putData = (data: Drink): void => {
        putAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}
