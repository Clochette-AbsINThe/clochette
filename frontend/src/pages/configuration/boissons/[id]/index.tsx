import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';
import { DrinkItemDeleteButton } from '@/components/configuration-drink/drink-item-delete-button';
import { DrinkItemUpdateForm } from '@/components/configuration-drink/drink-item-forms';
import Base from '@/layouts/base';
import { fetchReadDrink } from '@/openapi-codegen/clochetteComponents';
import { DrinkItem } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';
import { verifySession } from '@/utils/verify-session';

export const getServerSideProps: GetServerSideProps<{
  drink: DrinkItem;
}> = async (context) => {
  const result = await verifySession(context, pages.configuration.boissons.index);

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

  let drink: DrinkItem;
  try {
    drink = await fetchReadDrink({
      pathParams: {
        drinkId: id
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
      drink
    }
  };
};

const ConfigurationBoissonIdPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Base title="Modification d'une boisson">
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <div className='flex justify-between'>
          <Link href={pages.configuration.boissons.index}>
            <Button retour>
              <span>Retour</span>
            </Button>
          </Link>
          <DrinkItemDeleteButton drink={props.drink} />
        </div>
        <h1 className='text-2xl'>Modification d&apos;une boisson</h1>
        <DrinkItemUpdateForm drink={props.drink} />
      </div>
    </Base>
  );
};

export default ConfigurationBoissonIdPage;
