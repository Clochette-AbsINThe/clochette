import { endpoints } from '@endpoints';
import useAxios from '@hooks/useAxios';
import { IProxy, IProxyId } from '@proxiesTypes';
import { ItemTransactionResponse, ITransactionType, TransactionResponse } from '@types';
import { generateTransactionItemArray } from '@utils/utils';

export function getTransactions(setItems: (item: ITransactionType[]) => void): IProxy {
    const [{ loading, error }, getAllTransactions] = useAxios<ITransactionType[]>(endpoints.v1.transaction);

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const { data } = await getAllTransactions();
        setItems(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

export function getTransactionItemsById(setItem: (items: ItemTransactionResponse[]) => void): IProxyId {
    const [{ loading, error }, getTransaction] = useAxios<TransactionResponse>('');

    const getDataAsync = async (id: number): Promise<void> => {
        setItem([]);
        const { data } = await getTransaction({}, endpoints.v1.transaction + id);
        setItem(generateTransactionItemArray(data));
    };

    const getData = (id: number): void => {
        getDataAsync(id).catch(() => {});
    };

    return [getData, { loading, error }];
}
