import { useRouter } from 'next/router';
import { useAuthContext } from '@components/Context';
import { deleteJwtInCookie } from '@utils/auth';
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
            <button
                onClick={signOut}
                className='btn-primary'>
                Se déconnecter
            </button>
        );
    }
}
