import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { useDeleteDrink } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { DrinkItem } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';

export function DrinkItemDeleteButton({ drink }: { drink: DrinkItem }) {
  const router = useRouter();
  const name = drink.name;

  const deleteDrink = useDeleteDrink({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} supprimé avec succès !`);
      router.push(pages.configuration.consommables.index);
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la suppression de la boisson ${name}. ${detail}`);
    }
  });

  const onDelete = () => {
    deleteDrink.mutate({
      pathParams: {
        drinkId: drink.id
      }
    });
  };

  return (
    <Button
      danger
      onClick={onDelete}
      loading={deleteDrink.isPending}
    >
      <span>Supprimer</span>
    </Button>
  );
}
