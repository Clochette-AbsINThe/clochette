import { useState } from 'react';
import toast from 'react-hot-toast';

import { DialogClose } from '@radix-ui/react-dialog';
import { Cross2Icon, UpdateIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';

import { Button as QueryButton } from '@/components/button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useReadGlasses, useUpdateBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';

export function UnmountBarrelButton({ barrel }: { barrel: Barrel }) {
  const queryClient = useQueryClient();

  const modifyBarrel = useUpdateBarrel({
    onSuccess(data, variables, context) {
      toast.success(`Fût ${data.name} démonté avec succès !`);
      queryClient.invalidateQueries({ stale: true });
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
        isMounted: false
      }
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={modifyBarrel.isLoading}
            onClick={onClick}
            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
          >
            {modifyBarrel.isLoading ? <UpdateIcon className='h-4 w-4 animate-spin' /> : <Cross2Icon className='h-4 w-4' />}
            <span className='sr-only'>Unmount</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remettre le fût en stock</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function EmptyBarrelButton({ barrel }: { barrel: Barrel }) {
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
              loading={modifyBarrel.isLoading}
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

export function BarrelCard({ barrel }: { barrel: Barrel }) {
  const { data } = useReadGlasses({
    queryParams: {
      barrel_id: barrel.id
    }
  });

  return (
    <div className='flex bg-card rounded-lg shadow-md border relative px-6'>
      <UnmountBarrelButton barrel={barrel} />
      <div className='flex flex-col px-2 py-4 items-center w-full gap-2 mt-2'>
        <h1 className='text-xl font-semibold uppercase [hyphens:_auto] text-center'>{barrel.name}</h1>
        {getIcon('Barrel', 'h-24 w-24 text-gray-500 dark:text-gray-100')}
        <ul className='list-disc pl-6 mb-2'>
          <li className='text-md text-muted-foreground'>Prix de vente au verre: {barrel.sellPrice}€</li>
          {data && <li className='text-md text-muted-foreground'>Verres vendus: {data.length}</li>}
        </ul>
        <EmptyBarrelButton barrel={barrel} />
      </div>
    </div>
  );
}
