import type { ItemTypes } from '@components/Transaction';
import useAxios from 'axios-hooks';

interface GetConsommablesType {
    getData: () => void
    loading: boolean
}

export function getConsommables(setItem: (value: ItemTypes[]) => void): GetConsommablesType {
    const [{ loading, error }, get] = useAxios<ItemTypes[]>('https://clochette.dev/api/consommables', { manual: true });

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

