/* eslint-disable @typescript-eslint/consistent-type-assertions */
import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyPost } from '@proxies/Config';
import type { Barrel, Consumable, ConsumableItem, Drink, ItemBuy, ItemTransactionResponse, OutOfStock, OutOfStockItemBuy, PaymentMethod, Transaction } from '@types';
import type { AxiosResponse } from 'axios';

/**
 * This function is used to retrieve the EcoCup item
 * @param setItems The setter of the state of the item
 * @returns A function to make the API call and the loading and error state
 */
export function getEcoCup(setItems: (item?: OutOfStockItemBuy) => void): IProxy {
    const [{ loading, error }, get] = useAxios<OutOfStockItemBuy[]>('/OutOfStockItem/Buy');

    const getDataAsync = async (): Promise<void> => {
        setItems();
        const { data } = (await get());
        const EcoCup = data.find((item) => item.name === 'EcoCup') as OutOfStockItemBuy;

        setItems(EcoCup);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
};

/**
 * This functon is used to fill barrel dropdown in the buy page
 * @param setItems The setter of the state of the items
 * @returns A function to make the API call and the loading and error state
 */
export function getDrinks(setItems: (items: Drink[]) => void): IProxy {
    const [{ loading, error }, get] = useAxios<Drink[]>('/drink');

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const { data } = (await get());
        setItems(data.map((item) => ({
            ...item,
            icon: 'Barrel'
        })));
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
};

/**
 * This function is used to fill consumables dropdown in the buy page
 * @param setItems The setter of the state of the items
 * @returns A function to make the API call and the loading and error state
 */
export function getConsumables(setItems: (items: ConsumableItem[]) => void): IProxy {
    const [{ loading, error }, get] = useAxios<ConsumableItem[]>('/ConsumableItem');

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const { data } = (await get());
        setItems(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

/**
 * This function is used to fill outOfStocks dropdown in the buy page
 * @param setItems The setter of the state of the items
 * @returns A function to make the API call and the loading and error state
 */
export function getOutOfStocks(setItems: (items: OutOfStockItemBuy[]) => void): IProxy {
    const [{ loading, error }, get] = useAxios<OutOfStockItemBuy[]>('/OutOfStockItem/Buy');

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const { data } = (await get());
        setItems(data.filter((item) => item.name !== 'EcoCup'));
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}


/**
 * This function is used to create a new Buy transaction
 * @returns A function to make the API call and the loading state
 */
export function postNewBuyTransaction(callback?: (data: AxiosResponse<Transaction<ItemTransactionResponse>, any>) => void): IProxyPost<ItemBuy[]> {
    const [{ loading: loading1, error: error1 }, postTransaction] = useAxios<Transaction<ItemBuy>>('/Transaction/Buy', { method: 'POST' });
    const [{ loading: loading2, error: error2 }, postOutOfStock] = useAxios<OutOfStockItemBuy>('/OutOfStockItem/Buy', { method: 'POST' });
    const [{ loading: loading3, error: error3 }, postConsumable] = useAxios<ConsumableItem>('/ConsumableItem', { method: 'POST' });
    const [{ loading: loading4, error: error4 }, postDrink] = useAxios<Drink>('/drink', { method: 'POST' });

    const loading = loading1 || loading2 || loading3 || loading4;
    const error = error1 ?? error2 ?? error3 ?? error4;

    const postDataAsync = async (transactionItems: ItemBuy[], paymentMethod: PaymentMethod, totalPrice: number, date: Date): Promise<void> => {
        const newItems: ItemBuy[] = [];
        for (let i = 0; i < transactionItems.length; i++) {
            const item = transactionItems[i];
            let fkID = item.item.fkID;
            switch (item.table) {
                case 'outofstock': {
                    if (item.item.fkID === -1) {
                        const dataRes = (await postOutOfStock({ data: { name: item.item.name, icon: item.item.icon } })).data;
                        fkID = dataRes.id as number;
                    }
                    newItems.push({
                        ...item,
                        item: {
                            fkID,
                            unitPrice: item.item.unitPrice
                        } as OutOfStock
                    });
                    break;
                }
                case 'consumable': {
                    let fkID = item.item.fkID;
                    if (item.item.fkID === -1) {
                        const dataRes = (await postConsumable({ data: { name: item.item.name, icon: item.item.icon } })).data;
                        fkID = dataRes.id as number;
                    }
                    newItems.push({
                        ...item,
                        item: {
                            fkID,
                            unitPrice: item.item.unitPrice,
                            sellPrice: item.item.sellPrice,
                            empty: false
                        } as Consumable
                    });
                    break;
                }
                case 'barrel': {
                    let fkID = item.item.fkID;
                    if (item.item.fkID === -1) {
                        const dataRes = (await postDrink({ data: { name: item.item.name } })).data;
                        fkID = dataRes.id as number;
                    }
                    newItems.push({
                        ...item,
                        item: {
                            fkID,
                            unitPrice: item.item.unitPrice,
                            sellPrice: item.item.sellPrice,
                            isMounted: false,
                            empty: false
                        } as Barrel
                    });
                    break;
                }
            }
        };


        const data: Transaction<ItemBuy> = {
            dateTime: date.toISOString(),
            sale: false,
            paymentMethod,
            totalPrice,
            items: newItems
        };
        const response = (await postTransaction({ data }));
        callback?.(response);
    };

    const postData = (transactionItems: ItemBuy[], paymentMethod: PaymentMethod, totalPrice: number, date: Date): void => {
        postDataAsync(transactionItems, paymentMethod, totalPrice, date).catch(() => { });
    };

    return [postData, { loading, error }];
}