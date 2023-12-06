import { ResolverResult, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { DataTableRowActionsProps } from './consumable-table-row-actions';

import { Button } from '@/components/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useReadConsumables, useUpdateConsumable } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { ConsumableUpdateModify } from '@/openapi-codegen/clochetteSchemas';
import { formatPrice } from '@/utils/utils';

export function consumableUpdateResolver(data: ConsumableUpdateModify): ResolverResult<ConsumableUpdateModify> {
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
interface ConsumableUpdateModifyFormProps extends DataTableRowActionsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ConsumableModifyPopup({ row, isOpen, setIsOpen }: ConsumableUpdateModifyFormProps) {
  const queryClient = useQueryClient();
  const consumable = row.original;

  const modifyConsumbale = useUpdateConsumable();

  const { data, isLoading, isError } = useReadConsumables(
    {
      queryParams: {
        consumable_item_id: row.original.consumableItemId
      }
    },
    {
      enabled: isOpen
    }
  );

  const form = useForm<ConsumableUpdateModify>({
    defaultValues: {
      sellPrice: row.original.sellPrice
    },
    resolver: consumableUpdateResolver
  });

  const onSubmit = (submitData: ConsumableUpdateModify) => {
    data?.forEach((consumable) => {
      modifyConsumbale.mutate(
        {
          body: submitData,
          pathParams: {
            consumableId: consumable.id
          }
        },
        {
          onSuccess(data, variables, context) {
            setIsOpen(false);
            toast.success(`Consommbale ${data.name} modifié avec succès !`);
            queryClient.invalidateQueries({ stale: true });
          },
          onError(error, variables, context) {
            const detail = generateApiErrorMessage(error);
            toast.error(`Erreur lors de la modification du consommable. ${detail}`);
          }
        }
      );
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Modifier le consommable :</DialogTitle>
      </DialogHeader>
      <div className='flex flex-col gap-4 min-h-[50vh] min-w-[50vw]'>
        {isLoading && <p className='text-md text-muted-foreground'>Chargement...</p>}
        {isError && <p className='text-md text-muted-foreground'>Erreur lors du chargement du consommable.</p>}
        {consumable && (
          <>
            <div className='flex flex-col mt-2 gap-y-2'>
              <div className='flex items-center gap-x-4'>
                <h6 className='text-lg font-semi text-accent-foreground'>{consumable.name}</h6>
              </div>
              <ul className='list-disc pl-6'>
                <li className='text-md text-muted-foreground'>Prix de vente: {formatPrice(consumable.sellPrice)}</li>
                <li className='text-md text-muted-foreground'>Prix d&apos;achat: {formatPrice(consumable.buyPrice)}</li>
              </ul>
            </div>
            <div className='flex flex-col mt-2 gap-y-2'>
              <div className='flex items-center gap-x-4'>
                <h6 className='text-lg font-semi text-accent-foreground'>Modifier le consommable :</h6>
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
                            placeholder={formatPrice(consumable.sellPrice)}
                            {...field}
                            value={field.value ?? 0}
                          />
                        </FormControl>
                        <FormDescription>Le prix de vente du consommable.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='grow'></div>
                  <DialogFooter>
                    <Button
                      confirm
                      loading={modifyConsumbale.isPending}
                      type='submit'
                    >
                      Modifier le consommable
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
