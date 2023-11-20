import { toast } from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/button';
import { DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useDeleteAccount } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Account } from '@/openapi-codegen/clochetteSchemas';

interface AccountDeletePopupProps {
  rowAccount: Account;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AccountDeletePopup({ rowAccount, setIsOpen }: AccountDeletePopupProps) {
  const queryClient = useQueryClient();

  const deleteAccount = useDeleteAccount({
    onSuccess() {
      setIsOpen(false);
      toast.success('Compte supprimé avec succès !');
      queryClient.invalidateQueries({ stale: true });
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la suppression du compte. ${detail}`);
    }
  });

  const onClickDelete = () => {
    deleteAccount.mutate({
      pathParams: {
        accountId: rowAccount.id
      }
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Supprimer le compte :</DialogTitle>
        <DialogDescription>Etes-vous sûr de vouloir supprimer le compte ?</DialogDescription>
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
            loading={deleteAccount.isPending}
            onClick={onClickDelete}
          >
            Supprimer
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
