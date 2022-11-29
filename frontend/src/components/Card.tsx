import { getIcon } from '@styles/utils';
import type { IconName } from '@types';
import Link from 'next/link';
import { useAuthContext } from '@components/Context';
import { getRedirectUrlEncoded } from '@utils/utils';

interface CardProps {
    title: string;
    description: string;
    link: string;
    icon: IconName[];
}

export default function Card(props: CardProps): JSX.Element {
    const { title, description, link, icon } = props;
    const { authenticated } = useAuthContext();

    const hrefLink = authenticated ? link : `/login?redirect=${getRedirectUrlEncoded(link)}`;

    return (
        <div className='w-full p-4 flex-grow'>
            <Link href={hrefLink}>
                <div className='border p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 h-full flex flex-col justify-around cursor-pointer dark:border-gray-500'>
                    <div className='flex flex-row items-center mb-4'>
                        <div className='flex-shrink pr-4'>{icon.map((name) => getIcon(name))}</div>
                        <div className='flex-1 text-right md:text-center space-y-3'>
                            <h3 className='text-2xl md:text-3xl font-bold uppercase text-green-700'>{title}</h3>
                        </div>
                    </div>
                    <h5 className='text-xl md:text-2xl font-semibold text-gray-500 dark:text-gray-100 text-center'>{description}</h5>
                </div>
            </Link>
        </div>
    );
}
