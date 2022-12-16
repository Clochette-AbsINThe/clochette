import Tabs from '@components/Admin/Dashboard/Tabs';
import { IBarrelStatProps, TransactionType, ItemTransactionResponse } from '@types';
import { createContext, useContext, useState } from 'react';

type DataCachingType = {
    barrelsCache: IBarrelStatProps[];
    setBarrelsCache: (barrelsStat: IBarrelStatProps[]) => void;
    transactionsCache: Array<TransactionType<ItemTransactionResponse>>;
    setTransactionsCache: (transactions: Array<TransactionType<ItemTransactionResponse>>) => void;
};

const defaultValues: DataCachingType = {
    barrelsCache: [],
    setBarrelsCache: () => {},
    transactionsCache: [],
    setTransactionsCache: () => {}
};

const DataCaching = createContext<DataCachingType>(defaultValues);

export const useDataCaching = () => useContext(DataCaching);

export default function Container({ children, pathname }: { children: React.ReactNode; pathname: string }) {
    const [barrelsCache, setBarrelsCache] = useState<IBarrelStatProps[]>([]);
    const [transactionsCache, setTransactionsCache] = useState<Array<TransactionType<ItemTransactionResponse>>>([]);

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
