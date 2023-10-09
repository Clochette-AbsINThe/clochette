import { renderHook, act } from '@testing-library/react';

import { SaleItemConsumable, SaleItemGlass, SaleItemNonInventoried, useTransactionSaleStore } from '@/components/transaction-page/sale/transaction-sale-store';
import { ECOCUP_NAME } from '@/utils/constant';

const ecocup: SaleItemNonInventoried = {
  type: 'non-inventoried',
  item: { name: ECOCUP_NAME, id: 2 } as any,
};
const glass: SaleItemGlass = {
  type: 'glass',
  item: { name: 'Test Glass', id: 1 } as any,
};
const nonInventoried: SaleItemNonInventoried = {
  type: 'non-inventoried',
  item: { name: 'Test Non Inventoried', id: 1 } as any,
};
const consumable: SaleItemConsumable = {
  type: 'consumable',
  item: { name: 'Test Consumable', id: 1 } as any,
  maxQuantity: 1,
};


describe('useTransactionSaleStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useTransactionSaleStore());
    act(() => {
      result.current.items = [];
    });
  });

  describe('should add item if not exist', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useTransactionSaleStore());
      act(() => {
        result.current.items = [];
      });
    });

    it(' on increment', () => {
      const { result } = renderHook(() => useTransactionSaleStore());

      act(() => {
        result.current.increment(nonInventoried);
      });

      expect(result.current.items).toEqual([{ ...nonInventoried, quantity: 1 }]);
    });

    it(' on decrement', () => {
      const { result } = renderHook(() => useTransactionSaleStore());

      act(() => {
        result.current.decrement(nonInventoried);
      });

      expect(result.current.items).toEqual([{ ...nonInventoried, quantity: 0 }]);
    });

    it(' on reset', () => {
      const { result } = renderHook(() => useTransactionSaleStore());

      act(() => {
        result.current.reset(nonInventoried);
      });

      expect(result.current.items).toEqual([{ ...nonInventoried, quantity: 0 }]);
    });
  });


  it('should increment and decrement sale items', () => {
    const { result } = renderHook(() => useTransactionSaleStore());

    act(() => {
      result.current.increment(nonInventoried);
    });

    expect(result.current.items).toEqual([{ ...nonInventoried, quantity: 1 }]);

    act(() => {
      result.current.increment(nonInventoried);
    });

    expect(result.current.items).toEqual([{ ...nonInventoried, quantity: 2 }]);

    act(() => {
      result.current.decrement(nonInventoried);
    });

    expect(result.current.items).toEqual([{ ...nonInventoried, quantity: 1 }]);
  });

  it('should reset sale items', () => {
    const { result } = renderHook(() => useTransactionSaleStore());

    act(() => {
      result.current.increment(consumable);
    });

    expect(result.current.items).toEqual([{ ...consumable, quantity: 1 }]);

    act(() => {
      result.current.reset(consumable);
    });

    expect(result.current.items).toEqual([{ ...consumable, quantity: 0 }]);
  });


  it('should increment and decrement eco cup accordingly to glass item', () => {
    const { result } = renderHook(() => useTransactionSaleStore());

    act(() => {
      result.current.addEcoCup(ecocup.item);
    });

    act(() => {
      result.current.increment(glass);
    });

    expect(result.current.items).toEqual([
      { ...ecocup, quantity: 1 },
      { ...glass, quantity: 1 },
    ]);

    act(() => {
      result.current.increment(glass);
    });

    expect(result.current.items).toEqual([
      { ...ecocup, quantity: 2 },
      { ...glass, quantity: 2 },
    ]);

    act(() => {
      result.current.decrement(glass);
    });

    expect(result.current.items).toEqual([
      { ...ecocup, quantity: 1 },
      { ...glass, quantity: 1 },
    ]);

    act(() => {
      result.current.reset(glass);
    });

    expect(result.current.items).toEqual([
      { ...ecocup, quantity: 0 },
      { ...glass, quantity: 0 },
    ]);
  });

  it('should increment and decrement glass item without ecocup', () => {
    const { result } = renderHook(() => useTransactionSaleStore());

    act(() => {
      result.current.increment(glass);
    });

    expect(result.current.items).toEqual([{ ...glass, quantity: 1 }]);

    act(() => {
      result.current.increment(glass);
    });

    expect(result.current.items).toEqual([{ ...glass, quantity: 2 }]);

    act(() => {
      result.current.decrement(glass);
    });

    expect(result.current.items).toEqual([{ ...glass, quantity: 1 }]);

    act(() => {
      result.current.reset(glass);
    });

    expect(result.current.items).toEqual([{ ...glass, quantity: 0 }]);
  });

  it('should reset all quantities', () => {
    const { result } = renderHook(() => useTransactionSaleStore());

    act(() => {
      result.current.addEcoCup(ecocup.item);
    });

    act(() => {
      result.current.increment(glass);
    });

    expect(result.current.items).toEqual([
      { ...ecocup, quantity: 1 },
      { ...glass, quantity: 1 },
    ]);

    act(() => {
      result.current.resetAllQuantity();
    });

    expect(result.current.items).toEqual([
      { ...ecocup, quantity: 0 },
      { ...glass, quantity: 0 },
    ]);
  });
});