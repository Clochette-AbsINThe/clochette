import Link from 'next/link';

import { Button } from '@/components/button';
import Loader from '@/components/loader';
import { Card } from '@/components/ui/card';
import { ReadConsumableItemsResponse, useReadConsumableItems } from '@/openapi-codegen/clochetteComponents';
import { getIcon } from '@/styles/utils';
import { pages } from '@/utils/pages';

export function filterConsumableItem(consumableItems: ReadConsumableItemsResponse, query: string) {
  return consumableItems.filter((consumableItem) => consumableItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
}

export function ConsumableItemHomeGrid({ query }: { query: string }) {
  const { isLoading, isError, data } = useReadConsumableItems({});

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>Erreur lors du chargement des consommables</p>;
  }

  if (data.length === 0) {
    return <p>Aucun consommable</p>;
  }

  return (
    <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>
      {filterConsumableItem(data, query).map((consumableItem) => (
        <Card
          key={consumableItem.id}
          className='flex flex-col space-y-5 p-4 bg-secondary'
        >
          <div className='flex justify-start items-center space-x-5'>
            <div>{getIcon(consumableItem.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}</div>
            <span className='text-center text-xl'>{consumableItem.name}</span>
          </div>
          <div className='flex grow justify-end space-x-5'>
            <Link href={pages.configuration.consommables.id(consumableItem.id)}>
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
