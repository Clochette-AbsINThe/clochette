import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { BarrelCard } from '@/components/barrel-card/barrel-card';
import { barrelColumns } from '@/components/barrel-table/barrel-stock-columns';
import { consumbaleColumns } from '@/components/consumable-table/consumable-columns';
import { DataTable } from '@/components/table/data-table';
import Base from '@/layouts/base';
import { logger } from '@/lib/logger';
import { fetchReadDistinctConsumables, useReadDistinctConsumables, fetchReadDistinctBarrels, useReadDistinctBarrels, fetchReadBarrels, useReadBarrels } from '@/openapi-codegen/clochetteComponents';
import { ConsumableDistinct, BarrelDistinct, Barrel } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  consumables: ConsumableDistinct[];
  barrels: BarrelDistinct[];
  mountedBarrels: Barrel[];
}> = async (context) => {
  const result = await verifySession(context, pages.stock);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  const data = await Promise.all([
    fetchReadDistinctConsumables({
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    })
      .then((response) => response)
      .catch((error) => {
        logger.error(error);
        return [];
      }),
    fetchReadDistinctBarrels({
      queryParams: {
        is_mounted: false
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    })
      .then((response) => response)
      .catch((error) => {
        logger.error(error);
        return [];
      }),
    fetchReadBarrels({
      queryParams: {
        is_mounted: true
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    })
      .then((response) => response)
      .catch((error) => {
        logger.error(error);
        return [];
      })
  ]);

  return {
    props: {
      consumables: data[0],
      barrels: data[1],
      mountedBarrels: data[2]
    }
  };
};

const StockPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: consumables } = useReadDistinctConsumables(
    {},
    {
      initialData: props.consumables
    }
  );

  const { data: barrels } = useReadDistinctBarrels(
    {
      queryParams: {
        is_mounted: false
      }
    },
    {
      initialData: props.barrels
    }
  );

  const { data: mountedBarrels } = useReadBarrels(
    {
      queryParams: {
        is_mounted: true
      }
    },
    {
      initialData: props.mountedBarrels
    }
  );

  return (
    <Base
      title='Stock'
      description='La page pour gérer les stocks'
    >
      <div className='space-y-4'>
        <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Fûts montés sur les tireuses</h2>
        <div className='flex flex-row gap-5 flex-wrap py-4 lg:mx-8 mx-2'>
          {mountedBarrels?.map((mountedBarrel) => (
            <BarrelCard
              barrel={mountedBarrel}
              key={mountedBarrel.id}
            />
          ))}
          {mountedBarrels?.length === 0 && <p className='text-lg'>Aucun fût monté sur les tireuses</p>}
        </div>
        <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Fûts en stock</h2>
        <DataTable
          columns={barrelColumns}
          data={barrels ?? []}
          pagination={false}
        />
        <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Consommables en stock</h2>
        <DataTable
          columns={consumbaleColumns}
          data={consumables ?? []}
          pagination={false}
        />
      </div>
    </Base>
  );
};

export default StockPage;
