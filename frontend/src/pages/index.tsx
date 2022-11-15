import HomePage from '@components/HomePage';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const Home: NextPage = () => {
    return (
        <Base
            title='Accueil'
            description="Page d'accueil">
            <HomePage />
        </Base>
    );
};

export default Home;
