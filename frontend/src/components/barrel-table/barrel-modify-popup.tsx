import { ResolverResult, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { DataTableRowActionsProps } from './barrel-table-row-actions';

import { Button } from '@/components/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useReadBarrels, useUpdateBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { BarrelDistinct, BarrelUpdateModify } from '@/openapi-codegen/clochetteSchemas';
import { formatPrice } from '@/utils/utils';

export function barrelUpdateResolver(data: BarrelUpdateModify): ResolverResult<BarrelUpdateModify> {
  if (!data.sellPrice) {
    return {
      values: data,
      errors: {
        sellPrice: {
          type: 'required',
          message: 'Le prix de vente est requis.'
        }
      }
    };
  }
  if (data.sellPrice <= 0) {
    return {
      values: data,
      errors: {
        sellPrice: {
          type: 'min',
          message: 'Le prix de vente doit être supérieur à 0.'
        }
      }
    };
  }
  return {
    values: data,
    errors: {}
  };
}
interface BarrelModifyPopupProps {
  rowBarrel: BarrelDistinct;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function BarrelModifyPopup({ rowBarrel, isOpen, setIsOpen }: BarrelModifyPopupProps) {
  const queryClient = useQueryClient();

  const modifyBarrel = useUpdateBarrel({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du fût. ${detail}`);
    }
  });

  const { data } = useReadBarrels(
    {
      queryParams: {
        drink_item_id: rowBarrel.drinkItemId
      }
    },
    {
      enabled: isOpen
    }
  );

  const form = useForm<BarrelUpdateModify>({
    defaultValues: {
      sellPrice: rowBarrel.sellPrice
    },
    resolver: barrelUpdateResolver
  });

  const onSubmit = (submitData: BarrelUpdateModify) => {
    data?.forEach((barrel) => {
      modifyBarrel.mutate(
        {
          body: submitData,
          pathParams: {
            barrelId: barrel.id
          }
        },
        {
          onSuccess(data, variables, context) {
            setIsOpen(false);
            toast.success(`Fût ${data.name} modifié avec succès !`);
            queryClient.invalidateQueries({ stale: true });
          }
        }
      );
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Modifier le fût :</DialogTitle>
      </DialogHeader>
      <div className='flex flex-col gap-4 min-h-[50vh] min-w-[50vw]'>
        {rowBarrel && (
          <>
            <div className='flex flex-col mt-2 gap-y-2'>
              <div className='flex items-center gap-x-4'>
                <h6 className='text-lg font-semi text-accent-foreground'>{rowBarrel.name}</h6>
              </div>
              <ul className='list-disc pl-6'>
                <li className='text-md text-muted-foreground'>Prix de vente au verre: {formatPrice(rowBarrel.sellPrice)}</li>
                <li className='text-md text-muted-foreground'>Prix d&apos;achat: {formatPrice(rowBarrel.buyPrice)}</li>
              </ul>
            </div>
            <div className='flex flex-col mt-2 gap-y-2'>
              <div className='flex items-center gap-x-4'>
                <h6 className='text-lg font-semi text-accent-foreground'>Modifier le fût :</h6>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-8 flex flex-col flex-grow'
                >
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
                            placeholder={formatPrice(rowBarrel.sellPrice)}
                            {...field}
                            value={field.value ?? 0}
                          />
                        </FormControl>
                        <FormDescription>Le prix de vente du verre associé à ce fût.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grow'></div>
                  <DialogFooter>
                    <Button
                      confirm
                      loading={modifyBarrel.isLoading}
                      type='submit'
                    >
                      Modifier le fût
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
