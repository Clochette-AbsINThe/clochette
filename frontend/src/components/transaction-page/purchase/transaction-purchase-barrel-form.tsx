import { FieldErrors, ResolverResult, useForm } from 'react-hook-form';

import { DialogClose } from '@radix-ui/react-dialog';

import { useTransactionPurchaseStore } from './transaction-purchase-store';

import { BuyPriceForm } from '@/components/forms/buy-price-form';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BarrelCreate, DrinkItem } from '@/openapi-codegen/clochetteSchemas';
import { patchEmptyString, formatPrice } from '@/utils/utils';

export type BarrelCreateForm = DrinkItem & BarrelCreate & { quantity: number };

export function barrelCreateResolver(data: BarrelCreateForm): ResolverResult<BarrelCreateForm> {
  const errors: FieldErrors<BarrelCreateForm> = {};

  if (!data.name || data.name === '') {
    errors.name = {
      type: 'required',
      message: 'Le nom est requis.'
    };
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.quantity = {
      type: 'min',
      message: 'La quantité doit être supérieure à 0.'
    };
  } else if (data.quantity % 1 !== 0) {
    errors.quantity = {
      type: 'validate',
      message: 'La quantité doit être un entier.'
    };
  }

  if (!data.buyPrice || data.buyPrice <= 0) {
    errors.buyPrice = {
      type: 'min',
      message: "Le prix d'achat doit être supérieur à 0."
    };
  }

  if (!data.sellPrice || data.sellPrice <= 0) {
    errors.sellPrice = {
      type: 'min',
      message: 'Le prix de vente doit être supérieur à 0.'
    };
  }

  return {
    values: patchEmptyString(data),
    errors
  };
}

export function BarrelDropdownPopupContent({ barrelCreate }: Readonly<{ barrelCreate?: Partial<BarrelCreateForm> }>) {
  const addItem = useTransactionPurchaseStore.use.addItem();
  const form = useForm<BarrelCreateForm>({
    defaultValues: {
      name: '',
      quantity: 1,
      sellPrice: 0,
      buyPrice: 0,
      ...barrelCreate
    },
    resolver: barrelCreateResolver
  });

  const onSubmit = (data: BarrelCreateForm): void => {
    addItem({
      type: 'barrel',
      item: data
    });
  };

  const disableItem = !!barrelCreate && 'id' in barrelCreate;

  const { name, quantity, sellPrice, buyPrice } = form.watch();
  const totalPrice = buyPrice * (quantity ?? 0);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter un ou plusieurs fûts</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid md:grid-cols-2 md:gap-x-6 gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      {...field}
                      disabled={disableItem}
                    />
                  </FormControl>
                  <FormDescription>Le nom de la boisson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input
                      step='1'
                      type='number'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>La quantité de fûts à ajouter.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='buyPrice'
              render={({ field }) => (
                <BuyPriceForm
                  field={field}
                  quantity={quantity}
                />
              )}
            />
            <FormField
              control={form.control}
              name='sellPrice'
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
                  <FormDescription>
                    Le prix de vente du verre, <span className='font-bold'>sans compter le prix de l&apos;EcoCup</span>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.isValid && (
              <div className='flex flex-col'>
                <div className='text-lg'>Récapitulatif :</div>
                <ul className='list-disc pl-6 mb-2'>
                  <li>
                    Achat de {quantity} {name} pour {formatPrice(totalPrice)}.
                  </li>
                  <li>Vente à {formatPrice(sellPrice)} l&apos;unité</li>
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                disabled={!form.formState.isValid}
                type='submit'
              >
                Valider
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
