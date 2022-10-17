import TransactionSwitch, { TransactionEnum } from '@components/TransactionSwitch';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('TransactionSwitch click Vente', async () => {
    const changeTransactionType = jest.fn();
    render(<TransactionSwitch changeTransactionType={changeTransactionType} startTransactionType={TransactionEnum.Achat} />);
    const item = screen.queryByText('Achat');
    expect(item).toBeInTheDocument();
    const achat = screen.getByLabelText('Achat');
    await userEvent.click(achat);
    expect(changeTransactionType).toHaveBeenCalledWith('Achat');
    const vente = screen.getByLabelText('Vente');
    await userEvent.click(vente);
    expect(changeTransactionType).toHaveBeenLastCalledWith('Vente');
});
