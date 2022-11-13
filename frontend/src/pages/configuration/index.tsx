import ConfigurationHomePage from '@components/ConfigurationPage/ConfigurationHomePage';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const ConfigurationPage: NextPage = () => {
    return (
        <Base
            title='Page de configuration'
            description='Page de configuration'>
            <ConfigurationHomePage />
        </Base>
    );
};

export default ConfigurationPage;
