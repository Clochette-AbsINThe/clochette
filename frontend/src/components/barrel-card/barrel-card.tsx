import { EmptyBarrelButton } from './barrel-card-empty-button';
import { UnmountBarrelButton } from './barrel-card-unmount-button';

import { useReadGlasses } from '@/openapi-codegen/clochetteComponents';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';

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
