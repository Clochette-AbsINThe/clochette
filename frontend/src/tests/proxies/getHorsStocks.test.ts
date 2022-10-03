import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor, act } from '@testing-library/react';
import { getHorsStocks } from '@proxies/getHorsStocks';

const server = setupServer(
    rest.get('https://clochette.dev/api/v1/hors-stocks', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'hors stock 1', price: 1, value: 0 }]), ctx.status(200), ctx.delay(100));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());

test('getHorsStocks', async () => {
    const setItem = jest.fn();
    const { result } = renderHook(() => getHorsStocks(setItem));
    await act(() => {
        result.current.getData();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(setItem).toBeCalledWith([{ id: 1, name: 'hors stock 1', price: 1, value: 0 }]);
});

test('getHorsStocks error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/hors-stocks', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        }),
        rest.get('https://clochette.dev/api/v1/verre', (req, res, ctx) => {
            return res(ctx.status(500), ctx.delay(100));
        })
    );
    const setItem = jest.fn();
    const { result } = renderHook(() => getHorsStocks(setItem));
    act(() => {
        result.current.getData();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(setItem).toBeCalledWith([]);
});
