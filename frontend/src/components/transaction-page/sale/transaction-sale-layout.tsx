import { useEffect } from 'react';

import Link from 'next/link';

import { EcoCupDeposit } from './transaction-sale-ecocup-deposit';

import { ItemCount } from '@/components/transaction-page/sale/transaction-sale-item-count';
import { useTransactionSaleStore } from '@/components/transaction-page/sale/transaction-sale-store';
import { Button } from '@/components/ui/button';
import { useReadBarrels, useReadDistinctConsumables, useReadNonInventoriedItems } from '@/openapi-codegen/clochetteComponents';
import { Barrel, ConsumableDistinct, NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { ECOCUP_NAME } from '@/utils/constant';
import { pages } from '@/utils/pages';

export function TransactionSaleLayout(props: { barrels: Barrel[]; nonInventoriedItems: NonInventoriedItem[]; consumables: ConsumableDistinct[]; ecoCupDeposit: NonInventoriedItem | null }) {
  const addEcoCup = useTransactionSaleStore.use.addEcoCup();
  const items = useTransactionSaleStore.use.items();

  const { data: barrels } = useReadBarrels(
    {
      queryParams: {
        is_mounted: true
      }
    },
    {
      initialData: props.barrels
    }
  );

  const { data: nonInventoriedItems } = useReadNonInventoriedItems(
    {
      queryParams: {
        trade: 'sale'
      }
    },
    {
      initialData: props.nonInventoriedItems
    }
  );

  const { data: consumables } = useReadDistinctConsumables(
    {},
    {
      initialData: props.consumables
    }
  );

  const ecoCup = nonInventoriedItems?.find((item) => item.name === ECOCUP_NAME);

  useEffect(() => {
    if (ecoCup && !items.find((item) => item.item.id === ecoCup.id && item.type === 'non-inventoried')) {
      addEcoCup(ecoCup);
    }
  }, [ecoCup]);

  return (
    <div className='md:grid-cols-3 flex-grow grid md:gap-2 gap-y-2 grid-cols-1'>
      <div className='h-full flex flex-col border rounded'>
        {barrels?.map((item) => (
          <ItemCount
            key={item.id}
            item={item}
            type='glass'
          />
        ))}
        {ecoCup && (
          <>
            <div className='grow'></div>
            <ItemCount
              item={ecoCup}
              type='non-inventoried'
            />
          </>
        )}
      </div>
      <div className='h-full flex flex-col border rounded'>
        {consumables?.map((item) => (
          <ItemCount
            key={item.id}
            item={item}
            type='consumable'
            maxQuantity={item.quantity}
          />
        ))}
      </div>
      <div className='flex flex-col gap-3'>
        <div className='h-full flex flex-col border rounded'>
          {nonInventoriedItems
            ?.filter((item) => item.name !== ECOCUP_NAME)
            .map((item) => (
              <ItemCount
                key={item.id}
                type='non-inventoried'
                item={item}
              />
            ))}
        </div>
        <Link href={pages.configuration.horsInventaires.create}>
          <Button className='w-full h-max'>
            <span>Ajouter un produit hors stock manquant</span>
          </Button>
        </Link>
        <EcoCupDeposit ecoCupDeposit={props.ecoCupDeposit} />
      </div>
    </div>
  );
}
