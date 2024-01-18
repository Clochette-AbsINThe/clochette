import { useState } from 'react';
import toast from 'react-hot-toast';

import { DialogClose } from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';

import { Button as QueryButton } from '@/components/button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUpdateBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';

export function EmptyBarrelButton({ barrel }: Readonly<{ barrel: Barrel }>) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const modifyBarrel = useUpdateBarrel({
    onSuccess(data, variables, context) {
      toast.success(`Fût ${data.name} vidé avec succès !`);
      queryClient.invalidateQueries({ stale: true });
      setIsOpen(false);
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du fût. ${detail}`);
    }
  });

  const onClick = () => {
    modifyBarrel.mutate({
      pathParams: {
        barrelId: barrel.id
      },
      body: {
        isMounted: false,
        emptyOrSolded: true
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={'destructive'}
          className='w-full'
        >
          Fût vide
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vider le fût</DialogTitle>
          <DialogDescription>Etes-vous sûr de vouloir déclarer le fût vide ?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex justify-end space-x-5'>
            <DialogClose asChild>
              <QueryButton>Annuler</QueryButton>
            </DialogClose>
            <QueryButton
              danger
              loading={modifyBarrel.isPending}
              onClick={onClick}
            >
              Vider
            </QueryButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
