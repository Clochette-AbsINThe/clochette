import { BarrelDropdownPopupContent } from './transaction-purchase-barrel-form';
import { ConsumableDropdownPopupContent } from './transaction-purchase-consumable-form';
import { NonInventoriedDropdownPopupContent } from './transaction-purchase-non-inventoried-form';
import { PurchaseItem, useTransactionPurchaseStore } from './transaction-purchase-store';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { IconName } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export function TransactionPurchaseRecap() {
  const items = useTransactionPurchaseStore.use.items();

  return (
    <div className='flex flex-col mb-4'>
      <h1 className='text-2xl font-bold'>Récapitulatif :</h1>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-2'>
        {items.map((item) => (
          <TransactionPurchaseRecapItem
            item={item}
            key={item.type + item.item.name}
          />
        ))}
      </div>
    </div>
  );
}

export function TransactionPurchaseRecapItem({ item }: Readonly<{ item: PurchaseItem }>) {
  const removeItem = useTransactionPurchaseStore.use.removeItem();
  const icon: IconName = 'icon' in item.item ? item.item.icon! : 'Barrel';
  const totalPrice = item.item.buyPrice! * item.item.quantity!;

  const onDelete = () => {
    removeItem(item);
  };

  return (
    <Dialog>
      <div
        className='flex flex-col gap-2 flex-wrap p-3 justify-center rounded-xl bg-semi-transparent'
        key={item.item.name}
      >
        <div className='flex flex-wrap gap-x-2'>
          {getIcon(icon, 'w-8 h-8')}
          <h1 className='grow lg:text-2xl text-lg'>{item.item.name}</h1>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>
            {item.item.quantity} {item.item.name} pour {formatPrice(totalPrice)}
          </li>
          {item.item.sellPrice !== undefined && <li className='text-md text-muted-foreground'>Prix de vente: {formatPrice(item.item.sellPrice)}</li>}
        </ul>
        <div className='grow'></div>
        <div className='flex self-end gap-x-5'>
          <DialogTrigger asChild>
            <Button>Editer</Button>
          </DialogTrigger>
          <Button
            onClick={onDelete}
            variant='destructive'
          >
            Supprimer
          </Button>
        </div>
      </div>
      <DialogContent>
        {item.type === 'barrel' && <BarrelDropdownPopupContent barrelCreate={item.item} />}
        {item.type === 'consumable' && <ConsumableDropdownPopupContent consumableCreate={item.item} />}
        {item.type === 'non-inventoried' && <NonInventoriedDropdownPopupContent nonInventoriedCreate={item.item} />}
      </DialogContent>
    </Dialog>
  );
}
