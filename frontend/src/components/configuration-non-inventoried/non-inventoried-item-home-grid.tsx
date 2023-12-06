import Link from 'next/link';

import { Button } from '@/components/button';
import Loader from '@/components/loader';
import { Card } from '@/components/ui/card';
import { ReadNonInventoriedItemsResponse, useReadNonInventoriedItems } from '@/openapi-codegen/clochetteComponents';
import { getIcon } from '@/styles/utils';
import { pages } from '@/utils/pages';

export function filterNonInventoried(nonInventoriedItems: ReadNonInventoriedItemsResponse, query: string) {
  return nonInventoriedItems.filter((nonInventoriedItem) => nonInventoriedItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
}

export function NonInventoriedItemHomeGrid({ query }: { query: string }) {
  const { isLoading, isError, data } = useReadNonInventoriedItems({});

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <p>Erreur lors du chargement des produits hors inventaire</p>;
  }

  if (data.length === 0) {
    return <p>Aucun produit hors inventaire</p>;
  }

  return (
    <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>
      {filterNonInventoried(data, query).map((nonInventoried) => (
        <Card
          key={nonInventoried.id}
          className='flex flex-col space-y-5 p-4 bg-secondary'
        >
          <div className='flex justify-start items-center'>
            <div>{getIcon(nonInventoried.icon, 'w-8 h-8 ml-2')}</div>
            <span className='text-center text-xl ml-4'>{nonInventoried.name}</span>
          </div>
          <div className='flex grow justify-end space-x-5'>
            {nonInventoried.sellPrice !== null ? <div className='self-end pb-2 grow'>Vente à {nonInventoried.sellPrice}€</div> : null}
            <Link href={pages.configuration.horsInventaires.id(nonInventoried.id)}>
              <Button
                confirm
                aria-label='edit'
              >
                Editer
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
