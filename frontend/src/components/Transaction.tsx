import { useEffect, useState } from 'react';

import TransactionSwitch, { TransactionEnum } from '@components/TransactionSwitch';
import Sale from '@components/Sale';
import PopupWindows from '@components/PopupWindows';

import { getBoissons } from '@proxies/getBoissons';
import { getConsommables } from '@proxies/getConsommables';
import { getHorsStocks } from '@proxies/getHorsStocks';

import type { ItemTypes } from '@types';

/**
 * This component is in charge of displaying the transaction page.
 * @returns JSX.Element
 */
export default function Transaction(): JSX.Element {
    /**
     * This state is in charge of storing the transaction type.
     */
    const [transactionType, setTransactionType] = useState(TransactionEnum.Vente);

    /**
     * This state is in charge of storing the items for the boissons sale.
     */
    const [itemsBoissons, setItemsBoissons] = useState<ItemTypes[]>([]);
    const { getData: getDataGlass, loading: loadingGlass, error: errorGlass } = getBoissons(setItemsBoissons);

    /**
     * This state is in charge of storing the items for the consommables sale.
     */
    const [itemsConsommable, setItemsConsommable] = useState<ItemTypes[]>([]);
    const { getData: getDataConsommables, loading: loadingConsommable, error: erroConsommable } = getConsommables(setItemsConsommable);

    /**
     * This state is in charge of storing the items for the hors stock sale.
     */
    const [itemsHorsStock, setItemsHorsStock] = useState<ItemTypes[]>([]);
    const { getData: getDataHorsStock, loading: loadingHorsStock, error: errorHorsStock } = getHorsStocks(setItemsHorsStock);

    /**
     * An array whit all the items.
     * @type {ItemTypes[]}
    */
    const allItems: ItemTypes[] = [...itemsBoissons, ...itemsConsommable, ...itemsHorsStock];

    /**
     * This state is in charge of storing the total price.
     */
    const [totalPrice, setTotalPrice] = useState(0);

    /**
     * Update the total price when the array of items change.
    */
    useEffect(() => {
        setTotalPrice(allItems.reduce((acc, item) => acc + (item.value * item.price), 0));
    }, [allItems]);

    /**
     * Update the API request when the transaction type change.
    */
    useEffect(() => {
        setTotalPrice(0);
        if (transactionType === TransactionEnum.Vente) {
            getDataGlass();
            getDataConsommables();
            getDataHorsStock();
        }
    }, [transactionType]);

    /**
     * This handler is in charge of changing the transaction type.
     * @param type chnage the transaction type
     */
    function handleChangeTransactionType(type: TransactionEnum): void {
        setTransactionType(type);
    };

    /**
     * Render the main content of the transaction page, where all the items are displayed.
     * @returns JSX.Element
     */
    function renderTransaction(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <div className="md:grid-cols-3 flex-grow grid gap-2 grid-cols-1">
                    <Sale
                        items={itemsBoissons}
                        changeSubTotal={(setItemsBoissons)}
                        loading={loadingGlass}
                        error={errorGlass}
                    />
                    <Sale
                        items={itemsConsommable}
                        changeSubTotal={setItemsConsommable}
                        loading={loadingConsommable}
                        error={erroConsommable}
                    />
                    <Sale
                        items={itemsHorsStock}
                        changeSubTotal={setItemsHorsStock}
                        loading={loadingHorsStock}
                        error={errorHorsStock}
                    />
                </div>
            );
        } else {
            return (
                <div className="flex-grow">ACHAT</div>
            );
        }
    };

    /**
     * Render the recap that is displayed in the popup window.
     * @returns JSX.Element
     */
    function renderRecap(): JSX.Element {
        return (
            <div className='flex flex-col mx-4 my-3 flex-grow'>
                {
                    allItems.sort((a, b) => b.price * b.value - a.price * a.value).map((item) => {
                        if (item.value > 0) {
                            return (
                                <li className='text-2xl flex justify-between mb-2 border-b border-b-orange-300' key={item.name}>
                                    <div className='flex'>
                                        <div className='mr-2'>{item.value}</div>
                                        <div>{item.name}</div>
                                    </div>
                                    <div>{item.value * item.price}€</div>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })
                }
            </div>
        );
    }

    return (
        <>
            <TransactionSwitch changeTransactionType={handleChangeTransactionType} />
            {renderTransaction()}
            <div className='flex justify-end mt-3'>
                <div className='text-2xl font-bold mr-8'>Total: {totalPrice}€</div>

                <PopupWindows trigger={{ className: 'bg-green-700 text-white font-bold py-2 px-4 rounded', content: 'Valider' }}>
                    <div className='flex flex-col flex-grow'>
                        <div className='text-3xl font-bold pb-2 border-b-2 border-neutral-400'>Récapitulatif de la commande :</div>
                        {renderRecap()}
                        <div className='flex pt-3 self-end'>
                            <div className='text-2xl font-bold mr-8'>Total: {totalPrice}€</div>
                            <button className='bg-green-700 text-white font-bold py-2 px-4 rounded'>Valider</button>
                        </div>
                    </div>
                </PopupWindows>
            </div>
        </>
    );
};
