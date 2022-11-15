import { getConsumables, getConsumablesDistincts } from '@proxies/StockProxies';
import { Consumable } from '@types';
import { useCallback, useEffect, useState } from 'react';
import { ConsumableStack } from '@components/Stock/Consumable/ConsumableStack';
import Loader from '@components/Loader';

export default function StockConsumable(): JSX.Element {
    const [consumables, setConsumables] = useState<Consumable[]>([]);
    const [getConsumableData, { loading: loadingConsumable }] = getConsumables(setConsumables);

    const [uniqueConsumables, setUniqueConsumables] = useState<Consumable[]>([]);
    const [getConsumableUniqueData, { loading: loadingConsumableUnique }] = getConsumablesDistincts(setUniqueConsumables);

    const makeApiCalls = useCallback((): void => {
        getConsumableData();
        getConsumableUniqueData();
    }, [getConsumableData, getConsumableUniqueData]);

    useEffect(() => {
        makeApiCalls();
    }, []);

    return (
        <>
            <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Consommables en stock</h2>
            <div className='flex flex-row px-5 gap-5 flex-wrap'>
                {loadingConsumable || loadingConsumableUnique ? (
                    <Loader />
                ) : (
                    uniqueConsumables.map((uniqueConsumable) => {
                        return (
                            <ConsumableStack
                                consumables={consumables}
                                uniqueConsumable={uniqueConsumable}
                                key={uniqueConsumable.name}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
}
