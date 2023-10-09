import { act, renderHook } from '@testing-library/react';

import { useCreateTransactionFlow } from '@/hooks/useCreateTransactionFlow';
import * as componentModule from '@/openapi-codegen/clochetteComponents';
import { TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';

describe('useCreateTransactionFlow', () => {
  const isLoading: false = false;
  const transaction: TransactionCommerceCreate = {
    datetime: '2023-09-04T12:30:47.062000Z',
    paymentMethod: 'CB',
    trade: 'purchase'
  };
  const itemsCallback = vi.fn().mockResolvedValue({});

  it('should call all mutations in the correct order', async () => {
    const mutateAsyncUseCreateTransactionMock = vi.fn().mockResolvedValue({ id: 1 });
    const mutateAsyncUseValidateTransactionMock = vi.fn().mockResolvedValue({});
    const mutateAsyncUseDeleteTransactionMock = vi.fn().mockResolvedValue({});

    vi.spyOn(componentModule, 'useCreateTransaction').mockImplementation(() => ({ mutateAsync: mutateAsyncUseCreateTransactionMock, isLoading } as any));
    vi.spyOn(componentModule, 'useValidateTransaction').mockImplementation(() => ({ mutateAsync: mutateAsyncUseValidateTransactionMock, isLoading } as any));
    vi.spyOn(componentModule, 'useDeleteTransaction').mockImplementation(() => ({ mutateAsync: mutateAsyncUseDeleteTransactionMock, isLoading } as any));

    const { result } = renderHook(() =>
      useCreateTransactionFlow()
    );

    act(() => {
      result.current.transactionFlow(transaction, itemsCallback);
    });

    await vi.waitFor(() => expect(mutateAsyncUseCreateTransactionMock).toHaveBeenCalledWith({ body: transaction }));
    await vi.waitFor(() => expect(itemsCallback).toHaveBeenCalledWith(1));
    await vi.waitFor(() => expect(mutateAsyncUseValidateTransactionMock).toHaveBeenCalledWith({ pathParams: { transactionId: 1 } }));
    await vi.waitFor(() => expect(mutateAsyncUseDeleteTransactionMock).not.toHaveBeenCalled());
  });

  it('should call deleteTransaction if validateTransaction fails', async () => {
    const mutateAsyncUseCreateTransactionMock = vi.fn().mockResolvedValue({ id: 1 });
    const mutateAsyncUseValidateTransactionMock = vi.fn().mockRejectedValue({});
    const mutateAsyncUseDeleteTransactionMock = vi.fn().mockResolvedValue({});

    vi.spyOn(componentModule, 'useCreateTransaction').mockImplementation(() => ({ mutateAsync: mutateAsyncUseCreateTransactionMock, isLoading } as any));
    vi.spyOn(componentModule, 'useValidateTransaction').mockImplementation(() => ({ mutateAsync: mutateAsyncUseValidateTransactionMock, isLoading } as any));
    vi.spyOn(componentModule, 'useDeleteTransaction').mockImplementation(() => ({ mutateAsync: mutateAsyncUseDeleteTransactionMock, isLoading } as any));

    const { result } = renderHook(() =>
      useCreateTransactionFlow()
    );

    await act(async () => {
      try {
        await result.current.transactionFlow(transaction, itemsCallback);
      } catch (error: any) {
        expect(error instanceof Error).toBe(true);
        expect(error.message).toBe('Transaction failed');
      }
    });

    await expect(result.current.transactionFlow(transaction, itemsCallback)).rejects.toThrow('Transaction failed');

    await vi.waitFor(() => expect(mutateAsyncUseCreateTransactionMock).toHaveBeenCalledWith({ body: transaction }));
    await vi.waitFor(() => expect(itemsCallback).toHaveBeenCalledWith(1));
    await vi.waitFor(() => expect(mutateAsyncUseValidateTransactionMock).toHaveBeenCalledWith({ pathParams: { transactionId: 1 } }));
    await vi.waitFor(() => expect(mutateAsyncUseDeleteTransactionMock).toHaveBeenCalledWith({ pathParams: { transactionId: 1 } }));
  });
});