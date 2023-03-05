import Tabs from '@components/Admin/Dashboard/Tabs';
import { getBarrelsStat, getTransactionItems } from '@proxies/DashboardProxies';
import { IBarrelStatProps, TransactionType, ItemTransactionResponse } from '@types';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

type DataCachingType = {
    barrelsCache: IBarrelStatProps[];
    setBarrelsCache: Dispatch<SetStateAction<IBarrelStatProps[]>>;
    transactionsCache: Map<number, TransactionType<ItemTransactionResponse>>;
    setTransactionsCache: Dispatch<SetStateAction<Map<number, TransactionType<ItemTransactionResponse>>>>;
};

const defaultValues: DataCachingType = {
    barrelsCache: [],
    setBarrelsCache: () => {},
    transactionsCache: new Map(),
    setTransactionsCache: () => {}
};

const date = new Date();
date.setMonth(date.getMonth() - 3);

const DataCaching = createContext<DataCachingType>(defaultValues);

export const useDataCaching = () => useContext(DataCaching);

export default function Container({ children, pathname }: { children: React.ReactNode; pathname: string }) {
    const [barrelsCache, setBarrelsCache] = useState<IBarrelStatProps[]>([]);
    const [transactionsCache, setTransactionsCache] = useState<Map<number, TransactionType<ItemTransactionResponse>>>(new Map());

    const mapSetter = (items: Array<TransactionType<ItemTransactionResponse>>) => {
        const map = new Map<number, TransactionType<ItemTransactionResponse>>();
        for (const item of items) {
            map.set(item.id!, item);
        }
        setTransactionsCache(map);
    };

    const [getTransactionItemsData, { loading }] = getTransactionItems(mapSetter);

    useEffect(() => {
        getTransactionItemsData({ datetime__gt: date.toISOString(), datetime__lt: new Date().toISOString() });
    }, []);

    return (
        <div className='flex md:flex-row flex-col flex-grow'>
            <Tabs pathname={pathname} />
            <div className='flex flex-col flex-grow'>
                <DataCaching.Provider
                    value={{
                        barrelsCache,
                        setBarrelsCache,
                        transactionsCache,
                        setTransactionsCache
                    }}>
                    {children}
                </DataCaching.Provider>
            </div>
        </div>
    );
}
