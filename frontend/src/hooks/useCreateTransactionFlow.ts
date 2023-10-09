import toast from 'react-hot-toast';

import { useCreateTransaction, useValidateTransaction, useDeleteTransaction } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Transaction, TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';

export function useCreateTransactionFlow() {
  const createTransaction = useCreateTransaction({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création de la transaction. ${detail}`);
    }
  });
  const validateTransaction = useValidateTransaction({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la validation de la transaction. ${detail}`);
    }
  });
  const deleteTransaction = useDeleteTransaction({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la suppression de la transaction. ${detail}`);
    }
  });

  const transactionFlow = async (transaction: TransactionCommerceCreate, itemsCallback: (transactionId: number) => Promise<void>) => {
    let transactionResult: Transaction | null = null;
    try {
      transactionResult = await createTransaction.mutateAsync({
        body: transaction
      });

      await itemsCallback(transactionResult.id);

      await validateTransaction.mutateAsync({
        pathParams: {
          transactionId: transactionResult.id
        }
      });
    } catch {
      if (transactionResult) {
        await deleteTransaction.mutateAsync({
          pathParams: {
            transactionId: transactionResult.id
          }
        });
      }
      throw new Error('Transaction failed');
    }
  };

  return {
    transactionFlow,
    isLoading: createTransaction.isLoading || validateTransaction.isLoading
  };
}
