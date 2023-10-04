import { Barrel, Consumable, Glass, NonInventoried } from '@/openapi-codegen/clochetteSchemas';
import { DecreasingArrowIcon, IncreaseArrowIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export function reduceItems<ItemType extends { name: string }>(items: ItemType[]): { name: string; quantity: number; items: ItemType[] }[] {
  // Use a Map to store the quantities for each distinct name
  const nameQuantityMap = new Map<string, { name: string; quantity: number; items: ItemType[] }>();

  for (const item of items) {
    // Check if the name already exists in the Map
    if (nameQuantityMap.has(item.name)) {
      const existingEntry = nameQuantityMap.get(item.name);
      if (existingEntry) {
        // Increment the quantity and add the barrel to the existing entry
        existingEntry.quantity += 1;
        existingEntry.items.push(item);
      }
    } else {
      // Create a new entry for the name
      nameQuantityMap.set(item.name, {
        name: item.name,
        quantity: 1,
        items: [item]
      });
    }
  }

  // Convert the Map values to an array
  const result = Array.from(nameQuantityMap.values());

  return result;
}

export const BarrelPurchaseDetail = (barrels: Barrel[]) => {
  const result = reduceItems(barrels);

  return result.map((barrel) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={barrel.name}
      >
        <div className='flex items-center gap-x-4'>
          <DecreasingArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{barrel.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {barrel.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix d&apos;achat unitaire: {formatPrice(barrel.items[0].buyPrice)}</li>
          {barrel.quantity > 1 && <li className='text-md text-muted-foreground'>Prix d&apos;achat total : {formatPrice(barrel.items[0].buyPrice * barrel.quantity)}</li>}
        </ul>
      </div>
    );
  });
};

export const BarrelSaleDetail = (barrels: Barrel[]) => {
  const result = reduceItems(barrels);

  return result.map((barrel) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={barrel.name}
      >
        <div className='flex items-center gap-x-4'>
          <IncreaseArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{barrel.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {barrel.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix de vente unitaire : {formatPrice(barrel.items[0].barrelSellPrice)}</li>
          {barrel.quantity > 1 && <li className='text-md text-muted-foreground'>Prix de vente total : {formatPrice(barrel.items[0].barrelSellPrice! * barrel.quantity)}</li>}
        </ul>
      </div>
    );
  });
};

export const ConsumablePurchaseDetail = (consumables: Consumable[]) => {
  const result = reduceItems(consumables);

  return result.map((consumable) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={consumable.name}
      >
        <div className='flex items-center gap-x-4'>
          <DecreasingArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{consumable.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {consumable.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix d&apos;achat unitaire : {formatPrice(consumable.items[0].buyPrice)}</li>
          {consumable.quantity > 1 && <li className='text-md text-muted-foreground'>Prix d&apos;achat total : {formatPrice(consumable.items[0].buyPrice * consumable.quantity)}</li>}
        </ul>
      </div>
    );
  });
};

export const ConsumableSaleDetail = (consumables: Consumable[]) => {
  const result = reduceItems(consumables);

  return result.map((consumable) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={consumable.name}
      >
        <div className='flex items-center gap-x-4'>
          <IncreaseArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{consumable.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {consumable.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix de vente unitaire : {formatPrice(consumable.items[0].sellPrice)}</li>
          {consumable.quantity > 1 && <li className='text-md text-muted-foreground'>Prix de vente total : {formatPrice(consumable.items[0].sellPrice * consumable.quantity)}</li>}
        </ul>
      </div>
    );
  });
};

export const GlassDetail = (glasses: Glass[]) => {
  const result = reduceItems(glasses);

  return result.map((glass) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={glass.name}
      >
        <div className='flex items-center gap-x-4'>
          <IncreaseArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{glass.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {glass.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix de vente unitaire : {formatPrice(glass.items[0].sellPrice)}</li>
          {glass.quantity > 1 && <li className='text-md text-muted-foreground'>Prix de vente total : {formatPrice(glass.items[0].sellPrice * glass.quantity)}</li>}
        </ul>
      </div>
    );
  });
};

export const NonInventoriedPurchaseDetail = (nonInventoried: NonInventoried[]) => {
  const result = reduceItems(nonInventoried);

  return result.map((nonInventoried) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={nonInventoried.name}
      >
        <div className='flex items-center gap-x-4'>
          <DecreasingArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{nonInventoried.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {nonInventoried.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix d&apos;achat unitaire: {formatPrice(nonInventoried.items[0].buyPrice)}</li>
          {nonInventoried.quantity > 1 && <li className='text-md text-muted-foreground'>Prix d&apos;achat total : {formatPrice(nonInventoried.items[0].buyPrice! * nonInventoried.quantity)}</li>}
        </ul>
      </div>
    );
  });
};

export const NonInventoriedSaleDetail = (nonInventoried: NonInventoried[]) => {
  const result = reduceItems(nonInventoried);

  return result.map((nonInventoried) => {
    return (
      <div
        className='flex flex-col mt-2'
        key={nonInventoried.name}
      >
        <div className='flex items-center gap-x-4'>
          <IncreaseArrowIcon />
          <h6 className='text-lg font-semi text-accent-foreground'>{nonInventoried.name}</h6>
        </div>
        <ul className='list-disc pl-2 md:pl-6'>
          <li className='text-md text-muted-foreground'>Quantité : {nonInventoried.quantity}</li>
          <li className='text-md text-muted-foreground'>Prix de vente unitaire : {formatPrice(nonInventoried.items[0].sellPrice)}</li>
          {nonInventoried.quantity > 1 && <li className='text-md text-muted-foreground'>Prix de vente total : {formatPrice(nonInventoried.items[0].sellPrice! * nonInventoried.quantity)}</li>}
        </ul>
      </div>
    );
  });
};
