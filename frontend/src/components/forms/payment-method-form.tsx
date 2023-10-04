import { ControllerRenderProps, FieldErrors, FieldValues, ResolverResult } from 'react-hook-form';

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentMethod, TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';

interface PaymentMethodFormProps<TFieldValues extends FieldValues> {
  /* @ts-expect-error */
  field: ControllerRenderProps<TFieldValues, 'paymentMethod'>;
}

export function paymentMethodResolver(data: TransactionCommerceCreate): ResolverResult<TransactionCommerceCreate> {
  const errors: FieldErrors<TransactionCommerceCreate> = {};

  if (!data.paymentMethod) {
    errors.paymentMethod = {
      type: 'required',
      message: 'Le moyen de paiement est requis.'
    };
  }

  return {
    values: data,
    errors: errors
  };
}

export function PaymentMethodForm<TFieldValues extends FieldValues>({ field }: PaymentMethodFormProps<TFieldValues>) {
  const paymentOptions: PaymentMethod[] = ['CB', 'Espèces', 'Lydia', 'Virement'];

  return (
    <FormItem className='space-y-3'>
      <FormLabel>Moyen de paiement</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={field.onChange}
          defaultValue={field.value}
          className='flex gap-y-2 gap-x-8 md:flex-row flex-col flex-wrap'
        >
          {paymentOptions.map((paymentOption) => (
            <FormItem
              className='flex items-center gap-x-2 space-y-0'
              key={paymentOption}
            >
              <FormControl>
                <RadioGroupItem value={paymentOption} />
              </FormControl>
              <FormLabel className='font-normal flex items-center gap-2'>
                {getIcon(paymentOption, 'w-8 h-8')} {paymentOption}
              </FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
