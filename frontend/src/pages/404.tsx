import Page404 from '@components/404';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const HomePage404: NextPage = () => {
    return (
        <Base
            title='404 Not Found'
            description="La page n'a pas été trouvée.">
            <Page404 />
        </Base>
    );
};

export default HomePage404;
