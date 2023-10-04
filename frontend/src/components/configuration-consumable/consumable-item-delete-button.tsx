import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { useDeleteConsumableItem } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { ConsumableItem } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';

export function ConsumableItemDeleteButton({ consumableItem }: { consumableItem: ConsumableItem }) {
  const router = useRouter();
  const name = consumableItem.name;

  const deleteConsumableItem = useDeleteConsumableItem({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} supprimé avec succès !`);
      router.push(pages.configuration.consommables.index);
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la suppression du consommable ${name}. ${detail}`);
    }
  });

  const onDelete = () => {
    deleteConsumableItem.mutate({
      pathParams: {
        consumableItemId: consumableItem.id
      }
    });
  };

  return (
    <Button
      danger
      onClick={onDelete}
      loading={deleteConsumableItem.isLoading}
    >
      <span>Supprimer</span>
    </Button>
  );
}
