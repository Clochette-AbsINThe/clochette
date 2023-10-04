import { create } from 'zustand';

import { createSelectors } from '@/lib/zustand';
import { Barrel, Consumable, NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { ECOCUP_NAME } from '@/utils/constant';

export type SaleItemGlass = {
  type: 'glass';
  item: Barrel;
};

export type SaleItemNonInventoried = {
  type: 'non-inventoried';
  item: NonInventoriedItem;
};

export type SaleItemConsumable = {
  type: 'consumable';
  item: Consumable;
  maxQuantity: number;
};

export type SaleItem = SaleItemGlass | SaleItemNonInventoried | SaleItemConsumable;
export type SaleItems = (SaleItem & { quantity: number })[];

type TransactionSaleStore = {
  items: SaleItems;
  addEcoCup: (ecoCup: NonInventoriedItem) => void;
  resetAllQuantity: () => void;

  increment: (saleItem: SaleItem) => void;
  decrement: (saleItem: SaleItem) => void;
  reset: (saleItem: SaleItem) => void;
};

export function increment(items: SaleItems, item: SaleItem, amount: number = 1) {
  const matchigItem = items.find((i) => i.type === item.type && i.item.name === item.item.name);
  if (matchigItem) {
    let maxQuantity = Infinity;
    if (matchigItem.type === 'consumable') {
      maxQuantity = (item as SaleItemConsumable).maxQuantity;
    }
    matchigItem.quantity = Math.min(matchigItem.quantity + amount, maxQuantity);
  } else {
    const newItem = { ...item, quantity: amount };
    items.push(newItem);
  }

  return {
    items: [...items]
  };
}

export function decrement(items: SaleItems, item: SaleItem, amount: number = 1) {
  const matchigItem = items.find((i) => i.type === item.type && i.item.name === item.item.name);
  if (matchigItem) {
    matchigItem.quantity = Math.max(matchigItem.quantity - amount, 0);
  } else {
    const newItem = { ...item, quantity: 0 };
    items.push(newItem);
  }

  return {
    items: [...items]
  };
}

export function reset(items: SaleItems, item: SaleItem) {
  const matchigItem = items.find((i) => i.type === item.type && i.item.name === item.item.name);
  let delta = 0;
  if (matchigItem) {
    delta = -matchigItem.quantity;
    matchigItem.quantity = 0;
  } else {
    const newItem = { ...item, quantity: 0 };
    items.push(newItem);
  }

  return {
    items: [...items],
    delta
  };
}

const useTransactionSaleStoreBase = create<TransactionSaleStore>((set, get) => ({
  items: [],
  resetAllQuantity: () => {
    const items = get().items;
    for (const item of items) {
      item.quantity = 0;
    }
    set({ items: [...items] });
  },
  addEcoCup: (ecoCup) => set({ items: [...get().items, { type: 'non-inventoried', item: ecoCup, quantity: 0 }] }),
  increment(saleItem) {
    switch (saleItem.type) {
      case 'glass':
        const items = get().items;
        const step1 = increment(items, saleItem);
        const ecoCup = step1.items.find((item) => item.item.name === ECOCUP_NAME);
        if (!ecoCup) {
          set(step1);
          break;
        }
        const step2 = increment(step1.items, ecoCup);
        set(step2);
        break;
      default:
        set(increment(get().items, saleItem));
        break;
    }
  },
  decrement(saleItem) {
    switch (saleItem.type) {
      case 'glass':
        const items = get().items;
        const step1 = decrement(items, saleItem);
        const ecoCup = step1.items.find((item) => item.item.name === ECOCUP_NAME);
        if (!ecoCup) {
          set(step1);
          break;
        }
        const step2 = decrement(step1.items, ecoCup);
        set(step2);
        break;
      default:
        set(decrement(get().items, saleItem));
        break;
    }
  },
  reset(saleItem) {
    switch (saleItem.type) {
      case 'glass':
        const items = get().items;
        const step1 = reset(items, saleItem);
        const ecoCup = step1.items.find((item) => item.item.name === ECOCUP_NAME);
        if (!ecoCup) {
          set(step1);
          break;
        }
        const step2 = decrement(step1.items, ecoCup, Math.abs(step1.delta));
        set(step2);
        break;
      default:
        set(reset(get().items, saleItem));
        break;
    }
  }
}));

export const useTransactionSaleStore = createSelectors(useTransactionSaleStoreBase);
