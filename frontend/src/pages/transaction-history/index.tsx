import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { DataTable } from '@/components/table/data-table';
import { transactionColumns } from '@/components/transaction-table/transaction-columns';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { useReadTransactions, fetchReadTransactions } from '@/openapi-codegen/clochetteComponents';
import { Transaction } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  transactions: Transaction[];
}> = async (context) => {
  const result = await verifySession(context, pages.transactionHistory);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  let transactions: Transaction[];
  try {
    transactions = await fetchReadTransactions({
      headers: {
        authorization: `Bearer ${result.session.token}`
      },
      queryParams: {
        type: 'commerce'
      }
    });
  } catch (error) {
    logger.error(error);
    transactions = [];
  }

  return {
    props: {
      transactions
    }
  };
};

const TransactionHistoryPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = useReadTransactions(
    {
      queryParams: {
        type: 'commerce'
      }
    },
    {
      placeholderData: props.transactions
    }
  );

  return (
    <Base title='Historique des transactions'>
      <DataTable
        columns={transactionColumns}
        data={data ?? []}
      />
    </Base>
  );
};

export default TransactionHistoryPage;
