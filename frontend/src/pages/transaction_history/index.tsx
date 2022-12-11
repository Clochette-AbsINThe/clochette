import Base from '@layouts/base';
import Table from '@components/History/TransactionHistory';
import type { NextPage } from 'next';

const TransactionHistoryPage: NextPage = () => {
    return (
        <Base
            title='Historique transactions'
            description='La page pour gérer les transactions'>
            <Table />
        </Base>
    );
};

export default TransactionHistoryPage;
