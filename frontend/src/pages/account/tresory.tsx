import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { Tabs } from '@/components/account-page/account-page-tabs';
import { LineChart } from '@/components/chart/line-chart';
import { DataTable } from '@/components/table/data-table';
import { transactionColumns } from '@/components/transaction-table/transaction-columns';
import { TresoryCardAccount } from '@/components/tresory-cards/tresory-card-account';
import { TresoryCardCash } from '@/components/tresory-cards/tresory-card-cash';
import { TresoryCardLydiaRate } from '@/components/tresory-cards/tresory-card-lydia-rate';
import { TresoryCardRecap } from '@/components/tresory-cards/tresory-card-recap';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { fetchReadLastTreasury, fetchReadTransactions, useReadLastTreasury, useReadTransactions } from '@/openapi-codegen/clochetteComponents';
import { Transaction, Treasury } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifyScopes, verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  transactions: Transaction[];
  treasury: Treasury | null;
}> = async (context) => {
  const result = await verifySession(context, pages.account.tresory);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const resultScopes = verifyScopes(pages.account.tresory, result.session);
  if (resultScopes.status === 'unauthorized') {
    return resultScopes.redirection;
  }

  const data = await Promise.all([
    fetchReadTransactions({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    }),
    fetchReadLastTreasury({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return null;
    })
  ]);

  return {
    props: {
      transactions: data[0],
      treasury: data[1]
    }
  };
};

const TresoryPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: transactions } = useReadTransactions({}, { placeholderData: props.transactions });
  const { data: treasury } = useReadLastTreasury({}, { placeholderData: props.treasury ?? undefined });

  return (
    <Base title='Gestions de la trésorerie'>
      <div className='flex md:flex-row flex-col flex-grow'>
        <Tabs />
        <div className='flex flex-col flex-grow gap-4'>
          <div className='flex gap-10 flex-wrap gap-y-4 justify-around'>
            {treasury && (
              <>
                <TresoryCardRecap treasury={treasury} />
                <TresoryCardLydiaRate treasury={treasury} />
                <TresoryCardAccount treasury={treasury} />
                <TresoryCardCash treasury={treasury} />
              </>
            )}
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-wrap gap-4 justify-between'>
              <LineChart type='account' />
              <LineChart type='cash' />
            </div>
          </div>
          <DataTable
            columns={transactionColumns}
            data={transactions ?? []}
          />
        </div>
      </div>
    </Base>
  );
};

export default TresoryPage;
