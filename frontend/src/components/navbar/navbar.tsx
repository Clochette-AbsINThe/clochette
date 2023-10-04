import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import LoginButton from '@/components/navbar/login-button';
import { pages } from '@/utils/pages';

const navitems = {
  Transaction: pages.transaction.vente,
  Stock: pages.stock,
  Historique: pages.transactionHistory,
  Configuration: pages.configuration.index
};

// Import Dark mode dynamically to avoid SSR issues
const DarkMode = dynamic(() => import('@/components/navbar/dark-mode-switch').then((mod) => mod.DarkMode), { ssr: false });

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='flex flex-col lg:flex-row'>
      <div className='flex justify-between items-center'>
        <Link
          href={pages.index}
          className='text-4xl text-green-700 font-bold p-2'
        >
          Clochette
        </Link>
        <div
          id='hamburger-menu'
          aria-label='hamburger-menu'
          onClick={() => setIsOpen(!isOpen)}
          className={(isOpen ? 'active ' : '') + 'lg:hidden'}
        >
          <span className='bg-gray-600 dark:bg-gray-300'></span>
          <span className='bg-gray-600 dark:bg-gray-300'></span>
          <span className='bg-gray-600 dark:bg-gray-300'></span>
        </div>
      </div>
      <div className={(!isOpen ? 'hidden ' : '') + 'lg:flex flex-col lg:flex-row items-center flex-grow'}>
        <div className={'flex p-2 justify-start flex-grow self-start lg:self-center h-full flex-col lg:flex-row pb-4 space-y-2 lg:space-y-0 lg:items-end lg:mb-2'}>
          {Object.entries(navitems).map(([name, link]) => (
            <Link
              key={name}
              className='text-xl hover:underline mx-4 w-max xl:mx-6'
              href={link}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className='flex flex-row justify-end flex-wrap lg:flex-nowrap'>
          <DarkMode />
          <div className='justify-center self-center mr-4'>
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
