import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ConsumableItemCreateForm, ConsumableItemUpdateForm, consumableItemResolver } from '@/components/configuration-consumable/consumable-item-forms';
import { ConsumableItem, ConsumableItemCreate, ConsumableItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

describe('consumableItemResolver', () => {
  it('should return an error if their is no name and icon', () => {
    const result = consumableItemResolver({
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
    const result = consumableItemResolver({
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
    const result = consumableItemResolver({
      name: 'TestName',
      icon: 'Misc'
    });
    expect(result.errors).toEqual({});
  });
});

describe('ConsumableItemCreateForm', () => {
  const newConsumableItem: ConsumableItemCreate = {
    icon: 'Soft',
    name: 'Consumable Test'
  };
  it('should submit the data', async () => {
    const createConsumableItem = vi.fn();

    spyOnApi('useCreateConsumableItem', createConsumableItem);

    const { container } = render(<ConsumableItemCreateForm />, {
      wrapper: createWrapper()
    });

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Nom'), {
      target: {
        value: newConsumableItem.name
      }
    });
    const radioElement = container.querySelector(`button[value="${newConsumableItem.icon}"][role="radio"]`);
    expect(radioElement).not.toBeNull();
    fireEvent.click(radioElement!);

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter le nouveau consommable' }));

    await waitFor(() => {
      expect(createConsumableItem).toHaveBeenCalledWith({
        body: newConsumableItem
      });
    });
  });
});

describe('ConsumableItemUpdateForm', () => {
  const newConsumableItem: ConsumableItemUpdate = {
    icon: 'Soft',
    name: 'Consumable Test'
  };
  const baseItem: ConsumableItem = {
    id: 1,
    icon: 'Misc',
    name: 'BaseName'
  };
  it('should submit the data', async () => {
    const updateConsumableItem = vi.fn();

    spyOnApi('useUpdateConsumableItem', updateConsumableItem);

    const { container } = render(<ConsumableItemUpdateForm consumableItem={baseItem} />, {
      wrapper: createWrapper()
    });

    expect(screen.getByLabelText<HTMLInputElement>('Nom').value).toBe(baseItem.name);
    const selectedRadioElement = container.querySelector<HTMLButtonElement>(`button[data-state="checked"][role="radio"]`);
    expect(selectedRadioElement).not.toBeNull();
    expect(selectedRadioElement!.value).toBe(baseItem.icon);

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Nom'), {
      target: {
        value: newConsumableItem.name
      }
    });
    const radioElement = container.querySelector(`button[value="${newConsumableItem.icon}"][role="radio"]`);
    expect(radioElement).not.toBeNull();
    fireEvent.click(radioElement!);

    fireEvent.click(screen.getByRole('button', { name: 'Modifier le consommable' }));

    await waitFor(() => {
      expect(updateConsumableItem).toHaveBeenCalledWith({
        pathParams: {
          consumableItemId: baseItem.id
        },
        body: {
          id: baseItem.id,
          ...newConsumableItem
        }
      });
    });
  });
});
