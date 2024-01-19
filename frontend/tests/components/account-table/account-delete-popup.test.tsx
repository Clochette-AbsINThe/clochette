import { render, screen, fireEvent } from '@testing-library/react';

import { AccountDeletePopup } from '@/components/account-table/account-delete-popup';
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

describe('AccountDeletePopup', () => {
  it('renders the delete confirmation dialog', () => {
    render(
      <AccountDeletePopup
        rowAccount={rowAccount}
        isOpen={true}
        setIsOpen={vi.fn()}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    expect(screen.getByText('Supprimer le compte :')).not.toBeNull();
    expect(screen.getByText('Etes-vous sûr de vouloir supprimer le compte ?')).not.toBeNull();
    expect(screen.getByText('Annuler')).not.toBeNull();
    expect(screen.getByText('Supprimer')).not.toBeNull();
  });

  it('cancels the delete operation when clicking the cancel button', () => {
    const setIsOpen = vi.fn();

    render(
      <AccountDeletePopup
        rowAccount={rowAccount}
        isOpen={true}
        setIsOpen={setIsOpen}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    fireEvent.click(screen.getByText('Annuler'));

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('deletes the account when clicking the delete button', async () => {
    const deleteAccount = vi.fn().mockResolvedValueOnce(undefined);
    const setIsOpen = vi.fn();

    spyOnApi('useDeleteAccount', deleteAccount);

    render(
      <AccountDeletePopup
        rowAccount={rowAccount}
        isOpen={true}
        setIsOpen={setIsOpen}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    fireEvent.click(screen.getByText('Supprimer'));

    expect(deleteAccount).toHaveBeenCalledWith({
      pathParams: {
        accountId: rowAccount.id
      }
    });
  });
});
