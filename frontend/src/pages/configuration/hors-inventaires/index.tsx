import { useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { NonInventoriedItemHomeGrid } from '@/components/configuration-non-inventoried/non-inventoried-item-home-grid';
import SearchBar from '@/components/search-bar';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const result = await verifySession(context, pages.configuration.horsInventaires.index);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  return { props: {} };
};

const ConfigurationHorsInventairePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState('');

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
        <NonInventoriedItemHomeGrid query={query} />
      </div>
    </Base>
  );
};

export default ConfigurationHorsInventairePage;
