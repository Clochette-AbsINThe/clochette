import ConfigurationDrink from '@components/ConfigurationPage/ConfigurationDrink';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const ConfigurationDrinkPage: NextPage = () => {
    return (
        <Base
            title='Boissons'
            description='Configuration des boissons'>
            <ConfigurationDrink />
        </Base>
    );
};

export default ConfigurationDrinkPage;
