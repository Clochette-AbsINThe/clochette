import { useState } from 'react';

import { TresoryTransactionPopupContent } from './tresory-transaction-popup-content';

import { Button as UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Treasury } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

interface TreasuryCardCashProps {
  treasury: Treasury;
}

export function TresoryCardCash(props: Readonly<TreasuryCardCashProps>) {
  const { treasury } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<keyof typeof handlers>('deposit');

  const cashAmount = treasury.cashAmount;

  const handlers = {
    deposit: {
      onAmountChange: (amount: number) => {
        return {
          accountAmountDiff: +amount,
          cashAmountDiff: -amount
        };
      },
      amountMessage: 'Montant à déposer.'
    },
    withdraw: {
      onAmountChange: (amount: number) => {
        return {
          accountAmountDiff: -amount,
          cashAmountDiff: +amount
        };
      },
      amountMessage: 'Montant à retirer.'
    },
    modify: {
      onAmountChange: (amount: number) => {
        return {
          accountAmountDiff: 0,
          cashAmountDiff: amount - cashAmount
        };
      },
      amountMessage: 'Nouveau montant du liquide.'
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Card className='p-6 flex sm:flex-row flex-col grow sm:grow-0 gap-4'>
        <div className='flex flex-col sm:pr-4 sm:border-r pb-4 border-b sm:pb-0 sm:border-b-0'>
          <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max mb-3'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
          <h6 className='text-lg font-medium mb-4'>Total espèces</h6>
          <div className='flex justify-center'>
            <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
              <span>{formatPrice(treasury.cashAmount)}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:pl-4 pt-4 sm:pt-0'>
          <h6 className='text-lg'>Actions possibles :</h6>
          <div className='flex flex-col mt-6 gap-4'>
            <DialogTrigger asChild>
              <UIButton
                onClick={() => setSelectedAction('deposit')}
                disabled={treasury.cashAmount == 0}
              >
                Déposer du liquide
              </UIButton>
            </DialogTrigger>
            <DialogTrigger asChild>
              <UIButton onClick={() => setSelectedAction('withdraw')}>Retirer du liquide</UIButton>
            </DialogTrigger>
            <DialogTrigger asChild>
              <UIButton
                onClick={() => setSelectedAction('modify')}
                variant={'destructive'}
              >
                Modifier le montant
              </UIButton>
            </DialogTrigger>
          </div>
        </div>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le montant du liquide :</DialogTitle>
        </DialogHeader>
        <TresoryTransactionPopupContent
          onAmountChange={handlers[selectedAction].onAmountChange}
          amountMessage={handlers[selectedAction].amountMessage}
          setIsOpen={setIsOpen}
          treasury={treasury}
        />
      </DialogContent>
    </Dialog>
  );
}
