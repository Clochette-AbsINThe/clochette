import { useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { ReadDrinksResponse, useReadDrinks } from '@/openapi-codegen/clochetteComponents';
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

export function filterDrinks(drinks: ReadDrinksResponse, query: string) {
  return drinks.filter((drink) => drink.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
}

const ConfigurationBoissonPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data } = useReadDrinks({});
  const [query, setQuery] = useState('');

  const content = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (isError) {
      return <p>Erreur lors du chargement des boissons</p>;
    }

    if (data.length === 0) {
      return <p>Aucune boisson</p>;
    }

    return (
      <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>
        {filterDrinks(data, query).map((drink) => (
          <div
            key={drink.id}
            className='flex flex-col space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700'>
            <div className='flex justify-start items-center'>
              <div>{getIcon('Beer', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
              <div>{getIcon('Barrel', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
              <span className='text-center text-xl ml-4'>{drink.name}</span>
            </div>
            <div className='flex grow justify-end space-x-5'>
              <Link href={pages.configuration.boissons.id(drink.id)}>
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
    <Base title='Configuration des boissons'>
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Configuration des boissons</h1>
        <p>Les boissons sont les produits achetés sous forme de fûts et revendu en verre.</p>
        <div className='flex justify-between flex-wrap-reverse gap-4'>
          <SearchBar
            query={query}
            setQuery={setQuery}
          />
          <Link href={pages.configuration.boissons.create}>
            <Button>
              <span>Ajouter une boisson</span>
            </Button>
          </Link>
        </div>
        {content()}
      </div>
    </Base>
  );
};

export default ConfigurationBoissonPage;
