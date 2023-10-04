import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import Tabs from '@/components/account-page/account-page-tabs';
import { accountColumns } from '@/components/account-table/account-columns';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { fetchReadAccounts, useReadAccounts } from '@/openapi-codegen/clochetteComponents';
import { Account } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifyScopes, verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  accounts: Account[];
}> = async (context) => {
  const result = await verifySession(context, pages.account.users);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const resultScopes = verifyScopes(pages.account.users, result.session);
  if (resultScopes.status === 'unauthorized') {
    return resultScopes.redirection;
  }
  let accounts: Account[];
  try {
    accounts = await fetchReadAccounts({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    });
  } catch (error) {
    logger.error(error);
    accounts = [];
  }

  return {
    props: {
      accounts
    }
  };
};

const UsersPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: accounts } = useReadAccounts({}, { initialData: props.accounts });

  return (
    <Base title='Gestions des utilisateurs'>
      <div className='flex md:flex-row flex-col flex-grow'>
        <Tabs />
        <div className='flex flex-col flex-grow gap-4'>
          <Link
            href={pages.signup}
            className='place-self-end m-4'
          >
            <Button>Ajouter un compte</Button>
          </Link>
          <DataTable
            columns={accountColumns}
            data={accounts ?? []}
          />
        </div>
      </div>
    </Base>
  );
};

export default UsersPage;
