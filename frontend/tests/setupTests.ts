import { removeIdFromUrl } from '@components/ConfigurationPage/ConfigurationPageBase';
import { endpoints } from '@endpoints';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import type { Barrel } from '@types';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import toast from 'react-hot-toast';

export const date = new Date();

export const server = setupServer(
    rest.get(`https://clochette.dev/api/v1${endpoints.v1.consumableUnique}`, (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: 0,
                    fkId: 0,
                    name: 'Pizza',
                    sellPrice: 5,
                    unitPrice: 1,
                    icon: 'Food',
                    empty: false
                }
            ]),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.get(`https://clochette.dev/api/v1${endpoints.v1.mountedBarrel}`, (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: 1,
                    fkId: 1,
                    name: 'boisson 1',
                    sellPrice: 2,
                    unitPrice: 1,
                    isMounted: true,
                    empty: false
                },
                {
                    id: 2,
                    fkId: 2,
                    name: 'boisson 2',
                    sellPrice: 2,
                    unitPrice: 1,
                    isMounted: true,
                    empty: false
                }
            ] as Barrel[]),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.get(`https://clochette.dev/api/v1${endpoints.v1.outOfStockItemSell}`, (req, res, ctx) => {
        return res(
            ctx.json([
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
            ]),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.post(`https://clochette.dev/api/v1${endpoints.v1.transaction}`, (req, res, ctx) => {
        return res(
            ctx.json({
                id: 0,
                dateTime: date.toISOString(),
                sale: true,
                paymentMethod: 'CB',
                totalPrice: 10,
                items: [
                    {
                        id: 0,
                        fkId: 1,
                        name: 'Pizza',
                        icon: 'Food',
                        unitPrice: 1,
                        sellPrice: 5,
                        empty: true
                    },
                    {
                        id: 10,
                        fkId: 11,
                        name: 'boisson 1',
                        sellPrice: 2
                    },
                    {
                        id: 20,
                        fkId: 21,
                        name: 'EcoCup',
                        icon: 'Glass',
                        unitPrice: 1
                    }
                ]
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.get(`https://clochette.dev/api/v1${endpoints.v1.outOfStockItemBuy}`, (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: 1,
                    name: 'EcoCup',
                    icon: 'Glass'
                }
            ]),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.post(`https://clochette.dev/api/v1${endpoints.v1.outOfStockItem}`, (req, res, ctx) => {
        return res(
            ctx.json({
                id: 10,
                name: 'NewOutOfStock',
                icon: 'Misc'
            }),
            ctx.status(200)
        );
    }),
    rest.get(`https://clochette.dev/api/v1${endpoints.v1.drink}`, (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: 1,
                    name: 'Rouge'
                }
            ]),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.get('https://clochette.dev/api/v1/drink/1', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 1,
                name: 'Rouge'
            }),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.get('https://clochette.dev/api/v1/drink/10', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 10,
                name: 'NewDrink'
            }),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.get('https://clochette.dev/api/v1/drink/404', (req, res, ctx) => {
        return res(ctx.status(404), ctx.delay(50));
    }),
    rest.post(`https://clochette.dev/api/v1${endpoints.v1.drink}`, (req, res, ctx) => {
        return res(
            ctx.json({
                id: 10,
                name: 'NewDrink'
            }),
            ctx.status(200)
        );
    }),
    rest.put('https://clochette.dev/api/v1/drink/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const { name } = await req.json();
        return await res(
            ctx.json({
                id: Number(id),
                name
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.delete('https://clochette.dev/api/v1/drink/1', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 1,
                name: 'Rouge'
            }),
            ctx.status(200),
            ctx.delay(50)
        );
    }),
    rest.get(`https://clochette.dev/api/v1${endpoints.v1.consumableItem}`, (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: 0,
                    name: 'Pizza',
                    icon: 'Food'
                }
            ]),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.get('https://clochette.dev/api/v1/consumable_item/0', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 0,
                name: 'Pizza',
                icon: 'Food'
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.get('https://clochette.dev/api/v1/consumable_item/10', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 10,
                name: 'NewConsumable',
                icon: 'Misc'
            }),
            ctx.status(200)
        );
    }),
    rest.get('https://clochette.dev/api/v1/consumable_item/404', (req, res, ctx) => {
        return res(ctx.status(404));
    }),
    rest.post(`https://clochette.dev/api/v1${endpoints.v1.consumableItem}`, (req, res, ctx) => {
        return res(
            ctx.json({
                id: 10,
                name: 'NewConsumable',
                icon: 'Misc'
            }),
            ctx.status(200)
        );
    }),
    rest.put('https://clochette.dev/api/v1/consumable_item/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const { name, icon } = await req.json();
        return await res(
            ctx.json({
                id: Number(id),
                name,
                icon
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.delete('https://clochette.dev/api/v1/consumable_item/0', async (req, res, ctx) => {
        return await res(
            ctx.json({
                id: 0,
                name: 'Pizza',
                icon: 'Food'
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.get('https://clochette.dev/api/v1/out_of_stock_item/1', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 1,
                name: 'EcoCup',
                icon: 'Glass'
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.put('https://clochette.dev/api/v1/out_of_stock_item/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const { name, icon } = await req.json();
        return await res(
            ctx.json({
                id: Number(id),
                name,
                icon
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.delete('https://clochette.dev/api/v1/out_of_stock_item/1', async (req, res, ctx) => {
        return await res(
            ctx.json({
                id: 1,
                name: 'EcoCup',
                icon: 'Glass'
            }),
            ctx.status(200),
            ctx.delay(100)
        );
    }),
    rest.get('https://clochette.dev/api/v1/out_of_stock_item/404', (req, res, ctx) => {
        return res(ctx.status(404));
    }),
    rest.get('https://clochette.dev/api/v1/out_of_stock_item/0', (req, res, ctx) => {
        return res(ctx.status(200));
    }),
    rest.get('https://clochette.dev/api/v1/out_of_stock_item/10', (req, res, ctx) => {
        return res(ctx.status(200));
    })
);

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    cleanup();
    removeIdFromUrl();
    toast.remove();
});
afterAll(() => server.close());

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
});
