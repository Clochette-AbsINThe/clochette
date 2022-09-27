import type { ItemTypes } from '@types';
import useAxios from 'axios-hooks';

interface GetHorsStocksType {
    getData: () => void
    loading: boolean
}

export function getHorsStocks(setItem: (value: ItemTypes[]) => void): GetHorsStocksType {
    const [{ error, loading }, get] = useAxios<ItemTypes[]>('https://clochette.dev/api/hors-stocks', { manual: true });

    const getDataAsync = async (): Promise<void> => {
        const { data, status } = (await get());
        if (status === 200) {
            data.forEach((item) => {
                item.value = 0;
            });
            setItem(data);
        } else {
            console.error(error);
        }
    };

    const getData = (): void => {
        void getDataAsync();
    };
    return {
        getData,
        loading
    };
}
