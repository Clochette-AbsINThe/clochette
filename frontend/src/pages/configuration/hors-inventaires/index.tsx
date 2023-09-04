import { useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { ReadNonInventoriedItemsResponse, useReadNonInventoriedItems } from '@/openapi-codegen/clochetteComponents';
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

export function filterNonInventoried(nonInventoriedItems: ReadNonInventoriedItemsResponse, query: string) {
  return nonInventoriedItems.filter((nonInventoriedItem) => nonInventoriedItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));
}

const ConfigurationHorsInventairePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isLoading, isError, data } = useReadNonInventoriedItems({});

  const [query, setQuery] = useState('');

  const content = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (isError) {
      return <p>Erreur lors du chargement des produit hors inventaire</p>;
    }

    if (data.length === 0) {
      return <p>Aucun produit hors inventaire</p>;
    }

    return (
      <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>
        {filterNonInventoried(data, query).map((nonInventoried) => (
          <div
            key={nonInventoried.id}
            className='flex flex-col space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700'>
            <div className='flex justify-start items-center'>
              <div>{getIcon(nonInventoried.icon, 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
              <span className='text-center text-xl ml-4'>{nonInventoried.name}</span>
            </div>
            <div className='flex grow justify-end space-x-5'>
              {nonInventoried.sellPrice !== null ? <div className='self-end pb-2 grow'>Vente à {nonInventoried.sellPrice}€</div> : null}
              <Link href={pages.configuration.horsInventaires.id(nonInventoried.id)}>
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
    <Base title='Configuration des produits hors inventaire'>
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Configuration des produits hors inventaire</h1>
        <p>Les produits hors inventaire sont les produits qui n&apos;apparaitrons pas dans la gestion des stocks comme les planchette de charcuterie.</p>
        <div className='flex justify-between flex-wrap-reverse gap-4'>
          <SearchBar
            query={query}
            setQuery={setQuery}
          />
          <Link href={pages.configuration.horsInventaires.create}>
            <Button>
              <span>Ajouter un produit hors inventaire</span>
            </Button>
          </Link>
        </div>
        {content()}
      </div>
    </Base>
  );
};

export default ConfigurationHorsInventairePage;
