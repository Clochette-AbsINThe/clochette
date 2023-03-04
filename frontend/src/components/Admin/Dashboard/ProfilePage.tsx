import Loader from '@components/Loader';
import { getPersonnalAccount, putPersonnalAccount } from '@proxies/DashboardProxies';
import { Account } from '@types';
import { getErrorMessage } from '@utils/utils';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AccountForm from './AccountForm';

export default function ProfilePage() {
    const [account, setAccount] = useState<Account | null>(null);
    const [getAccountData, { loading }] = getPersonnalAccount(setAccount);

    const makeApiCall = useCallback(() => {
        getAccountData();
    }, [getAccountData]);

    useEffect(() => {
        makeApiCall();
    }, []);

    const [editAccount, { loading: editLoading }] = putPersonnalAccount((data) => {
        if (data.status === 200) {
            const item = data.data as Account;
            toast.success(`${item.firstName} modifié avec succès !`);
            makeApiCall();
        } else {
            const detail = getErrorMessage(data);
            toast.error(`Erreur lors de la modification de ${account!.firstName}. ${detail}`);
        }
    });

    if (loading || account === null || editLoading) return <Loader />;

    return (
        <>
            <div className='flex justify-center grow items-center'>
                <div className='min-w-[50%] border p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 flex flex-col justify-around dark:border-gray-500'>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-2xl font-bold md:mb-12 mb-6'>Modification de votre compte</h1>
                    </div>
                    <AccountForm
                        account={account}
                        editAccount={editAccount}
                    />
                </div>
            </div>
        </>
    );
}
