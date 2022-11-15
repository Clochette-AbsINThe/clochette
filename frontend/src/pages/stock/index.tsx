import Base from '@layouts/base';
import Stock from '@components/Stock/Stock';
import type { NextPage } from 'next';

const StockPage: NextPage = () => {
    return (
        <Base
            title='Stock'
            description='La page pour gérer les stocks'>
            <Stock />
        </Base>
    );
};

export default StockPage;
