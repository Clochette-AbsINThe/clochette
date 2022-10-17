import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const date = new Date();

export const server = setupServer(
    rest.get('https://clochette.dev/api/v1/Consumable', (req, res, ctx) => {
        return res(ctx.json([{
            id: 0,
            fkID: 0,
            name: 'Pizza',
            sellPrice: 5,
            unitPrice: 1,
            icon: 'Food',
            empty: false
        }]), ctx.status(200), ctx.delay(100));
    }),
    rest.get('https://clochette.dev/api/v1/Glass', (req, res, ctx) => {
        return res(ctx.json([{
            fKID: 1,
            name: 'boisson 1',
            sellPrice: 2
        },
        {
            fKID: 2,
            name: 'boisson 2',
            sellPrice: 2
        }]
        ), ctx.status(200), ctx.delay(50));
    }),
    rest.get('https://clochette.dev/api/v1/OutOfStockItem/Sell', (req, res, ctx) => {
        return res(ctx.json([{
            id: 0,
            name: 'EcoCup',
            sellPrice: 1,
            icon: 'Glass'
        },
        {
            id: 1,
            name: 'Planchette Charcuterie',
            sellPrice: 5,
            icon: 'Food'
        }]), ctx.status(200), ctx.delay(100));
    }),
    rest.post('https://clochette.dev/api/v1/Transaction/Sell', (req, res, ctx) => {
        return res(ctx.json({
            id: 0,
            dateTime: date.toISOString(),
            sale: true,
            paymentMethod: 'CB',
            totalPrice: 10,
            items: [
                {
                    id: 0,
                    fkID: 1,
                    name: 'Pizza',
                    icon: 'Food',
                    unitPrice: 1,
                    sellPrice: 5,
                    empty: true
                },
                {
                    id: 10,
                    fkID: 11,
                    name: 'boisson 1',
                    sellPrice: 2
                },
                {
                    id: 20,
                    fkID: 21,
                    name: 'EcoCup',
                    icon: 'Glass',
                    unitPrice: 1
                }
            ]
        }), ctx.status(200));
    }),
    rest.get('https://clochette.dev/api/v1/OutOfStockItem/Buy', (req, res, ctx) => {
        return res(ctx.json([
            {
                id: 1,
                name: 'EcoCup',
                icon: 'Glass'
            }]), ctx.status(200), ctx.delay(100));
    }),
    rest.post('https://clochette.dev/api/v1/Transaction/Buy', (req, res, ctx) => {
        return res(ctx.json({}), ctx.status(200), ctx.delay(100));
    }),
    rest.get('https://clochette.dev/api/v1/drink', (req, res, ctx) => {
        return res(ctx.json([
            {
                id: 1,
                name: 'Rouge'
            }]), ctx.status(200), ctx.delay(50));
    }),
    rest.get('https://clochette.dev/api/v1/ConsumableItem', (req, res, ctx) => {
        return res(ctx.json([
            {
                id: 0,
                name: 'Pizza',
                icon: 'Food'
            }]), ctx.status(200), ctx.delay(100));
    }),
    rest.post('https://clochette.dev/api/v1/OutOfStockItem/Buy', (req, res, ctx) => {
        return res(ctx.json({
            id: 10,
            name: 'NewOutOfStock',
            icon: 'Misc'
        }), ctx.status(200));
    }),
    rest.post('https://clochette.dev/api/v1/ConsumableItem', (req, res, ctx) => {
        return res(ctx.json({
            id: 10,
            name: 'NewConsumable',
            icon: 'Misc'
        }), ctx.status(200));
    }),
    rest.post('https://clochette.dev/api/v1/drink', (req, res, ctx) => {
        return res(ctx.json({
            id: 10,
            name: 'NewDrink'
        }), ctx.status(200));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
