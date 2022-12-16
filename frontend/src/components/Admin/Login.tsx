import { saveJwtInCookie } from '@utils/auth_internal_api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useAuthContext } from '@components/Context';
import { login } from '@proxies/AuthProxies';

export default function Login() {
    const { query, push } = useRouter();
    const errorRef = useRef<HTMLHeadingElement>(null);
    const { setJwt } = useAuthContext();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formDetails = new FormData(e.currentTarget);
        const username = formDetails.get('username') as string;
        const password = formDetails.get('password') as string;

        // Get the redirection URL from the query string after the login sucess
        const redirect = Array.isArray(query.redirect) ? query.redirect[0] ?? '/' : query.redirect ?? '/';

        // Sign in the user and get the result of the sign in process and the JWT
        const results = await login({ username, password });

        if (results.status !== 200) {
            errorRef.current!.innerText = results.error?.detail as string;
            return;
        }

        // If sucess save the JWT in the cookie by calling internal API
        await saveJwtInCookie({ jwt: results.token.access_token });

        // Save the JWT in the context
        setJwt(results.token.access_token);

        // Redirect to the redirection URL
        push(redirect);
    };

    return (
        <>
            <div className='border p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 flex flex-col dark:border-gray-500 space-y-3 place-self-center min-[450px]:w-[400px] w-full aspect-square mt-20'>
                <Link
                    href='/'
                    className='flex self-center text-2xl font-semibold'>
                    <>
                        <Image
                            className='mr-2'
                            src='/absinthe.png'
                            alt='logo'
                            width={32}
                            height={32}
                        />
                        <span>Absinthe</span>
                    </>
                </Link>
                <h1 className='text-xl font-bold md:text-2xl'>Connectez-vous</h1>
                <h3
                    className='font-bold text-red-600'
                    ref={errorRef}></h3>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4'>
                        <label
                            htmlFor='username'
                            className='text-sm font-semibold'>
                            Nom d&apos;utilisateur
                        </label>
                        <input
                            type='text'
                            name='username'
                            id='username'
                            placeholder="Nom d'utilisateur"
                            className='input w-full'
                            required
                            aria-label='username'
                        />
                        <label
                            htmlFor='password'
                            className='text-sm font-semibold'>
                            Mot de passe
                        </label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            placeholder='••••••••••••••••'
                            className='input w-full'
                            required
                            aria-label='password'
                        />
                    </div>
                    <button
                        type='submit'
                        role={'submit'}
                        className='btn-primary w-full'>
                        Se connecter
                    </button>
                </form>
                <Link
                    href={'/register'}
                    className='text-sm text-gray-500 hover:text-gray-700'>
                    Vous n&apos;avez pas de compte ? Inscrivez-vous
                </Link>
            </div>
        </>
    );
}
