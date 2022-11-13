import { deleteOutOfStockItem, getOutOfStockItemById, getOutOfStockItems, postOutOfStockItem, putOutOfStockItem } from '@proxies/ConfigurationOutOfStockItemProxies';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { OutOfStockItemBuy } from '@types';
import { rest } from 'msw';
import { server } from '../setupTests';

test('getOutOfStockItems', async () => {
    const setItems = vi.fn();
    const { result } = renderHook(() => getOutOfStockItems(setItems));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItems).toHaveBeenLastCalledWith([
        {
            id: 1,
            name: 'EcoCup',
            icon: 'Glass'
        },
        {
            id: 0,
            name: 'EcoCup',
            sellPrice: 1,
            icon: 'Glass'
        },
        {
            id: 2,
            name: 'Planchette Charcuterie',
            sellPrice: 5,
            icon: 'Food'
        }
    ]);
});

test('getOutOfStockItems error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/out_of_stock_item/sell/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItems = vi.fn();
    const { result } = renderHook(() => getOutOfStockItems(setItems));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItems).toHaveBeenLastCalledWith([]);
});

test('getOutOfStockItembyId', async () => {
    const setItem = vi.fn();
    const { result } = renderHook(() => getOutOfStockItemById(setItem));
    act(() => {
        result.current[0](1);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith({
        id: 1,
        name: 'EcoCup',
        icon: 'Glass'
    });
});

test('getOutOfStockItembyId error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/out_of_stock_item/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = vi.fn();
    const { result } = renderHook(() => getOutOfStockItemById(setItem));
    act(() => {
        result.current[0](0);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith({ icon: 'Misc', name: '' });
});

test('postOutOfStockItem', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => postOutOfStockItem(callback));
    act(() => {
        result.current[0]({
            name: 'NewOutOfStock',
            icon: 'Misc'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual({
        id: 10,
        name: 'NewOutOfStock',
        icon: 'Misc'
    });
});

test('postOutOfStockItem error', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/out_of_stock_item/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = vi.fn();
    const { result } = renderHook(() => postOutOfStockItem(callback));
    act(() => {
        result.current[0]({
            name: 'NewOutOfStockItem',
            icon: 'Glass'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('putOutOfStockItem', async () => {
    const sendData = {
        id: 0,
        name: 'PutOutOfStockItem',
        icon: 'Glass'
    };
    const callback = vi.fn();
    const { result } = renderHook(() => putOutOfStockItem(callback));
    act(() => {
        result.current[0](sendData as OutOfStockItemBuy);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual(sendData);
});

test('putOutOfStockItem error', async () => {
    server.use(
        rest.put('https://clochette.dev/api/v1/out_of_stock_item/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = vi.fn();
    const { result } = renderHook(() => putOutOfStockItem(callback));
    act(() => {
        result.current[0]({
            id: 0,
            name: 'PutOutOfStockItem',
            icon: 'Glass'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('deleteOutOfStockItem', async () => {
    const sendData = {
        id: 1,
        name: 'EcoCup',
        icon: 'Glass'
    };
    const callback = vi.fn();
    const { result } = renderHook(() => deleteOutOfStockItem(callback));
    act(() => {
        result.current[0](sendData.id);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual(sendData);
});

test('deleteOutOfStockItem error', async () => {
    server.use(
        rest.delete('https://clochette.dev/api/v1/out_of_stock_item/1', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = vi.fn();
    const { result } = renderHook(() => deleteOutOfStockItem(callback));
    act(() => {
        result.current[0](1);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});
