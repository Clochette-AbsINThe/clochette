import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import { AccountModifyPopup } from '@/components/account-table/account-modify-popup';
import { Account } from '@/openapi-codegen/clochetteSchemas';
import { createDialogWrapper, spyOnApi } from 'tests/utils';

const rowAccount: Account = {
  username: 'admin',
  lastName: 'Admin',
  firstName: 'Admin',
  promotionYear: 2020,
  id: 1,
  scope: 'president',
  isActive: true
};

describe('AccountModifyPopup', () => {
  it('renders the component', async () => {
    render(
      <AccountModifyPopup
        rowAccount={rowAccount}
        isOpen={true}
        setIsOpen={vi.fn()}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    const trigger = screen.getByRole('combobox', {
      name: 'Scope'
    });

    expect(screen.getByText('Modifier le compte :')).not.toBeNull();
    expect(within(trigger).getByText('Président')).not.toBeNull();
    expect(screen.getByLabelText<HTMLInputElement>('Compte actif').value).toBe('on');
    expect(screen.getByRole('button', { name: 'Modifier le compte' })).not.toBeNull();
  });

  // Didn't test the select because it's a mess with radix aaaaah
  it('submits the form with updated values', async () => {
    const updateAccount = vi.fn();
    const newIsActive = false;
    spyOnApi('useUpdateAccount', updateAccount);

    render(
      <AccountModifyPopup
        rowAccount={rowAccount}
        isOpen={true}
        setIsOpen={vi.fn()}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    fireEvent.click(screen.getByLabelText<HTMLInputElement>('Compte actif'));

    fireEvent.click(screen.getByRole('button', { name: 'Modifier le compte' }));

    await waitFor(() => {
      expect(updateAccount).toHaveBeenCalledWith({
        body: {
          scope: 'president',
          isActive: newIsActive
        },
        pathParams: {
          accountId: rowAccount.id
        }
      });
    });
  });
});
