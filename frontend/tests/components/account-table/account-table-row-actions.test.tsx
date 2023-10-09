import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import { DataTableRowActions } from '@/components/account-table/account-table-row-actions';
import { createWrapper, dropDownClick } from 'tests/utils';

const mockRow = {
  original: {
    username: 'admin',
    lastName: 'Admin',
    firstName: 'Admin',
    promotionYear: 2020,
    id: 1,
    scope: 'president',
    isActive: true
  }
};

describe('DataTableRowActions', () => {
  it('should render a dropdown menu with "Modifier" and "Supprimer" options', () => {
    render(<DataTableRowActions row={mockRow as any} />);
    const dropdownTrigger = screen.getByRole('button', { name: 'Open menu' });
    dropDownClick(dropdownTrigger);
    const modifyOption = screen.getByRole('menuitem', { name: 'Modifier' });
    const deleteOption = screen.getByRole('menuitem', { name: 'Supprimer' });
    expect(modifyOption).not.toBeNull();
    expect(deleteOption).not.toBeNull();
  });

  it('should render a "AccountModifyPopup" when "Modifier" is clicked', () => {
    render(<DataTableRowActions row={mockRow as any} />, {
      wrapper: createWrapper()
    });
    const dropdownTrigger = screen.getByRole('button', { name: 'Open menu' });
    dropDownClick(dropdownTrigger);
    const modifyOption = screen.getByRole('menuitem', { name: 'Modifier' });
    fireEvent.click(modifyOption);
    const modifyPopup = screen.getByRole('dialog', { name: 'Modifier le compte :' });
    expect(modifyPopup).not.toBeNull();
  });

  it('should render a "AccountDeletePopup" when "Supprimer" is clicked', () => {
    render(<DataTableRowActions row={mockRow as any} />, {
      wrapper: createWrapper()
    });
    const dropdownTrigger = screen.getByRole('button', { name: 'Open menu' });
    dropDownClick(dropdownTrigger);
    const deleteOption = screen.getByRole('menuitem', { name: 'Supprimer' });
    fireEvent.click(deleteOption);
    const deletePopup = screen.getByRole('dialog', { name: 'Supprimer le compte :' });
    expect(deletePopup).not.toBeNull();
  });
});
