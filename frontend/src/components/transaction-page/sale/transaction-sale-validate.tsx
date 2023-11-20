import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { Button as QueryButton } from '@/components/button';
import { PaymentMethodForm, paymentMethodResolver } from '@/components/forms/payment-method-form';
import { useTransactionSaleStore } from '@/components/transaction-page/sale/transaction-sale-store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { useCreateSaleTransaction } from '@/hooks/useCreateSaleTransaction';
import { TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';
import { formatPrice } from '@/utils/utils';

export function TransactionSaleValidate(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const items = useTransactionSaleStore.use.items();
  const resetAllQuantity = useTransactionSaleStore.use.resetAllQuantity();

  const { createTransaction, loading } = useCreateSaleTransaction();
  const form = useForm<TransactionCommerceCreate>({
    resolver: paymentMethodResolver,
    defaultValues: {
      paymentMethod: 'Lydia'
    }
  });

  const totalPrice = items.reduce((acc, item) => {
    return acc + item.item.sellPrice! * item.quantity;
  }, 0);

  const onSubmit = async (submitData: TransactionCommerceCreate) => {
    const transaction: TransactionCommerceCreate = {
      datetime: new Date().toISOString(),
      paymentMethod: submitData.paymentMethod,
      trade: 'sale'
    };

    try {
      await createTransaction(transaction);
      setIsOpen(false);
      resetAllQuantity();
      toast.success('Transaction effectuée avec succès');
      queryClient.invalidateQueries({ stale: true });
    } catch {}
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className='flex justify-end mt-3 flex-row items-baseline'>
        <div className='text-xl font-semi mr-8'>
          Total: <span>{formatPrice(totalPrice)}</span>
        </div>
        <DialogTrigger asChild>
          <Button>Valider</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Récapitulatif de la transaction</DialogTitle>
          <DialogDescription>Montant total de {formatPrice(totalPrice)}</DialogDescription>
        </DialogHeader>
        <ul className='list-disc pl-2 md:pl-6'>
          {items
            .filter((item) => item.quantity > 0)
            .map((item) => (
              <li
                className='text-md text-muted-foreground'
                key={item.item.id + item.item.name}
              >
                {item.quantity} {item.item.name} pour {formatPrice(item.item.sellPrice! * item.quantity)}
              </li>
            ))}
        </ul>
        <div className='grow'></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-3 justify-between grow'
          >
            <FormField
              control={form.control}
              name='paymentMethod'
              render={({ field }) => <PaymentMethodForm field={field} />}
            />
            <DialogFooter>
              <QueryButton
                confirm
                disabled={totalPrice === 0}
                loading={loading}
                type='submit'
              >
                Valider
              </QueryButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
