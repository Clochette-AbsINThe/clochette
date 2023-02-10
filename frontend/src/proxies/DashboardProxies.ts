import { endpoints } from '@endpoints';
import useAxios from '@hooks/useAxios';
import { IProxy, IProxyId, IProxyParam, IProxyPost, QueryType } from '@proxiesTypes';
import { Account, Barrel, Glass, IBarrelStatProps, IconName, ItemTransactionResponse, ITransactionType, TransactionResponse, TransactionType, Tresory } from '@types';
import { generateTransactionItemArray } from '@utils/utils';
import { AxiosResponse, AxiosError } from 'axios';

// Used for caching data in the container dashboard
export function getTransactionItems(setItems: (item: Array<TransactionType<ItemTransactionResponse>>) => void): IProxyPost<QueryType> {
    const [{ loading: loading1, error: error1 }, getAllTransactions] = useAxios<ITransactionType[]>(endpoints.v1.transaction);
    const [{ loading: loading2, error: error2 }, getTransaction] = useAxios<TransactionResponse>('');

    const loading = loading1 || loading2;
    const error = error1 || error2;

    const getDataAsync = async (query: QueryType): Promise<void> => {
        setItems([]);
        const finalResponse: Array<TransactionType<ItemTransactionResponse>> = [];
        const { data } = await getAllTransactions({ params: query });
        await Promise.all(
            data
                // .filter((transaction) => transaction.sale === true)
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

    const getData = (query: QueryType): void => {
        getDataAsync(query).catch(() => {});
    };

    return [getData, { loading, error }];
}

// Use for both stacked chart and tresory
export function getTransactions(setItems: (item: ITransactionType[]) => void): IProxyParam<QueryType> {
    const [{ loading, error }, getAllTransactions] = useAxios<ITransactionType[]>(endpoints.v1.transaction);

    const getDataAsync = async (query?: QueryType): Promise<void> => {
        setItems([]);
        const { data } = await getAllTransactions({ params: query });
        setItems(data);
    };

    const getData = (query?: QueryType): void => {
        getDataAsync(query).catch(() => {});
    };

    return [getData, { loading, error }];
}

// Use to get missing transation form cache for the stacked chart
export function getTransactionItem(setItem: (item: TransactionType<ItemTransactionResponse>) => void): IProxyId {
    const [{ loading, error }, getTransaction] = useAxios<TransactionResponse>(endpoints.v1.transaction);

    const getDataAsync = async (id: number): Promise<void> => {
        const { data } = await getTransaction({}, endpoints.v1.transaction + id);
        setItem({
            ...data,
            items: generateTransactionItemArray(data)
        });
    };

    const getData = (id: number): void => {
        getDataAsync(id).catch(() => {});
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

export function getAccounts(setItems: (item: any[]) => void): IProxy {
    const [{ loading, error }, getAllAccounts] = useAxios<any[]>(endpoints.v1.account);

    const getDataAsync = async (): Promise<void> => {
        setItems([]);
        const { data } = await getAllAccounts();
        setItems(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

export function putAccount(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Account> {
    const [{ error, loading }, put] = useAxios<Account>('', { method: 'PUT' });

    const putAsync = async (data: Account): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, endpoints.v1.account + id!);
        callback?.(response);
    };

    const putData = (data: Account): void => {
        putAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}

export function deleteAccount(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyId {
    const [{ error, loading }, del] = useAxios<Account>('', { method: 'DELETE' });

    const deleteAsync = async (id: number): Promise<void> => {
        const response = await del({}, endpoints.v1.account + id!);
        callback?.(response);
    };

    const deleteData = (id: number): void => {
        deleteAsync(id).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [deleteData, { loading, error }];
}

export function getPersonnalAccount(setItem: (item: Account | null) => void): IProxy {
    const [{ loading, error }, getAccount] = useAxios<Account>(endpoints.v1.accountMe);

    const getDataAsync = async (): Promise<void> => {
        setItem(null);
        const { data } = await getAccount();
        setItem(data);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

export function putPersonnalAccount(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Partial<Account>> {
    const [{ error, loading }, put] = useAxios<Account>('', { method: 'PUT' });

    const putAsync = async (data: Partial<Account>): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, endpoints.v1.accountMe);
        callback?.(response);
    };

    const putData = (data: Partial<Account>): void => {
        putAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}

export function getTresory(setItem: (item: Tresory) => void): IProxy {
    const [{ loading, error }, getTresory] = useAxios<Tresory[]>(endpoints.v1.tresory);

    const getDataAsync = async (): Promise<void> => {
        const { data } = await getTresory();
        setItem(data[0]!);
    };

    const getData = (): void => {
        getDataAsync().catch(() => {});
    };

    return [getData, { loading, error }];
}

export function postNewTransaction(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<TransactionType<null>> {
    const [{ error, loading }, post] = useAxios<TransactionType<null>>('', { method: 'POST' });

    const postAsync = async (data: TransactionType<null>): Promise<void> => {
        const response = await post({ data }, endpoints.v1.transaction);
        callback?.(response);
    };

    const postData = (data: TransactionType<null>): void => {
        postAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [postData, { loading, error }];
}

export function putTreasury(callback?: (data: AxiosResponse<unknown, any>) => void): IProxyPost<Tresory> {
    const [{ error, loading }, put] = useAxios<Tresory>('', { method: 'PUT' });

    const putAsync = async (data: Tresory): Promise<void> => {
        const { id, ...rest } = data;
        const response = await put({ data: rest }, endpoints.v1.tresory + id!);
        callback?.(response);
    };

    const putData = (data: Tresory): void => {
        putAsync(data).catch((err: AxiosError<unknown, any>) => {
            callback?.(err.response as AxiosResponse<unknown, any>);
        });
    };

    return [putData, { loading, error }];
}
