import { useState } from 'react';
import { FieldErrors, ResolverResult, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/button';
import { Button as UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useOnEchap from '@/hooks/useOnEchap';
import { useUpdateTreasury } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Treasury, TreasuryUpdate } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { patchEmptyString } from '@/utils/utils';

export function treasuryUpdateResolver(data: TreasuryUpdate): ResolverResult<TreasuryUpdate> {
  const errors: FieldErrors<TreasuryUpdate> = {};

  if (!data.lydiaRate) {
    errors.lydiaRate = {
      type: 'required',
      message: 'Le taux Lydia est requis.'
    };
  } else if (data.lydiaRate < 0) {
    errors.lydiaRate = {
      type: 'min',
      message: 'Le taux Lydia doit être supérieur à 0 %.'
    };
  } else if (data.lydiaRate > 100) {
    errors.lydiaRate = {
      type: 'max',
      message: 'Le taux Lydia doit être inférieur à 100 %.'
    };
  }

  return {
    values: patchEmptyString(data),
    errors
  };
}

interface TreasuryCardLydiaRateProps {
  treasury: Treasury;
}

export function TresoryCardLydiaRate(props: Readonly<TreasuryCardLydiaRateProps>) {
  const { treasury } = props;
  const queryClient = useQueryClient();
  const [isEditingTreasuryRate, setIsEditingTreasuryRate] = useState(false);

  const updateTreasury = useUpdateTreasury({
    onSuccess() {
      setIsEditingTreasuryRate(false);
      toast.success('Modification du taux de Lydia effectuée avec succès');
      queryClient.invalidateQueries({ stale: true });
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du taux Lydia. ${detail}`);
    }
  });

  const form = useForm<TreasuryUpdate>({
    defaultValues: {
      lydiaRate: treasury.lydiaRate * 100
    },
    resolver: treasuryUpdateResolver
  });

  useOnEchap(() => {
    setIsEditingTreasuryRate(false);
  });

  const onSubmit = (data: TreasuryUpdate) => {
    updateTreasury.mutate({
      body: {
        lydiaRate: data.lydiaRate! / 100
      },
      pathParams: {
        treasuryId: treasury.id
      }
    });
  };

  return (
    <Card className='p-6 flex flex-col grow sm:grow-0 gap-4'>
      <h6 className='text-lg font-medium'>Taux Lydia</h6>
      <Form {...form}>
        <form
          className='flex flex-col grow'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex items-center mb-4'>
            <div className='bg-[#1472B128] p-2 rounded-md max-w-max'>{getIcon('Lydia', 'w-8 h-8')}</div>
            <div className='flex flex-col ml-2'>
              {isEditingTreasuryRate ? (
                <FormField
                  control={form.control}
                  name='lydiaRate'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center space-y-0'>
                      <FormControl>
                        <Input
                          className='w-12 remove-arrows'
                          type='number'
                          step='any'
                          min={0}
                          max={100}
                          {...field}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <span className='font-medium text-lg ml-2'>%</span>
                    </FormItem>
                  )}
                />
              ) : (
                <span className='font-medium text-lg'>{(treasury.lydiaRate * 100).toFixed(2)} %</span>
              )}
            </div>
          </div>
          <div className='flex items-end mb-2 grow'>
            <UIButton
              className={isEditingTreasuryRate ? 'hidden' : ''}
              type='button'
              onClick={() => setIsEditingTreasuryRate(true)}
            >
              Modifier le taux
            </UIButton>
            <Button
              loading={updateTreasury.isPending}
              type='submit'
              hidden={!isEditingTreasuryRate}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
