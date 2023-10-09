import { useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { DrinkItemHomeGrid } from '@/components/configuration-drink/drink-item-home-grid';
import SearchBar from '@/components/search-bar';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const result = await verifySession(context, pages.configuration.boissons.index);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  return { props: {} };
};

const ConfigurationBoissonPage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState('');

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
        <DrinkItemHomeGrid query={query} />
      </div>
    </Base>
  );
};

export default ConfigurationBoissonPage;
