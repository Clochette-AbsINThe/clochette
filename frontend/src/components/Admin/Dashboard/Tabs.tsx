import { useAuthContext } from '@components/Context';
import { links } from '@pages/account/[[...page]]';
import { parseJwt } from '@utils/utils';
import Link from 'next/link';

export default function Tabs({ pathname }: { pathname: string }) {
    const activeLink = links.find((link) => link.href.search(pathname) !== -1);
    let filteredLinks = [] as typeof links;

    const { jwt } = useAuthContext();
    if (jwt) {
        const userRoles = parseJwt(jwt)!.scopes ?? [];
        filteredLinks = links.filter((link) => link.scopes.some((role) => userRoles.includes(role)));
    }

    return (
        <div className='flex justify-center pr-2 md:border-r md:border-b-0 border-b md:mr-4 mb-4 md:mb-0'>
            <div className='w-full max-w-md md:w-max flex justify-start items-center md:items-start md:flex-col flex-row mb-2 md:mb-0'>
                {filteredLinks.map((link) => (
                    <Link
                        href={link.href}
                        key={link.href}
                        className={`px-3 py-2 text-sm w-full font-medium ${activeLink === link ? 'bg-slate-400 dark:bg-gray-800' : 'text-gray-900 hover:bg-slate-300 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
