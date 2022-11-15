import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyId, IProxyPost } from '@proxiesTypes';
import type { OutOfStockItemBuy, OutOfStockItemSell } from '@types';
import type { AxiosError, AxiosResponse } from 'axios';
import { endpoints } from '@utils/endpoints';

export function getOutOfStockItems(setItem: (value: Array<OutOfStockItemBuy | OutOfStockItemSell>) => void): IProxy {
    const [{ error: error1, loading: loading1 }, getBuy] = useAxios<OutOfStockItemBuy[]>(endpoints.v1.outOfStockItemBuy);
    const [{ error: error2, loading: loading2 }, getSell] = useAxios<OutOfStockItemSell[]>(endpoints.v1.outOfStockItemSell);

    const loading = loading1 || loading2;
    const error = error1 ?? error2;

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data: dataBuy } = await getBuy();
        const { data: dataSell } = await getSell();

        setItem([...dataBuy, ...dataSell]);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

export function getOutOfStockItemById(setItem: (value: OutOfStockItemBuy | OutOfStockItemSell) => void): IProxyId {
    const [{ error, loading }, get] = useAxios<OutOfStockItemBuy | OutOfStockItemSell>('');

    const getDataAsync = async (id: number): Promise<void> => {
        setItem({ name: '', icon: 'Misc' });
        const { data } = await get({}, `${endpoints.v1.outOfStockItem}${id}`);

        setItem(data);
    };

    const getData = (id: number): void => {
        getDataAsync(id).catch(() => {});
    };

    return [getData, { loading, error }];
}

export function postOutOfStockItem(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<OutOfStockItemBuy | OutOfStockItemSell> {
    const [{ error, loading }, post] = useAxios<OutOfStockItemBuy | OutOfStockItemSell>(endpoints.v1.outOfStockItem, { method: 'POST' });

    const postAsync = async (data: OutOfStockItemBuy | OutOfStockItemSell): Promise<void> => {
        const response = await post({ data });
        callback?.(response);
    };

    const postData = (data: OutOfStockItemBuy | OutOfStockItemSell): void => {
        postAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [postData, { loading, error }];
}

export function putOutOfStockItem(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<OutOfStockItemBuy | OutOfStockItemSell> {
    const [{ error, loading }, put] = useAxios<OutOfStockItemBuy | OutOfStockItemSell>('', { method: 'PUT' });

    const putAsync = async (data: OutOfStockItemBuy | OutOfStockItemSell): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, `${endpoints.v1.outOfStockItem}${id as number}`);
        callback?.(response);
    };

    const putData = (data: OutOfStockItemBuy | OutOfStockItemSell): void => {
        putAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}

export function deleteOutOfStockItem(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyId {
    const [{ error, loading }, del] = useAxios<OutOfStockItemBuy | OutOfStockItemSell>('', { method: 'DELETE' });

    const deleteAsync = async (id: number): Promise<void> => {
        const response = await del({}, `${endpoints.v1.outOfStockItem}${id}`);
        callback?.(response);
    };

    const deleteData = (id: number): void => {
        deleteAsync(id).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [deleteData, { loading, error }];
}
