import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import Tabs from '@/components/account-page/account-page-tabs';
import { barrelColumns } from '@/components/barrel-table/barrel-admin-columns';
import { DateSaleChart } from '@/components/chart/date-sale-chart';
import { HourSaleChart } from '@/components/chart/hour-sale-chart';
import { DataTable } from '@/components/table/data-table';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { fetchReadBarrels, useReadBarrels } from '@/openapi-codegen/clochetteComponents';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifyScopes, verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  barrels: Barrel[];
}> = async (context) => {
  const result = await verifySession(context, pages.account.dashboard);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const resultScopes = verifyScopes(pages.account.dashboard, result.session);
  if (resultScopes.status === 'unauthorized') {
    return resultScopes.redirection;
  }

  let barrels: Barrel[];
  try {
    barrels = await fetchReadBarrels({
      queryParams: {
        all: true
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    });
  } catch (error) {
    logger.error(error);
    barrels = [];
  }

  return {
    props: {
      barrels
    }
  };
};

const DashboardPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: barrels } = useReadBarrels({
    queryParams: {
      all: true
    }
  });

  const filteredBarrels = barrels?.filter((barrel) => (barrel.isMounted === true || barrel.emptyOrSolded === true) && barrel.barrelSellPrice === null);

  return (
    <Base title='Tableau de bord'>
      <div className='flex md:flex-row flex-col flex-grow'>
        <Tabs />
        <div className='flex flex-col flex-grow gap-4'>
          <h1 className='text-xl mb-2'>Quantité de verres vendus par fûts :</h1>
          <DataTable
            columns={barrelColumns}
            data={filteredBarrels ?? []}
          />
          <div className='flex flex-wrap gap-4 justify-between mt-4'>
            <div className='max-w-full'>
              <h1 className='text-xl mb-2'>Nombre de ventes par jour :</h1>
              <DateSaleChart />
            </div>
            <div className='max-w-full'>
              <h1 className='text-xl mb-2'>Nombre de ventes par heure :</h1>
              <HourSaleChart />
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default DashboardPage;
