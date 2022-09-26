import type { ItemTypes } from '@components/Transaction';
import useAxios from 'axios-hooks';

interface GetBoissonsType {
    getData: () => void
    loading: boolean
}

export function getBoissons(setItem: (value: ItemTypes[]) => void): GetBoissonsType {
    const [{ error: boissonsError, loading: boissonsLoading }, boissonsGetData] = useAxios<ItemTypes[]>('https://clochette.dev/api/boissons', { manual: true });
    const [{ error: verreError, loading: verreLoading }, verreGetData] = useAxios<ItemTypes>('https://clochette.dev/api/verre', { manual: true });

    const getDataAsync = async (): Promise<void> => {
        const { data: boissonsData, status: boissonStatus } = (await boissonsGetData());
        const { data: verreData, status: verreStatus } = (await verreGetData());
        if (boissonStatus === 200 && verreStatus === 200) {
            const value = [...boissonsData, verreData];
            value.forEach((item) => {
                item.value = 0;
            });
            setItem(value);
        } else {
            console.warn(boissonsError?.message, verreError?.message);
        }
    };

    const getData = (): void => {
        void getDataAsync();
    };

    return {
        getData,
        loading: boissonsLoading || verreLoading
    };
}

