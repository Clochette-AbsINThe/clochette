import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import Page404 from '@/components/404';
import { Button } from '@/components/button';
import Base from '@/layouts/base';

const HomePage404: NextPage = () => {
  const router = useRouter();

  return (
    <Base
      title='404 Non trouvée'
      description="La page n'a pas été trouvée."
    >
      <div className='flex-grow flex flex-col'>
        <div>
          <Button
            retour
            onClick={router.back}
          >
            Retour
          </Button>
        </div>
        <Page404 />
      </div>
    </Base>
  );
};

export default HomePage404;
