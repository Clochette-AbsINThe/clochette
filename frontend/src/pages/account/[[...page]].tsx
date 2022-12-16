import Base from '@layouts/base';
import Container from '@components/Admin/Dashboard/Container';
import type { NextPage } from 'next';
import DashboardPage from './_dashboard';
import UserPage from './_users';
import IndexPage from './_index';
import TresoryPage from './_tresory';

export const links = [
    { label: 'Accueil', to: '/account', role: ['ROLE_USER'] },
    { label: 'Tableau de bord', to: '/account/dashboard', role: ['ROLE_ADMIN'] },
    { label: 'Comptes utilisateurs', to: '/account/users', role: ['ROLE_ADMIN'] },
    { label: 'Trésorie', to: '/account/tresory', role: ['ROLE_ADMIN'] }
];


export async function getStaticPaths() {
    return {
        paths: links.map((link) => ({ params: { page: link.to.split('/').slice(2) } })),
        fallback: false
    };
}

export async function getStaticProps({ params }: { params: { page: string } }) {
    return {
        props: {
            page: params.page ? params.page[0] : ''
        }
    };
}

const AccountPage: NextPage<{ page: string }> = ({ page }: { page: string }) => {
    const generatePage = () => {
        if (page === 'dashboard') {
            return <DashboardPage />;
        } else if (page === 'users') {
            return <UserPage />;
        } else if (page === 'tresory') {
            return <TresoryPage />;
        } else {
            return <IndexPage />;
        }
    };

    return (
        <Base
            title='Dashboard'
            description=''>
            <Container pathname={page}>{generatePage()}</Container>
        </Base>
    );
};

export default AccountPage;
