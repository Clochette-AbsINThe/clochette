import toast from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/button';
import { useReadBarrels, useUpdateBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';

interface BarrelsTableMountActionProps {
  barrel: BarrelDistinct;
}

export function BarrelsTableMountAction({ barrel }: Readonly<BarrelsTableMountActionProps>) {
  const queryClient = useQueryClient();

  const modifyBarrel = useUpdateBarrel({
    onSuccess(data, variables, context) {
      toast.success(`Fût ${data.name} monté avec succès !`);
      queryClient.invalidateQueries({ stale: true });
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du fût. ${detail}`);
    }
  });

  const { data } = useReadBarrels({
    queryParams: {
      is_mounted: true,
      drink_item_id: barrel.drinkItemId
    }
  });

  const onClick = () => {
    modifyBarrel.mutate({
      pathParams: {
        barrelId: barrel.id
      },
      body: {
        isMounted: true
      }
    });
  };

  return (
    <Button
      confirm
      disabled={data === undefined || data.length > 0}
      onClick={onClick}
      loading={modifyBarrel.isPending}
    >
      Monter
    </Button>
  );
}
