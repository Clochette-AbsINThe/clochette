import { useEffect, useState } from 'react';

import BuyPage from '@components/BuyPage';
import PopupWindows from '@components/PopupWindows';
import SalePage from '@components/SalePage';
import TransactionSwitch, { TransactionEnum } from '@components/TransactionSwitch';

import { postNewBuyTransaction } from '@proxies/BuyPageProxies';
import { postNewSellTransaction } from '@proxies/SalePageProxies';

import type { ItemBuy, ItemSell, PaymentMethod } from '@types';
import type { AxiosResponse } from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { getErrorMessage } from '@components/ConfigurationPage/ConfigurationPageBase';
import { getIcon } from '@styles/utils';

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
    const [newBuyTransaction, { loading: loadingBuy }] = postNewBuyTransaction(callbackPost);
    const [newSellTransaction, { loading: loadingSell }] = postNewSellTransaction(callbackPost);
    const [reRender, setReRender] = useState<-1 | 1>(1);


    function callbackPost(data: AxiosResponse<any, any>): void {
        if (data.status === 200) {
            toast.success('Transaction effectuée avec succès');
            setPopupWindowOpen(false);
            setReRender((reRender * -1) as -1 | 1);
            if (transactionType === TransactionEnum.Achat) {
                setSelectedItemsBuy([]);
            }
        } else {
            const err = `Error ${data.status}: ${getErrorMessage(data)} on ${(data.config.baseURL as string) + (data.config.url as string)} with ${(data.config.method as string).toUpperCase()}`;
            toast.error(err);
            if (transactionType === TransactionEnum.Achat) {
                setReRender((reRender * -1) as -1 | 1);
            }
        }
    }

    /**
     * Update the total price when the selected items change.
     */
    useEffect(() => {
        if (transactionType === TransactionEnum.Achat) {
            setTotalPrice(selectedItemsBuy.reduce((acc, item) => acc + Number((item.quantity * item.item.unitPrice).toFixed(2)), 0));
        } else {
            setTotalPrice(selectedItemsSell.reduce((acc, item) => acc + Number((item.quantity * item.item.sellPrice).toFixed(2)), 0));
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
        if (transactionType === TransactionEnum.Achat) {
            if (selectedItemsBuy.length > 0) {
                newBuyTransaction(selectedItemsBuy, paymentMethod, totalPrice, new Date());
            }
        } else {
            if (selectedItemsSell.length > 0) {
                newSellTransaction(selectedItemsSell, paymentMethod, totalPrice, new Date());
            }
        }
    };

    /**
     * Render the main content of the transaction page, where all the items are displayed.
     */
    function renderTransaction(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <SalePage setItems={setSelectedItemsSell} key={reRender} />
            );
        } else {
            return (
                <BuyPage changeSelectedItems={setSelectedItemsBuy} selectedItems={selectedItemsBuy} key={reRender} />
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
                                    <div>{Number((item.quantity * item.item.sellPrice).toFixed(2))}€</div>
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
                                    <div>{Number((item.quantity * item.item.unitPrice).toFixed(2))}€</div>
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
            <Toaster position='bottom-left' toastOptions={{ style: { maxWidth: 500 } }} />
            <TransactionSwitch changeTransactionType={handleChangeTransactionType} startTransactionType={transactionType} />
            {renderTransaction()}
            <div className='flex justify-end mt-3'>
                <div className='text-2xl font-bold mr-8' aria-label='total-price'>
                    Total: <span>{totalPrice}</span>€
                </div>

                <PopupWindows trigger={{ className: 'btn-primary', content: 'Valider' }} onOpen={popupWindowOpen} callback={(state) => setPopupWindowOpen(state)}>
                    <div className='flex flex-col flex-grow'>
                        <div className='text-3xl font-bold pb-2 border-b-2 border-neutral-400'>Récapitulatif de la commande :</div>
                        {renderRecap()}
                        <div className='flex pt-3 self-end space-x-5'>
                            {getIcon('CB')}
                            {getIcon('Lydia')}
                            {getIcon('Cash')}
                            <div className='text-2xl font-bold mr-8' aria-label='total-price'>Total: {totalPrice}€</div>
                            <button id='submit-btn' className='btn-primary' onClick={handlePostData} disabled={loadingBuy || loadingSell}>Valider le paiment</button>
                        </div>
                    </div>
                </PopupWindows>
            </div>
        </>
    );
};
