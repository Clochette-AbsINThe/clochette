import { useEffect, useState } from 'react';

import BuyPage from '@components/BuyPage';
import PopupWindows from '@components/PopupWindows';
import SalePage from '@components/SalePage';
import TransactionSwitch, { TransactionEnum } from '@components/TransactionSwitch';

import { postNewBuyTransaction } from '@proxies/BuyPageProxies';
import { postNewSellTransaction } from '@proxies/SalePageProxies';

import type { ItemBuy, ItemSell, PaymentMethod } from '@types';

/**
 * This component is in charge of displaying the transaction page.
 */
export default function Transaction(): JSX.Element {
    /**
     * This state is in charge of storing the transaction type.
     */
    const [transactionType, setTransactionType] = useState(TransactionEnum.Achat);

    /**
     * This state is in charge of storing the total price.
     */
    const [totalPrice, setTotalPrice] = useState(0);

    /**
     * An array whit all the items.
    */
    const [selectedItemsSell, setSelectedItemsSell] = useState<ItemSell[]>([]);
    const [selectedItemsBuy, setSelectedItemsBuy] = useState<ItemBuy[]>([]);

    /**
     * This state is in charge of storing the payment method.
     */
    const [paymentMethod] = useState<PaymentMethod>('CB');

    /**
     * This state is in charge of storing the open state of the popup window.
     */
    const [popupWindowOpen, setPopupWindowOpen] = useState(false);

    /**
     * Those functions is in charge of handling the submit of the transaction.
     */
    const [newBuyTransaction, { loading: loadingBuy }] = postNewBuyTransaction();
    const [newSellTransaction, { loading: loadingSell }] = postNewSellTransaction();

    /**
     * Update the total price when the selected items change.
     */
    useEffect(() => {
        if (transactionType === TransactionEnum.Achat) {
            setTotalPrice(selectedItemsBuy.reduce((acc, item) => acc + (item.quantity * item.item.unitPrice), 0));
        } else {
            setTotalPrice(selectedItemsSell.reduce((acc, item) => acc + (item.quantity * item.item.sellPrice), 0));
        }
    }, [transactionType, selectedItemsBuy, selectedItemsSell]);

    /**
     * This handler is in charge of changing the transaction type.
     * @param type change the transaction type
     */
    const handleChangeTransactionType = (type: TransactionEnum): void => {
        setTransactionType(type);
    };

    /**
     * This handler is in charge of submitting the transaction.
     */
    const handlePostData = (): void => {
        setPopupWindowOpen(false);
        if (loadingBuy || loadingSell) return;
        if (transactionType === TransactionEnum.Achat) {
            if (selectedItemsBuy.length > 0) {
                newBuyTransaction({ transactionItems: selectedItemsBuy, paymentMethod, totalPrice });
            }
        } else {
            if (selectedItemsSell.length > 0) {
                newSellTransaction({ transactionItems: selectedItemsSell, paymentMethod, totalPrice });
            }
        }
    };

    /**
     * Render the main content of the transaction page, where all the items are displayed.
     */
    function renderTransaction(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <SalePage setItems={setSelectedItemsSell} />
            );
        } else {
            return (
                <BuyPage changeSelectedItems={setSelectedItemsBuy} selectedItems={selectedItemsBuy} />
            );
        }
    };

    /**
     * Render the recap that is displayed in the popup window.
     */
    function renderRecap(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <div className='flex flex-col mx-4 my-3 flex-grow'>
                    {
                        selectedItemsSell.sort((a, b) => b.item.sellPrice * b.quantity - a.item.sellPrice * a.quantity).map((item) => {
                            return (
                                <li className='text-2xl flex justify-between mb-2 border-b border-b-gray-300' key={item.item.name}>
                                    <div className='flex'>
                                        <div className='mr-2'>{item.quantity}</div>
                                        <div>{item.item.name}</div>
                                    </div>
                                    <div>{item.quantity * item.item.sellPrice}€</div>
                                </li>
                            );
                        })
                    }
                </div>
            );
        } else {
            return (
                <div className='flex flex-col mx-4 my-3 flex-grow'>
                    {
                        selectedItemsBuy.map((item) => {
                            return (
                                <li className='text-2xl flex justify-between mb-2 border-b border-b-gray-300' key={item.item.name + item.table}>
                                    <div className='flex'>
                                        <div className='mr-2'>{item.quantity}</div>
                                        <div>{item.item.name}</div>
                                    </div>
                                    <div>{item.quantity * item.item.unitPrice}€</div>
                                </li>
                            );
                        })
                    }
                </div>
            );
        }
    }

    return (
        <>
            <TransactionSwitch changeTransactionType={handleChangeTransactionType} startTransactionType={transactionType} />
            {renderTransaction()}
            <div className='flex justify-end mt-3'>
                <div className='text-2xl font-bold mr-8' aria-label='total-price'>Total: {totalPrice}€</div>

                <PopupWindows trigger={{ className: 'btn-primary', content: 'Valider' }} onOpen={popupWindowOpen} callback={(state) => setPopupWindowOpen(state)}>
                    <div className='flex flex-col flex-grow'>
                        <div className='text-3xl font-bold pb-2 border-b-2 border-neutral-400'>Récapitulatif de la commande :</div>
                        {renderRecap()}
                        <div className='flex pt-3 self-end'>
                            <div className='text-2xl font-bold mr-8' aria-label='total-price'>Total: {totalPrice}€</div>
                            <button className='btn-primary' onClick={handlePostData}>Valider</button>
                        </div>
                    </div>
                </PopupWindows>
            </div>
        </>
    );
};
