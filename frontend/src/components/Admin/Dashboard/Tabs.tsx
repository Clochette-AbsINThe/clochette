import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
    { label: 'Dashboard', to: '/account/dashboard' },
    { label: 'Users', to: '/account/users' },
    { label: 'Products', to: '/account/products' }
];

export default function Tabs() {
    const router = useRouter();
    const { pathname } = router;

    return (
        <div className='flex justify-center pr-2 md:border-r md:border-b-0 border-b mr-4 mb-4 md:mb-0'>
            <div className='w-full max-w-md flex justify-start md:flex-col flex-row mb-2 md:mb-0'>
                {links.map((link) => (
                    <Link
                        href={link.to}
                        key={link.to}
                        className={`px-3 py-2 text-sm font-medium ${pathname === link.to ? 'bg-slate-400 dark:bg-gray-800' : 'text-gray-900 hover:bg-slate-300 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
