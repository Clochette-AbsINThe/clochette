import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor, act } from '@testing-library/react';
import { getBoissons } from '@proxies/getBoissons';

const server = setupServer(
    rest.get('https://clochette.dev/api/v1/boissons', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'boisson 1', price: 2, value: 0 }]), ctx.status(200), ctx.delay(100));
    }),
    rest.get('https://clochette.dev/api/v1/verre', (req, res, ctx) => {
        return res(ctx.json({ id: 0, name: 'verre 1', price: 1, value: 0, isGlass: true }), ctx.status(200), ctx.delay(100));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());

test('getBoissons', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getBoissons(setItem));
    await act(() => {
        result.current.getData();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(setItem).toBeCalledWith([{ id: 1, name: 'boisson 1', price: 2, value: 0 }, { id: 0, name: 'verre 1', price: 1, value: 0, isGlass: true }]);
});

test('getBoissons error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/boissons', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getBoissons(setItem));
    act(() => {
        result.current.getData();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});
