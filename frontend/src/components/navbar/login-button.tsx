import { PersonIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { pages } from '@/utils/pages';

export default function LoginButton(): JSX.Element {
  const router = useRouter();
  const { status } = useSession();

  const onClick = async () => {
    signOut();
    router.push(pages.index);
  };

  if (status !== 'authenticated') {
    return (
      <Link href={pages.signin}>
        <Button>Se connecter</Button>
      </Link>
    );
  } else {
    return (
      <div className='flex'>
        <Button onClick={onClick}>Se déconnecter</Button>
        <Link
          href={pages.account.index}
          className='ml-4'
        >
          <Button>
            <PersonIcon className='h-5 w-5' />
          </Button>
        </Link>
      </div>
    );
  }
}
