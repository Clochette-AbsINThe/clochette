import Base from '@layouts/base';
import Container from '@components/Admin/Dashboard/Container';
import type { NextPage } from 'next';
import DashboardPage from './_dashboard';
import UserPage from './_users';
import IndexPage from './_index';
import TresoryPage from './_tresory';

export const links = [
    { label: 'Accueil', href: '/account', scopes: ['staff', 'treasurer', 'president'] },
    { label: 'Tableau de bord', href: '/account/dashboard', scopes: ['president', 'treasurer'] },
    { label: 'Comptes utilisateurs', href: '/account/users', scopes: ['president'] },
    { label: 'Trésorie', href: '/account/tresory', scopes: ['president', 'treasurer'] }
];

export async function getStaticPaths() {
    return {
        paths: links.map((link) => ({ params: { page: link.href.split('/').slice(2) } })),
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
            title='Panneau de configuration'
            description=''>
            <Container pathname={page}>{generatePage()}</Container>
        </Base>
    );
};

export default AccountPage;
