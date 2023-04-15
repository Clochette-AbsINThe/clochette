import { useRouter } from 'next/router';
import { useAuthContext } from '@components/Context';
import { deleteJwtInCookie } from '@utils/auth_internal_api';
import Link from 'next/link';

export default function LoginButton(): JSX.Element {
    const router = useRouter();
    const { setJwt, authenticated } = useAuthContext();

    const signOut = () => {
        setJwt(null);
        deleteJwtInCookie();
        router.push('/');
    };

    if (!authenticated) {
        return (
            <Link
                href='/login'
                className='btn-primary'>
                Se connecter
            </Link>
        );
    } else {
        return (
            <div className='flex'>
                <button
                    onClick={signOut}
                    className='btn-primary'>
                    Se déconnecter
                </button>
                <Link
                    href='/account'
                    className='ml-4 rounded-xl bg-green-700 p-1 text-gray-200 flex justify-center items-center'>
                    <svg
                        className='w-7 h-7'
                        viewBox='0 0 24 24'>
                        <path
                            fill='currentColor'
                            d='M10 12q-1.65 0-2.825-1.175Q6 9.65 6 8q0-1.65 1.175-2.825Q8.35 4 10 4q1.65 0 2.825 1.175Q14 6.35 14 8q0 1.65-1.175 2.825Q11.65 12 10 12Zm-7 8q-.425 0-.712-.288Q2 19.425 2 19v-1.8q0-.825.425-1.55q.425-.725 1.175-1.1q1.275-.65 2.875-1.1Q8.075 13 10 13h.35q.15 0 .3.05q-.2.45-.338.938q-.137.487-.212 1.012q-.125.9-.075 1.512q.05.613.275 1.488q.15.525.4 1.038q.25.512.55.962Zm14-2q.825 0 1.413-.587Q19 16.825 19 16q0-.825-.587-1.413Q17.825 14 17 14q-.825 0-1.412.587Q15 15.175 15 16q0 .825.588 1.413Q16.175 18 17 18Zm-1.3 1.5q-.3-.125-.563-.262q-.262-.138-.537-.338l-1.075.325q-.175.05-.325-.013q-.15-.062-.25-.212l-.6-1q-.1-.15-.062-.325q.037-.175.187-.3l.825-.725q-.05-.35-.05-.65q0-.3.05-.65l-.825-.725q-.15-.125-.187-.3q-.038-.175.062-.325l.6-1q.1-.15.25-.213q.15-.062.325-.012l1.075.325q.275-.2.537-.338q.263-.137.563-.262l.225-1.1q.05-.175.175-.287q.125-.113.3-.113h1.2q.175 0 .3.113q.125.112.175.287l.225 1.1q.3.125.563.275q.262.15.537.375l1.05-.375q.175-.075.338 0q.162.075.262.225l.6 1.05q.1.15.075.325q-.025.175-.175.3l-.85.725q.05.3.05.625t-.05.625l.825.725q.15.125.187.3q.038.175-.062.325l-.6 1q-.1.15-.25.212q-.15.063-.325.013L19.4 18.9q-.275.2-.537.338q-.263.137-.563.262l-.225 1.1q-.05.175-.175.287q-.125.113-.3.113h-1.2q-.175 0-.3-.113q-.125-.112-.175-.287Z'></path>
                    </svg>
                </Link>
            </div>
        );
    }
}
