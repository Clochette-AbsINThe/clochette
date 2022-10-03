import { act, screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Transaction from '@components/Transaction';

const server = setupServer(
    rest.get('https://clochette.dev/api/v1/consommables', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'consommable 1', price: 1, value: 0 }]), ctx.status(200), ctx.delay(100));
    }),
    rest.get('https://clochette.dev/api/v1/boissons', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'boisson 1', price: 2, value: 0 }]), ctx.status(200), ctx.delay(100));
    }),
    rest.get('https://clochette.dev/api/v1/verre', (req, res, ctx) => {
        return res(ctx.json({ id: 0, name: 'verre 1', price: 1, value: 0, isGlass: true }), ctx.status(200), ctx.delay(0));
    }),
    rest.get('https://clochette.dev/api/v1/hors-stocks', (req, res, ctx) => {
        return res(ctx.json([{ id: 1, name: 'hors stock 1', price: 1, value: 0 }]), ctx.status(200), ctx.delay(100));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Change Transaction Type', async () => {
    render(<Transaction />);
    const transaction = screen.getByLabelText('window-vente');
    expect(transaction).toBeInTheDocument();
    const type = screen.getByLabelText('Achat');
    await userEvent.click(type);
    expect(screen.getByLabelText('window-achat')).toBeInTheDocument();
});

test('Verify total', async () => {
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    const total = screen.getByLabelText('total-price');
    expect(total).toHaveTextContent('0');
    const plus = screen.queryAllByLabelText('plus')[0];
    await act(async () => {
        await userEvent.click(plus);
    });
    expect(total).toHaveTextContent('Total: 3€');
});
