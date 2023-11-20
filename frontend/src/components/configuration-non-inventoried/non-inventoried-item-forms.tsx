import { ResolverResult, UseFormReturn, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { IconForm } from '@/components/forms/icon-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateNonInventoriedItem, useUpdateNonInventoriedItem } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { NonInventoriedItem, NonInventoriedItemCreate, NonInventoriedItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { patchEmptyString } from '@/utils/utils';

export function nonInventoriedItemResolver(data: NonInventoriedItemUpdate | NonInventoriedItemCreate): ResolverResult<NonInventoriedItemUpdate | NonInventoriedItemCreate> {
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

  if (data.sellPrice && data.sellPrice <= 0) {
    errors.sellPrice = {
      type: 'min',
      message: 'Le prix de vente doit être supérieur à 0.'
    };
  }

  return {
    values: patchEmptyString(data),
    errors: errors
  };
}

interface NonInventoriedItemFormProps {
  form: UseFormReturn<NonInventoriedItemUpdate> | UseFormReturn<NonInventoriedItemCreate>;
  onSubmit: ((data: NonInventoriedItemUpdate) => void) | ((data: NonInventoriedItemCreate) => void);
  children: React.ReactNode;
}

export function NonInventoriedItemForm(props: NonInventoriedItemFormProps) {
  const form = props.form as UseFormReturn<NonInventoriedItemCreate | NonInventoriedItemUpdate>;
  const onSubmit = props.onSubmit as (data: NonInventoriedItemCreate | NonInventoriedItemUpdate) => void;

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
            />
          )}
        />
        <FormField
          control={form.control}
          rules={{ required: false }}
          name='sellPrice'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix de vente (€)</FormLabel>
              <FormDescription>Laisser vide pour ne pas le rendre disponible à la vente.</FormDescription>
              <FormControl>
                <Input
                  step='any'
                  type='number'
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Le prix de vente du produit.</FormDescription>
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

export function NonInventoriedItemUpdateForm({ nonInventoriedItem }: { nonInventoriedItem: NonInventoriedItem }) {
  const router = useRouter();

  const form = useForm<NonInventoriedItemUpdate>({
    defaultValues: nonInventoriedItem,
    resolver: nonInventoriedItemResolver
  });

  const name = form.getValues('name');

  const updateNonInventoriedItem = useUpdateNonInventoriedItem({
    onSuccess(data, variables, context) {
      toast.success(`${data.name} modifié avec succès !`);
      router.push(pages.configuration.horsInventaires.id(data.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du produit hors inventaire ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: NonInventoriedItemUpdate) => {
    updateNonInventoriedItem.mutate({
      body: data,
      pathParams: {
        nonInventoriedItemId: nonInventoriedItem.id
      }
    });
  };

  return (
    <NonInventoriedItemForm
      form={form}
      onSubmit={onSubmit}
    >
      <Button
        confirm
        loading={updateNonInventoriedItem.isPending}
        type='submit'
      >
        Modifier le produit hors inventaire
      </Button>
    </NonInventoriedItemForm>
  );
}

export function NonInventoriedItemCreateForm() {
  const router = useRouter();
  const form = useForm<NonInventoriedItemCreate>({
    resolver: nonInventoriedItemResolver
  });

  const name = form.getValues('name');

  const createNonInventoriedItem = useCreateNonInventoriedItem({
    onSuccess(data, variables, context) {
      const item = data;
      toast.success(`${item.name} ajouté avec succès !`);
      router.push(pages.configuration.horsInventaires.id(item.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de l'ajout du produit hors inventaire ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: NonInventoriedItemCreate) => {
    createNonInventoriedItem.mutate({
      body: data
    });
  };

  return (
    <NonInventoriedItemForm
      form={form}
      onSubmit={onSubmit}
    >
      <Button
        confirm
        loading={createNonInventoriedItem.isPending}
        type='submit'
      >
        Ajouter le nouveau produit hors inventaire
      </Button>
    </NonInventoriedItemForm>
  );
}
