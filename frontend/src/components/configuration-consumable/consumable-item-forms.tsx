import { ResolverResult, UseFormReturn, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { IconForm } from '@/components/forms/icon-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateConsumableItem, useUpdateConsumableItem } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { ConsumableItem, ConsumableItemCreate, ConsumableItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { patchEmptyString } from '@/utils/utils';

export function consumableItemResolver(data: ConsumableItemUpdate | ConsumableItemCreate): ResolverResult<ConsumableItemUpdate | ConsumableItemCreate> {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!data.name || data.name === '') {
    errors.name = {
      type: 'required',
      message: 'Le nom est requis.'
    };
  }

  if (!data.icon) {
    errors.icon = {
      type: 'required',
      message: 'Le type de produit est requis.'
    };
  }

  return {
    values: patchEmptyString(data),
    errors: errors
  };
}

interface ConsumableItemFormProps {
  form: UseFormReturn<ConsumableItemUpdate> | UseFormReturn<ConsumableItemCreate>;
  onSubmit: ((data: ConsumableItemUpdate) => void) | ((data: ConsumableItemCreate) => void);
  children: React.ReactNode;
}

export function ConsumableItemForm(props: Readonly<ConsumableItemFormProps>) {
  const form = props.form as UseFormReturn<ConsumableItemCreate | ConsumableItemUpdate>;
  const onSubmit = props.onSubmit as (data: ConsumableItemCreate | ConsumableItemUpdate) => void;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col self-start space-y-2 p-2 grow w-full'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
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
            />
          )}
        />
        <div className='grow'></div>
        <div className='flex justify-end space-x-5'>{props.children}</div>
      </form>
    </Form>
  );
}

export function ConsumableItemCreateForm() {
  const router = useRouter();
  const form = useForm<ConsumableItemCreate>({
    defaultValues: {
      icon: 'Misc',
      name: ''
    },
    resolver: consumableItemResolver
  });

  const name = form.getValues('name');

  const createConsumableItem = useCreateConsumableItem({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} ajouté avec succès !`);
      router.push(pages.configuration.consommables.id(data.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de l'ajout du consommable ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: ConsumableItemCreate) => {
    createConsumableItem.mutate({
      body: data
    });
  };

  return (
    <ConsumableItemForm
      form={form}
      onSubmit={onSubmit}
    >
      <Button
        confirm
        loading={createConsumableItem.isPending}
        type='submit'
      >
        Ajouter le nouveau consommable
      </Button>
    </ConsumableItemForm>
  );
}

export function ConsumableItemUpdateForm({ consumableItem }: Readonly<{ consumableItem: ConsumableItem }>) {
  const router = useRouter();

  const form = useForm<ConsumableItemUpdate>({
    defaultValues: consumableItem,
    resolver: consumableItemResolver
  });

  const name = form.getValues('name');

  const updateConsumableItem = useUpdateConsumableItem({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} modifié avec succès !`);
      router.push(pages.configuration.consommables.id(data.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du consommable ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: ConsumableItemUpdate) => {
    updateConsumableItem.mutate({
      body: data,
      pathParams: {
        consumableItemId: consumableItem.id
      }
    });
  };

  return (
    <ConsumableItemForm
      form={form}
      onSubmit={onSubmit}
    >
      <Button
        confirm
        loading={updateConsumableItem.isPending}
        type='submit'
      >
        Modifier le consommable
      </Button>
    </ConsumableItemForm>
  );
}
