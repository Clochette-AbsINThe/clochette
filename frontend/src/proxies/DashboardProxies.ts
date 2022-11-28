import { endpoints } from '@endpoints';
import useAxios from '@hooks/useAxios';
import { IProxy } from '@proxiesTypes';
import { APIItem, Barrel, Consumable, Glass, ItemTransactionResponse, ITransactionType, OutOfStockBuy, OutOfStockSell, TableData, TransactionResponse, TransactionType } from '@types';

export function getTransactionItems(setItems: (item: Array<TransactionType<ItemTransactionResponse>>) => void): IProxy {
    const [{ loading: loading1, error: error1 }, getAllTransactions] = useAxios<ITransactionType[]>(endpoints.v1.transaction);
    const [{ loading: loading2, error: error2 }, getTransaction] = useAxios<TransactionResponse>('');

    const loading = loading1 || loading2;
    const error = error1 || error2;

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const finalResponse: Array<TransactionType<ItemTransactionResponse>> = [];
        const { data } = await getAllTransactions();
        await Promise.all(
            data
                .filter((transaction) => transaction.sale === true)
                .map((transaction) => {
                    return new Promise<void>(async (resolve) => {
                        const { data: transactionData } = await getTransaction({}, endpoints.v1.transaction + transaction.id);
                        finalResponse.push({
                            ...transaction,
                            items: [
                                generateQuantityArray(transactionData.barrels, 'barrel'),
                                generateQuantityArray(transactionData.glasses, 'glass'),
                                generateQuantityArray(transactionData.consumablesPurchase, 'consumable'),
                                generateQuantityArray(transactionData.consumablesSale, 'consumable'),
                                generateQuantityArray(transactionData.outOfStocks, 'out_of_stock')
                            ].flat()
                        });
                        resolve();
                    });
                })
        );
        setItems(finalResponse);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

function generateQuantityArray(items: Barrel[] | Consumable[] | Array<OutOfStockBuy | OutOfStockSell> | Glass[], table: TableData): ItemTransactionResponse[] {
    const quantityArray: ItemTransactionResponse[] = [];
    items.forEach((item) => {
        const element = quantityArray.find((element) => element.item.name === item.name);
        if (element === undefined) {
            quantityArray.push({
                quantity: 1,
                table: table,
                item
            });
        } else {
            element.quantity += 1;
        }
    });
    return quantityArray;
}
