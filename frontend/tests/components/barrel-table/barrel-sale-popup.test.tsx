import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import { BarrelSalePopup, barrelSaleResolver } from '@/components/barrel-table/barrel-sale-popup';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';
import { createDialogWrapper, mockUseCreateTransactionFlowApiCalls, spyOnApi, spyOnApiCall } from 'tests/utils';

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

describe('BarrelSalePopup', () => {
  it('renders the component', async () => {
    render(
      <BarrelSalePopup
        rowBarrel={rowBarrel}
        isOpen={true}
        setIsOpen={vi.fn()}
      />,
      {
        wrapper: createDialogWrapper()
      }
    );

    expect(screen.getByText('Rouge')).not.toBeNull();
  });

  it('submits the form with updated values', async () => {
    const saleBarrel = vi.fn();
    const barrelSellPrice = 83.0;

    spyOnApi('useSaleBarrel', vi.fn(), saleBarrel);
    mockUseCreateTransactionFlowApiCalls(1);

    render(
      <BarrelSalePopup
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
        value: barrelSellPrice
      }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Vendre le fût' }));

    await waitFor(() => {
      expect(saleBarrel).toHaveBeenCalledWith({
        body: {
          barrelSellPrice: barrelSellPrice.toString(),
          transactionId: 1
        },
        pathParams: {
          barrelId: 1
        }
      });
    });
  });
});

describe('barrelSaleResolver', () => {
  it('should return an error if their is no barrelSellPrice', () => {
    const result = barrelSaleResolver({
      barrelSellPrice: null,
      paymentMethod: 'CB'
    } as any);
    expect(result.errors).toEqual({
      barrelSellPrice: {
        type: 'required',
        message: 'Le prix de vente est requis.'
      }
    });
  });

  it('should return an error if the price is negative', () => {
    const result = barrelSaleResolver({
      barrelSellPrice: -1,
      paymentMethod: 'CB'
    } as any);
    expect(result.errors).toEqual({
      barrelSellPrice: {
        type: 'min',
        message: 'Le prix de vente doit être supérieur à 0.'
      }
    });
  });

  it('should return no error if the price is positive', () => {
    const result = barrelSaleResolver({
      barrelSellPrice: 1,
      paymentMethod: 'CB'
    } as any);
    expect(result.errors).toEqual({});
  });

  it('should return an error if their is no paymentMethod', () => {
    const result = barrelSaleResolver({
      barrelSellPrice: 1,
      paymentMethod: null
    } as any);
    expect(result.errors).toEqual({
      paymentMethod: {
        type: 'required',
        message: 'Le moyen de paiement est requis.'
      }
    });
  });
});
