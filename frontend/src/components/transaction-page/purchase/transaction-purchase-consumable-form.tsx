import { ResolverResult, FieldErrors, useForm } from 'react-hook-form';

import { DialogClose } from '@radix-ui/react-dialog';

import { useTransactionPurchaseStore } from './transaction-purchase-store';

import { BuyPriceForm } from '@/components/forms/buy-price-form';
import { IconForm } from '@/components/forms/icon-form';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ConsumableItem, ConsumableCreate } from '@/openapi-codegen/clochetteSchemas';
import { patchEmptyString, formatPrice } from '@/utils/utils';

export type ConsumableCreateForm = ConsumableItem & ConsumableCreate & { quantity: number };

export function consumableCreateResolver(data: ConsumableCreateForm): ResolverResult<ConsumableCreateForm> {
  const errors: FieldErrors<ConsumableCreateForm> = {};

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

export function ConsumableDropdownPopupContent({ consumableCreate }: Readonly<{ consumableCreate?: Partial<ConsumableCreateForm> }>) {
  const addItem = useTransactionPurchaseStore.use.addItem();
  const form = useForm<ConsumableCreateForm>({
    defaultValues: {
      name: '',
      icon: 'Misc',
      quantity: 1,
      sellPrice: 0,
      buyPrice: 0,
      ...consumableCreate
    },
    resolver: consumableCreateResolver
  });

  const onSubmit = (data: ConsumableCreateForm) => {
    addItem({
      type: 'consumable',
      item: data
    });
  };

  const disableItem = !!consumableCreate && 'id' in consumableCreate;

  const { name, quantity, sellPrice, buyPrice } = form.watch();
  const totalPrice = buyPrice * (quantity ?? 0);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter un ou plusieurs consommables</DialogTitle>
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
                  <FormDescription>Le nom du consommable.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <IconForm
                  field={field}
                  exclude={['Barrel', 'Beer']}
                  disabled={disableItem}
                  direction='row'
                />
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
                  <FormDescription>La quantité de consommables à ajouter.</FormDescription>
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
                  <FormDescription>Le prix de vente du consommable.</FormDescription>
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
