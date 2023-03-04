import ReloadButton from '@components/Admin/Charts/ReloadButton';
import Loader from '@components/Loader';
import PopupWindows from '@components/PopupWindows';
import { getTresory } from '@proxies/DashboardProxies';
import { getTransactionItemsById, getTransactions } from '@proxies/TransactionHistoryProxies';
import { ItemTransactionResponse, ITransactionType, Tresory } from '@types';
import { translateTable } from '@utils/utils';
import { useCallback, useEffect, useState } from 'react';

interface TransactionHistoryProps {
    showTreasuryTransaction: boolean;
}

export default function TransactionHistory(props: TransactionHistoryProps) {
    const { showTreasuryTransaction } = props;

    const [transactions, setTransactions] = useState<ITransactionType[]>([]);
    const [getTransactionsData, { loading }] = getTransactions(setTransactions);

    const [tresory, setTresory] = useState<Tresory>();
    const [getTresoryData] = getTresory(setTresory);

    const [transactionItems, setTransactionItems] = useState<ItemTransactionResponse[]>([]);
    const [transactionId, setTransactionId] = useState<ITransactionType>();
    const [getTransactionItemsData, { loading: loadingItems }] = getTransactionItemsById(setTransactionItems);
    const [showModal, setShowModal] = useState(false);

    const makeApiCall = useCallback(() => {
        getTransactionsData();
        getTresoryData();
    }, [getTransactionsData, getTresoryData]);

    useEffect(() => {
        makeApiCall();
    }, []);

    const handleShowModal = (_id: number) => {
        setTransactionId(transactions.find((transaction) => transaction.id === _id)!);
        getTransactionItemsData(_id);
        setShowModal(true);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <ReloadButton onClick={makeApiCall} />
            <div className='overflow-x-auto md:mx-12'>
                <table className='table-auto w-full'>
                    <thead>
                        <tr className='bg-gray-300 dark:bg-gray-700'>
                            <th className='border-y text-start px-4 py-2 border-l'>Id</th>
                            <th className='border-y text-start px-4 py-2'>Date</th>
                            <th className='border-y text-start px-4 py-2'>Heure</th>
                            {showTreasuryTransaction && <th className='border-y text-start px-4 py-2'>Type de transaction</th>}
                            <th className='border-y text-start px-4 py-2'>Moyen de paiment</th>
                            <th className='border-y text-start px-4 py-2'>Montant</th>
                            {showTreasuryTransaction && <th className='border-y text-start px-4 py-2'>Montant spécifique Lydia</th>}
                            <th className='border-y text-start px-4 py-2'></th>
                            <th className='border-y text-start px-4 py-2 w-0 border-r'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions
                            .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                            .filter((transaction) => showTreasuryTransaction || transaction.type !== 'tresorery')
                            .map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className='border-b border-l px-4 py-2'>{transaction.id}</td>
                                    <td className='border-b px-4 py-2'>{new Date(transaction.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
                                    <td className='border-b px-4 py-2'>{new Date(transaction.datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                                    {showTreasuryTransaction && <td className='border-b px-4 py-2'>{transaction.type === 'transaction' ? 'Transaction classique' : 'Transaction de trésorerie'}</td>}
                                    <td className='border-b px-4 py-2'>{transaction.paymentMethod}</td>
                                    <td className='border-b px-4 py-2 text-xl font-bold'>
                                        {transaction.sale ? '+' : '-'} {transaction.amount} €
                                    </td>
                                    {showTreasuryTransaction && <td className='border-b px-4 py-2 text-xl font-bold'>{transaction.sale && transaction.paymentMethod === 'Lydia' ? '+' + transaction.amount * (1 - (tresory?.lydiaRate ?? 0)) + '€' : null}</td>}
                                    <td className='border-b px-4 py-2'>
                                        {transaction.sale ? (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                className='text-green-600 h-4 w-4 mx-auto'>
                                                <polyline points='23 6 13.5 15.5 8.5 10.5 1 18'></polyline>
                                                <polyline points='17 6 23 6 23 12'></polyline>
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                className='text-red-600 h-4 w-4 mx-auto'>
                                                <polyline points='23 18 13.5 8.5 8.5 13.5 1 6'></polyline>
                                                <polyline points='17 18 23 18 23 12'></polyline>
                                            </svg>
                                        )}
                                    </td>
                                    <td className='border-b border-r px-4 py-2 w-fit'>
                                        <button
                                            className='btn-primary'
                                            onClick={() => handleShowModal(transaction.id as number)}>
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <PopupWindows
                open={showModal}
                setOpen={setShowModal}>
                <div className='flex flex-col mx-4 my-3 flex-grow'>
                    <div className='text-3xl font-bold mb-2 border-b-2 border-neutral-400'>Récapitulatif de la commande :</div>
                    {loadingItems && <Loader />}
                    {showTreasuryTransaction && <div className='text-xl mb-2'>{transactionId?.description}</div>}
                    {transactionItems.map((item) => {
                        return (
                            <li
                                className='text-2xl flex justify-between mb-2 border-b border-b-gray-300'
                                key={item.item.name}>
                                <div className='flex'>
                                    <div className='mr-2'>{item.quantity}</div>
                                    <div>
                                        {translateTable(item.table, item.quantity)} {item.item.name}
                                    </div>
                                </div>
                                {transactionId!.sale && <div className='text-green-600'>+{item.item.sellPrice! * item.quantity} €</div>}
                                {!transactionId!.sale && <div className='text-red-600'>-{'unitPrice' in item.item && item.item.unitPrice * item.quantity} €</div>}
                            </li>
                        );
                    })}
                </div>
            </PopupWindows>
        </>
    );
}
