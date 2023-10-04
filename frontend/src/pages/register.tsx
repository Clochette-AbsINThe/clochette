import type { NextPage } from 'next';

import Register from '@/components/register';
import Base from '@/layouts/base';

const RegisterPage: NextPage = () => {
  return (
    <Base
      title={"S'inscrire"}
      description={"Page de d'inscription"}
    >
      <Register />
    </Base>
  );
};

export default RegisterPage;
