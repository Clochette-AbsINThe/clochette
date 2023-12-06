import Link from 'next/link';

import { Button } from '@/components/button';
import Loader from '@/components/loader';
import { Card } from '@/components/ui/card';
import { ReadDrinksResponse, useReadDrinks } from '@/openapi-codegen/clochetteComponents';
import { getIcon } from '@/styles/utils';
import { pages } from '@/utils/pages';

export function filterDrinks(drinks: ReadDrinksResponse, query: string) {
  return drinks.filter((drink) => drink.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
}
export function DrinkItemHomeGrid({ query }: { query: string }) {
  const { isLoading, isError, data } = useReadDrinks({});

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <p>Erreur lors du chargement des boissons</p>;
  }

  if (data.length === 0) {
    return <p>Aucune boisson</p>;
  }

  return (
    <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>
      {filterDrinks(data, query).map((drink) => (
        <Card
          key={drink.id}
          className='flex flex-col space-y-5 p-4 bg-secondary'
        >
          <div className='flex justify-start items-center'>
            <div>{getIcon('Beer', 'w-8 h-8 ml-2')}</div>
            <div>{getIcon('Barrel', 'w-8 h-8 ml-2')}</div>
            <span className='text-center text-xl ml-4'>{drink.name}</span>
          </div>
          <div className='flex grow justify-end space-x-5'>
            <Link href={pages.configuration.boissons.id(drink.id)}>
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
