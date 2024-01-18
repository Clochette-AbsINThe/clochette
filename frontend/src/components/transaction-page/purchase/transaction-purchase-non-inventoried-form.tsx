import { FieldErrors, ResolverResult, useForm } from 'react-hook-form';

import { DialogClose } from '@radix-ui/react-dialog';

import { useTransactionPurchaseStore } from './transaction-purchase-store';

import { BuyPriceForm } from '@/components/forms/buy-price-form';
import { IconForm } from '@/components/forms/icon-form';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NonInventoriedItem, NonInventoriedCreate } from '@/openapi-codegen/clochetteSchemas';
import { patchEmptyString, formatPrice } from '@/utils/utils';

export type NonInventoriedCreateForm = NonInventoriedItem & NonInventoriedCreate & { quantity: number };

export function nonInventoriedCreateResolver(data: NonInventoriedCreateForm): ResolverResult<NonInventoriedCreateForm> {
  const errors: FieldErrors<NonInventoriedCreateForm> = {};

  if (!data.name || data.name === '') {
    errors.name = {
      type: 'required',
      message: 'Le nom est requis.'
    };
  }

  if (!data.icon) {
    errors.icon = {
      type: 'required',
      message: 'Le type est requis.'
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

  return {
    values: patchEmptyString(data),
    errors
  };
}

export function NonInventoriedDropdownPopupContent({ nonInventoriedCreate }: Readonly<{ nonInventoriedCreate?: Partial<NonInventoriedCreateForm> }>) {
  const addItem = useTransactionPurchaseStore.use.addItem();
  const form = useForm<NonInventoriedCreateForm>({
    defaultValues: {
      name: '',
      icon: 'Misc',
      quantity: 1,
      buyPrice: 0,
      ...nonInventoriedCreate
    },
    resolver: nonInventoriedCreateResolver
  });

  const onSubmit = (data: NonInventoriedCreateForm) => {
    addItem({
      type: 'non-inventoried',
      item: data
    });
  };

  const disableItem = !!nonInventoriedCreate && 'id' in nonInventoriedCreate;

  const { name, quantity, buyPrice } = form.watch();
  const totalPrice = buyPrice! * (quantity ?? 0);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter un ou plusieurs produit hors inventaire</DialogTitle>
        <DialogDescription>Ces produit ne sont pas destinés à être vendus et ne sont pas comptabilisés dans l&apos;inventaire.</DialogDescription>
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
                  <FormDescription>Le nom du produit hors inventaire.</FormDescription>
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
                  <FormDescription>La quantité de produits hors inventaire à ajouter.</FormDescription>
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
            {form.formState.isValid && (
              <div className='flex flex-col'>
                <div className='text-lg'>Récapitulatif :</div>
                <ul className='list-disc pl-6 mb-2'>
                  <li>
                    Achat de {quantity} {name} pour {formatPrice(totalPrice)}.
                  </li>
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
