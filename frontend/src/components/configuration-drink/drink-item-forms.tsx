import { ResolverResult, UseFormReturn, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { IconForm } from '@/components/forms/icon-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateDrink, useUpdateDrink } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { DrinkItem, DrinkItemCreate, DrinkItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { patchEmptyString } from '@/utils/utils';

export function drinkResolver(data: DrinkItemUpdate | DrinkItemCreate): ResolverResult<DrinkItemUpdate | DrinkItemCreate> {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!data.name || data.name === '') {
    errors.name = {
      type: 'required',
      message: 'Le nom est requis.'
    };
  }

  return {
    values: patchEmptyString(data),
    errors: errors
  };
}

interface DrinkItemFormProps {
  form: UseFormReturn<DrinkItemUpdate> | UseFormReturn<DrinkItemCreate>;
  onSubmit: ((data: DrinkItemUpdate) => void) | ((data: DrinkItemCreate) => void);
  children: React.ReactNode;
}

export function DrinkItemForm(props: DrinkItemFormProps) {
  const form = props.form as UseFormReturn<DrinkItemCreate | DrinkItemUpdate>;
  const onSubmit = props.onSubmit as (data: DrinkItemCreate | DrinkItemUpdate) => void;

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
              <FormDescription>Le nom de la boisson.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grow'></div>
        <div className='flex justify-end space-x-5'>{props.children}</div>
      </form>
    </Form>
  );
}

export function DrinkItemCreateForm() {
  const router = useRouter();
  const form = useForm<DrinkItemCreate>({
    resolver: drinkResolver
  });

  const name = form.getValues('name');

  const createDrink = useCreateDrink({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} ajouté avec succès !`);
      router.push(pages.configuration.boissons.id(data.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de l'ajout de la boisson ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: DrinkItemCreate) => {
    createDrink.mutate({
      body: data
    });
  };

  return (
    <DrinkItemForm
      form={form}
      onSubmit={onSubmit}
    >
      <Button
        confirm
        loading={createDrink.isLoading}
        type='submit'
      >
        Ajouter la nouvelle boisson
      </Button>
    </DrinkItemForm>
  );
}

export function DrinkItemUpdateForm(props: { drink: DrinkItem }) {
  const router = useRouter();

  const form = useForm<DrinkItemUpdate>({
    defaultValues: props.drink,
    resolver: drinkResolver
  });

  const name = form.getValues('name');

  const updateDrink = useUpdateDrink({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} modifié avec succès !`);
      router.push(pages.configuration.boissons.id(data.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification de la boisson ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: DrinkItemUpdate) => {
    updateDrink.mutate({
      body: data,
      pathParams: {
        drinkId: props.drink.id
      }
    });
  };

  return (
    <DrinkItemForm
      form={form}
      onSubmit={onSubmit}
    >
      <Button
        confirm
        loading={updateDrink.isLoading}
        type='submit'
      >
        Modifier la boisson
      </Button>
    </DrinkItemForm>
  );
}
