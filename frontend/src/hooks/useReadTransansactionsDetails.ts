import { useQueries } from '@tanstack/react-query';

import { fetchReadTransaction, useReadTransactions } from '@/openapi-codegen/clochetteComponents';
import { useClochetteContext } from '@/openapi-codegen/clochetteContext';
import { TransactionDetail } from '@/openapi-codegen/clochetteSchemas';

interface UseReadTransactionsDetailsOptions {
  datetime__gt: Date;
  datetime__lt: Date;
}

export function useReadTransactionsDetails({ datetime__gt, datetime__lt }: UseReadTransactionsDetailsOptions) {
  const { data: transactions } = useReadTransactions({
    queryParams: {
      datetime__gt: datetime__gt.toISOString(),
      datetime__lt: datetime__lt.toISOString(),
      trade: 'sale',
      type: 'commerce'
    }
  });

  const { fetcherOptions, queryOptions } = useClochetteContext();

  const transactionsWithDetails = useQueries({
    queries:
      transactions?.map((transaction) => ({
        queryKey: ['api', 'v2', 'transaction', transaction.id],
        queryFn: () => fetchReadTransaction({ ...fetcherOptions, pathParams: { transactionId: transaction.id } }),
        refetchOnWindowFocus: false,
        ...queryOptions
      })) ?? []
  }).map((transaction) => transaction.data);

  return {
    transactions: transactionsWithDetails.filter((transaction): transaction is TransactionDetail => !!transaction)
  };
}
