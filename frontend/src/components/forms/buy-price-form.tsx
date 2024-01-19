import { useEffect, useRef, useState } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BuyPriceFormProps<TFieldValues extends FieldValues> {
  /* @ts-expect-error */
  field: ControllerRenderProps<TFieldValues, 'buyPrice'>;
  quantity: number;
}

export function BuyPriceForm<TFieldValues extends FieldValues>({ field, quantity }: Readonly<BuyPriceFormProps<TFieldValues>>) {
  const [type, setType] = useState<'unit' | 'total'>('unit');
  const inputRef = useRef<HTMLInputElement>(null);

  const onValueChange = (value: string) => {
    let newValue: string = value;
    if (type === 'total' && quantity > 0) {
      newValue = (Number(value) / quantity).toString();
    }

    field.onChange(newValue);
  };

  useEffect(() => {
    onValueChange(inputRef.current?.value ?? '0');
  }, [type, quantity]);

  return (
    <FormItem className='space-y-3'>
      <FormLabel>Prix d&apos;achat (€)</FormLabel>
      <FormControl>
        <>
          <Input
            className='hidden'
            type='number'
            {...field}
          />
          <Input
            ref={inputRef}
            type='number'
            step='any'
            defaultValue={field.value}
            onChange={(event) => {
              onValueChange(event.target.value);
            }}
          />
          <FormItem className='flex items-center gap-x-2 space-y-0 ml-2'>
            <FormControl>
              <RadioGroup
                className='flex gap-y-2 gap-x-8 md:flex-row flex-col flex-wrap'
                onValueChange={(value) => {
                  setType(value as any);
                }}
                value={type}
              >
                <FormItem className='flex items-center gap-x-2 space-y-0'>
                  <FormControl>
                    <RadioGroupItem value='unit' />
                  </FormControl>
                  <FormLabel>Prix unitaire</FormLabel>
                </FormItem>
                <FormItem className='flex items-center gap-x-2 space-y-0'>
                  <FormControl>
                    <RadioGroupItem value='total' />
                  </FormControl>
                  <FormLabel>Prix total</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
          <FormDescription>Vous pouvez entrer le prix unitaire du produit ou le prix total dans le cas d&apos;un achat multiple.</FormDescription>
        </>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
