import Transaction, { PaymentMethodForm } from '@components/Transaction/Transaction';
import { endpoints } from '@utils/endpoints';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../setupTests';
import { Toaster } from 'react-hot-toast';

test('Change Transaction Type', async () => {
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    await act(async () => {
        await userEvent.click(screen.getByLabelText('Vente'));
    });
    const transaction = screen.getByLabelText('window-vente');
    expect(transaction).toBeInTheDocument();
    const type = screen.getByLabelText('Achat');
    await act(async () => {
        await userEvent.click(type);
    });
    expect(screen.getByLabelText('window-achat')).toBeInTheDocument();
});

test('Verify total for SellPage', async () => {
    render(<Toaster />);
    server.use(
        rest.get(`https://clochette.dev/api/v1${endpoints.v1.consumableDistinct}`, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    await userEvent.click(screen.getByLabelText('Vente'));
    expect(screen.getByText('failed', { exact: false })).toBeInTheDocument();
    const total = screen.getByLabelText('total-price');
    expect(total).toHaveTextContent('Total: 0€');
    const plus = screen.queryAllByLabelText('plus');
    const minus = screen.queryAllByLabelText('minus');
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await userEvent.keyboard('{Escape}');
    await act(async () => {
        await userEvent.click(plus[0]);
        await userEvent.click(minus[1]);
    });
    expect(total).toHaveTextContent('Total: 3€');
    await act(async () => {
        await userEvent.click(minus[2]);
        await userEvent.click(minus[0]);
    });
    expect(total).toHaveTextContent('Total: 0€');
    await act(async () => {
        await userEvent.click(plus[3]);
    });
    expect(total).toHaveTextContent('Total: 5€');
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
    });
    expect(screen.getByText('Transaction effectuée avec succès', { exact: false })).toBeInTheDocument();
});

test('Verify search for BuyPage', async () => {
    render(<Toaster />);
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
    });
    await userEvent.click(screen.getByLabelText('Achat'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
    });
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await act(async () => {
        await userEvent.keyboard('{Escape}');
    });
    const dropdowns = screen.getAllByLabelText('dropdown-button');
    expect(screen.getByText('Rouge')).not.toBeVisible();
    await act(async () => {
        await userEvent.click(dropdowns[0]);
    });
    expect(screen.getByText('Rouge')).toBeVisible();
    await act(async () => {
        await userEvent.type(screen.getAllByLabelText('search')[0], 'Rou');
    });
    expect(screen.getByText('Rouge')).toBeVisible();
    const dropdownItems = screen.getAllByLabelText('dropdown-item');
    await act(async () => {
        await userEvent.click(dropdownItems[0]);
    });
    expect(screen.getAllByText('Prix', { exact: false })).not.toBeNull();
    await act(async () => {
        await userEvent.keyboard('{Escape}');
        await userEvent.click(dropdowns[0]);
        await userEvent.type(screen.getAllByLabelText('search')[0], 'fg');
    });
    expect(screen.queryByText('Rouge')).toBeNull();
    await act(async () => {
        await userEvent.click(screen.getAllByLabelText('dropdown-missing-item')[0]);
    });
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.type(screen.getByLabelText('unitPrice'), '50');
    await userEvent.type(screen.getByLabelText('sellPrice'), '5');
    await act(async () => {
        await userEvent.click(screen.getByRole('submit'));
    });
    expect(screen.getByText('test')).toBeInTheDocument();
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await new Promise((resolve) => setTimeout(resolve, 10));
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Transaction effectuée avec succès')).toBeInTheDocument();
});

test('Verify error on post on BuyPage', async () => {
    render(<Toaster />);
    server.use(
        rest.post(`https://clochette.dev/api/v1${endpoints.v1.transaction}`, (req, res, ctx) => {
            return res(ctx.json({ detail: 'Transaction already exist' }), ctx.status(400));
        })
    );
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    await userEvent.click(screen.getByLabelText('Achat'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.queryByText('Nombre', { exact: false })).toBeNull();
    const dropdowns = screen.getAllByLabelText('dropdown-button');
    await userEvent.click(dropdowns[0]);
    await userEvent.click(screen.getAllByLabelText('dropdown-item')[0]);
    await act(async () => {
        await userEvent.type(screen.getByLabelText('unitPrice'), '2');
        await userEvent.type(screen.getByLabelText('sellPrice'), '5');
        await userEvent.keyboard('{Enter}');
    });
    expect(screen.getByText('Nombre', { exact: false })).toBeInTheDocument();
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Transaction already exist', { exact: false })).toBeInTheDocument();
});

test('Verify error on post on SalePage', async () => {
    render(<Toaster />);
    server.use(
        rest.post(`https://clochette.dev/api/v1${endpoints.v1.transaction}`, (req, res, ctx) => {
            return res(ctx.json({ detail: 'Transaction already exist' }), ctx.status(400));
        })
    );
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    await userEvent.click(screen.getByLabelText('Vente'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    await act(async () => {
        await userEvent.click(screen.queryAllByLabelText('plus')[0]);
    });
    await act(async () => {
        await userEvent.click(screen.getByLabelText('button-popup'));
    });
    await userEvent.click(screen.getByText('Valider le paiment'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Transaction already exist', { exact: false })).toBeInTheDocument();
});

test('Change paymentMethod', async () => {
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    await userEvent.click(screen.getByLabelText('button-popup'));
    await userEvent.click(screen.getByLabelText('cash'));
    expect(screen.getByLabelText('cash')).toBeChecked();
    await userEvent.click(screen.getByLabelText('lydia'));
    expect(screen.getByLabelText('lydia')).toBeChecked();
    await userEvent.click(screen.getByLabelText('cb'));
    expect(screen.getByLabelText('cb')).toBeChecked();
});

test('Render paymentMethodForm', () => {
    render(
        <PaymentMethodForm
            changePaymentMethod={vi.fn()}
            paymentMethod='CB'
        />
    );
    expect(screen.getByLabelText('cash')).toBeInTheDocument();
    expect(screen.getByLabelText('lydia')).toBeInTheDocument();
    expect(screen.getByLabelText('cb')).toBeInTheDocument();
});
