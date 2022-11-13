import { DarkMode } from '@components/DarkMode';
import useWindowSize from '@hooks/useWindowSize';
import Link from 'next/link';
import { useState } from 'react';

const navitems = {
    Transaction: '/transaction',
    Stocks: '/stocks',
    Historique: '/transaction_history',
    Configuration: '/configuration'
};

export default function Navbar(): JSX.Element {
    const dimension = useWindowSize();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className='flex flex-col'>
            <div className='flex'>
                <Link href='/'>
                    <a className='text-4xl text-green-700 font-bold p-4'>Clochette</a>
                </Link>
                {dimension.width > 1024 ? (
                    <>
                        <div className='flex p-2 justify-start flex-grow self-center h-full'>
                            {Object.entries(navitems).map(([name, link]) => (
                                <NavbarItem
                                    key={name}
                                    name={name}
                                    link={link}
                                />
                            ))}
                        </div>
                        <DarkMode />
                        <div className='justify-center self-center mr-4'>
                            <Link href='/login'>
                                <a className='btn-primary'>Login</a>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='flex flex-grow justify-end items-center'>
                            <div
                                id='hamburger-menu'
                                aria-label='hamburger-menu'
                                onClick={() => setIsOpen(!isOpen)}
                                className={isOpen ? 'active' : ''}>
                                <span className='bg-gray-600 dark:bg-gray-300'></span>
                                <span className='bg-gray-600 dark:bg-gray-300'></span>
                                <span className='bg-gray-600 dark:bg-gray-300'></span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {isOpen && dimension.width < 1024 && (
                <div className='relative'>
                    <div className='flex flex-grow justify-end items-center'>
                        <DarkMode />
                        <div className='justify-center self-center mr-4'>
                            <Link href='/login'>
                                <a className='btn-primary'>Login</a>
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col w-full border-b-2 space-y-2 pb-4'>
                        {Object.entries(navitems).map(([name, link]) => (
                            <NavbarItem
                                key={name}
                                name={name}
                                link={link}
                            />
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}

function NavbarItem(props: { name: string; link: string }): JSX.Element {
    return (
        <div className='text-xl hover:underline mx-6'>
            <Link href={props.link}>
                <a>{props.name}</a>
            </Link>
        </div>
    );
}
