import SellColumn from '@components/SellColumn';
import { getConsumables, getGlasses, getOutOfStocks } from '@proxies/SellPageProxies';
import type { APIItem, Consumable, Glass, ItemSell, OutOfStockSell } from '@types';
import { useCallback, useEffect, useState } from 'react';

interface SellPageProps {
    setItems: (nbItems: ItemSell[]) => void;
}

export default function SellPage(props: SellPageProps): JSX.Element {
    /**
     * This state is in charge of storing the items for the glasses sale.
     */
    const [itemsGlass, setItemsGlass] = useState<Array<APIItem<Glass | OutOfStockSell>>>([]);
    const [getDataBoissons, { loading: loadingBoisson, error: errorBoisson }] = getGlasses(setItemsGlass);
    /**
     * This state is in charge of storing the items for the consumables sale.
     */
    const [itemsConsumables, setItemsConsumbales] = useState<Array<APIItem<Consumable>>>([]);
    const [getDataConsommables, { loading: loadingConsommable, error: errorConsommable }] = getConsumables(setItemsConsumbales);

    /**
     * This state is in charge of storing the items for the out of stocks sale.
     */
    const [itemsOutOfStocks, setItemsOutOfStocks] = useState<Array<APIItem<OutOfStockSell>>>([]);
    const [getDataHorsStock, { loading: loadingHorsStock, error: errorHorsStock }] = getOutOfStocks(setItemsOutOfStocks);

    const makeApiCalls = useCallback((): void => {
        getDataBoissons();
        getDataConsommables();
        getDataHorsStock();
    }, [getDataBoissons, getDataConsommables, getDataHorsStock]);

    /**
     * Make all the api calls to get the items at first render.
     */
    useEffect(() => {
        makeApiCalls();
    }, []);

    /**
     * This function update the subtotal by calling the parent function.
     */
    useEffect(() => {
        props.setItems([...itemsGlass, ...itemsConsumables, ...itemsOutOfStocks].filter((item) => item.quantity > 0));
    }, [itemsGlass, itemsConsumables, itemsOutOfStocks]);

    return (
        <div
            className='md:grid-cols-3 flex-grow grid md:gap-2 gap-y-2 grid-cols-1'
            aria-label='window-vente'>
            <SellColumn
                items={itemsGlass}
                setItems={setItemsGlass}
                loading={loadingBoisson}
                error={errorBoisson}
            />
            <SellColumn
                items={itemsConsumables}
                setItems={setItemsConsumbales}
                loading={loadingConsommable}
                error={errorConsommable}
            />
            <SellColumn
                items={itemsOutOfStocks}
                setItems={setItemsOutOfStocks}
                loading={loadingHorsStock}
                error={errorHorsStock}
            />
        </div>
    );
}
