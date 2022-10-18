/* eslint-disable @typescript-eslint/consistent-type-assertions */
import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyPost } from '@proxies/Config';
import type { APIItem, Consumable, Glass, ItemSell, ItemTransactionResponse, OutOfStockItemSell, OutOfStockSell, PaymentMethod, Transaction } from '@types';
import type { AxiosResponse } from 'axios';

/**
 * This function is used to fill glass column in the sale page
 * @param setItem The setter of the state of the item
 * @returns A function to make the API call and the loading and error state
 */
export function getGlasses(setItem: (value: Array<APIItem<Glass | OutOfStockSell>>) => void): IProxy {
    const [{ error, loading: loading1 }, getGlass] = useAxios<Glass[]>('/Glass');
    const [{ loading: loading2 }, outOfStockGet] = useAxios<OutOfStockItemSell[]>('/OutOfStockItem/Sell');

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data: dataGlass } = (await getGlass());
        const { data: dataOutOfStock } = (await outOfStockGet());
        const newItem: Array<APIItem<Glass | OutOfStockSell>> = dataGlass.map((item) => ({
            table: 'glass',
            quantity: 0,
            item: {
                ...item,
                icon: 'Beer'
            }
        }));
        const EcoCup = dataOutOfStock.find((item) => item.name === 'EcoCup') as OutOfStockItemSell;
        const OutOfStockItem: APIItem<OutOfStockSell> = {
            table: 'outofstock',
            quantity: 0,
            item: {
                ...EcoCup,
                fkID: EcoCup.id as number
            }
        };
        delete OutOfStockItem.item.id;

        newItem.push(OutOfStockItem);
        setItem(newItem);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading: loading1 || loading2, error }];
}

/**
 * This function is used to fill outOfStocks column in the sale page
 * @param setItem The setter of the state of the item
 * @returns A function to make the API call and the loading and error state
 */
export function getOutOfStocks(setItem: (value: Array<APIItem<OutOfStockSell>>) => void): IProxy {
    const [{ error, loading }, get] = useAxios<OutOfStockItemSell[]>('/OutOfStockItem/Sell');

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = (await get());
        const newItem: Array<APIItem<OutOfStockSell>> = data.map((item) => ({
            table: 'outofstock',
            quantity: 0,
            item: {
                ...item,
                fkID: item.id as number
            }
        }));
        newItem.forEach((item) => delete item.item.id);
        setItem(newItem.filter((item) => item.item.name !== 'EcoCup'));
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

/**
 * This function is used to fill consumable column in the sale page
 * @param setItem The setter of the state of the item
 * @returns A function to make the API call and the loading and error state
 */
export function getConsumables(setItem: (value: Array<APIItem<Consumable>>) => void): IProxy {
    const [{ error, loading }, get] = useAxios<Consumable[]>('/Consumable');

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = (await get());
        const newItem: Array<APIItem<Consumable>> = data.map((item) => ({
            table: 'consumable',
            quantity: 0,
            item
        }));
        setItem(newItem);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

/**
 * This function is used to create a new Sale transaction
 * @returns A function to make the API call and the loading state
 */
export function postNewSellTransaction(callback?: (data: AxiosResponse<Transaction<ItemTransactionResponse>, any>) => void): IProxyPost<ItemSell[]> {
    const [{ loading, error }, postTransaction] = useAxios<Transaction<ItemTransactionResponse>>('/Transaction/Sell', { method: 'POST' });

    const postDataAsync = async (transactionItems: ItemSell[], paymentMethod: PaymentMethod, totalPrice: number, date: Date): Promise<void> => {
        const newItems: ItemSell[] = [];
        for (let i = 0; i < transactionItems.length; i++) {
            const item = transactionItems[i];
            switch (item.table) {
                case 'glass':
                    newItems.push(item);
                    break;
                case 'consumable':
                    newItems.push({
                        ...item,
                        item: {
                            ...item.item,
                            empty: true
                        } as Consumable
                    });
                    break;
                case 'outofstock': {
                    newItems.push(item);
                    break;
                }
            }
        }

        const data: Transaction<ItemSell> = {
            dateTime: date.toISOString(),
            sale: true,
            paymentMethod,
            totalPrice,
            items: newItems
        };
        console.log(data);
        const response = (await postTransaction({ data }));
        callback?.(response);
    };

    const postData = (transactionItems: ItemSell[], paymentMethod: PaymentMethod, totalPrice: number, date: Date): void => {
        postDataAsync(transactionItems, paymentMethod, totalPrice, date).catch(() => { });
    };

    return [postData, { loading, error }];
}
