import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { TransactionSaleLayout } from '@/components/transaction-page/sale/transaction-sale-layout';
import { TransactionSaleValidate } from '@/components/transaction-page/sale/transaction-sale-validate';
import { TransactionTradeSwitch } from '@/components/transaction-page/transaction-trade-switch';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { fetchReadDistinctConsumables, fetchReadBarrels, fetchReadNonInventoriedItems } from '@/openapi-codegen/clochetteComponents';
import { Barrel, ConsumableDistinct, NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { ECOCUP_NAME } from '@/utils/constant';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  barrels: Barrel[];
  nonInventoriedItems: NonInventoriedItem[];
  consumables: ConsumableDistinct[];
  ecoCupDeposit: NonInventoriedItem | null;
}> = async (context) => {
  const result = await verifySession(context, pages.transaction.vente);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const data = await Promise.all([
    fetchReadBarrels({
      queryParams: {
        is_mounted: true
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    }),
    fetchReadNonInventoriedItems({
      queryParams: {
        trade: 'sale'
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    }),
    fetchReadDistinctConsumables({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    }),
    fetchReadNonInventoriedItems({
      queryParams: {
        trade: 'purchase',
        name: ECOCUP_NAME
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    }).catch((error) => {
      logger.error(error);
      return [];
    })
  ]);

  let ecoCupDeposit: NonInventoriedItem | null = null;
  if (data[3].length > 0) {
    ecoCupDeposit = data[3][0];
  }

  return {
    props: {
      barrels: data[0],
      nonInventoriedItems: data[1],
      consumables: data[2],
      ecoCupDeposit
    }
  };
};

const TransactionVentePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base
      title='Transaction vente'
      description='La page pour gérer les transactions de vente'
    >
      <>
        <TransactionTradeSwitch />
        <TransactionSaleLayout {...props} />
        <TransactionSaleValidate />
      </>
    </Base>
  );
};

export default TransactionVentePage;
