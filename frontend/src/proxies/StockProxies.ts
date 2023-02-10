import { endpoints } from '@utils/endpoints';
import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyPost } from '@proxiesTypes';
import type { Barrel, Consumable } from '@types';
import type { AxiosError, AxiosResponse } from 'axios';

export function getBarrels(setItem: (value: Barrel[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Barrel[]>(endpoints.v1.barrel);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        setItem(
            data
                .filter((item) => item.isMounted === false)
                .map((item) => ({
                    ...item,
                    icon: 'Barrel'
                }))
        );
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

export function getBarrelsMounted(setItem: (value: Barrel[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Barrel[]>(endpoints.v1.barrelMounted);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        setItem(
            data.map((item) => ({
                ...item,
                icon: 'Barrel'
            }))
        );
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

export function getBarrelsDistincts(setItem: (value: Barrel[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Barrel[]>(endpoints.v1.barrelDistinct);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        setItem(
            data.map((item) => ({
                ...item,
                icon: 'Barrel'
            }))
        );
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

export function putBarrel(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Barrel> {
    const [{ error, loading }, put] = useAxios<Barrel>('', { method: 'PUT' });

    const putDataAsync = async (data: Barrel): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, `${endpoints.v1.barrel}${id as number}`);
        callback?.(response);
    };

    const putData = (data: Barrel): void => {
        putDataAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}

export function getConsumables(setItem: (value: Consumable[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Consumable[]>(endpoints.v1.consumable);

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

export function getConsumablesDistincts(setItem: (value: Consumable[]) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Consumable[]>(endpoints.v1.consumableDistinct);

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

export function putConsumable(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Consumable> {
    const [{ error, loading }, put] = useAxios<Consumable>('', { method: 'PUT' });

    const putDataAsync = async (data: Consumable): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, `${endpoints.v1.consumable}${id as number}`);
        callback?.(response);
    };

    const putData = (data: Consumable): void => {
        putDataAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}
