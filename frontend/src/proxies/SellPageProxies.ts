import { endpoints } from '@endpoints';
import useAxios from '@hooks/useAxios';
import type { IProxy, IProxyPostTransaction } from '@proxies/Config';
import type { APIItem, Barrel, Consumable, Glass, ItemSell, ItemTransactionResponse, OutOfStockItemSell, OutOfStockSell, PaymentMethod, TransactionType } from '@types';
import type { AxiosError, AxiosResponse } from 'axios';

/**
 * This function is used to fill glass column in the sale page
 * @param setItem The setter of the state of the item
 * @returns A function to make the API call and the loading and error state
 */
export function getGlasses(setItem: (value: Array<APIItem<Glass | OutOfStockSell>>) => void): IProxy {
    const [{ error, loading: loading1 }, getGlass] = useAxios<Barrel[]>(endpoints.v1.mountedBarrel);
    const [{ loading: loading2 }, outOfStockGet] = useAxios<OutOfStockItemSell[]>(endpoints.v1.outOfStockItemSell);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data: dataBarrel } = await getGlass();
        const { data: dataOutOfStock } = await outOfStockGet();
        const newItem: Array<APIItem<Glass | OutOfStockSell>> = dataBarrel.map((item) => ({
            table: 'glass',
            quantity: 0,
            item: {
                fkId: item.id as number,
                name: item.name,
                sellPrice: item.sellPrice,
                icon: 'Beer'
            }
        }));
        const EcoCup = dataOutOfStock.find((item) => item.name === 'EcoCup') as OutOfStockItemSell;
        const OutOfStockItem: APIItem<OutOfStockSell> = {
            table: 'out_of_stock',
            quantity: 0,
            item: {
                ...EcoCup,
                fkId: EcoCup.id as number
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
    const [{ error, loading }, get] = useAxios<OutOfStockItemSell[]>(endpoints.v1.outOfStockItemSell);

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        const newItem: Array<APIItem<OutOfStockSell>> = data.map((item) => ({
            table: 'out_of_stock',
            quantity: 0,
            item: {
                ...item,
                fkId: item.id as number
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
    const [{ error: error1, loading: loading1 }, get] = useAxios<Consumable[]>(endpoints.v1.consumableDistinct);
    const [{ error: error2, loading: loading2 }, getAll] = useAxios<Consumable[]>(endpoints.v1.consumable);

    const error = error1 || error2;
    const loading = loading1 || loading2;

    const getDataAsync = async (): Promise<void> => {
        setItem([]);
        const { data } = await get();
        const { data: dataAll } = await getAll();
        const newItem: Array<APIItem<Consumable>> = data.map((item) => {
            return {
                table: 'consumable',
                quantity: 0,
                item,
                maxQuantity: dataAll.filter((item2) => item2.name === item.name).reduce((acc) => acc + 1, 0)
            } as APIItem<Consumable>;
        });
        setItem(newItem);
    };

    const getData = (): void => {
        getDataAsync().catch(() => { });
    };

    return [getData, { loading, error }];
}

/**
 * This function is used to create a new Sell transaction
 * @returns A function to make the API call and the loading state
 */
export function postNewSellTransaction(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPostTransaction<ItemSell[]> {
    const [{ loading, error }, postTransaction] = useAxios<TransactionType<ItemTransactionResponse>>(endpoints.v1.transaction, { method: 'POST' });
    const [{ loading: loading2, error: error2 }, getAllConsumable] = useAxios<Consumable[]>(endpoints.v1.consumable);

    const postDataAsync = async (transactionItems: ItemSell[], paymentMethod: PaymentMethod, totalPrice: number, date: Date): Promise<void> => {
        const newItems: ItemSell[] = [];
        const { data: dataAllConsumable } = await getAllConsumable();

        for (let i = 0; i < transactionItems.length; i++) {
            const item = transactionItems[i] as ItemSell;
            switch (item.table) {
                case 'glass':
                    newItems.push(item);
                    break;
                case 'consumable':
                    newItems.push(...createListOfConsumable(item as APIItem<Consumable>, dataAllConsumable));
                    break;
                case 'out_of_stock': {
                    newItems.push(item);
                    break;
                }
            }
        }

        const data: TransactionType<ItemSell> = {
            datetime: date.toISOString(),
            sale: true,
            paymentMethod,
            amount: totalPrice,
            items: newItems
        };
        const response = await postTransaction({ data });
        callback?.(response);
    };

    const postData = (transactionItems: ItemSell[], paymentMethod: PaymentMethod, totalPrice: number, date: Date): void => {
        postDataAsync(transactionItems, paymentMethod, totalPrice, date).catch((err: AxiosError) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [postData, { loading, error }];
}

function createListOfConsumable(consumableItem: APIItem<Consumable>, allConsumables: Consumable[]): Array<APIItem<Consumable>> {
    const newConsumables: Array<APIItem<Consumable>> = [];
    const quantity = consumableItem.quantity;
    const consumable = allConsumables.filter((item2) => item2.name === consumableItem.item.name);

    for (let i = 0; i < quantity; i++) {
        newConsumables.push({
            table: 'consumable',
            quantity: 1,
            item: {
                ...consumable[i] as Consumable,
                empty: true
            }
        });
    }
    return newConsumables;
}
