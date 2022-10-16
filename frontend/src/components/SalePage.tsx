import SaleCol from '@components/SaleCol';
import { getConsumables, getGlasses, getOutOfStocks } from '@proxies/SalePageProxies';
import type { APIItem, Consumable, Glass, ItemSell, OutOfStock } from '@types';
import { useEffect, useState } from 'react';

interface SalePageProps {
    setItems: (nbItems: ItemSell[]) => void
}

export default function SalePage(props: SalePageProps): JSX.Element {
    /**
    * This state is in charge of storing the items for the glasses sale.
    */
    const [itemsGlass, setItemsGlass] = useState<Array<APIItem<Glass | OutOfStock>>>([]);
    const [getDataBoissons, { loading: loadingBoisson, error: errorBoisson }] = getGlasses(setItemsGlass);

    /**
     * This state is in charge of storing the items for the consumables sale.
     */
    const [itemsConsumables, setItemsConsumbales] = useState<Array<APIItem<Consumable>>>([]);
    const [getDataConsommables, { loading: loadingConsommable, error: errorConsommable }] = getConsumables(setItemsConsumbales);

    /**
     * This state is in charge of storing the items for the out of stocks sale.
     */
    const [itemsOutOfStocks, setItemsOutOfStocks] = useState<Array<APIItem<OutOfStock>>>([]);
    const [getDataHorsStock, { loading: loadingHorsStock, error: errorHorsStock }] = getOutOfStocks(setItemsOutOfStocks);

    /**
     * Make all the api calls to get the items at first render.
     */
    useEffect(() => {
        getDataBoissons();
        getDataConsommables();
        getDataHorsStock();
    }, []);

    /**
     * This function update the subtotal by calling the parent function.
     */
    useEffect(() => {
        props.setItems([...itemsGlass, ...itemsConsumables, ...itemsOutOfStocks].filter((item) => item.quantity > 0));
    }, [itemsGlass, itemsConsumables, itemsOutOfStocks]);

    return (
        <div className="md:grid-cols-3 flex-grow grid md:gap-2 gap-y-2 grid-cols-1" aria-label='window-vente'>
            <SaleCol
                items={itemsGlass}
                setItems={setItemsGlass}
                loading={loadingBoisson}
                error={errorBoisson}
            />
            <SaleCol
                items={itemsConsumables}
                setItems={setItemsConsumbales}
                loading={loadingConsommable}
                error={errorConsommable}
            />
            <SaleCol
                items={itemsOutOfStocks}
                setItems={setItemsOutOfStocks}
                loading={loadingHorsStock}
                error={errorHorsStock}
            />
        </div>
    );
}
