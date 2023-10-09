import Link from 'next/link';

import { Button } from '@/components/button';
import { pages } from '@/utils/pages';

export default function Page404(): JSX.Element {
  return (
    <div className='flex flex-col w-full h-full justify-around items-center grow'>
      <div className='flex items-center my-4 text-[11.5rem]'>
        <div className='opacity-0 animate-slide-in [animation-delay:_0.2s]'>4</div>
        <div className='opacity-0 animate-slide-in [animation-delay:_0.4s]'>0</div>
        <div className='opacity-0 animate-slide-in [animation-delay:_0.6s]'>4</div>
      </div>
      <h2 className='opacity-0 animate-slide-in md:text-7xl my-4 text-4xl uppercase'>La page est introuvable</h2>
      <p className='text-xl'>La page que vous recherchez a peut-être été supprimée, a été renommée ou est provisoirement indisponible.</p>
      <Link href={pages.index}>
        <Button>Retourner à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
