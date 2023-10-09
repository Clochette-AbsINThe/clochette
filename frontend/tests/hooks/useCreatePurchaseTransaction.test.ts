import { renderHook } from '@testing-library/react';

import { useCreatePurchaseTransaction, expandItems, ExpandedItem } from '@/hooks/useCreatePurchaseTransaction';
import { createWrapper } from 'tests/utils';

describe('useCreatePurchaseTransaction', () => {
  it('should return the correct loading state', () => {
    const { result } = renderHook(() => useCreatePurchaseTransaction(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(false);
  });
});

describe('expandItems', () => {
  it('should return an empty array when given an empty array', () => {
    const items: ExpandedItem[] = [];

    const result = expandItems(items);

    expect(result).toEqual([]);
  });

  it('should return an array with the correct length when given an array with one item', () => {
    const items: ExpandedItem[] = [
      {
        type: 'consumable',
        item: {
          id: 1,
          name: 'Test Item',
          quantity: 3,
          buyPrice: 1.99,
          sellPrice: 2.99,
        },
      },
    ];

    const result = expandItems(items);

    expect(result).toHaveLength(3);
  });

  it('should return an array with the correct length when given an array with multiple items', () => {
    const items: ExpandedItem[] = [
      {
        type: 'consumable',
        item: {
          id: 1,
          name: 'Test Item 1',
          quantity: 2,
          buyPrice: 1.99,
          sellPrice: 2.99,
        },
      },
      {
        type: 'barrel',
        item: {
          id: 2,
          name: 'Test Item 2',
          quantity: 1,
          buyPrice: 4.99,
          sellPrice: 5.99,
        },
      },
      {
        type: 'non-inventoried',
        item: {
          id: 3,
          name: 'Test Item 3',
          quantity: 4,
          buyPrice: 9.99,
          sellPrice: 10.99,
        },
      },
    ];

    const result = expandItems(items);

    expect(result).toHaveLength(7);
  });
});
