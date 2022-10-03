import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import TransactionSwitch from '@components/TransactionSwitch';

test('Render TransactionSwitch', () => {
    render(<TransactionSwitch changeTransactionType={jest.fn()} />);
    const item = screen.queryByText('Achat');
    expect(item).toBeInTheDocument();
});

test('TransactionSwitch click Achat', async () => {
    const changeTransactionType = jest.fn();
    render(<TransactionSwitch changeTransactionType={changeTransactionType} />);
    const item = screen.getByLabelText('Achat');
    await userEvent.click(item);
    expect(changeTransactionType).toHaveBeenCalledWith('Achat');
});

test('TransactionSwitch click Vente', async () => {
    const changeTransactionType = jest.fn();
    render(<TransactionSwitch changeTransactionType={changeTransactionType} />);
    const achat = screen.getByLabelText('Achat');
    await userEvent.click(achat);
    const vente = screen.getByLabelText('Vente');
    await userEvent.click(vente);
    expect(changeTransactionType).toHaveBeenLastCalledWith('Vente');
});
