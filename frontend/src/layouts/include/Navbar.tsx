import { DarkMode } from '@components/DarkMode';
import useWindowSize from '@hooks/useWindowSize';
import { useState } from 'react';

const navitems = {
    Home: '/',
    Stocks: '/stocks',
    Transaction: '/transaction',
    Historique: '/transaction-history',
    Configuration: '/configuration'
};

export default function Navbar(): JSX.Element {
    const dimension = useWindowSize();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex flex-col">
            <div className="flex">
                <h1 className="text-4xl text-green-700 font-bold p-4">Clochette</h1>
                {dimension.width > 1024
                    ? (
                        <>
                            <div className="flex p-2 justify-start flex-grow self-center h-full">
                                {Object.entries(navitems).map(([name, link]) => <NavbarItem key={name} name={name} link={link} />)}
                            </div>
                            <DarkMode />
                            <div className="justify-center self-center mr-4">
                                <a className="btn-primary" href='/login'>Login</a>
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="flex flex-grow justify-end items-center">
                                <div id="hamburger-menu" aria-label='hamburger-menu' onClick={() => setIsOpen(!isOpen)} className={isOpen ? 'active' : ''}>
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
                    <div className="flex flex-grow justify-end items-center">
                        <DarkMode />
                        <div className="justify-center self-center mr-4">
                            <a className="btn-primary" href='/login'>Login</a>
                        </div>
                    </div>
                    <div className="flex flex-col w-full border-b-2 space-y-2 pb-4">
                        {Object.entries(navitems).map(([name, link]) => <NavbarItem key={name} name={name} link={link} />)}
                    </div>
                </div>
            )}
        </header>
    );
}

function NavbarItem(props: { name: string, link: string }): JSX.Element {
    return (
        <div className="text-xl hover:underline mx-6">
            <a href={props.link}>{props.name}</a>
        </div>
    );
}
