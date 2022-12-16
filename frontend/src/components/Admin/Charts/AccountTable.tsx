import Loader from '@components/Loader';
import PopupWindows from '@components/PopupWindows';
import { deleteAccount, getAccounts, putAccount } from '@proxies/DashboardProxies';
import { Account } from '@types';
import { getErrorMessage } from '@utils/utils';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AccountForm from '../Dashboard/AccountForm';

export default function AccountTable() {
    const [allAccounts, setAllAccounts] = useState<Account[]>([]);
    const [getAccountsData, { loading }] = getAccounts(setAllAccounts);

    const activeAccounts = allAccounts.filter((account) => account.isActive);
    const inactiveAccounts = allAccounts.filter((account) => !account.isActive);

    const [showModal, setShowModal] = useState(false);

    const [selectedAccount, setSelectedAccount] = useState<Account>();

    const [editAccount] = putAccount((data) => {
        if (data.status === 200) {
            const item = data.data as Account;
            toast.success(`${item.firstName} modifié avec succès !`);
        } else {
            const detail = getErrorMessage(data);
            toast.error(`Erreur lors de la modification de ${selectedAccount!.firstName}. ${detail}`);
        }
    });

    const [delAccount] = deleteAccount((data) => {
        if (data.status === 200) {
            const item = data.data as Account;
            toast.success(`${item.firstName} supprimé avec succès !`);
        } else {
            const detail = getErrorMessage(data);
            toast.error(`Erreur lors de la suppression de ${selectedAccount!.firstName}. ${detail}`);
        }
    });

    const makeApiCall = useCallback(() => {
        getAccountsData();
    }, [getAccountsData]);

    const handleAccountClick = (account: Account) => {
        setSelectedAccount(account);
        setShowModal(true);
    };

    useEffect(() => {
        makeApiCall();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <div className='overflow-x-auto md:mx-12 hide-scroll-bar'>
                <table className='table-auto w-full'>
                    <thead>
                        <tr className='bg-gray-300 dark:bg-gray-700'>
                            <th className='border-y text-start px-4 py-2 border-l'>Id</th>
                            <th className='border-y text-start px-4 py-2'>Nom</th>
                            <th className='border-y text-start px-4 py-2'>Prénom</th>
                            <th className='border-y text-start px-4 py-2'>Surnom</th>
                            <th className='border-y text-start px-4 py-2'>Rôle</th>
                            <th className='border-y text-start px-4 py-2'>Actif</th>
                            <th className='border-y text-center px-4 py-2 w-max border-r'>Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {inactiveAccounts.map((account) => (
                            <tr key={account.id}>
                                <td className='border-b border-l px-4 py-2'>{account.id}</td>
                                <td className='border-b px-4 py-2'>{account.lastName}</td>
                                <td className='border-b px-4 py-2'>{account.firstName}</td>
                                <td className='border-b px-4 py-2'>{account.staffName}</td>
                                <td className='border-b px-4 py-2'>{account.roles}</td>
                                <td className='border-b px-4 py-2 font-bold text-red-600'>{'✗'}</td>
                                <td className='border-b border-r px-4 py-2 text-center'>
                                    <button
                                        className='p-1 rounded-md text-gray-400 hover:text-gray-500'
                                        onClick={() => handleAccountClick(account)}>
                                        <svg
                                            className='w-5 h-5'
                                            fill='none'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'>
                                            <path d='M4 6h16M4 10h16M4 14h16M4 18h16'></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className='bg-gray-200 dark:bg-gray-800'>
                            <td
                                colSpan={7}
                                className='border-x border-b h-8'></td>
                        </tr>
                        {activeAccounts.map((account) => (
                            <tr key={account.id}>
                                <td className='border-b border-l px-4 py-2'>{account.id}</td>
                                <td className='border-b px-4 py-2'>{account.lastName}</td>
                                <td className='border-b px-4 py-2'>{account.firstName}</td>
                                <td className='border-b px-4 py-2'>{account.staffName}</td>
                                <td className='border-b px-4 py-2'>{account.roles}</td>
                                <td className='border-b px-4 py-2 font-bold text-green-600'>{'✓'}</td>
                                <td className='border-b border-r px-4 py-2 text-center'>
                                    <button
                                        className='p-1 rounded-md text-gray-400 hover:text-gray-500'
                                        onClick={() => handleAccountClick(account)}>
                                        <svg
                                            className='w-5 h-5'
                                            fill='none'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'>
                                            <path d='M4 6h16M4 10h16M4 14h16M4 18h16'></path>
                                        </svg>
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
                {selectedAccount !== undefined ? (
                    <AccountForm
                        account={selectedAccount}
                        editAccount={editAccount}
                        deleteAccount={delAccount}
                    />
                ) : (
                    <></>
                )}
            </PopupWindows>
        </>
    );
}
