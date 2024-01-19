import type { NextPage } from 'next';

import Card from '@/components/card';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';

const Home: NextPage = () => {
  return (
    <Base
      title='Accueil'
      description="Page d'accueil"
    >
      <>
        <div className='flex flex-col items-center justify-center h-full'>
          <h1 className='text-4xl font-bold text-green-700'>Bienvenue sur Clochette!</h1>
          <h2 className='text-2xl font-medium text-gray-500 dark:text-gray-100'>Le site pour la gestion du bar.</h2>
        </div>
        <div className='flex flex-grow flex-col justify-center'>
          <div className='grid grid-col-1 lg:grid-cols-2 gap-5 flex-grow'>
            <Card
              icon={['CB', 'Cash']}
              title='Gestion des transactions'
              description='Gestion des différents transactions du bar, les commandes et les ventes'
              link={pages.transaction.vente}
            />
            <Card
              icon={['Barrel', 'Soft']}
              title='Gestion des stocks'
              description='Gestion du stock du bar, les fûts et les consommables'
              link={pages.stock}
            />
            <Card
              icon={['Misc']}
              title='Historique des transactions'
              description='Historique des transactions du bar.'
              link={pages.transactionHistory}
            />
            <Card
              icon={['Setting']}
              title='Configuration'
              description='Configuration des élements du bar, les boissons, les consommables et les produits hors-inventaires'
              link={pages.configuration.index}
            />
          </div>
        </div>
      </>
    </Base>
  );
};

export default Home;
