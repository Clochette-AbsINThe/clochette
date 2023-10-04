import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import Tabs from '@/components/account-page/account-page-tabs';
import { UserForm } from '@/components/account-page/account-page-user-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Base from '@/layouts/base';
import { fetchReadAccountMe } from '@/openapi-codegen/clochetteComponents';
import { Account } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  user: Account;
}> = async (context) => {
  const result = await verifySession(context, pages.account.index);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const user = await fetchReadAccountMe({
    headers: {
      authorization: `Bearer ${result.session.token}`
    }
  });

  return {
    props: {
      user
    }
  };
};

const AccountPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base title='Gestion du compte'>
      <div className='flex md:flex-row flex-col flex-grow'>
        <Tabs />
        <div className='flex flex-col flex-grow p-8 lg:p-12 lg:px-48'>
          <Card>
            <CardHeader className='pb-0'>
              <CardTitle className='text-xl font-bold md:text-2xl'>Modifier mon compte</CardTitle>
            </CardHeader>
            <CardContent>
              <UserForm user={props.user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Base>
  );
};

export default AccountPage;
