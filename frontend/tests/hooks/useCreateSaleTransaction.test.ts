import { renderHook } from '@testing-library/react';

import { SaleItems } from '@/components/transaction-page/sale/transaction-sale-store';
import { useCreateSaleTransaction, expandItems } from '@/hooks/useCreateSaleTransaction';
import { Consumable } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper } from 'tests/utils';

describe('useCreateSaleTransaction', () => {
  it('should return the correct loading state', () => {
    const { result } = renderHook(() => useCreateSaleTransaction(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(false);
  });
});

describe('expandItems', () => {
  const consumable: Consumable = {
    id: 1,
    solded: false,
    consumableItemId: 1,
    icon: 'Misc',
    name: 'Test Item',
    buyPrice: 1.99,
    sellPrice: 2.99,
  };

  it('should return an empty array when given an empty array', () => {
    const items: SaleItems = [];

    const result = expandItems(items, []);

    expect(result).toEqual([]);
  });

  it('should return an array with the correct length when given an array with one item', () => {
    const items: SaleItems = [
      {
        type: 'consumable',
        item: consumable,
        maxQuantity: 3,
        quantity: 3,
      },
    ];

    const consumables: Consumable[] = [1, 2, 3].map((id) => ({
      ...consumable,
      id,
    }));

    const result = expandItems(items, consumables);

    expect(result).toHaveLength(3);
    // Expect the ids to be different
    expect(result[0].item.id).not.toEqual(result[1].item.id);
    expect(result[0].item.id).not.toEqual(result[2].item.id);
    expect(result[1].item.id).not.toEqual(result[2].item.id);
  });

  it('should return an array with the correct length when given an array with multiple items', () => {
    const items: SaleItems = [
      {
        type: 'consumable',
        item: consumable,
        maxQuantity: 2,
        quantity: 1,
      },
      {
        type: 'glass',
        item: {
          id: 2,
          name: 'Test Item 2',
          buyPrice: 4.99,
          sellPrice: 5.99,
          barrelSellPrice: null,
          drinkItemId: 2,
          emptyOrSolded: false,
          isMounted: true,
        },
        quantity: 1,
      },
      {
        type: 'non-inventoried',
        item: {
          id: 3,
          name: 'Test Item 3',
          sellPrice: 10.99,
          icon: 'Misc',
          trade: 'purchase',
        },
        quantity: 4,
      },
    ];

    const result = expandItems(items, [consumable]);

    expect(result).toHaveLength(6);
  });
});
