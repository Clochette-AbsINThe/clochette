import Base from '@layouts/base';
import Transaction from '@components/Transaction';
import type { NextPage } from 'next';

const TransactionPage: NextPage = () => {
    return (
        <Base
            title='Transaction'
            description='La page pour gérer les transactions'>
            <Transaction />
        </Base>
    );
};

export default TransactionPage;
