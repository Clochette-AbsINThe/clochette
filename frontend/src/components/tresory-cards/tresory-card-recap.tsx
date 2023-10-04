import { Card } from '@/components/ui/card';
import { useReadLastTreasury } from '@/openapi-codegen/clochetteComponents';
import { Treasury } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

interface TreasuryCardRecapProps {
  treasury: Treasury;
}

export function TresoryCardRecap(props: TreasuryCardRecapProps) {
  const { treasury } = props;
  return (
    <Card className='p-6 flex flex-col grow sm:grow-0 gap-4'>
      <h6 className='text-lg font-medium'>Total</h6>
      <div className='flex items-center'>
        <div className='bg-[#0e7c7c28] p-2 rounded-md max-w-max'>{getIcon('Virement', 'text-[#0e7c7c] w-8 h-8')}</div>
        <div className='flex flex-col ml-2'>
          <span className='text-sm text-muted-foreground'>Total de la trésorerie</span>
          <span className='font-medium text-md'>{formatPrice(treasury.totalAmount)}</span>
        </div>
      </div>
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
    </Card>
  );
}
