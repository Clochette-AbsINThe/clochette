import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';

import { fetchReadConsumableItem, useUpdateConsumableItem } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { ConsumableItem, ConsumableItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { options } from '@/pages/api/auth/[...nextauth]';
import { Button } from '@components/Button';
import Base from '@layouts/base';
import { getIcon } from '@styles/utils';
import { pages } from '@utils/pages';

export const getServerSideProps: GetServerSideProps<{
  consumableItem: ConsumableItem;
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, options);

  if (!session)
    return {
      redirect: {
        destination: pages.signin,
        permanent: false
      }
    };

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
        authorization: `Bearer ${session.token}`
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
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<ConsumableItemUpdate>({
    defaultValues: props.consumableItem
  });

  const name = getValues('name');

  const updateConsumableItem = useUpdateConsumableItem({
    onSuccess(data, variables, context) {
      const item = data;
      toast.success(`${item.name} modifié avec succès !`);
      router.push(pages.configuration.consommables.id(item.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la modification du consommable ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: ConsumableItemUpdate) => {
    updateConsumableItem.mutate({
      body: data,
      pathParams: {
        consumableItemId: props.consumableItem.id
      }
    });
  };

  return (
    <Base title="Modification d'un consommable">
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.consommables.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Modification d&apos;un consommable</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col self-start space-y-4 p-4 grow w-full'>
          <div className='flex flex-col space-y-2'>
            <label htmlFor='name'>Nom</label>
            <input
              id='name'
              type='text'
              className={`input ${errors.name ? 'input-error' : ''}`}
              {...register('name', { required: true })}
            />
            {errors.name && <span className='text-red-500'>Le nom est requis</span>}
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='text-2xl'>Type de produit :</div>
            <div className='flex flex-col items-start flex-wrap space-y-2'>
              <div className='flex space-x-4 items-center'>
                <input
                  {...register('icon', { required: true })}
                  type='radio'
                  id='Food'
                  value='Food'
                  className='checkbox'
                />
                <label htmlFor='Food'>{getIcon('Food', 'w-10 h-10 dark:text-white text-black')}</label>
              </div>
              <div className='flex space-x-4 items-center'>
                <input
                  {...register('icon', { required: true })}
                  type='radio'
                  id='Soft'
                  value='Soft'
                  className='checkbox'
                />
                <label htmlFor='Soft'>{getIcon('Soft', 'w-10 h-10 dark:text-white text-black')}</label>
              </div>
              <div className='flex space-x-4 items-center'>
                <input
                  {...register('icon', { required: true })}
                  type='radio'
                  id='Misc'
                  value='Misc'
                  className='checkbox'
                />
                <label htmlFor='Misc'>{getIcon('Misc', 'w-10 h-10 dark:text-white text-black')}</label>
              </div>
              <div className='flex space-x-4 items-center'>
                <input
                  {...register('icon', { required: true })}
                  type='radio'
                  id='Glass'
                  value='Glass'
                  className='checkbox'
                />
                <label htmlFor='Glass'>{getIcon('Glass', 'w-10 h-10 dark:text-white text-black')}</label>
              </div>
            </div>
            {errors.icon && <span className='text-red-500'>Le type de produit est requis</span>}
          </div>
          <div className='grow'></div>
          <div className='flex justify-end space-x-5'>
            <Button
              confirm
              loading={updateConsumableItem.isLoading}
              type='submit'>
              Modifier le consommable
            </Button>
          </div>
        </form>
      </div>
    </Base>
  );
};

export default ConfigurationConsommableIdPage;
