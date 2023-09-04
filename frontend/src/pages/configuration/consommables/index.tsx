import { useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { ReadConsumableItemsResponse, useReadConsumableItems } from '@/openapi-codegen/clochetteComponents';
import { options } from '@/pages/api/auth/[...nextauth]';
import { Button } from '@components/Button';
import Loader from '@components/Loader';
import SearchBar from '@components/SearchBar';
import Base from '@layouts/base';
import { getIcon } from '@styles/utils';
import { pages } from '@utils/pages';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getServerSession(context.req, context.res, options);

  if (!session)
    return {
      redirect: {
        destination: pages.signin,
        permanent: false
      }
    };

  return { props: {} };
};

export function filterConsumableItem(consumableItems: ReadConsumableItemsResponse, query: string) {
  return consumableItems.filter((consumableItem) => consumableItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
}

const ConfigurationConsommablePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data } = useReadConsumableItems({});
  const [query, setQuery] = useState('');

  const content = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (isError) {
      return <p>Erreur lors du chargement des consommables</p>;
    }

    if (data.length === 0) {
      return <p>Aucun consommable</p>;
    }

    return (
      <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>
        {filterConsumableItem(data, query).map((consumableItem) => (
          <div
            key={consumableItem.id}
            className='flex flex-col space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700'>
            <div className='flex justify-start items-center space-x-5'>
              <div>{getIcon(consumableItem.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}</div>
              <span className='text-center text-xl'>{consumableItem.name}</span>
            </div>
            <div className='flex grow justify-end space-x-5'>
              <Link href={pages.configuration.consommables.id(consumableItem.id)}>
                <Button
                  confirm
                  aria-label='edit'>
                  Editer
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Base title='Configuration des consommables'>
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Configuration des consommables</h1>
        <p>Les produits consommables sont les produits qui sont vendus sous la même forme qu&apos;ils sont acheté, comme par exemple les softs où les pizzas.</p>
        <div className='flex justify-between flex-wrap-reverse gap-4'>
          <SearchBar
            query={query}
            setQuery={setQuery}
          />
          <Link href={pages.configuration.consommables.create}>
            <Button>
              <span>Ajouter un consommable</span>
            </Button>
          </Link>
        </div>
        {content()}
      </div>
    </Base>
  );
};

export default ConfigurationConsommablePage;
