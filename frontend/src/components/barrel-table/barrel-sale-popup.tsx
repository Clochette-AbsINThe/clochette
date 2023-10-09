import { FieldErrors, ResolverResult, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/button';
import { PaymentMethodForm, paymentMethodResolver } from '@/components/forms/payment-method-form';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateTransactionFlow } from '@/hooks/useCreateTransactionFlow';
import { useSaleBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { BarrelDistinct, BarrelUpdateSale, TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';
import { formatPrice } from '@/utils/utils';

export function barrelSaleResolver(data: BarrelUpdateSale & TransactionCommerceCreate): ResolverResult<BarrelUpdateSale & TransactionCommerceCreate> {
  const errors: FieldErrors<BarrelUpdateSale & TransactionCommerceCreate> = {};

  if (!data.barrelSellPrice) {
    errors.barrelSellPrice = {
      type: 'required',
      message: 'Le prix de vente est requis.'
    };
  } else if (data.barrelSellPrice <= 0) {
    errors.barrelSellPrice = {
      type: 'min',
      message: 'Le prix de vente doit être supérieur à 0.'
    };
  }

  const paymentMethodResolverResult = paymentMethodResolver(data);

  if ('paymentMethod' in paymentMethodResolverResult.errors) {
    errors.paymentMethod = paymentMethodResolverResult.errors.paymentMethod;
  }

  return {
    values: data,
    errors: errors
  };
}
interface BarrelSalePopupProps {
  rowBarrel: BarrelDistinct;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function BarrelSalePopup({ rowBarrel, isOpen, setIsOpen }: BarrelSalePopupProps) {
  const queryClient = useQueryClient();

  const sellBarrel = useSaleBarrel({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la vente du fût. ${detail}`);
    }
  });

  const { transactionFlow, isLoading } = useCreateTransactionFlow();

  const form = useForm<BarrelUpdateSale & TransactionCommerceCreate>({
    resolver: barrelSaleResolver,
    defaultValues: {
      barrelSellPrice: 0,
      paymentMethod: 'CB'
    }
  });

  const onSubmit = async (submitData: BarrelUpdateSale & TransactionCommerceCreate) => {
    const itemsCallback = async (transactionId: number) => {
      await sellBarrel.mutateAsync({
        body: {
          barrelSellPrice: submitData.barrelSellPrice,
          transactionId: transactionId
        },
        pathParams: {
          barrelId: rowBarrel.id
        }
      });
    };

    const transaction: TransactionCommerceCreate = {
      datetime: new Date().toISOString(),
      paymentMethod: submitData.paymentMethod,
      trade: 'sale'
    };

    try {
      await transactionFlow(transaction, itemsCallback);
      setIsOpen(false);
      toast.success(`Fût ${rowBarrel.name} vendu avec succès !`);
      queryClient.invalidateQueries({ stale: true });
    } catch {}
  };

  const loading = sellBarrel.isLoading || isLoading;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Vendre le fût :</DialogTitle>
      </DialogHeader>
      <div className='flex flex-col gap-4 min-h-[50vh] min-w-[50vw]'>
        <div className='flex flex-col mt-2 gap-y-2'>
          <div className='flex items-center gap-x-4'>
            <h6 className='text-lg font-semi text-accent-foreground'>{rowBarrel.name}</h6>
          </div>
          <ul className='list-disc pl-6'>
            <li className='text-md text-muted-foreground'>Prix d&apos;achat: {formatPrice(rowBarrel.buyPrice)}</li>
          </ul>
        </div>
        <div className='flex flex-col mt-2 gap-y-2'>
          <div className='flex items-center gap-x-4'>
            <h6 className='text-lg font-semi text-accent-foreground'>Vendre le fût :</h6>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8 flex flex-col flex-grow'
            >
              <FormField
                control={form.control}
                name='barrelSellPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de vente (€)</FormLabel>
                    <FormControl>
                      <Input
                        step='any'
                        type='number'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Le prix de vente du fût.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='paymentMethod'
                render={({ field }) => <PaymentMethodForm field={field} />}
              />
              <div className='grow'></div>
              <DialogFooter>
                <Button
                  confirm
                  loading={loading}
                  type='submit'
                >
                  Vendre le fût
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
