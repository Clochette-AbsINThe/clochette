import ConfigurationOutOfStockItem from '@components/ConfigurationPage/ConfigurationOutOfStockItem';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const ConfigurationOutOfStockPage: NextPage = () => {
    return (
        <Base
            title='Hors stocks'
            description='Configuration des produits hors stocks'>
            <ConfigurationOutOfStockItem />
        </Base>
    );
};

export default ConfigurationOutOfStockPage;
