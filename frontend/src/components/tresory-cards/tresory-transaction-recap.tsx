import { Card } from '@/components/ui/card';
import { Treasury } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

interface TresoryTransactionRecapProps {
  treasury: Treasury;
  accountAmountDiff: number;
  cashAmountDiff: number;
}

export function TresoryTransactionRecap(props: TresoryTransactionRecapProps) {
  const { treasury, accountAmountDiff, cashAmountDiff } = props;

  return (
    <>
      <h1 className='text-xl font-medium mb-4'>Prévisualisation de l&apos;opération :</h1>
      <Card className='p-6 flex flex-row grow sm:grow-0 justify-around flex-wrap'>
        <div className='flex flex-col grow gap-4'>
          <h6 className='text-lg font-medium'>Etat actuel</h6>
          <div className='flex items-center'>
            <div className='bg-[#28C76F28] p-2 rounded-md max-w-max'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
            <div className='flex flex-col ml-2'>
              <span className='text-sm text-muted-foreground'>Compte</span>
              <span className='font-medium text-md'>{formatPrice(treasury.totalAmount - treasury.cashAmount)}</span>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
            <div className='flex flex-col ml-2'>
              <span className='text-sm text-muted-foreground'>Espèces</span>
              <span className='font-medium text-md'>{formatPrice(treasury.cashAmount)}</span>
            </div>
          </div>
        </div>
        <div className='sm:border-r mx-8'></div>
        <div className='flex flex-col grow-[2] gap-4'>
          <h6 className='text-lg font-medium'>Nouvel état</h6>
          <div className='flex sm:items-center flex-col sm:flex-row gap-2'>
            <div className='flex items-center'>
              <div className='bg-[#28C76F28] p-2 rounded-md max-w-max'>{getIcon('CB', 'text-[#28C76F] w-8 h-8')}</div>
              <div className='flex flex-col ml-2 grow'>
                <span className='text-sm text-muted-foreground'>Compte</span>
                <span className='font-medium text-md'>{formatPrice(treasury.totalAmount + accountAmountDiff - treasury.cashAmount)}</span>
              </div>
            </div>
            <div className='flex sm:justify-end sm:mx-8 grow-[2]'>
              <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
                <span>{formatPrice(accountAmountDiff, 'exceptZero')}</span>
              </div>
            </div>
          </div>
          <div className='flex sm:items-center flex-col sm:flex-row gap-2'>
            <div className='flex items-center'>
              <div className='bg-[#FF9F4328] p-2 rounded-md max-w-max'>{getIcon('Cash', 'text-[#FF9F43] w-8 h-8')}</div>
              <div className='flex flex-col ml-2 grow'>
                <span className='text-sm text-muted-foreground'>Espèces</span>
                <span className='font-medium text-md'>{formatPrice(treasury.cashAmount + cashAmountDiff)}</span>
              </div>
            </div>
            <div className='flex sm:justify-end sm:mx-8 grow-[2]'>
              <div className='bg-[#47445050] rounded-md py-1 px-2 max-w-max'>
                <span>{formatPrice(cashAmountDiff, 'exceptZero')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
