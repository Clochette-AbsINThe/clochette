import Loader from '@components/Loader';
import PopupWindows from '@components/PopupWindows';
import useOnEchap from '@hooks/useOnEchap';
import { getTresory, postNewTransaction, putTreasury } from '@proxies/DashboardProxies';
import { getIcon } from '@styles/utils';
import { ITransactionType, Tresory } from '@types';
import { getErrorMessage } from '@utils/utils';
import { AxiosResponse } from 'axios';
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

enum PopupType {
    ModifyTotal,
    WithdrawCash,
    ModifyCash,
    DepositCash
}

export default function TresoryButtons() {
    const [tresory, setTresory] = useState<Tresory>({
        cashAmount: 0,
        lydiaRate: 0,
        totalAmount: 0,
        id: 0
    });
    const [getTresoryData, { loading: tresoryLoading }] = getTresory(setTresory);

    const makeApiCall = useCallback(() => {
        getTresoryData();
    }, [getTresoryData]);

    useEffect(() => {
        makeApiCall();
    }, []);

    const [amount, setAmount] = useState(0);

    const Amount = isNaN(amount) ? 0 : amount;

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState<PopupType>(PopupType.ModifyTotal);

    const [postTransaction] = postNewTransaction((data: AxiosResponse<any, any>) => {
        if (data.status === 200) {
            toast.success('Modification de la trésorie effectuée avec succès');
            setShowPopup(false);
            makeApiCall();
        } else {
            toast.error(`Erreur lors de la validation de la modification de la trésorie: ${getErrorMessage(data)}`);
        }
    });

    const [isEditingTreasuryRate, setIsEditingTreasuryRate] = useState(false);

    useOnEchap(() => {
        setIsEditingTreasuryRate(false);
    });

    const [changeLydiaRate] = putTreasury((data: AxiosResponse<any, any>) => {
        if (data.status === 200) {
            toast.success('Modification du taux de Lydia effectuée avec succès');
            setIsEditingTreasuryRate(false);
            makeApiCall();
        } else {
            toast.error(`Erreur lors de la validation de la modification du taux de Lydia: ${getErrorMessage(data)}`);
        }
    });

    const handleSubmitLydia = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newLydiaRate = parseFloat((e.target as any).lydiaRate.value);
        if (isNaN(newLydiaRate)) {
            toast.error('Le taux de Lydia doit être un nombre');
            return;
        }
        if (newLydiaRate < 0) {
            toast.error('Le taux de Lydia doit être positif');
            return;
        }
        if (newLydiaRate > 100) {
            toast.error('Le taux de Lydia doit être inférieur à 100%');
            return;
        }
        const lydiaRate = (newLydiaRate / 100).toFixed(3);
        changeLydiaRate({
            id: tresory.id,
            lydiaRate: Number(lydiaRate)
        });
    };

    const handlePopupShow = (type: PopupType) => {
        setShowPopup(true);
        setPopupType(type);
    };

    const specificPopupAmount = (type: PopupType, category: 'CB' | 'Cash'): number => {
        switch (type) {
            case PopupType.ModifyTotal:
                if (category === 'CB') return Amount;
                return 0;
            case PopupType.ModifyCash:
                if (category === 'CB') return 0;
                return Amount;
            case PopupType.WithdrawCash:
                if (category === 'CB') return -Amount;
                return Amount;
            case PopupType.DepositCash:
                if (category === 'CB') return Amount;
                return -Amount;
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value === '') {
            setAmount(NaN);
            return;
        }
        if (popupType === PopupType.DepositCash) {
            if (Number(value) > tresory.cashAmount) {
                value = tresory.cashAmount.toString();
            }
            if (Number(value) < 0) {
                setAmount(NaN);
                return;
            }
        }
        if (popupType === PopupType.WithdrawCash) {
            if (Number(value) < 0) {
                setAmount(NaN);
                return;
            }
        }
        setAmount(Number(value));
    };

    const handleSubmitTransaction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const amount_cb = Number(formData.get('amount_cb') as string);
        const amount_cash = Number(formData.get('amount_cash') as string);
        const description = formData.get('description') as string;

        if (amount_cb !== 0) {
            const transaction: ITransactionType = {
                amount: Math.abs(amount_cb),
                paymentMethod: 'CB',
                description,
                datetime: new Date().toISOString(),
                sale: amount_cb > 0 ? true : false,
                type: 'tresorery'
            };
            postTransaction(transaction);
        } else if (amount_cash !== 0) {
            const transaction: ITransactionType = {
                amount: Math.abs(amount_cash),
                paymentMethod: 'Espèces',
                description,
                datetime: new Date().toISOString(),
                sale: amount_cash > 0 ? true : false,
                type: 'tresorery'
            };
            postTransaction(transaction);
        } else {
            toast.error('Le montant de modification doit être différent de 0');
        }
    };

    if (tresoryLoading) return <Loader />;

    return (
        <>
            <div className='flex gap-10 flex-wrap my-4 justify-around'>
                <div className='border p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-500 flex flex-col grow sm:grow-0'>
                    <h6 className='text-xl font-medium mb-4'>Total</h6>
                    <div className='flex items-center mb-4'>
                        <div className='bg-[#0e7c7c28] p-2 rounded-md max-w-max'>{getIcon('Virement', 'text-[#0e7c7c] w-8 h-8')}</div>
                        <div className='flex flex-col ml-2'>
                            <span className='text-sm text-gray-400'>Total de la trésorerie</span>
                            <span className='font-medium text-lg'>{tresory.totalAmount} €</span>
                        </div>
                    </div>
                    <div className='flex items-center mb-4'>
                        <div className='bg-[#28C76F28] p-2 rounded-md max-w-max'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
                        <div className='flex flex-col ml-2'>
                            <span className='text-sm text-gray-400'>Compte</span>
                            <span className='font-medium text-lg'>{tresory.totalAmount - tresory.cashAmount} €</span>
                        </div>
                    </div>
                    <div className='flex items-center mb-2'>
                        <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
                        <div className='flex flex-col ml-2'>
                            <span className='text-sm text-gray-400'>Espèces</span>
                            <span className='font-medium text-lg'>{tresory.cashAmount} €</span>
                        </div>
                    </div>
                </div>
                <div className='border p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-500 flex flex-col grow sm:grow-0'>
                    <h6 className='text-xl font-medium mb-4'>Taux Lydia</h6>
                    <form
                        className='flex flex-col grow'
                        onSubmit={handleSubmitLydia}>
                        <div className='flex items-center mb-4'>
                            <div className='bg-[#1472B128] p-2 rounded-md max-w-max'>{getIcon('Lydia', 'w-8 h-8')}</div>
                            <div className='flex flex-col ml-2'>
                                {isEditingTreasuryRate ? (
                                    <div className='flex flex-row items-center'>
                                        <input
                                            className='text-sm input w-12'
                                            type='numbre'
                                            name='lydiaRate'
                                            min={0}
                                            max={100}
                                            defaultValue={Number((tresory.lydiaRate * 100).toFixed(3))}
                                        />
                                        <span className='font-medium text-lg ml-2'>%</span>
                                    </div>
                                ) : (
                                    <span className='font-medium text-lg'>{Number((tresory.lydiaRate * 100).toFixed(3))} %</span>
                                )}
                            </div>
                        </div>
                        <div className='flex items-end mb-2 grow'>
                            <button
                                className='btn-primary'
                                type='button'
                                onClick={() => setIsEditingTreasuryRate(true)}
                                hidden={isEditingTreasuryRate}>
                                Modifier le taux
                            </button>
                            <button
                                className='btn-primary'
                                type='submit'
                                hidden={!isEditingTreasuryRate}>
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
                <div className='border p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-500 flex sm:flex-row flex-col grow sm:grow-0'>
                    <div className='flex flex-col sm:pr-4 sm:border-r pb-4 border-b sm:pb-0 sm:border-b-0'>
                        <div className='bg-[#28C76F28] p-2 rounded-md max-w-max mb-3'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
                        <h6 className='text-xl font-medium mb-4'>Total compte</h6>
                        <div className='flex justify-center'>
                            <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
                                <span>{tresory.totalAmount - tresory.cashAmount} €</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col sm:pl-4 pt-4 sm:pt-0'>
                        <h6 className='text-xl'>Actions possibles :</h6>
                        <div className='flex flex-col mt-6'>
                            <button
                                className='btn-danger'
                                onClick={() => handlePopupShow(PopupType.ModifyTotal)}>
                                Modifier le montant
                            </button>
                        </div>
                    </div>
                </div>
                <div className='border p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-500 flex sm:flex-row flex-col grow sm:grow-0'>
                    <div className='flex flex-col sm:pr-4 sm:border-r pb-4 border-b sm:pb-0 sm:border-b-0'>
                        <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max mb-3'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
                        <h6 className='text-xl font-medium mb-4'>Total espèces</h6>
                        <div className='flex justify-center'>
                            <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
                                <span>{tresory.cashAmount} €</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col sm:pl-4 pt-4 sm:pt-0'>
                        <h6 className='text-xl'>Actions possibles :</h6>
                        <div className='flex flex-col mt-6'>
                            <button
                                className='btn-primary'
                                onClick={() => handlePopupShow(PopupType.DepositCash)}>
                                Déposer du liquide
                            </button>
                            <button
                                className='btn-primary mt-4'
                                onClick={() => handlePopupShow(PopupType.WithdrawCash)}>
                                Retirer du liquide
                            </button>
                            <button
                                className='btn-danger mt-4'
                                onClick={() => handlePopupShow(PopupType.ModifyCash)}>
                                Modifier le montant
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showPopup && (
                <PopupWindows
                    open={showPopup}
                    setOpen={setShowPopup}>
                    <div className='flex flex-col grow p-8'>
                        <h1 className='text-3xl font-bold mb-4'>
                            {popupType === PopupType.ModifyTotal && 'Modifier le montant du compte'}
                            {popupType === PopupType.ModifyCash && 'Modifier le montant des espèces'}
                            {popupType === PopupType.WithdrawCash && 'Retirer du liquide'}
                            {popupType === PopupType.DepositCash && 'Déposer du liquide'}
                        </h1>
                        <form
                            className='flex flex-col grow gap-4 '
                            onSubmit={handleSubmitTransaction}>
                            <div className='flex flex-col'>
                                <label htmlFor='amount'>
                                    {(popupType === PopupType.ModifyTotal || popupType === PopupType.ModifyCash) && 'Nouveau montant'}
                                    {popupType === PopupType.WithdrawCash && 'Montant à retirer'}
                                    {popupType === PopupType.DepositCash && 'Montant à déposer'}
                                </label>
                                <div className='flex items-center'>
                                    <input
                                        type='number'
                                        id='amount'
                                        name='amount'
                                        required
                                        className='input w-64 mt-2'
                                        step={0.01}
                                        min={popupType === PopupType.WithdrawCash || popupType === PopupType.DepositCash ? 0 : undefined}
                                        value={isNaN(amount) ? '' : amount}
                                        onChange={handleAmountChange}
                                        onBlur={() => setAmount(isNaN(amount) ? 0 : amount)}
                                    />
                                    <span className='ml-2 font-bold text-2xl'>€</span>
                                </div>
                            </div>
                            <div className='flex flex-col mt-4'>
                                <label htmlFor='description'>Description</label>
                                <input
                                    type='text'
                                    name='description'
                                    id='description'
                                    className='input mt-2'
                                    required
                                />
                            </div>
                            <div>
                                <h1 className='text-xl font-medium mt-8 mb-4'>Prévisualisation de l&apos;opération :</h1>
                                <div className='border p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-500 flex flex-row grow sm:grow-0 justify-around flex-wrap'>
                                    <div className='flex flex-col grow'>
                                        <h6 className='text-xl font-medium mb-4'>Etat actuel</h6>
                                        <div className='flex items-center mb-4'>
                                            <div className='bg-[#28C76F28] p-2 rounded-md max-w-max'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
                                            <div className='flex flex-col ml-2'>
                                                <span className='text-sm text-gray-400'>Compte</span>
                                                <span className='font-medium text-lg'>{tresory.totalAmount - tresory.cashAmount} €</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center mb-2'>
                                            <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
                                            <div className='flex flex-col ml-2'>
                                                <span className='text-sm text-gray-400'>Espèces</span>
                                                <span className='font-medium text-lg'>{tresory.cashAmount} €</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='sm:border-r mx-8'></div>
                                    <div className='flex flex-col grow-[2]'>
                                        <h6 className='text-xl font-medium mb-4'>Nouvel état</h6>
                                        <div className='flex sm:items-center mb-4 flex-col sm:flex-row gap-2'>
                                            <div className='flex items-center'>
                                                <div className='bg-[#28C76F28] p-2 rounded-md max-w-max'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
                                                <div className='flex flex-col ml-2 grow'>
                                                    <span className='text-sm text-gray-400'>Compte</span>
                                                    {popupType === PopupType.ModifyTotal ? (
                                                        <span className='font-medium text-lg'>{Amount} €</span>
                                                    ) : (
                                                        <span className='font-medium text-lg'>{tresory.totalAmount - tresory.cashAmount + specificPopupAmount(popupType, 'CB')} €</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex sm:justify-end sm:mx-8 grow-[2]'>
                                                <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
                                                    {popupType === PopupType.ModifyTotal ? (
                                                        <>
                                                            <span>
                                                                {Amount - (tresory.totalAmount - tresory.cashAmount) >= 0 ? '+' : ''}
                                                                {(Amount - (tresory.totalAmount - tresory.cashAmount)).toFixed(2)} €
                                                            </span>
                                                            <input
                                                                type='number'
                                                                hidden
                                                                className='sr-only'
                                                                readOnly
                                                                value={(Amount - (tresory.totalAmount - tresory.cashAmount)).toFixed(2)}
                                                                name='amount_cb'
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>
                                                                {specificPopupAmount(popupType, 'CB') >= 0 ? '+' : ''}
                                                                {specificPopupAmount(popupType, 'CB')} €
                                                            </span>
                                                            <input
                                                                type='number'
                                                                hidden
                                                                className='sr-only'
                                                                readOnly
                                                                value={specificPopupAmount(popupType, 'CB')}
                                                                name='amount_cb'
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex sm:items-center mb-4 flex-col sm:flex-row gap-2'>
                                            <div className='flex items-center'>
                                                <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
                                                <div className='flex flex-col ml-2 grow'>
                                                    <span className='text-sm text-gray-400'>Espèces</span>
                                                    {popupType === PopupType.ModifyCash ? (
                                                        <span className='font-medium text-lg'>{Amount} €</span>
                                                    ) : (
                                                        <span className='font-medium text-lg'>{tresory.cashAmount + specificPopupAmount(popupType, 'Cash')} €</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex sm:justify-end sm:mx-8 grow-[2]'>
                                                <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
                                                    {popupType === PopupType.ModifyCash ? (
                                                        <>
                                                            <span>
                                                                {Amount - tresory.cashAmount >= 0 ? '+' : ''}
                                                                {Amount - tresory.cashAmount} €
                                                            </span>
                                                            <input
                                                                type='number'
                                                                hidden
                                                                className='sr-only'
                                                                readOnly
                                                                value={Amount - tresory.cashAmount}
                                                                name='amount_cash'
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>
                                                                {specificPopupAmount(popupType, 'Cash') >= 0 ? '+' : ''}
                                                                {specificPopupAmount(popupType, 'Cash')} €
                                                            </span>
                                                            <input
                                                                type='number'
                                                                hidden
                                                                className='sr-only'
                                                                readOnly
                                                                value={specificPopupAmount(popupType, 'Cash')}
                                                                name='amount_cash'
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='grow'></div>
                            <div className='flex justify-end'>
                                <button
                                    className='btn-primary'
                                    type='submit'>
                                    Modifier
                                </button>
                            </div>
                        </form>
                    </div>
                </PopupWindows>
            )}
        </>
    );
}
