import { getConsumables, getDrinks, getEcoCup, getOutOfStocks, postNewBuyTransaction } from '@proxies/BuyPageProxies';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ItemBuy, TransactionType } from '@types';
import { rest } from 'msw';
import { date, server } from '../setupTests';

const transactionItems: ItemBuy[] = [
    {
        table: 'consumable',
        quantity: 1,
        item: {
            fkId: 1,
            name: 'Pizza',
            icon: 'Food',
            unitPrice: 1,
            sellPrice: 5,
            empty: false
        }
    },
    {
        table: 'consumable',
        quantity: 1,
        item: {
            fkId: -1,
            name: 'NewConsumable',
            icon: 'Misc',
            unitPrice: 1,
            sellPrice: 4,
            empty: false
        }
    },
    {
        table: 'barrel',
        quantity: 1,
        item: {
            fkId: 11,
            name: 'Rouge',
            unitPrice: 50,
            sellPrice: 2,
            icon: 'Barrel',
            isMounted: false,
            empty: false
        }
    },
    {
        table: 'barrel',
        quantity: 1,
        item: {
            fkId: -1,
            name: 'NewDrink',
            unitPrice: 50,
            sellPrice: 2,
            icon: 'Barrel',
            isMounted: false,
            empty: false
        }
    },
    {
        table: 'out_of_stock',
        quantity: 1,
        item: {
            fkId: 21,
            name: 'EcoCup',
            icon: 'Glass',
            unitPrice: 1,
            sellPrice: 1
        }
    },
    {
        table: 'out_of_stock',
        quantity: 1,
        item: {
            fkId: -1,
            name: 'NewOutOfStock',
            icon: 'Misc',
            unitPrice: 1,
            sellPrice: 1
        }
    }
];

const data: TransactionType<ItemBuy> = {
    datetime: date.toISOString(),
    description: '',
    type: 'transaction',
    sale: false,
    paymentMethod: 'CB',
    amount: 10,
    items: [
        {
            table: 'consumable',
            quantity: 1,
            item: {
                fkId: 1,
                name: 'Pizza',
                icon: 'Food',
                unitPrice: 1,
                sellPrice: 5,
                empty: false
            }
        },
        {
            table: 'consumable',
            quantity: 1,
            item: {
                fkId: 10,
                name: 'NewConsumable',
                icon: 'Misc',
                unitPrice: 1,
                sellPrice: 4,
                empty: false
            }
        },
        {
            table: 'barrel',
            quantity: 1,
            item: {
                fkId: 11,
                name: 'Rouge',
                unitPrice: 50,
                sellPrice: 2,
                icon: 'Barrel',
                isMounted: false,
                empty: false
            }
        },
        {
            table: 'barrel',
            quantity: 1,
            item: {
                fkId: 10,
                name: 'NewDrink',
                unitPrice: 50,
                sellPrice: 2,
                icon: 'Barrel',
                isMounted: false,
                empty: false
            }
        },
        {
            table: 'out_of_stock',
            quantity: 1,
            item: {
                fkId: 21,
                name: 'EcoCup',
                icon: 'Glass',
                unitPrice: 1,
                sellPrice: 1
            }
        },
        {
            table: 'out_of_stock',
            quantity: 1,
            item: {
                fkId: 10,
                name: 'NewOutOfStock',
                icon: 'Misc',
                unitPrice: 1,
                sellPrice: 1
            }
        }
    ]
};

test('postTransaction', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => postNewBuyTransaction(callback));
    act(() => {
        result.current[0](transactionItems, 'CB', 10, date);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const sendData = JSON.parse(callback.mock.calls[0][0].config.data);
    expect(sendData).toStrictEqual(data);
});

test('postTransaction error', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/drink/', (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    const { result } = renderHook(() => postNewBuyTransaction());
    act(() => {
        result.current[0](transactionItems, 'CB', 10, date);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(result.current[1].error).not.toBeNull();
});

test('getDrink error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/drink/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = vi.fn();
    const { result } = renderHook(() => getDrinks(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});

test('getConsumable error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/consumable_item/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = vi.fn();
    const { result } = renderHook(() => getConsumables(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});

test('getOutOfStock error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/OutOfStockItem/Buy', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = vi.fn();
    const { result } = renderHook(() => getOutOfStocks(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});

test('getEcoCup error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/OutOfStockItem/Buy', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = vi.fn();
    const { result } = renderHook(() => getEcoCup(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith();
});
