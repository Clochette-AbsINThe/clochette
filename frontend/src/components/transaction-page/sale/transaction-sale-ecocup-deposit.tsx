import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button as QueryButton } from '@/components/button';
import { PaymentMethodForm, paymentMethodResolver } from '@/components/forms/payment-method-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogDescription, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { useCreateTransactionFlow } from '@/hooks/useCreateTransactionFlow';
import { useReadNonInventoriedItems, useCreateNonInventoried } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { NonInventoriedItem, TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';
import { PlusCircledIcon } from '@/styles/utils';
import { getIcon } from '@/styles/utils';
import { ECOCUP_NAME } from '@/utils/constant';

interface EcoCupDepositPopupProps {
  ecoCup: NonInventoriedItem;
}

export function EcoCupDepositPopup({ ecoCup }: EcoCupDepositPopupProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const createNonInventoried = useCreateNonInventoried({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du produit hors inventaire. ${detail}`);
    }
  });
  const { transactionFlow, isLoading } = useCreateTransactionFlow();
  const loading = createNonInventoried.isLoading || isLoading;
  const form = useForm<TransactionCommerceCreate>({
    resolver: paymentMethodResolver,
    defaultValues: {
      paymentMethod: 'Espèces'
    }
  });

  const onSubmit = async (submitData: TransactionCommerceCreate) => {
    const itemsCallback = async (transactionId: number) => {
      await createNonInventoried.mutateAsync({
        body: {
          nonInventoriedItemId: ecoCup.id,
          transactionId: transactionId,
          buyPrice: 1
        }
      });
    };

    const transaction: TransactionCommerceCreate = {
      datetime: new Date().toISOString(),
      paymentMethod: submitData.paymentMethod,
      trade: 'purchase'
    };

    try {
      await transactionFlow(transaction, itemsCallback);
      setIsOpen(false);
      toast.success(`Rendu de caution ${ecoCup.name} effectué avec succès !`);
    } catch {}
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
        >
          <PlusCircledIcon className='w-10 h-10' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rendu de caution Ecocup</DialogTitle>
          <DialogDescription>Montant rendu 1€</DialogDescription>
        </DialogHeader>
        <div className='grow'></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-3 justify-between grow'
          >
            <FormField
              control={form.control}
              name='paymentMethod'
              render={({ field }) => <PaymentMethodForm field={field} />}
            />
            <DialogFooter>
              <QueryButton
                confirm
                loading={loading}
                type='submit'
              >
                Valider
              </QueryButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EcoCupDeposit({ ecoCupDeposit }: { ecoCupDeposit: NonInventoriedItem | null }): JSX.Element {
  const { data: ecoCupDepositArray } = useReadNonInventoriedItems(
    {
      queryParams: {
        trade: 'purchase',
        name: ECOCUP_NAME
      }
    },
    {
      initialData: ecoCupDeposit ? [ecoCupDeposit] : []
    }
  );
  const ecoCup = ecoCupDepositArray?.[0];

  if (!ecoCup) {
    return <></>;
  }

  return (
    <div className='flex flex-col'>
      <h1 className='text-2xl font-bold'>Rendu caution Ecocup :</h1>
      <div className='flex m-4 items-center h-max rounded-xl bg-semi-transparent p-3 md:max-w-[33vw] shadow-md max-w-full flex-wrap'>
        <div className='flex flex-grow-[10] items-center'>
          {getIcon(ecoCup.icon, 'w-10 h-10 ml-2')}
          <h1 className='grow lg:text-2xl mx-5 text-lg'>Caution {ecoCup.name}</h1>
          <h2 className='mr-6 text-xl'>1€</h2>
        </div>
        <div className='flex flex-grow justify-end self-center'>
          <EcoCupDepositPopup ecoCup={ecoCup} />
        </div>
      </div>
    </div>
  );
}
