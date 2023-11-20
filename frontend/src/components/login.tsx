import { useRef, useState } from 'react';
import { ResolverResult, useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/button';
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logger } from '@/lib/logger';
import { BodyLogin } from '@/openapi-codegen/clochetteSchemas';
import { pages } from '@/utils/pages';

export function loginResolver(data: BodyLogin): ResolverResult<BodyLogin> {
  const errors: Record<string, { type: string; message: string }> = {};

  if (!data.username || data.username === '') {
    errors.username = {
      type: 'required',
      message: "Le nom d'utilisateur est requis."
    };
  }

  if (!data.password || data.password === '') {
    errors.password = {
      type: 'required',
      message: 'Le mot de passe est requis.'
    };
  }

  return {
    values: data,
    errors: errors
  };
}

export default function Login() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<BodyLogin>({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: loginResolver
  });

  const onSubmit = async (data: BodyLogin) => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      });
      setLoading(false);

      if (res === undefined || res.error) {
        errorRef.current!.innerText = "Nom d'utilisateur ou mot de passe incorrect";
        return;
      }

      if (res.ok) {
        // Get the query params from the res.url
        const query = Object.fromEntries(new URLSearchParams(res.url?.split('?')[1]));
        const callbackUrl = (query.callbackUrl as string) ?? '/';
        push(callbackUrl);
        return;
      }
    } catch (err) {
      setLoading(false);
      logger.error(err);
      return;
    }
  };

  if (typeof window === 'undefined') return null;

  return (
    <Card className='flex flex-col space-y-3 place-self-center min-[450px]:w-[400px] w-full aspect-square mt-20'>
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
        <CardTitle className='text-xl font-bold md:text-2xl'>Connectez-vous</CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        <h3
          className='font-bold text-red-600'
          ref={errorRef}
        ></h3>
      </CardContent>
      <CardContent>
        <Form {...form}>
          <form
            className='grow flex justify-between flex-col gap-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='••••••••••••••••'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grow'></div>
            <Button
              type='submit'
              loading={loading}
            >
              Se connecter
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Link
          href={pages.signup}
          className='text-sm text-gray-500 hover:text-gray-700'
        >
          Vous n&apos;avez pas de compte ? <span className='underline'>Inscrivez-vous</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
