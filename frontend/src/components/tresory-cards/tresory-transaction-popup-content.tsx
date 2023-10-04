import { FieldErrors, ResolverResult, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';

import { TresoryTransactionRecap } from './tresory-transaction-recap';

import { Button } from '@/components/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateTreasuryTransaction } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { TransactionTreasuryCreate, Treasury } from '@/openapi-codegen/clochetteSchemas';

interface TresoryTransactionPopupContentProps {
  treasury: Treasury;
  amountMessage: string;
  onAmountChange: (amount: number) => { accountAmountDiff: number; cashAmountDiff: number };
  setIsOpen: (isOpen: boolean) => void;
}

export function createTreasuryTransactionResolver(data: TransactionTreasuryCreate, newCashAmount: number): ResolverResult<TransactionTreasuryCreate> {
  const errors: FieldErrors<TransactionTreasuryCreate> = {};

  if (!data.amount) {
    errors.amount = {
      type: 'required',
      message: 'Le montant est requis.'
    };
  } else if (newCashAmount < 0) {
    errors.amount = {
      type: 'max',
      message: "Le montant implique un montant d'espèces négatif"
    };
  }

  if (!data.description || data.description === '') {
    errors.description = {
      type: 'required',
      message: 'La description est requise.'
    };
  }

  return {
    values: data,
    errors
  };
}

export function TresoryTransactionPopupContent(props: TresoryTransactionPopupContentProps) {
  const { treasury } = props;
  const queryClient = useQueryClient();

  const form = useForm<TransactionTreasuryCreate>({
    defaultValues: {
      /* @ts-expect-error */
      amount: '',
      description: ''
    },
    mode: 'all',
    resolver: (data) => {
      const { cashAmountDiff } = props.onAmountChange(data.amount);
      const newCashAmount = treasury.cashAmount + cashAmountDiff;
      return createTreasuryTransactionResolver(data, newCashAmount);
    }
  });

  const createTreasuryTransaction = useCreateTreasuryTransaction({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création de la transaction. ${detail}`);
    }
  });

  const { accountAmountDiff, cashAmountDiff } = props.onAmountChange(form.watch('amount'));

  const onSubmit = async (submitData: TransactionTreasuryCreate) => {
    if (accountAmountDiff === 0 && cashAmountDiff === 0) {
      toast.error('Le montant de modification doit être différent de 0');
      return;
    }
    const promises = [];
    if (accountAmountDiff !== 0) {
      promises.push(
        createTreasuryTransaction.mutateAsync({
          body: {
            datetime: new Date().toISOString(),
            description: submitData.description,
            amount: accountAmountDiff,
            paymentMethod: 'CB',
            trade: accountAmountDiff > 0 ? 'sale' : 'purchase'
          }
        })
      );
    }
    if (cashAmountDiff !== 0) {
      promises.push(
        createTreasuryTransaction.mutateAsync({
          body: {
            datetime: new Date().toISOString(),
            description: submitData.description,
            amount: cashAmountDiff,
            paymentMethod: 'Espèces',
            trade: cashAmountDiff > 0 ? 'sale' : 'purchase'
          }
        })
      );
    }

    await Promise.all(promises);

    form.reset();
    toast.success('Modification de la trésorie effectuée avec succès');
    queryClient.invalidateQueries({ stale: true });
    props.setIsOpen(false);
  };

  return (
    <Form {...form}>
      <form
        className='space-y-2 flex flex-col flex-grow'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (€)</FormLabel>
              <FormControl>
                <Input
                  step='any'
                  type='number'
                  {...field}
                />
              </FormControl>
              <FormDescription>{props.amountMessage}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Description de la transaction.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grow'></div>
        <TresoryTransactionRecap
          treasury={treasury}
          accountAmountDiff={accountAmountDiff}
          cashAmountDiff={cashAmountDiff}
        />
        <DialogFooter>
          <Button
            confirm
            loading={createTreasuryTransaction.isLoading}
            type='submit'
          >
            Confirmer
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
