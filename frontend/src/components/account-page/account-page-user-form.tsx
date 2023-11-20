import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useReadAccountMe, useUpdateAccountMe } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Account, OwnAccountUpdate } from '@/openapi-codegen/clochetteSchemas';

interface UserFormProps {
  user: Account;
}

export function UserForm(props: UserFormProps): React.JSX.Element {
  const query = useQueryClient();

  const { data: user } = useReadAccountMe(
    {},
    {
      initialData: props.user
    }
  );

  const updateOwnAccount = useUpdateAccountMe({
    onSuccess: () => {
      toast.success('Votre compte a été mis à jour.');
      query.invalidateQueries({ stale: true });
    },
    onError: (error) => {
      const detail = generateApiErrorMessage(error);
      toast.error(`Une erreur est survenue lors de la mise à jour de votre compte : ${detail}`);
    }
  });

  const form = useForm<OwnAccountUpdate>({
    defaultValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName
    }
  });

  const onSubmit = (data: OwnAccountUpdate) => {
    updateOwnAccount.mutate({
      body: data
    });
  };

  return (
    <Form {...form}>
      <form
        className='grow flex justify-between flex-col gap-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  placeholder='Prénom'
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Modification du prénom</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de famille</FormLabel>
              <FormControl>
                <Input
                  placeholder='Nom de famille'
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Modification du nom de famille</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nom d'utilisateur"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>Modification du nom d&apos;utilisateur</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grow'></div>
        <Button
          type='submit'
          loading={updateOwnAccount.isLoading}
        >
          Modifier mon compte
        </Button>
      </form>
    </Form>
  );
}
