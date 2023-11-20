import Link from 'next/link';

import { Icons, getIcon } from '@/styles/utils';

interface CardProps {
  title: string;
  description: string;
  link: string;
  icon: Icons[];
}

export default function Card({ title, description, link, icon }: CardProps): React.JSX.Element {
  return (
    <div className='w-full p-2 flex-grow'>
      <Link href={link}>
        <div className='border p-2 bg-secondary rounded-lg shadow-md h-full flex flex-col justify-around cursor-pointer'>
          <div className='flex flex-row items-center mb-2'>
            <div className='flex-shrink pr-4'>{icon.map((name) => getIcon(name))}</div>
            <div className='flex-1 text-right md:text-center space-y-3'>
              <h3 className='text-2xl md:text-3xl font-bold uppercase text-primary'>{title}</h3>
            </div>
          </div>
          <h5 className='text-lg md:text-xl font-semibold text-center'>{description}</h5>
        </div>
      </Link>
    </div>
  );
}
