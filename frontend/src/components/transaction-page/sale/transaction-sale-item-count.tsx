import { useEffect, useState } from 'react';

import { Cross2Icon } from '@radix-ui/react-icons';

import { SaleItem, useTransactionSaleStore } from './transaction-sale-store';

import { Button } from '@/components/ui/button';
import { IconName } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { PlusCircledIcon, MinusCircledIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export function ItemCount(props: SaleItem): JSX.Element {
  const [quantity, setQuantity] = useState<number>(0);
  const { increment, decrement, reset, items } = useTransactionSaleStore();

  useEffect(() => {
    const item = items.find((item) => item.item.name === props.item.name && item.type === props.type);
    if (item) {
      setQuantity(item.quantity);
    }
  }, [items, props.item.name, props.type]);

  const resetHandler = (): void => {
    reset(props);
  };

  const decrementHandler = (): void => {
    decrement(props);
  };

  const incrementHandler = (): void => {
    increment(props);
  };

  const icon: IconName = 'icon' in props.item ? props.item.icon : 'Beer';

  return (
    <div className='flex my-2 mx-4 p-2 items-center h-max rounded-xl bg-semi-transparent md:max-w-[33vw] max-w-full flex-wrap shadow-md opacity-0 animate-fade-in'>
      <div className='flex flex-grow-[10] items-center'>
        {getIcon(icon, 'w-10 h-10 ml-2')}
        <h1 className='grow lg:text-2xl mx-5 text-lg'>{props.item.name}</h1>
        <h2 className='mr-6 text-xl'>{formatPrice(props.item.sellPrice)}</h2>
      </div>
      <div className='flex flex-grow justify-end mt-2 items-center'>
        <div className='flex px-2 border-2 rounded-full border-green-800 items-center'>
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={quantity <= 0}
            onClick={decrementHandler}
          >
            <MinusCircledIcon className='w-10 h-10' />
          </Button>
          <h3 className='py-2 px-4 text-2xl'>{quantity}</h3>
          <Button
            variant={'ghost'}
            size={'icon'}
            disabled={props.type === 'consumable' && quantity >= props.maxQuantity}
            onClick={incrementHandler}
          >
            <PlusCircledIcon className='w-10 h-10' />
          </Button>
        </div>
        <Button
          variant={'ghost'}
          size={'icon'}
          className='ml-3'
          disabled={quantity <= 0}
          onClick={resetHandler}
        >
          <Cross2Icon className='w-12 h-12' />
        </Button>
      </div>
    </div>
  );
}
