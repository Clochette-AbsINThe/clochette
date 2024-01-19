import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { DrinkItemCreateForm, DrinkItemUpdateForm, drinkResolver } from '@/components/configuration-drink/drink-item-forms';
import { DrinkItem, DrinkItemCreate, DrinkItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

describe('drinkResolver', () => {
  it('should return an error if their is no name', () => {
    const result = drinkResolver({
      name: null
    });
    expect(result.errors).toEqual({
      name: {
        type: 'required',
        message: 'Le nom est requis.'
      }
    });
  });

  it('should return an error if name is empty string', () => {
    const result = drinkResolver({
      name: ''
    });
    expect(result.errors).toEqual({
      name: {
        type: 'required',
        message: 'Le nom est requis.'
      }
    });
  });

  it('should return no error if all is good', () => {
    const result = drinkResolver({
      name: 'TestName'
    });
    expect(result.errors).toEqual({});
  });
});

describe('DrinkItemCreateForm', () => {
  const newDrinkItem: DrinkItemCreate = {
    name: 'Drink Test'
  };
  it('should submit the data', async () => {
    const createDrinkItem = vi.fn();

    spyOnApi('useCreateDrink', createDrinkItem);

    render(<DrinkItemCreateForm />, {
      wrapper: createWrapper()
    });

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Nom'), {
      target: {
        value: newDrinkItem.name
      }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter la nouvelle boisson' }));

    await waitFor(() => {
      expect(createDrinkItem).toHaveBeenCalledWith({
        body: newDrinkItem
      });
    });
  });
});

describe('DrinkItemUpdateForm', () => {
  const newDrinkItem: DrinkItemUpdate = {
    name: 'Drink Test'
  };
  const baseItem: DrinkItem = {
    id: 1,
    name: 'BaseName'
  };
  it('should submit the data', async () => {
    const updateDrinkItem = vi.fn();

    spyOnApi('useUpdateDrink', updateDrinkItem);

    const { container } = render(<DrinkItemUpdateForm drink={baseItem} />, {
      wrapper: createWrapper()
    });

    expect(screen.getByLabelText<HTMLInputElement>('Nom').value).toBe(baseItem.name);

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Nom'), {
      target: {
        value: newDrinkItem.name
      }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Modifier la boisson' }));

    await waitFor(() => {
      expect(updateDrinkItem).toHaveBeenCalledWith({
        pathParams: {
          drinkId: baseItem.id
        },
        body: {
          id: baseItem.id,
          ...newDrinkItem
        }
      });
    });
  });
});
