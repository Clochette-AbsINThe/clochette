import { render, screen, fireEvent } from '@testing-library/react';

import { DataTableRowActions } from '@/components/barrel-table/barrel-table-row-actions';
import { createWrapper, dropDownClick } from 'tests/utils';

const mockRow = {
  original: {
    name: 'Rouge',
    buyPrice: 65.0,
    sellPrice: 2.5,
    barrelSellPrice: null,
    isMounted: true,
    emptyOrSolded: false,
    drinkItemId: 1,
    id: 1,
    quantity: 5
  }
};

describe('DataTableRowActions', () => {
  it('should render a dropdown menu with "Modifier" and "Vendre le fût" options', () => {
    render(<DataTableRowActions row={mockRow as any} />);
    const dropdownTrigger = screen.getByRole('button', { name: 'Open menu' });
    dropDownClick(dropdownTrigger);
    const modifyOption = screen.getByRole('menuitem', { name: 'Modifier' });
    const deleteOption = screen.getByRole('menuitem', { name: 'Vendre le fût' });
    expect(modifyOption).not.toBeNull();
    expect(deleteOption).not.toBeNull();
  });

  it('should render a "BarrelModifyPopup" when "Modifier" is clicked', () => {
    render(<DataTableRowActions row={mockRow as any} />, {
      wrapper: createWrapper()
    });
    const dropdownTrigger = screen.getByRole('button', { name: 'Open menu' });
    dropDownClick(dropdownTrigger);
    const modifyOption = screen.getByRole('menuitem', { name: 'Modifier' });
    fireEvent.click(modifyOption);
    const modifyPopup = screen.getByRole('dialog', { name: 'Modifier le fût :' });
    expect(modifyPopup).not.toBeNull();
  });

  it('should render a "BarrelSalePopup" when "Vendre le fût" is clicked', () => {
    render(<DataTableRowActions row={mockRow as any} />, {
      wrapper: createWrapper()
    });
    const dropdownTrigger = screen.getByRole('button', { name: 'Open menu' });
    dropDownClick(dropdownTrigger);
    const deleteOption = screen.getByRole('menuitem', { name: 'Vendre le fût' });
    fireEvent.click(deleteOption);
    const deletePopup = screen.getByRole('dialog', { name: 'Vendre le fût :' });
    expect(deletePopup).not.toBeNull();
  });
});
