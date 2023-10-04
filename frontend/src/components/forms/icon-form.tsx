import { useEffect } from 'react';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconName } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';

interface IconFormProps<TFieldValues extends FieldValues> {
  /* @ts-expect-error */
  field: ControllerRenderProps<TFieldValues, 'icon'>;
  exclude?: IconName[];
  direction?: 'row' | 'column';
  disabled?: boolean;
}

export function IconForm<TFieldValues extends FieldValues>({ field, exclude, direction = 'column', disabled = false }: IconFormProps<TFieldValues>) {
  let iconOptions: IconName[] = ['Soft', 'Beer', 'Barrel', 'Food', 'Misc', 'Glass'];

  if (exclude) {
    iconOptions = iconOptions.filter((icon) => !exclude.includes(icon));
  }

  useEffect(() => {
    if (field.value && !iconOptions.includes(field.value)) {
      field.onChange('Misc');
    }
  }, [iconOptions]);

  return (
    <FormItem className='space-y-3'>
      <FormLabel>Type</FormLabel>
      <FormControl>
        <RadioGroup
          disabled={disabled}
          onValueChange={field.onChange}
          defaultValue={field.value}
          className={`flex gap-1 ${direction === 'row' ? 'flex-row gap-x-6' : 'flex-col gap-y-3'}`}
        >
          {iconOptions.map((icon) => (
            <FormItem
              className='flex items-center gap-x-2 space-y-0'
              key={icon}
            >
              <FormControl>
                <RadioGroupItem value={icon} />
              </FormControl>
              <FormLabel className='font-normal'>{getIcon(icon, 'w-8 h-8')}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
