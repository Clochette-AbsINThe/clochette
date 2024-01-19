import { act, renderHook } from '@testing-library/react';

import { PurchaseItemBarrel, PurchaseItemConsumable, PurchaseItemNonInventoried, addItem, removeItem, useTransactionPurchaseStore } from '@/components/transaction-page/purchase/transaction-purchase-store';

const barrelItem: PurchaseItemBarrel = {
  type: 'barrel',
  item: {
    name: 'Barrel 1',
    quantity: 2
  }
};

const nonInventoriedItem: PurchaseItemNonInventoried = {
  type: 'non-inventoried',
  item: {
    name: 'Non-Inventoried Item 1',
    quantity: 2
  }
};

const consumableItem: PurchaseItemConsumable = {
  type: 'consumable',
  item: {
    name: 'Consumable Item 1',
    quantity: 5
  }
};

describe('Transaction Purchase Store', () => {
  describe('addItem', () => {
    it('should add a new item to the list if it does not exist', () => {
      const items = [barrelItem];
      const newItem = nonInventoriedItem;
      const result = addItem(items, newItem);
      expect(result.items).toEqual([...items, newItem]);
    });

    it('should update an existing item in the list', () => {
      const items = [barrelItem, nonInventoriedItem];
      const updatedItem: PurchaseItemNonInventoried = {
        type: 'non-inventoried',
        item: {
          name: 'Non-Inventoried Item 1',
          quantity: 3
        }
      };
      const result = addItem(items, updatedItem);
      expect(result.items).toEqual([barrelItem, updatedItem]);
    });
  });

  describe('removeItem', () => {
    it('should remove an existing item from the list', () => {
      const items = [barrelItem, nonInventoriedItem];
      const itemToRemove = barrelItem;
      const result = removeItem(items, itemToRemove);
      expect(result.items).toEqual([nonInventoriedItem]);
    });

    it('should not remove anything if the item does not exist in the list', () => {
      const items = [barrelItem, nonInventoriedItem];
      const itemToRemove = consumableItem;
      const result = removeItem(items, itemToRemove);
      expect(result.items).toEqual(items);
    });
  });
});

describe('Transaction Purchase Store hook', () => {
  it('should initialize with an empty list', () => {
    const { result } = renderHook(() => useTransactionPurchaseStore());
    expect(result.current.items).toEqual([]);
  });

  it('should add an item to the list', () => {
    const { result } = renderHook(() => useTransactionPurchaseStore());
    act(() => {
      result.current.addItem(consumableItem);
    });
    expect(result.current.items).toEqual([consumableItem]);
  });

  it('should remove an item from the list', () => {
    const { result } = renderHook(() => useTransactionPurchaseStore());
    act(() => {
      result.current.addItem(consumableItem);
      result.current.removeItem(consumableItem);
    });
    expect(result.current.items).toEqual([]);
  });

  it('should remove all items from the list', () => {
    const { result } = renderHook(() => useTransactionPurchaseStore());
    act(() => {
      result.current.addItem(consumableItem);
      result.current.removeAllItems();
    });
    expect(result.current.items).toEqual([]);
  });
});
