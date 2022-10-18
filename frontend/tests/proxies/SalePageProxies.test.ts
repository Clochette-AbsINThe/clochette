import { getConsumables, getGlasses, getOutOfStocks, postNewSellTransaction } from '@proxies/SalePageProxies';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ItemSell } from '@types';
import { rest } from 'msw';
import { date, server } from '../setupTests';

const transactionItems: ItemSell[] = [
    {
        table: 'consumable',
        quantity: 1,
        item: {
            id: 0,
            fkID: 1,
            name: 'Pizza',
            icon: 'Food',
            unitPrice: 1,
            sellPrice: 5,
            empty: false
        }
    },
    {
        table: 'glass',
        quantity: 1,
        item: {
            fkID: 11,
            name: 'boisson 1',
            sellPrice: 2,
            icon: 'Beer'
        }
    },
    {
        table: 'outofstock',
        quantity: 1,
        item: {
            id: undefined,
            fkID: 21,
            name: 'EcoCup',
            icon: 'Glass',
            sellPrice: 1
        }
    }
];

const data = {
    dateTime: date.toISOString(),
    sale: true,
    paymentMethod: 'CB',
    totalPrice: 10,
    items: [
        {
            table: 'consumable',
            quantity: 1,
            item: {
                id: 0,
                fkID: 1,
                name: 'Pizza',
                icon: 'Food',
                unitPrice: 1,
                sellPrice: 5,
                empty: true
            }
        },
        {
            table: 'glass',
            quantity: 1,
            item: {
                fkID: 11,
                name: 'boisson 1',
                sellPrice: 2,
                icon: 'Beer'
            }
        },
        {
            table: 'outofstock',
            quantity: 1,
            item: {
                fkID: 21,
                name: 'EcoCup',
                icon: 'Glass',
                sellPrice: 1
            }
        }
    ]
};


test('getGlasses', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getGlasses(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith([
        {
            table: 'glass',
            quantity: 0,
            item: {
                fKID: 1,
                name: 'boisson 1',
                sellPrice: 2,
                icon: 'Beer'
            }
        },
        {
            table: 'glass',
            quantity: 0,
            item: {
                fKID: 2,
                name: 'boisson 2',
                sellPrice: 2,
                icon: 'Beer'
            }
        },
        {
            table: 'outofstock',
            quantity: 0,
            item: {
                name: 'EcoCup',
                sellPrice: 1,
                icon: 'Glass',
                fkID: 0
            }
        }
    ]);
});

test('getGlasses error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/Glass', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getGlasses(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});

test('getOutOfStocks', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getOutOfStocks(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([
        {
            table: 'outofstock',
            quantity: 0,
            item: {
                name: 'Planchette Charcuterie',
                sellPrice: 5,
                icon: 'Food',
                fkID: 1
            }
        }
    ]);
});

test('getOutOfStocks error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/OutOfStockItem/Sell', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getOutOfStocks(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});


test('getConsumables', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getConsumables(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([
        {
            table: 'consumable',
            quantity: 0,
            item: {
                id: 0,
                fkID: 0,
                name: 'Pizza',
                sellPrice: 5,
                unitPrice: 1,
                icon: 'Food',
                empty: false
            }
        }
    ]);
});

test('getConsumables error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/Consumable', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getConsumables(setItem));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});

test('postTransaction', async () => {
    const callback = jest.fn();
    const { result } = renderHook(() => postNewSellTransaction(callback));
    act(() => {
        result.current[0](transactionItems, 'CB', 10, date);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const sendData = JSON.parse(callback.mock.calls[0][0].config.data);
    expect(sendData).toStrictEqual(data);
});

test('postTransaction error', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/Transaction/Sell', (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    const { result } = renderHook(() => postNewSellTransaction());
    act(() => {
        result.current[0](transactionItems, 'CB', 10, date);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(result.current[1].error).not.toBeNull();
});

