import Loader from '@components/Loader';
import SellColumn from '@components/Transaction/Sell/SellColumn';
import { getEcoCup } from '@proxies/BuyPageProxies';
import { getConsumables, getGlasses, getOutOfStocks } from '@proxies/SellPageProxies';
import { getIcon } from '@styles/utils';
import type { APIItem, Consumable, Glass, ItemBuy, ItemSell, OutOfStockItemBuy, OutOfStockSell, PaymentMethod } from '@types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { createNewItem } from '@components/Transaction/Buy/BuyPage';
import PopupWindows from '@components/PopupWindows';

interface SellPageProps {
    setItems: (nbItems: ItemSell[]) => void;
    postNewBuyTransactionForEcoCup: (transactionItems: ItemBuy[], paymentMethod: PaymentMethod, totalPrice: number, date: Date) => void;
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

    /**
     * This state is in charge of storing the eco cup item
     */
    const [ecoCup, setEcoCup] = useState<OutOfStockItemBuy>();
    const [getDataEcoCup, { loading: loadingEcoCup, error: errorEcoCup }] = getEcoCup(setEcoCup);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const makeApiCalls = useCallback((): void => {
        getDataBoissons();
        getDataConsommables();
        getDataHorsStock();
        getDataEcoCup();
    }, [getDataBoissons, getDataConsommables, getDataHorsStock, getDataEcoCup]);

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
        <>
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
                <div className='flex flex-col gap-3'>
                    <SellColumn
                        items={itemsOutOfStocks}
                        setItems={setItemsOutOfStocks}
                        loading={loadingHorsStock}
                        error={errorHorsStock}
                    />
                    <Link
                        href={'/configuration/hors-stocks?id=-1'}
                        className='btn-primary'>
                        Ajouter un produit hors stock manquant
                    </Link>
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-bold'>Rendu caution Ecocup :</h1>
                        {errorEcoCup && <p className='text-red-500'>Erreur lors du chargement de l&apos;écocup</p>}
                        {loadingEcoCup && <Loader />}
                        {ecoCup && (
                            <div className='flex m-4 items-center h-max rounded-xl bg-[#70707016] p-3 md:max-w-[33vw] shadow-md max-w-full flex-wrap'>
                                <div className='flex flex-grow-[10] items-center'>
                                    {ecoCup.icon && getIcon(ecoCup.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}
                                    <h1 className='grow lg:text-3xl mx-5 text-xl'>Caution {ecoCup.name}</h1>
                                    <h1 className='mr-6 text-2xl'>1€</h1>
                                </div>
                                <div className='flex flex-grow justify-end self-center cursor-pointer'>
                                    <button
                                        onClick={() => setOpenPopup(true)}
                                        aria-label='add-ecocup'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1}
                                            stroke='currentColor'
                                            className='w-10 h-10'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PopupWindows
                open={openPopup}
                setOpen={setOpenPopup}>
                <div className='flex flex-col gap-3 justify-between grow'>
                    <div>
                        <h1 className='text-3xl font-bold mb-5'>Rendu caution Ecocup :</h1>
                        <h2 className='text-2xl'>Montant rendu 1€</h2>
                    </div>
                    {ecoCup && (
                        <button
                            className='btn-primary'
                            onClick={() => {
                                props.postNewBuyTransactionForEcoCup([createNewItem(ecoCup, 'out_of_stock')], 'Espèces', 1, new Date());
                                setOpenPopup(false);
                            }}>
                            Valider
                        </button>
                    )}
                </div>
            </PopupWindows>
        </>
    );
}
