import { deleteDrink, getDrinkById, getDrinks, postDrink, putDrink } from '@proxies/ConfigurationDrinkProxies';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { Drink } from '@types';
import { rest } from 'msw';
import { server } from '../setupTests';

test('getDrinks', async () => {
    const setItems = jest.fn();
    const { result } = renderHook(() => getDrinks(setItems));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItems).toHaveBeenLastCalledWith([{
        id: 1,
        name: 'Rouge'
    }]);
});

test('getDrinks error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/drink/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItems = jest.fn();
    const { result } = renderHook(() => getDrinks(setItems));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItems).toHaveBeenLastCalledWith([]);
});

test('getDrinkbyId', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getDrinkById(setItem));
    act(() => {
        result.current[0](1);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith({
        id: 1,
        name: 'Rouge'
    });
});

test('getDrinkbyId error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/drink/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getDrinkById(setItem));
    act(() => {
        result.current[0](0);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(setItem).toHaveBeenLastCalledWith({ name: '' });
});

test('postDrink', async () => {
    const callback = jest.fn();
    const { result } = renderHook(() => postDrink(callback));
    act(() => {
        result.current[0]({
            name: 'NewDrink'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual({
        id: 10,
        name: 'NewDrink'
    });
});

test('postDrink error', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/drink/', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = jest.fn();
    const { result } = renderHook(() => postDrink(callback));
    act(() => {
        result.current[0]({
            name: 'NewDrink'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('putDrink', async () => {
    const sendData = {
        id: 0,
        name: 'PutDrink'
    };
    const callback = jest.fn();
    const { result } = renderHook(() => putDrink(callback));
    act(() => {
        result.current[0](sendData as Drink);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual(sendData);
});

test('putDrink error', async () => {
    server.use(
        rest.put('https://clochette.dev/api/v1/drink/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = jest.fn();
    const { result } = renderHook(() => putDrink(callback));
    act(() => {
        result.current[0]({
            id: 0,
            name: 'PutDrink'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('deleteDrink', async () => {
    const sendData = {
        id: 1,
        name: 'Rouge'
    };
    const callback = jest.fn();
    const { result } = renderHook(() => deleteDrink(callback));
    act(() => {
        result.current[0](sendData.id);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual(sendData);
});

test('deleteDrink error', async () => {
    server.use(
        rest.delete('https://clochette.dev/api/v1/drink/0', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = jest.fn();
    const { result } = renderHook(() => deleteDrink(callback));
    act(() => {
        result.current[0](0);
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});
