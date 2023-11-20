import { FieldErrors, ResolverResult, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@/components/button';
import { PasswordForm, passwordFormResolver } from '@/components/forms/password-form';
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateAccount } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { AccountCreate } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';

type RegisterBody = AccountCreate & {
  passwordConfirm: string;
};

export function registerResolver(data: RegisterBody): ResolverResult<RegisterBody> {
  const errors: FieldErrors<RegisterBody> = {};

  if (!data.username || data.username === '') {
    errors.username = {
      type: 'required',
      message: "Le nom d'utilisateur est requis."
    };
  }

  const passwordResolverResult = passwordFormResolver(data);

  if ('password' in passwordResolverResult.errors) errors.password = passwordResolverResult.errors.password;
  if ('passwordConfirm' in passwordResolverResult.errors) errors.passwordConfirm = passwordResolverResult.errors.passwordConfirm;

  if (!data.firstName || data.firstName === '') {
    errors.firstName = {
      type: 'required',
      message: 'Le prénom est requis.'
    };
  }

  if (!data.lastName || data.lastName === '') {
    errors.lastName = {
      type: 'required',
      message: 'Le nom de famille est requis.'
    };
  }

  return {
    values: data,
    errors: errors
  };
}

export default function Register(): React.JSX.Element {
  const { push } = useRouter();

  const form = useForm<RegisterBody>({
    defaultValues: {
      username: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: ''
    },
    resolver: registerResolver,
    mode: 'all'
  });

  const createAccount = useCreateAccount({
    onSuccess(data, variables, context) {
      toast.success('Votre compte a bien été créé ! Le président validera votre inscription dans les plus brefs délais.');
      push('/');
    },
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Une erreur est survenue lors de la création de votre compte : ${detail}`);
    }
  });

  const onSubmit = (data: RegisterBody) => {
    createAccount.mutate({
      body: {
        username: data.username,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        promotionYear: new Date().getFullYear() + 3
      }
    });
  };

  return (
    <Card className='flex flex-col space-y-3 place-self-center min-[450px]:w-[400px] w-full aspect-square mt-2'>
      <CardHeader className='pb-0'>
        <Link
          href={pages.index}
          className='flex self-center text-2xl font-semibold mb-2'
        >
          <img
            src='/absinthe.png'
            alt='logo'
            width={32}
            height={32}
            className='mr-2'
          />
          <span>Absinthe</span>
        </Link>
        <CardTitle className='text-xl font-bold md:text-2xl'>Création du compte</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='grow flex justify-between flex-col gap-2'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Prénom'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de famille</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nom de famille'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d&apos;utilisateur</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom d'utilisateur"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordForm form={form} />
            <div className='grow'></div>
            <Button
              type='submit'
              loading={createAccount.isLoading}
            >
              Créer un compte
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Link
          href={pages.signin}
          className='text-sm text-gray-500 hover:text-gray-700'
        >
          Vous avez déjà un compte ? <span className='underline'>Connectez-vous</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
