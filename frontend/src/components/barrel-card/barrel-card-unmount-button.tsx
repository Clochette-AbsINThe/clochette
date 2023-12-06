import toast from 'react-hot-toast';

import { Cross2Icon, UpdateIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUpdateBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';

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
            disabled={modifyBarrel.isPending}
            onClick={onClick}
            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
          >
            {modifyBarrel.isPending ? <UpdateIcon className='h-4 w-4 animate-spin' /> : <Cross2Icon className='h-4 w-4' />}
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
