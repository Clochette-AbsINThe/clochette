/* eslint-disable @typescript-eslint/consistent-type-assertions */
import useAxios from '@hooks/useAxios';
import BaseUrl, { IProxy } from '@proxies/Config';
import type { Barrel, Consumable, ConsumableItem, Drink, ItemBuy, OutOfStock, OutOfStockItemBuy, PaymentMethod, Transaction } from '@types';

/**
 * This function is used to retrieve the EcoCup item
 * @param setItems The setter of the state of the item
 * @returns A function to make the API call and the loading and error state
 */
export function getEcoCup(setItems: (item?: OutOfStockItemBuy) => void): IProxy {
    const [{ loading, error }, get] = useAxios<OutOfStockItemBuy[]>(`${BaseUrl}/OutOfStock/Buy`);

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
    const [{ loading, error }, get] = useAxios<Drink[]>(`${BaseUrl}/drink`);

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
    const [{ loading, error }, get] = useAxios<ConsumableItem[]>(`${BaseUrl}/ConsumableItem`);

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
    const [{ loading, error }, get] = useAxios<OutOfStockItemBuy[]>(`${BaseUrl}/OutOfStock/Buy`);

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
export function postNewBuyTransaction(): IProxy {
    const [{ loading: loading1 }, postTransaction] = useAxios<ItemBuy>(`${BaseUrl}/Transaction/Buy`, { method: 'POST' });
    const [{ loading: loading2 }, postOutOfStock] = useAxios<OutOfStockItemBuy>(`${BaseUrl}/OutOfStockItem/Buy`, { method: 'POST' });
    const [{ loading: loading3 }, postConsumable] = useAxios<ConsumableItem>(`${BaseUrl}/ConsumableItem`, { method: 'POST' });
    const [{ loading: loading4 }, postDrink] = useAxios<Drink>(`${BaseUrl}/drink`, { method: 'POST' });

    const loading = loading1 || loading2 || loading3 || loading4;

    const postDataAsync = async (transactionItems: ItemBuy[], paymentMethod: PaymentMethod, totalPrice: number): Promise<void> => {
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
            dateTime: new Date(),
            sale: false,
            paymentMethod,
            totalPrice,
            items: newItems
        };
        console.log(data);
        await postTransaction({ data });
    };

    const postData = (data: { transactionItems: ItemBuy[], paymentMethod: PaymentMethod, totalPrice: number }): void => {
        postDataAsync(data.transactionItems, data.paymentMethod, data.totalPrice).catch((err) => { console.error(err); });
    };

    return [postData, { loading }];
}
