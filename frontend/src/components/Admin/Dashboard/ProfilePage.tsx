import Loader from '@components/Loader';
import { getPersonnalAccount } from '@proxies/DashboardProxies';
import { Account } from '@types';
import { useCallback, useEffect, useState } from 'react';
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

    if (loading || account === null) return <Loader />;

    return (
        <div className='max-h-max max-w-lg'>
            <AccountForm
                account={account}
                editAccount={() => {}}
            />
        </div>
    );
}
