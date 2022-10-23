import { deleteConsumableItem, getConsumableItemById, getConsumableItems, postConsumableItem, putConsumableItem } from '@proxies/ConfigurationConsumableItemProxies';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ConsumableItem } from '@types';
import { rest } from 'msw';
import { server } from '../setupTests';

test('getConsumableItems', async () => {
    const setItems = jest.fn();
    const { result } = renderHook(() => getConsumableItems(setItems));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItems).toHaveBeenLastCalledWith([{
        id: 0,
        name: 'Pizza',
        icon: 'Food'
    }]);
});

test('getConsumableItems error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/consumable_item/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItems = jest.fn();
    const { result } = renderHook(() => getConsumableItems(setItems));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItems).toHaveBeenLastCalledWith([]);
});

test('getConsumableItembyId', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getConsumableItemById(setItem));
    act(() => {
        result.current[0](0);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith({
        id: 0,
        name: 'Pizza',
        icon: 'Food'
    });
});

test('getConsumableItembyId error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/consumable_item/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getConsumableItemById(setItem));
    act(() => {
        result.current[0](0);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith({ name: '', icon: 'Misc' });
});

test('postConsumableItem', async () => {
    const callback = jest.fn();
    const { result } = renderHook(() => postConsumableItem(callback));
    act(() => {
        result.current[0]({
            name: 'NewConsumable',
            icon: 'Misc'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual({
        id: 10,
        name: 'NewConsumable',
        icon: 'Misc'
    });
});

test('postConsumableItem error', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/consumable_item/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = jest.fn();
    const { result } = renderHook(() => postConsumableItem(callback));
    act(() => {
        result.current[0]({
            name: 'NewConsumable',
            icon: 'Misc'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('putConsumableItem', async () => {
    const sendData = {
        id: 0,
        name: 'PutConsommable',
        icon: 'Misc'
    };
    const callback = jest.fn();
    const { result } = renderHook(() => putConsumableItem(callback));
    act(() => {
        result.current[0](sendData as ConsumableItem);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual(sendData);
});

test('putConsumableItem error', async () => {
    server.use(
        rest.put('https://clochette.dev/api/v1/consumable_item/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = jest.fn();
    const { result } = renderHook(() => putConsumableItem(callback));
    act(() => {
        result.current[0]({
            id: 0,
            name: 'PutConsommable',
            icon: 'Misc'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('deleteConsumableItem', async () => {
    const sendData = {
        id: 0,
        name: 'Pizza',
        icon: 'Food'
    };
    const callback = jest.fn();
    const { result } = renderHook(() => deleteConsumableItem(callback));
    act(() => {
        result.current[0](sendData.id);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual(sendData);
});

test('deleteConsumableItem error', async () => {
    server.use(
        rest.delete('https://clochette.dev/api/v1/consumable_item/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = jest.fn();
    const { result } = renderHook(() => deleteConsumableItem(callback));
    act(() => {
        result.current[0](0);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});
