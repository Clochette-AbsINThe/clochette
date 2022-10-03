import type { ItemTypes } from '@types';
import useAxios from '@hooks/useAxios';
import BaseUrl, { IProxy } from './Config';


export function getBoissons(setItem: (value: ItemTypes[]) => void): IProxy {
    const [{ error: boissonsError, loading: boissonsLoading }, boissonsGetData] = useAxios<ItemTypes[]>(`${BaseUrl}/boissons`);
    const [{ error: verreError, loading: verreLoading }, verreGetData] = useAxios<ItemTypes>(`${BaseUrl}/verre`);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data: boissonsData } = (await boissonsGetData());
        const { data: verreData } = (await verreGetData());
        const value = [...boissonsData, verreData];
        value.forEach((item) => {
            item.value = 0;
        });
        setItem(value);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return {
        getData,
        loading: boissonsLoading || verreLoading,
        error: boissonsError ?? verreError
    };
}

