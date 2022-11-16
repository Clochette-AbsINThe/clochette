import { useEffect, useState } from 'react';

import BuyPage from '@components/Transaction/Buy/BuyPage';
import SellPage from '@components/Transaction/Sell/SellPage';
import TransactionSwitch, { TransactionEnum } from '@components/Transaction/TransactionSwitch';
import PopupWindows from '@components/PopupWindows';

import { postNewBuyTransaction } from '@proxies/BuyPageProxies';
import { postNewSellTransaction } from '@proxies/SellPageProxies';

import type { ItemBuy, ItemSell, PaymentMethod } from '@types';
import type { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@utils/utils';
import { getIcon } from '@styles/utils';
import Link from 'next/link';

/**
 * This component is in charge of displaying the transaction page.
 */
export default function Transaction(): JSX.Element {
    /**
     * This state is in charge of storing the transaction type.
     */
    const [transactionType, setTransactionType] = useState(TransactionEnum.Vente);

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
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Lydia');

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
            setTotalPrice(+selectedItemsBuy.reduce((acc, item) => acc + Number(item.quantity * item.item.unitPrice), 0).toFixed(2));
        } else {
            setTotalPrice(+selectedItemsSell.reduce((acc, item) => acc + Number(item.quantity * item.item.sellPrice), 0).toFixed(2));
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
                <SellPage
                    setItems={setSelectedItemsSell}
                    key={reRender}
                />
            );
        } else {
            return (
                <BuyPage
                    changeSelectedItems={setSelectedItemsBuy}
                    selectedItems={selectedItemsBuy}
                    key={reRender}
                />
            );
        }
    }

    /**
     * Render the recap that is displayed in the popup window.
     */
    function renderRecap(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <div className='flex flex-col mx-4 my-3 flex-grow'>
                    {selectedItemsSell
                        .sort((a, b) => b.item.sellPrice * b.quantity - a.item.sellPrice * a.quantity)
                        .map((item) => {
                            return (
                                <li
                                    className='text-2xl flex justify-between mb-2 border-b border-b-gray-300'
                                    key={item.item.name}>
                                    <div className='flex'>
                                        <div className='mr-2'>{item.quantity}</div>
                                        <div>{item.item.name}</div>
                                    </div>
                                    <div>{Number((item.quantity * item.item.sellPrice).toFixed(2))}€</div>
                                </li>
                            );
                        })}
                </div>
            );
        } else {
            return (
                <div className='flex flex-col mx-4 my-3 flex-grow'>
                    {selectedItemsBuy.map((item) => {
                        return (
                            <li
                                className='text-2xl flex justify-between mb-2 border-b border-b-gray-300'
                                key={item.item.name + item.table}>
                                <div className='flex'>
                                    <div className='mr-2'>{item.quantity}</div>
                                    <div>{item.item.name}</div>
                                </div>
                                <div>{Number((item.quantity * item.item.unitPrice).toFixed(2))}€</div>
                            </li>
                        );
                    })}
                </div>
            );
        }
    }

    return (
        <>
            <TransactionSwitch
                changeTransactionType={handleChangeTransactionType}
                startTransactionType={transactionType}
            />
            {renderTransaction()}
            <div className='flex justify-between mt-3 flex-row'>
                {transactionType === TransactionEnum.Vente ? (
                    <Link href={'/configuration/hors-stocks?id=-1'}>
                        <a className='btn-primary'>Pour ajouter un produit hors stock manquant</a>
                    </Link>
                ) : (
                    <div className='flex-grow'></div>
                )}
                <div className='flex'>
                    <div
                        className='text-2xl font-bold mr-8'
                        aria-label='total-price'>
                        Total: <span>{totalPrice}</span>€
                    </div>
                    <PopupWindows
                        trigger={{ className: 'btn-primary', content: 'Valider' }}
                        onOpen={popupWindowOpen}
                        callback={(state) => setPopupWindowOpen(state)}>
                        <div className='flex flex-col flex-grow'>
                            <div className='text-3xl font-bold pb-2 border-b-2 border-neutral-400'>Récapitulatif de la commande :</div>
                            {renderRecap()}
                            <div className='flex justify-between flex-wrap'>
                                <PaymentMethodForm
                                    changePaymentMethod={setPaymentMethod}
                                    paymentMethod={paymentMethod}
                                />
                                <div className='flex pt-3 self-end space-x-5'>
                                    <div
                                        className='text-2xl font-bold mr-8'
                                        aria-label='total-price'>
                                        Total: {totalPrice}€
                                    </div>
                                    <button
                                        id='submit-btn'
                                        className='btn-primary'
                                        onClick={handlePostData}
                                        disabled={loadingBuy || loadingSell}>
                                        Valider le paiment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </PopupWindows>
                </div>
            </div>
        </>
    );
}

export function PaymentMethodForm({ paymentMethod, changePaymentMethod }: { paymentMethod: PaymentMethod; changePaymentMethod: (data: PaymentMethod) => void }): JSX.Element {
    return (
        <div className='flex flex-col space-y-3 mr-8'>
            <label htmlFor='payment-method'>
                <span className='text-2xl font-bold mb-2'>Moyen de paiement</span>
            </label>
            <div className='flex flex-row flex-wrap'>
                <label
                    htmlFor='cb'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='cb'
                        name='payment-method'
                        value='CB'
                        checked={paymentMethod === 'CB'}
                        onChange={() => changePaymentMethod('CB')}
                        className='checkbox'
                        aria-label='cb'
                    />
                    {getIcon('CB')}
                    <span>CB</span>
                </label>

                <label
                    htmlFor='lydia'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='lydia'
                        name='payment-method'
                        value='Lydia'
                        checked={paymentMethod === 'Lydia'}
                        onChange={() => changePaymentMethod('Lydia')}
                        className='checkbox'
                        aria-label='lydia'
                    />
                    {getIcon('Lydia')}
                    <span>Lydia</span>
                </label>
                <label
                    htmlFor='cash'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='cash'
                        name='payment-method'
                        value='Cash'
                        checked={paymentMethod === 'Espèces'}
                        onChange={() => changePaymentMethod('Espèces')}
                        className='checkbox'
                        aria-label='cash'
                    />
                    {getIcon('Cash')}
                    <span>Espèces</span>
                </label>
            </div>
        </div>
    );
}
