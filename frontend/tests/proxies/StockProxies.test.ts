import { getBarrels, getBarrelsDistincts, getBarrelsMounted, getConsumables, getConsumablesDistincts, putBarrel } from '@proxies/StockProxies';
import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { server } from '../setupTests';

test('getBarrels', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => getBarrels(callback));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(callback).toHaveBeenCalledWith([
        {
            id: 1,
            fkId: 1,
            name: 'boisson 1',
            sellPrice: 2,
            unitPrice: 1,
            isMounted: false,
            empty: false,
            icon: 'Barrel'
        }
    ]);
});

test('getBarrelsMounted', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => getBarrelsMounted(callback));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(callback).toHaveBeenCalledWith([
        {
            id: 1,
            fkId: 1,
            name: 'boisson 1',
            sellPrice: 2,
            unitPrice: 1,
            isMounted: true,
            empty: false,
            icon: 'Barrel'
        },
        {
            id: 2,
            fkId: 2,
            name: 'boisson 2',
            sellPrice: 2,
            unitPrice: 1,
            isMounted: true,
            empty: false,
            icon: 'Barrel'
        }
    ]);
});

test('getBarrelsDistincts', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => getBarrelsDistincts(callback));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(callback).toHaveBeenCalledWith([
        {
            id: 1,
            fkId: 1,
            name: 'boisson 1',
            sellPrice: 2,
            unitPrice: 1,
            isMounted: false,
            empty: false,
            icon: 'Barrel'
        }
    ]);
});

test('putBarrel', async () => {
    server.use(
        rest.put('https://clochette.dev/api/v1/barrel/1', (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    id: 1,
                    fkId: 1,
                    name: 'boisson 1',
                    sellPrice: 2,
                    unitPrice: 1,
                    isMounted: true,
                    empty: false
                }),
                ctx.delay(100)
            );
        })
    );
    const callback = vi.fn();
    const { result } = renderHook(() => putBarrel(callback));
    act(() => {
        result.current[0]({
            id: 1,
            fkId: 1,
            name: 'boisson 1',
            sellPrice: 2,
            unitPrice: 1,
            isMounted: false,
            empty: false,
            icon: 'Barrel'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const receiveData = callback.mock.calls[0][0].data;
    expect(receiveData).toStrictEqual({
        id: 1,
        fkId: 1,
        name: 'boisson 1',
        sellPrice: 2,
        unitPrice: 1,
        isMounted: true,
        empty: false
    });
});

test('putBarrel error', async () => {
    server.use(
        rest.put('https://clochette.dev/api/v1/barrel/1', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const callback = vi.fn();
    const { result } = renderHook(() => putBarrel(callback));
    act(() => {
        result.current[0]({
            id: 1,
            fkId: 1,
            name: 'boisson 1',
            sellPrice: 2,
            unitPrice: 1,
            isMounted: false,
            empty: false,
            icon: 'Barrel'
        });
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    const status = callback.mock.calls[0][0].status;
    expect(status).toBe(500);
});

test('getConsumables', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => getConsumables(callback));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(callback).toHaveBeenCalledWith([
        {
            id: 0,
            fkId: 0,
            name: 'Pizza',
            sellPrice: 5,
            unitPrice: 1,
            icon: 'Food',
            empty: false
        }
    ]);
});

test('getConsumablesDistinct', async () => {
    const callback = vi.fn();
    const { result } = renderHook(() => getConsumablesDistincts(callback));
    act(() => {
        result.current[0]();
    });
    await waitFor(() => expect(result.current[1].loading).toBe(false));
    expect(callback).toHaveBeenCalledWith([
        {
            id: 0,
            fkId: 0,
            name: 'Pizza',
            sellPrice: 5,
            unitPrice: 1,
            icon: 'Food',
            empty: false
        }
    ]);
});
