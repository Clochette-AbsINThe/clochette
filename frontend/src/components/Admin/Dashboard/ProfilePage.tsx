import Loader from '@components/Loader';
import { getPersonnalAccount } from '@proxies/DashboardProxies';
import { Account } from '@types';
import { useCallback, useEffect, useState } from 'react';
import AccountForm from './AccountForm';

// TODO: Add modification of account when backend is ready
export default function ProfilePage() {
    const [account, setAccount] = useState<Account | null>(null);
    const [getAccountData, { loading }] = getPersonnalAccount(setAccount);

    const makeApiCall = useCallback(() => {
        getAccountData();
    }, [getAccountData]);

    useEffect(() => {
        makeApiCall();
    }, []);

    if (loading || account === null) return <Loader />;

    return (
        <>
            <div className='flex justify-center grow items-center'>
                <div className='min-w-[50%] border p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 flex flex-col justify-around dark:border-gray-500'>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-2xl font-bold md:mb-12 mb-6'>Modification de votre compte</h1>
                    </div>
                    <AccountForm
                        account={account}
                        editAccount={(account) => console.log(account)}
                    />
                </div>
            </div>
        </>
    );
}
