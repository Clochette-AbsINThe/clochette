import ConfigurationConsumableItem from '@components/ConfigurationPage/ConfigurationConsumableItem';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const ConfigurationConsumablePage: NextPage = () => {
    return (
        <Base
            title='Consommables'
            description='Configuration des produits consommables'>
            <ConfigurationConsumableItem />
        </Base>
    );
};

export default ConfigurationConsumablePage;
