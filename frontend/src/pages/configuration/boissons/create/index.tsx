import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';

import { useCreateDrink } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { DrinkItemCreate } from '@/openapi-codegen/clochetteSchemas';
import { options } from '@/pages/api/auth/[...nextauth]';
import { Button } from '@components/Button';
import Base from '@layouts/base';
import { pages } from '@utils/pages';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getServerSession(context.req, context.res, options);

  if (!session)
    return {
      redirect: {
        destination: pages.signin,
        permanent: false
      }
    };

  return { props: {} };
};

const ConfigurationBoissonCreatePage: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<DrinkItemCreate>();

  const name = getValues('name');

  const createDrink = useCreateDrink({
    onSuccess(data, variables, context) {
      const item = data;
      toast.success(`${item.name} ajouté avec succès !`);
      router.push(pages.configuration.boissons.id(item.id));
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de l'ajout de la boisson ${name}. ${detail}`);
    }
  });

  const onSubmit = (data: DrinkItemCreate) => {
    createDrink.mutate({
      body: data
    });
  };

  return (
    <Base title="Ajout d'une nouvelle boisson">
      <div className='flex-grow px-3 flex flex-col space-y-4'>
        <Link href={pages.configuration.boissons.index}>
          <Button retour>
            <span>Retour</span>
          </Button>
        </Link>
        <h1 className='text-2xl'>Ajout d&apos;une nouvelle boisson</h1>
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
          <div className='grow'></div>
          <div className='flex justify-end space-x-5'>
            <Button
              confirm
              loading={createDrink.isLoading}
              type='submit'>
              Ajouter la nouvelle boisson
            </Button>
          </div>
        </form>
      </div>
    </Base>
  );
};

export default ConfigurationBoissonCreatePage;
