import { create } from 'zustand';

import { BarrelCreateForm } from './transaction-purchase-barrel-form';
import { ConsumableCreateForm } from './transaction-purchase-consumable-form';
import { NonInventoriedCreateForm } from './transaction-purchase-non-inventoried-form';

import { createSelectors } from '@/lib/zustand';

type PurchaseItemBarrel = {
  type: 'barrel';
  item: Partial<BarrelCreateForm>;
};

type PurchaseItemNonInventoried = {
  type: 'non-inventoried';
  item: Partial<NonInventoriedCreateForm>;
};

type PurchaseItemConsumable = {
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
  const matchigItem = items.findIndex((i) => i.type === item.type && i.item.name === item.item.name);
  if (matchigItem !== -1) {
    items[matchigItem] = item;
  } else {
    items.push(item);
  }

  return {
    items: [...items]
  };
}

export function removeItem(items: PurchaseItem[], item: PurchaseItem) {
  const matchigItem = items.findIndex((i) => i.type === item.type && i.item.name === item.item.name);
  if (matchigItem !== -1) {
    items.splice(matchigItem, 1);
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
