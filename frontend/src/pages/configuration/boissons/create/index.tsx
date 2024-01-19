import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { DrinkItemCreateForm } from '@/components/configuration-drink/drink-item-forms';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const result = await verifySession(context, pages.configuration.boissons.create);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  return { props: {} };
};

const ConfigurationBoissonCreatePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base title="Ajout d'une nouvelle boisson">
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.boissons.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Ajout d&apos;une nouvelle boisson</h1>
        <DrinkItemCreateForm />
      </div>
    </Base>
  );
};

export default ConfigurationBoissonCreatePage;
