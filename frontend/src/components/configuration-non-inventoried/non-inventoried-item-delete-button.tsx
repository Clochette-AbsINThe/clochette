import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { useDeleteNonInventoriedItem } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';

export function NonInventoriedItemDeleteButton({ nonInventoriedItem }: { nonInventoriedItem: NonInventoriedItem }) {
  const router = useRouter();
  const name = nonInventoriedItem.name;

  const deleteNonInventoriedItem = useDeleteNonInventoriedItem({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} supprimé avec succès !`);
      router.push(pages.configuration.horsInventaires.index);
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la suppression du produit hors inventaire ${name}. ${detail}`);
    }
  });

  const onDelete = () => {
    deleteNonInventoriedItem.mutate({
      pathParams: {
        nonInventoriedItemId: nonInventoriedItem.id
      }
    });
  };

  return (
    <Button
      danger
      onClick={onDelete}
      loading={deleteNonInventoriedItem.isPending}
    >
      <span>Supprimer</span>
    </Button>
  );
}
