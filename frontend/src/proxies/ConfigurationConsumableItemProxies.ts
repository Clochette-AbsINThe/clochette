import { endpoints } from '@utils/endpoints';
import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyId, IProxyPost } from '@proxiesTypes';
import type { ConsumableItem } from '@types';
import type { AxiosError, AxiosResponse } from 'axios';

export function getConsumableItems(setItem: (value: ConsumableItem[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<ConsumableItem[]>(endpoints.v1.consumableItem);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        setItem(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

export function getConsumableItemById(setItem: (value: ConsumableItem) => void): IProxyId {
    const [{ error, loading }, get] = useAxios<ConsumableItem>('');

    const getDataAsync = async (id: number): Promise<void> => {
        setItem({ name: '', icon: 'Misc' });
        const { data } = await get({}, `${endpoints.v1.consumableItem}${id}`);
        setItem(data);
    };

    const getData = (id: number): void => {
        getDataAsync(id).catch(() => {});
    };

    return [getData, { loading, error }];
}

export function postConsumableItem(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<ConsumableItem> {
    const [{ error, loading }, post] = useAxios<ConsumableItem>(endpoints.v1.consumableItem, { method: 'POST' });

    const postAsync = async (data: ConsumableItem): Promise<void> => {
        const response = await post({ data });
        callback?.(response);
    };

    const postData = (data: ConsumableItem): void => {
        postAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [postData, { loading, error }];
}

export function putConsumableItem(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<ConsumableItem> {
    const [{ error, loading }, put] = useAxios<ConsumableItem>('', { method: 'PUT' });

    const putAsync = async (data: ConsumableItem): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, `${endpoints.v1.consumableItem}${id as number}`);
        callback?.(response);
    };

    const putData = (data: ConsumableItem): void => {
        putAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}

export function deleteConsumableItem(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyId {
    const [{ error, loading }, del] = useAxios<ConsumableItem>('', { method: 'DELETE' });

    const deleteAsync = async (id: number): Promise<void> => {
        const response = await del({}, `${endpoints.v1.consumableItem}${id}`);
        callback?.(response);
    };

    const deleteData = (id: number): void => {
        deleteAsync(id).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [deleteData, { loading, error }];
}
