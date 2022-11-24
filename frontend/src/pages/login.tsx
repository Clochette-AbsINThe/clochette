import Login from '@components/Login';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const LoginPage: NextPage = () => {
    return (
        <Base
            title='Login'
            description='Page de connection'>
            <Login />
        </Base>
    );
};

export default LoginPage;
