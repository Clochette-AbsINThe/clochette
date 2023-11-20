import { useState } from 'react';

import { TresoryTransactionPopupContent } from './tresory-transaction-popup-content';

import { Button as UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Treasury } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

interface TreasuryCardAccountProps {
  treasury: Treasury;
}

export function TresoryCardAccount(props: TreasuryCardAccountProps) {
  const { treasury } = props;
  const [isOpen, setIsOpen] = useState(false);

  const accountAmount = treasury.totalAmount - treasury.cashAmount;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Card className='p-6 flex sm:flex-row flex-col grow sm:grow-0 gap-4'>
        <div className='flex flex-col sm:pr-4 sm:border-r pb-4 border-b sm:pb-0 sm:border-b-0'>
          <div className='bg-[#28C76F28] p-2 rounded-md max-w-max mb-3'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
          <h6 className='text-lg font-medium mb-4'>Total compte</h6>
          <div className='flex justify-center'>
            <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
              <span>{formatPrice(treasury.totalAmount - treasury.cashAmount)}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col sm:pl-4 pt-4 sm:pt-0'>
          <h6 className='text-lg'>Actions possibles :</h6>
          <div className='flex flex-col mt-6'>
            <DialogTrigger asChild>
              <UIButton variant={'destructive'}>Modifier le montant</UIButton>
            </DialogTrigger>
          </div>
        </div>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le montant du compte :</DialogTitle>
        </DialogHeader>
        <TresoryTransactionPopupContent
          onAmountChange={(amount) => {
            return {
              accountAmountDiff: amount - accountAmount,
              cashAmountDiff: 0
            };
          }}
          setIsOpen={setIsOpen}
          amountMessage={'Nouveau montant du compte.'}
          treasury={treasury}
        />
      </DialogContent>
    </Dialog>
  );
}
