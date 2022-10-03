import type { ItemTypes } from '@types';
import useAxios from '@hooks/useAxios';
import BaseUrl, { IProxy } from './Config';


export function getConsommables(setItem: (value: ItemTypes[]) => void): IProxy {
    const [{ loading, error }, get] = useAxios<ItemTypes[]>(`${BaseUrl}/consommables`);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = (await get());
        data.forEach((item) => {
            item.value = 0;
        });
        setItem(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return {
        getData,
        loading,
        error
    };
}

