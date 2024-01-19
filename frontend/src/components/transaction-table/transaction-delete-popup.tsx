import { toast } from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { DataTableRowActionsProps } from './transaction-table-row-actions';

import { Button } from '@/components/button';
import { DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDeleteTransaction } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';

interface TransactionDeletePopupProps extends DataTableRowActionsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function TransactionDeletePopup({ row, setIsOpen }: Readonly<TransactionDeletePopupProps>) {
  const queryClient = useQueryClient();

  const deleteTransaction = useDeleteTransaction({
    onSuccess() {
      setIsOpen(false);
      toast.success('Transaction supprimée avec succès !');
      queryClient.invalidateQueries({ stale: true });
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la suppression de la transaction. ${detail}`);
    }
  });

  const onClickDelete = () => {
    deleteTransaction.mutate({
      pathParams: {
        transactionId: row.original.id
      }
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Supprimer la transaction :</DialogTitle>
        <DialogDescription>Etes-vous sûr de vouloir supprimer la transaction ?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className='flex justify-end space-x-5'>
          <Button
            confirm
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button
            danger
            loading={deleteTransaction.isPending}
            onClick={onClickDelete}
          >
            Supprimer
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
