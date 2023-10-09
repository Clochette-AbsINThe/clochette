import type { GetServerSideProps, NextPage } from 'next';

import Card from '@/components/card';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const result = await verifySession(context, pages.configuration.index);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  return { props: {} };
};

const ConfigurationPage: NextPage = () => {
  return (
    <Base
      title='Page de configuration'
      description='Page de configuration'
    >
      <>
        <div className='flex flex-col items-center justify-center h-full'>
          <h1 className='text-3xl font-bold text-primary'>Configuration</h1>
          <h2 className='text-xl'>Page de configuration</h2>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 flex-grow'>
          <Card
            icon={['Barrel', 'Beer']}
            title='Boissons'
            description='Les boissons sont les produits achetés sous forme de fûts et revendu en verre.'
            link={pages.configuration.boissons.index}
          />
          <Card
            icon={['Soft', 'Food']}
            title='Consommables'
            description="Les produits consommables apparaissent dans la gestion du stock. Il sont les produits qui sont vendus sous la même forme qu'ils sont achetés, comme par exemple les softs où les pizzas."
            link={pages.configuration.consommables.index}
          />
          <Card
            icon={['Misc', 'Glass']}
            title='Produits hors inventaire'
            description="Les produits hors inventaire sont les produits qui n'apparaitrons pas dans la gestion des stocks comme les planchettes de charcuterie."
            link={pages.configuration.horsInventaires.index}
          />
        </div>
      </>
    </Base>
  );
};

export default ConfigurationPage;
