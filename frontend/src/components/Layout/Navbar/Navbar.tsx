import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import LoginButton from '@components/Layout/Navbar/LoginButton';
import { useAuthContext } from '@components/Context';
import { getRedirectUrlEncoded } from '@utils/utils';

const navitems = {
    Transaction: '/transaction',
    Stock: '/stock',
    Historique: '/transaction_history',
    Configuration: '/configuration'
};

// Import Dark mode dynamically to avoid SSR issues
const DarkMode = dynamic(() => import('@components/Layout/Navbar/DarkMode').then((mod) => mod.DarkMode), { ssr: false });

export default function Navbar(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className='flex flex-col lg:flex-row'>
            <div className='flex justify-between items-center'>
                <Link
                    href='/'
                    className='text-4xl text-green-700 font-bold p-4'>
                    Clochette
                </Link>
                <div
                    id='hamburger-menu'
                    aria-label='hamburger-menu'
                    onClick={() => setIsOpen(!isOpen)}
                    className={(isOpen ? 'active ' : '') + 'lg:hidden'}>
                    <span className='bg-gray-600 dark:bg-gray-300'></span>
                    <span className='bg-gray-600 dark:bg-gray-300'></span>
                    <span className='bg-gray-600 dark:bg-gray-300'></span>
                </div>
            </div>
            <div className={(!isOpen ? 'hidden ' : '') + 'lg:flex flex-col lg:flex-row items-center flex-grow'}>
                <div className={'flex p-2 justify-start flex-grow self-start lg:self-center h-full flex-col lg:flex-row pb-4 space-y-2 lg:space-y-0 lg:items-end lg:mb-2'}>
                    {Object.entries(navitems).map(([name, link]) => (
                        <NavbarItem
                            key={name}
                            name={name}
                            link={link}
                        />
                    ))}
                </div>
                <div className='flex flex-row justify-end'>
                    <DarkMode />
                    <div className='justify-center self-center mr-4'>
                        <LoginButton />
                    </div>
                </div>
            </div>
        </header>
    );
}

function NavbarItem(props: { name: string; link: string }): JSX.Element {
    const { authenticated } = useAuthContext();
    const link = authenticated ? props.link : `/login?redirect=${getRedirectUrlEncoded(props.link)}`;
    return (
        <div className='text-xl hover:underline mx-6 w-max'>
            <Link href={link}>{props.name}</Link>
        </div>
    );
}
