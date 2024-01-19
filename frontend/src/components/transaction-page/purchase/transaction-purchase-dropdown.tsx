import { useState } from 'react';

import { ChevronDownIcon } from '@radix-ui/react-icons';

import { BarrelDropdownPopupContent } from './transaction-purchase-barrel-form';
import { ConsumableDropdownPopupContent } from './transaction-purchase-consumable-form';
import { NonInventoriedDropdownPopupContent } from './transaction-purchase-non-inventoried-form';

import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ConsumableItem, DrinkItem, IconName, NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { PlusCircledIcon, getIcon } from '@/styles/utils';

type DropdownItemProps =
  | {
      item: DrinkItem;
      type: 'barrel';
    }
  | {
      item: ConsumableItem;
      type: 'consumable';
    }
  | {
      item: NonInventoriedItem;
      type: 'non-inventoried';
    };

export function DropdownItem(props: DropdownItemProps): React.JSX.Element {
  const icon: IconName = 'icon' in props.item ? props.item.icon : 'Barrel';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className='w-full p-2 h-max'
        >
          <div className='flex items-center w-full'>
            {getIcon(icon, 'w-8 h-8 ml-2')}
            <p className='px-4 py-1 text-lg capitalize grow text-left font-normal'>{props.item.name}</p>
            <PlusCircledIcon className='w-8 h-8' />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {props.type === 'barrel' && <BarrelDropdownPopupContent barrelCreate={props.item} />}
        {props.type === 'consumable' && <ConsumableDropdownPopupContent consumableCreate={props.item} />}
        {props.type === 'non-inventoried' && <NonInventoriedDropdownPopupContent nonInventoriedCreate={props.item} />}
      </DialogContent>
    </Dialog>
  );
}

export function MissingDropdownItem({ type }: Readonly<{ type: DropdownItemProps['type'] }>): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className='h-max flex justify-start rounded-t-none items-center p-3 w-full text-sm font-medium rounded-b bg-gray-50 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:underline'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6 mr-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z'
            />
          </svg>
          <span>Ajouter un produit manquant</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {type === 'barrel' && <BarrelDropdownPopupContent />}
        {type === 'consumable' && <ConsumableDropdownPopupContent />}
        {type === 'non-inventoried' && <NonInventoriedDropdownPopupContent />}
      </DialogContent>
    </Dialog>
  );
}

type DropdownProps = (
  | {
      items: DrinkItem[];
      type: 'barrel';
    }
  | {
      items: ConsumableItem[];
      type: 'consumable';
    }
  | {
      items: NonInventoriedItem[];
      type: 'non-inventoried';
    }
) & {
  name: string;
};

export function filterItems(items: DropdownProps['items'], query: string): DropdownProps['items'] {
  return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
}

export function Dropdown(props: DropdownProps): React.JSX.Element {
  const [query, setQuery] = useState('');

  const filteredItems = filterItems(props.items, query);

  return (
    <Popover>
      <div className='flex m-2 items-center rounded-xl bg-semi-transparent px-3 py-4 flex-wrap shadow-md'>
        <PopoverTrigger asChild>
          <Button
            size={'lg'}
            className='w-full flex justify-between p-2'
          >
            <p className='text-lg font-normal whitespace-nowrap overflow-hidden'>{props.name}</p>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent>
        <div className='flex flex-col p-2 space-y-2'>
          <SearchBar
            query={query}
            setQuery={setQuery}
          />
          <div className='max-h-64 overflow-y-auto'>
            {filteredItems.map((item) => (
              /* @ts-ignore */
              <DropdownItem
                key={item.id}
                item={item}
                type={props.type}
              />
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className='flex flex-col justify-center p-2'>
              <p className='text-lg'>Aucun résultat</p>
            </div>
          )}
        </div>
        <MissingDropdownItem type={props.type} />
      </PopoverContent>
    </Popover>
  );
}
