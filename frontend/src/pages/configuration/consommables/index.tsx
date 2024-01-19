import { useState } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { ConsumableItemHomeGrid } from '@/components/configuration-consumable/consumable-item-home-grid';
import SearchBar from '@/components/search-bar';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const result = await verifySession(context, pages.configuration.consommables.index);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  return { props: {} };
};

const ConfigurationConsommablePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [query, setQuery] = useState('');

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
        <ConsumableItemHomeGrid query={query} />
      </div>
    </Base>
  );
};

export default ConfigurationConsommablePage;
