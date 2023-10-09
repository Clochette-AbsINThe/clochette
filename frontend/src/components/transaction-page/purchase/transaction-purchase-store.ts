import { create } from 'zustand';

import { BarrelCreateForm } from './transaction-purchase-barrel-form';
import { ConsumableCreateForm } from './transaction-purchase-consumable-form';
import { NonInventoriedCreateForm } from './transaction-purchase-non-inventoried-form';

import { createSelectors } from '@/lib/zustand';

export type PurchaseItemBarrel = {
  type: 'barrel';
  item: Partial<BarrelCreateForm>;
};

export type PurchaseItemNonInventoried = {
  type: 'non-inventoried';
  item: Partial<NonInventoriedCreateForm>;
};

export type PurchaseItemConsumable = {
  type: 'consumable';
  item: Partial<ConsumableCreateForm>;
};

export type PurchaseItem = PurchaseItemBarrel | PurchaseItemNonInventoried | PurchaseItemConsumable;

type TransactionPurchaseStore = {
  items: PurchaseItem[];

  addItem: (item: PurchaseItem) => void;
  removeItem: (item: PurchaseItem) => void;
  removeAllItems: () => void;
};

export function addItem(items: PurchaseItem[], item: PurchaseItem) {
  const itemsCopy = [...items];
  const matchigItemIndex = items.findIndex((i) => i.type === item.type && i.item.name === item.item.name);
  if (matchigItemIndex !== -1) {
    itemsCopy[matchigItemIndex] = item;
  } else {
    itemsCopy.push(item);
  }

  return {
    items: [...itemsCopy]
  };
}

export function removeItem(items: PurchaseItem[], item: PurchaseItem) {
  const matchigItemIndex = items.findIndex((i) => i.type === item.type && i.item.name === item.item.name);
  if (matchigItemIndex !== -1) {
    items.splice(matchigItemIndex, 1);
  }

  return {
    items: [...items]
  };
}

const useTransactionPurchaseStoreBase = create<TransactionPurchaseStore>((set, get) => ({
  items: [],

  addItem: (item) => set(addItem(get().items, item)),
  removeItem: (item) => set(removeItem(get().items, item)),
  removeAllItems: () => set({ items: [] })
}));

export const useTransactionPurchaseStore = createSelectors(useTransactionPurchaseStoreBase);
