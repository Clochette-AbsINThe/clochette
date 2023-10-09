import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { NonInventoriedItemCreateForm } from '@/components/configuration-non-inventoried/non-inventoried-item-forms';
import Base from '@/layouts/base';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const result = await verifySession(context, pages.configuration.horsInventaires.create);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  return { props: {} };
};

const ConfigurationHorsInventaireCreatePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base title="Ajout d'un nouveau produit hors inventaire">
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.horsInventaires.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Ajout d&apos;un nouveau produit hors inventaire</h1>
        <NonInventoriedItemCreateForm />
      </div>
    </Base>
  );
};

export default ConfigurationHorsInventaireCreatePage;
