import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { ConsumableItemDeleteButton } from '@/components/configuration-consumable/consumable-item-delete-button';
import { ConsumableItemUpdateForm } from '@/components/configuration-consumable/consumable-item-forms';
import Base from '@/layouts/base';
import { fetchReadConsumableItem } from '@/openapi-codegen/clochetteComponents';
import { ConsumableItem } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  consumableItem: ConsumableItem;
}> = async (context) => {
  const result = await verifySession(context, pages.configuration.consommables.index);

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

  let consumableItem: ConsumableItem;
  try {
    consumableItem = await fetchReadConsumableItem({
      pathParams: {
        consumableItemId: id
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
      consumableItem
    }
  };
};

const ConfigurationConsommableIdPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base title="Modification d'un consommable">
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <div className='flex justify-between'>
          <Link href={pages.configuration.consommables.index}>
            <Button retour>
              <span>Retour</span>
            </Button>
          </Link>
          <ConsumableItemDeleteButton consumableItem={props.consumableItem} />
        </div>
        <h1 className='text-2xl'>Modification d&apos;un consommable</h1>
        <ConsumableItemUpdateForm consumableItem={props.consumableItem} />
      </div>
    </Base>
  );
};

export default ConfigurationConsommableIdPage;
