import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { NonInventoriedItemCreateForm, NonInventoriedItemUpdateForm, nonInventoriedItemResolver } from '@/components/configuration-non-inventoried/non-inventoried-item-forms';
import { NonInventoriedItem, NonInventoriedItemCreate, NonInventoriedItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

describe('nonInventoriedItemResolver', () => {
  it('should return an error if their is no name and icon', () => {
    const result = nonInventoriedItemResolver({
      name: null,
      icon: null
    });
    expect(result.errors).toEqual({
      name: {
        type: 'required',
        message: 'Le nom est requis.'
      },
      icon: {
        type: 'required',
        message: 'Le type de produit est requis.'
      }
    });
  });

  it('should return an error if name is empty string', () => {
    const result = nonInventoriedItemResolver({
      name: '',
      icon: 'Misc'
    });
    expect(result.errors).toEqual({
      name: {
        type: 'required',
        message: 'Le nom est requis.'
      }
    });
  });

  it('should return no error if all is good', () => {
    const result = nonInventoriedItemResolver({
      name: 'TestName',
      icon: 'Misc'
    });
    expect(result.errors).toEqual({});
  });
});

describe('NonInventoriedItemCreateForm', () => {
  const newNonInventoriedItem = {
    icon: 'Soft',
    name: 'NonInventoried Test',
    sellPrice: 5
  } satisfies NonInventoriedItemCreate;
  it('should submit the data', async () => {
    const createNonInventoriedItem = vi.fn();

    spyOnApi('useCreateNonInventoriedItem', createNonInventoriedItem);

    const { container } = render(<NonInventoriedItemCreateForm />, {
      wrapper: createWrapper()
    });

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Nom'), {
      target: {
        value: newNonInventoriedItem.name
      }
    });
    const radioElement = container.querySelector(`button[value="${newNonInventoriedItem.icon}"][role="radio"]`);
    expect(radioElement).not.toBeNull();
    fireEvent.click(radioElement!);

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Prix de vente (€)'), {
      target: {
        value: newNonInventoriedItem.sellPrice
      }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter le nouveau produit hors inventaire' }));

    await waitFor(() => {
      expect(createNonInventoriedItem).toHaveBeenCalledWith({
        body: {
          ...newNonInventoriedItem,
          sellPrice: newNonInventoriedItem.sellPrice.toString()
        }
      });
    });
  });
});

describe('NonInventoriedItemUpdateForm', () => {
  const newNonInventoriedItem: NonInventoriedItemUpdate = {
    icon: 'Soft',
    name: 'NonInventoried Test',
    sellPrice: null
  };
  const baseItem: NonInventoriedItem = {
    id: 1,
    icon: 'Misc',
    name: 'BaseName',
    trade: 'purchase',
    sellPrice: 5
  };
  it('should submit the data', async () => {
    const updateNonInventoriedItem = vi.fn();

    spyOnApi('useUpdateNonInventoriedItem', updateNonInventoriedItem);

    const { container } = render(<NonInventoriedItemUpdateForm nonInventoriedItem={baseItem} />, {
      wrapper: createWrapper()
    });

    expect(screen.getByLabelText<HTMLInputElement>('Nom').value).toBe(baseItem.name);
    const selectedRadioElement = container.querySelector<HTMLButtonElement>(`button[data-state="checked"][role="radio"]`);
    expect(selectedRadioElement).not.toBeNull();
    expect(selectedRadioElement!.value).toBe(baseItem.icon);

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Nom'), {
      target: {
        value: newNonInventoriedItem.name
      }
    });
    const radioElement = container.querySelector(`button[value="${newNonInventoriedItem.icon}"][role="radio"]`);
    expect(radioElement).not.toBeNull();
    fireEvent.click(radioElement!);

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Prix de vente (€)'), {
      target: {
        value: ''
      }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Modifier le produit hors inventaire' }));

    await waitFor(() => {
      expect(updateNonInventoriedItem).toHaveBeenCalledWith({
        pathParams: {
          nonInventoriedItemId: baseItem.id
        },
        body: {
          id: baseItem.id,
          trade: baseItem.trade,
          ...newNonInventoriedItem
        }
      });
    });
  });
});
