import Link from 'next/link';
import { useRouter } from 'next/router';

import { TradeType } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';

export function TransactionTradeSwitch() {
  const router = useRouter();
  const trade: TradeType = router.pathname === pages.transaction.achat ? 'purchase' : 'sale';

  return (
    <div className='flex items-center justify-center mb-2'>
      <Link
        href={pages.transaction.achat}
        className={'py-1 px-12 cursor-pointer bg-semi-transparent rounded-l-full border-2' + (trade === 'purchase' ? ' border-green-600' : ' color-gray border-gray-400 opacity-75')}
      >
        Achat
      </Link>
      <Link
        href={pages.transaction.vente}
        className={'py-1 px-12 cursor-pointer bg-semi-transparent rounded-r-full border-2' + (trade === 'sale' ? ' border-green-600' : ' color-gray border-gray-400 opacity-75')}
      >
        Vente
      </Link>
    </div>
  );
}
