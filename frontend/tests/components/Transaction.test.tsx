import Transaction from '@components/Transaction';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../setupTests';

test('Change Transaction Type', async () => {
    render(<Transaction />);
    await userEvent.click(screen.getByLabelText('Vente'));
    const transaction = screen.getByLabelText('window-vente');
    expect(transaction).toBeInTheDocument();
    const type = screen.getByLabelText('Achat');
    await userEvent.click(type);
    expect(screen.getByLabelText('window-achat')).toBeInTheDocument();
});

test('Verify total for SalePage', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/Consumable', (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    render(<Transaction />);
    await userEvent.click(screen.getByLabelText('Vente'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
    });
    expect(screen.getByText('failed', { exact: false })).toBeInTheDocument();
    const total = screen.getByLabelText('total-price');
    expect(total).toHaveTextContent('Total: 0€');
    const plus = screen.queryAllByLabelText('plus');
    const minus = screen.queryAllByLabelText('minus');
    await userEvent.click(screen.getByLabelText('button-popup'));
    await userEvent.click(screen.getByText('Valider le paiment'));
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
    await userEvent.click(screen.getByLabelText('button-popup'));
    await userEvent.click(screen.getByText('Valider le paiment'));
});

test('Verify search for BuyPage', async () => {
    render(<Transaction />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
    });
    await userEvent.click(screen.getByLabelText('button-popup'));
    await userEvent.click(screen.getByText('Valider le paiment'));
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
    await userEvent.click(screen.getByLabelText('button-popup'));
    await userEvent.click(screen.getByText('Valider le paiment'));
    await userEvent.click(screen.getByLabelText('button-popup'));
    await userEvent.click(screen.getByText('Valider le paiment'));
});