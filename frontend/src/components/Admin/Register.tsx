import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnFrPackage from '@zxcvbn-ts/language-fr';
import { AccountCreate } from '@types';
import { register } from '@proxies/AuthProxies';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getErrorMessage } from '@utils/utils';

const options = {
    translations: zxcvbnFrPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnFrPackage.dictionary
    }
};

zxcvbnOptions.setOptions(options);

export default function Register(): JSX.Element {
    const { push } = useRouter();
    const username = useRef<HTMLInputElement>(null);
    const password1 = useRef<HTMLInputElement>(null);
    const password2 = useRef<HTMLInputElement>(null);
    const firstName = useRef<HTMLInputElement>(null);
    const lastName = useRef<HTMLInputElement>(null);

    const [zxcvbnResult, setzxcvbnResult] = useState<ZxcvbnResult>(zxcvbn(''));

    const handlePassword2Change = () => {
        if (password1.current!.value !== password2.current!.value) {
            password2.current!.setCustomValidity('Les mots de passe ne correspondent pas');
        } else {
            password2.current!.setCustomValidity('');
        }
    };

    const handlePassword1Change = () => {
        const res = zxcvbn(password1.current!.value, [username.current!.value, firstName.current!.value, lastName.current!.value]);
        setzxcvbnResult(res);
        console.log(res);
        if (res.score < 4) {
            password1.current!.setCustomValidity(res.feedback.warning !== '' ? res.feedback.warning : 'Votre mot de passe ne correpond pas aux critères de sécurité');
        } else {
            password1.current!.setCustomValidity('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const account: AccountCreate = {
            username: username.current!.value,
            password: password1.current!.value,
            firstName: firstName.current!.value,
            lastName: lastName.current!.value,
            promotionYear: new Date().getFullYear() + 3
        };
        const results = await register(account);

        if (results.status !== 200) {
            toast.error(`Une erreur est survenue lors de la création de votre compte : ${getErrorMessage(results)}`);
        } else {
            toast.success('Votre compte a bien été créé ! Le président validera votre inscription dans les plus brefs délais.');
        }

        push('/');
    };

    return (
        <>
            <div className='border p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 flex flex-col dark:border-gray-500 place-self-center min-[450px]:w-[400px] w-full aspect-square mt-20'>
                <Link
                    href='/'
                    className='flex self-center text-2xl font-semibold'>
                    <>
                        <Image
                            className='mr-2 mb-3'
                            src='/absinthe.png'
                            alt='logo'
                            width={32}
                            height={32}
                        />
                        <span>Absinthe</span>
                    </>
                </Link>
                <h1 className='text-xl font-bold md:text-2xl'>Création du compte</h1>
                <form
                    className='grow flex justify-between flex-col'
                    onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 p-2'>
                        <div>
                            <label
                                htmlFor='firstName'
                                className='text-sm font-semibold'>
                                Prénom
                            </label>
                            <input
                                type='text'
                                name='firstName'
                                id='firstName'
                                placeholder='Prénom'
                                className='input w-full'
                                required
                                aria-label='firstName'
                                ref={firstName}
                                onBlur={() => {
                                    handlePassword1Change();
                                    firstName.current!.classList.add('input-error');
                                }}
                            />
                            <label
                                htmlFor='lastName'
                                className='text-sm font-semibold'>
                                Nom de famille
                            </label>
                            <input
                                type='text'
                                name='lastName'
                                id='lastName'
                                placeholder="Nom d'utilisateur"
                                className='input w-full'
                                required
                                aria-label='lastName'
                                ref={lastName}
                                onBlur={() => {
                                    handlePassword1Change();
                                    lastName.current!.classList.add('input-error');
                                }}
                            />
                        </div>
                        <div>
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
                                ref={username}
                                onBlur={() => {
                                    handlePassword1Change();
                                    username.current!.classList.add('input-error');
                                }}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor='password1'
                                className='text-sm font-semibold'>
                                Mot de passe
                            </label>
                            <div className='relative'>
                                <input
                                    type='password'
                                    name='password1'
                                    id='password1'
                                    placeholder='••••••••••••••••'
                                    className='input w-full'
                                    required
                                    aria-label='password1'
                                    ref={password1}
                                    onChange={handlePassword1Change}
                                    onFocus={() => {
                                        password1.current!.classList.add('input-error');
                                    }}
                                />
                                <button
                                    className='absolute right-0 top-0 mt-3 mr-3 focus:outline-none hover:text-gray-700'
                                    type='button'
                                    tabIndex={-1}
                                    onMouseDown={() => (password1.current!.type = 'text')}
                                    onTouchStart={() => (password1.current!.type = 'text')}
                                    onMouseUp={() => (password1.current!.type = 'password')}
                                    onTouchEnd={() => (password1.current!.type = 'password')}
                                    onMouseLeave={() => (password1.current!.type = 'password')}>
                                    <svg
                                        className='h-4 w-4'
                                        viewBox='0 0 24 24'>
                                        <path
                                            fill='currentColor'
                                            d='M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z'></path>
                                    </svg>
                                </button>
                            </div>
                            <label
                                htmlFor='password2'
                                className='text-sm font-semibold'>
                                Confirmez votre mot de passe
                            </label>
                            <div className='relative'>
                                <input
                                    type='password'
                                    name='password2'
                                    id='password2'
                                    placeholder='••••••••••••••••'
                                    className='input w-full'
                                    required
                                    aria-label='password2'
                                    ref={password2}
                                    onChange={handlePassword2Change}
                                    onFocus={() => {
                                        password2.current!.classList.add('input-error');
                                    }}
                                />
                                <button
                                    className='absolute right-0 top-0 mt-3 mr-3 focus:outline-none'
                                    type='button'
                                    tabIndex={-1}
                                    onMouseDown={() => (password2.current!.type = 'text')}
                                    onTouchStart={() => (password2.current!.type = 'text')}
                                    onMouseUp={() => (password2.current!.type = 'password')}
                                    onTouchEnd={() => (password2.current!.type = 'password')}
                                    onMouseLeave={() => (password2.current!.type = 'password')}>
                                    <svg
                                        className='h-4 w-4 ml-1'
                                        viewBox='0 0 24 24'>
                                        <path
                                            fill='currentColor'
                                            d='M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z'></path>
                                    </svg>
                                </button>
                            </div>
                            <div className='flex flex-col justify-between w-full mt-4'>
                                <div className='flex flex-row gap-2'>
                                    <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 0 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                                    <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 1 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                                    <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 2 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                                    <div className={`w-full h-2 rounded-full ${zxcvbnResult.score > 3 ? `${colorForPasswordValidator(zxcvbnResult.score)}` : 'bg-gray-300'}`}></div>
                                </div>
                                <div className='text-xs text-gray-500 mt-2'>
                                    {zxcvbnResult.feedback.suggestions.map((suggestion, index) => (
                                        <div key={index}>{suggestion}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type='submit'
                        role={'submit'}
                        className='btn-primary w-full my-2'>
                        Créer un compte
                    </button>
                </form>
                <Link
                    href={'/login'}
                    className='text-sm text-gray-500 hover:text-gray-700'>
                    Vous avez déjà un compte ? Connectez-vous
                </Link>
            </div>
        </>
    );
}

function colorForPasswordValidator(score: number) {
    switch (score) {
        case 0:
            return 'bg-red-500';
        case 1:
            return 'bg-red-500';
        case 2:
            return 'bg-orange-500';
        case 3:
            return 'bg-yellow-500';
        case 4:
            return 'bg-green-500';
        default:
            return 'bg-gray-300';
    }
}
