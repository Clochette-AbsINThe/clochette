import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { DataTableRowActionsProps } from './account-table-row-actions';

import { Button } from '@/components/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useReadAccount, useUpdateAccount } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { AccountUpdate } from '@/openapi-codegen/clochetteSchemas';

interface AccountModifyPopupProps extends DataTableRowActionsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function AccountModifyPopup({ row, isOpen, setIsOpen }: AccountModifyPopupProps) {
  const queryClient = useQueryClient();

  const updateAccount = useUpdateAccount({
    onSuccess() {
      setIsOpen(false);
      toast.success('Compte modifié avec succès !');
      queryClient.invalidateQueries({ stale: true });
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du compte. ${detail}`);
    }
  });

  const {
    data: account,
    isLoading,
    isError
  } = useReadAccount(
    {
      pathParams: {
        accountId: row.original.id
      }
    },
    {
      initialData: row.original,
      enabled: isOpen
    }
  );

  const form = useForm<AccountUpdate>({
    defaultValues: {
      scope: account?.scope ?? row.original.scope,
      isActive: account?.isActive ?? row.original.isActive
    }
  });

  const onSubmit = (data: AccountUpdate) => {
    updateAccount.mutate({
      body: data,
      pathParams: {
        accountId: row.original.id
      }
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Modifier le compte :</DialogTitle>
      </DialogHeader>
      <div className='flex flex-col gap-4 min-h-[50vh] min-w-[50vw]'>
        {isLoading && <p className='text-md text-muted-foreground'>Chargement...</p>}
        {isError && <p className='text-md text-muted-foreground'>Erreur lors du chargement du compte.</p>}
        {account && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8 flex flex-col flex-grow'
            >
              <FormField
                control={form.control}
                name='scope'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? row.original.scope}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Séléctionner un rôle' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'staff'}>Membre</SelectItem>
                          <SelectItem value={'treasurer'}>Trésorier</SelectItem>
                          <SelectItem value={'president'}>Président</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Modification du rôle</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Compte actif</FormLabel>
                      <FormDescription>Modification du statut du compte</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? row.original.isActive}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grow'></div>
              <DialogFooter>
                <Button
                  confirm
                  type='submit'
                  loading={updateAccount.isLoading}
                >
                  Modifier le compte
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </div>
    </>
  );
}
