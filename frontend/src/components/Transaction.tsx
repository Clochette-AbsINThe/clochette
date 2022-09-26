import React, { useEffect, useState } from 'react';
import TransactionSwitch, { TransactionEnum } from '@components/TransactionSwitch';
import Sale from '@components/Sale';
import PopupWindows from '@components/PopupWindows';
import { getBoissons } from '@proxies/getBoissons';
import { getConsommables } from '@proxies/getConsommables';
import { getHorsStocks } from '@proxies/getHorsStocks';

export interface ItemTypes {
    id: number
    name: string
    price: number
    value: number
    image?: string
    isGlass?: boolean
}

export default function Transaction(): JSX.Element {
    const [transactionType, setTransactionType] = React.useState(TransactionEnum.Vente);

    const [itemsBoissons, setItemsBoissons] = useState<ItemTypes[]>([]);
    const { getData: getDataGlass, loading: loadingGlass } = getBoissons(setItemsBoissons);

    const [itemsConsommable, setItemsConsommable] = useState<ItemTypes[]>([]);
    const { getData: getDataConsommables, loading: loadingConsommable } = getConsommables(setItemsConsommable);

    const [itemsHorsStock, setItemsHorsStock] = useState<ItemTypes[]>([]);
    const { getData: getDataHorsStock, loading: loadingHorsStock } = getHorsStocks(setItemsHorsStock);

    const allItems = [...itemsBoissons, ...itemsConsommable, ...itemsHorsStock];

    const [totalPrice, setTotalPrice] = React.useState(0);

    useEffect(() => {
        setTotalPrice(allItems.reduce((acc, item) => acc + (item.value * item.price), 0));
    }, [allItems]);

    useEffect(() => {
        setTotalPrice(0);
        if (transactionType === TransactionEnum.Vente) {
            getDataGlass();
            getDataConsommables();
            getDataHorsStock();
        }
    }, [transactionType]);

    function handleChangeTransactionType(type: TransactionEnum): void {
        setTransactionType(type);
    };

    function renderTransaction(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <div className="md:grid-cols-3 flex-grow grid gap-2 grid-cols-1">
                    <Sale
                        items={itemsBoissons}
                        changeSubTotal={(setItemsBoissons)}
                        loading={loadingGlass}
                    />
                    <Sale
                        items={itemsConsommable}
                        changeSubTotal={setItemsConsommable}
                        loading={loadingConsommable}
                    />
                    <Sale
                        items={itemsHorsStock}
                        changeSubTotal={setItemsHorsStock}
                        loading={loadingHorsStock}
                    />
                </div>
            );
        } else {
            return (
                <div className="flex-grow">ACHAT</div>
            );
        }
    };

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
