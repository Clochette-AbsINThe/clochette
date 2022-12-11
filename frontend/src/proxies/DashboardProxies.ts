import { endpoints } from '@endpoints';
import useAxios from '@hooks/useAxios';
import { IProxy } from '@proxiesTypes';
import { Barrel, Glass, IBarrelStatProps, IconName, ItemTransactionResponse, ITransactionType, TransactionResponse, TransactionType } from '@types';
import { generateTransactionItemArray } from '@utils/utils';

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
                            items: generateTransactionItemArray(transactionData)
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

export function getBarrelsStat(setItems: (item: IBarrelStatProps[]) => void): IProxy {
    const [{ loading: loading1, error: error1 }, getBarrels] = useAxios<Barrel[]>(endpoints.v1.barrelAll);
    const [{ loading: loading2, error: error2 }, getGlass] = useAxios<Glass[]>('');

    const loading = loading1 || loading2;
    const error = error1 || error2;

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const { data } = await getBarrels();
        const barrels = data
            .filter((item) => item.isMounted === true || item.empty === true)
            .map((item: Barrel) => ({
                ...item,
                icon: 'Barrel' as IconName
            }));
        const finalResponse: IBarrelStatProps[] = [];
        await Promise.all(
            barrels.map((barrel) => {
                return new Promise<void>(async (resolve) => {
                    const { data: dataGlass } = await getGlass({}, `${endpoints.v1.glass}?barrel_id=${barrel.id!}`);

                    const barrelStat: IBarrelStatProps = {
                        ...barrel,
                        glassForBarrel: dataGlass.map((item: Glass) => ({
                            ...item,
                            icon: 'Glass' as IconName
                        }))
                    };
                    finalResponse.push(barrelStat);
                    resolve();
                });
            })
        );
        setItems([...finalResponse.filter((item) => item.isMounted).sort((a, b) => b.id! - a.id!), ...finalResponse.filter((item) => !item.isMounted).sort((a, b) => b.id! - a.id!)]);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}
