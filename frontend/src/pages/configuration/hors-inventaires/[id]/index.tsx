import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { NonInventoriedItemDeleteButton } from '@/components/configuration-non-inventoried/non-inventoried-item-delete-button';
import { NonInventoriedItemUpdateForm } from '@/components/configuration-non-inventoried/non-inventoried-item-forms';
import Base from '@/layouts/base';
import { fetchReadNonInventoriedItem } from '@/openapi-codegen/clochetteComponents';
import { NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  nonInventoriedItem: NonInventoriedItem;
}> = async (context) => {
  const result = await verifySession(context, pages.configuration.horsInventaires.index);

  if (result.status === 'unauthenticated') {
    return result.redirection;
  }

  let id: number;
  try {
    id = parseInt(context.query.id as string);
  } catch (error) {
    // Make a 404
    return {
      notFound: true
    };
  }

  let nonInventoriedItem: NonInventoriedItem;
  try {
    nonInventoriedItem = await fetchReadNonInventoriedItem({
      pathParams: {
        nonInventoriedItemId: id
      },
      headers: {
        authorization: `Bearer ${result.session.token}`
      }
    });
  } catch (error) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      nonInventoriedItem
    }
  };
};

const ConfigurationHorsInventaireIdPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base title="Modification d'un produit hors inventaire">
      <div className='flex-grow px-3 flex flex-col space-y-2'>
        <div className='flex justify-between'>
          <Link href={pages.configuration.horsInventaires.index}>
            <Button retour>
              <span>Retour</span>
            </Button>
          </Link>
          <NonInventoriedItemDeleteButton nonInventoriedItem={props.nonInventoriedItem} />
        </div>
        <h1 className='text-xl'>Modification d&apos;un produit hors inventaire</h1>
        <NonInventoriedItemUpdateForm nonInventoriedItem={props.nonInventoriedItem} />
      </div>
    </Base>
  );
};

export default ConfigurationHorsInventaireIdPage;
