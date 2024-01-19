import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import { BarrelModifyPopup, barrelUpdateResolver } from '@/components/barrel-table/barrel-modify-popup';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';
import { createDialogWrapper, spyOnApi, spyOnApiCall } from 'tests/utils';

const rowBarrel: BarrelDistinct = {
  name: 'Rouge',
  buyPrice: 65.0,
  sellPrice: 2.5,
  barrelSellPrice: null,
  isMounted: true,
  emptyOrSolded: false,
  drinkItemId: 1,
  id: 1,
  quantity: 5
};

describe('BarrelModifyPopup', () => {
  it('renders the component', async () => {
    render(
      <BarrelModifyPopup
        rowBarrel={rowBarrel}
        isOpen={true}
        setIsOpen={vi.fn()}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    expect(screen.getByText('Rouge')).not.toBeNull();
    expect(screen.getByLabelText<HTMLInputElement>('Prix de vente (€)').value).toBe('2.5');
  });

  it('submits the form with updated values', async () => {
    const updateBarrel = vi.fn();
    const barrels = [rowBarrel];
    const newSellPrice = 3.0;

    spyOnApi('useUpdateBarrel', updateBarrel);
    spyOnApiCall('useReadBarrels', barrels);

    render(
      <BarrelModifyPopup
        rowBarrel={rowBarrel}
        isOpen={true}
        setIsOpen={vi.fn()}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    fireEvent.change(screen.getByLabelText<HTMLInputElement>('Prix de vente (€)'), {
      target: {
        value: newSellPrice
      }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Modifier le fût' }));

    await waitFor(() => {
      expect(updateBarrel).toHaveBeenCalledWith(
        {
          body: {
            sellPrice: newSellPrice.toString()
          },
          pathParams: {
            barrelId: rowBarrel.id
          }
        },
        expect.anything()
      );
    });
  });
});

describe('barrelUpdateResolver', () => {
  it('should return an error if their is no sell price', () => {
    const result = barrelUpdateResolver({
      sellPrice: null
    } as any);
    expect(result.errors).toEqual({
      sellPrice: {
        type: 'required',
        message: 'Le prix de vente est requis.'
      }
    });
  });

  it('should return an error if the price is negative', () => {
    const result = barrelUpdateResolver({
      sellPrice: -1
    } as any);
    expect(result.errors).toEqual({
      sellPrice: {
        type: 'min',
        message: 'Le prix de vente doit être supérieur à 0.'
      }
    });
  });

  it('should return no error if the price is positive', () => {
    const result = barrelUpdateResolver({
      sellPrice: 1
    } as any);
    expect(result.errors).toEqual({});
  });
});
