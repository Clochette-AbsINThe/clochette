import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { Dropdown } from '@/components/transaction-page/purchase/transaction-purchase-dropdown';
import { TransactionPurchaseRecap } from '@/components/transaction-page/purchase/transaction-purchase-recap';
import { TransactionPurchaseValidate } from '@/components/transaction-page/purchase/transaction-purchase-validate';
import { TransactionTradeSwitch } from '@/components/transaction-page/transaction-trade-switch';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { fetchReadNonInventoriedItems, fetchReadDrinks, fetchReadConsumableItems, useReadDrinks, useReadConsumableItems, useReadNonInventoriedItems } from '@/openapi-codegen/clochetteComponents';
import { ConsumableItem, DrinkItem, NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { ECOCUP_NAME } from '@/utils/constant';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  drinkItems: DrinkItem[];
  consumableItems: ConsumableItem[];
  nonInventoriedItems: NonInventoriedItem[];
}> = async (context) => {
  const result = await verifySession(context, pages.transaction.achat);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const data = await Promise.all([
    fetchReadDrinks({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    }),
    fetchReadConsumableItems({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    }),
    fetchReadNonInventoriedItems({
      queryParams: {
        trade: 'purchase'
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    })
  ]);

  return {
    props: {
      drinkItems: data[0],
      consumableItems: data[1],
      nonInventoriedItems: data[2]
    }
  };
};

const TransactionVentePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: drinkItems } = useReadDrinks({}, { initialData: props.drinkItems });
  const { data: consumableItems } = useReadConsumableItems({}, { initialData: props.consumableItems });
  const { data: nonInventoriedItems } = useReadNonInventoriedItems({ queryParams: { trade: 'purchase' } }, { initialData: props.nonInventoriedItems });

  return (
    <Base
      title='Transaction achat'
      description="La page pour gérer les transactions d'achat"
    >
      <>
        <TransactionTradeSwitch />
        <div className='md:grid-cols-3 flex-grow grid md:gap-2 gap-y-2 grid-cols-1'>
          <div className='h-full flex flex-col rounded border p-1 justify-between'>
            <div className='flex flex-col space-y-8'>
              <h1 className='text-2xl font-bold'>Fûts :</h1>
              <Dropdown
                items={drinkItems ?? []}
                type='barrel'
                name='Ajouter des fûts'
              />
              <h1 className='text-2xl font-bold'>Consommables :</h1>
              <Dropdown
                items={consumableItems ?? []}
                type='consumable'
                name='Ajouter des consommables'
              />
              <h1 className='text-2xl font-bold'>Extras :</h1>
              <Dropdown
                items={(nonInventoriedItems ?? []).filter((item) => item.name !== ECOCUP_NAME)}
                type='non-inventoried'
                name='Ajouter des hors inventaires'
              />
            </div>
          </div>
          <div className='col-span-2 border rounded p-1'>
            <TransactionPurchaseRecap />
          </div>
        </div>
        <TransactionPurchaseValidate />
      </>
    </Base>
  );
};

export default TransactionVentePage;
