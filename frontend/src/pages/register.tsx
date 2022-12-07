import Register from '@components/Admin/Register';
import Base from '@layouts/base';
import type { NextPage } from 'next';

const RegisterPage: NextPage = () => {
    return (
        <Base
            title='Register'
            description='Page de connection'>
            <Register />
        </Base>
    );
};

export default RegisterPage;
