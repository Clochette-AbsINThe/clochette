import type { NextPage } from 'next';

import Login from '@/components/login';
import Base from '@/layouts/base';

const LoginPage: NextPage = () => {
  return (
    <Base
      title='Se connecter'
      description='Page de connexion'
    >
      <Login />
    </Base>
  );
};

export default LoginPage;
