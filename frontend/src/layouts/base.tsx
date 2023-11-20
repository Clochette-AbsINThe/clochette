import { Toaster } from 'react-hot-toast';

import Head from 'next/head';

import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';

export interface Props {
  title: string;
  description?: string;
  children: React.JSX.Element;
}

export default function Base({ children, title, description }: React.PropsWithChildren<Props>): React.JSX.Element {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content={description}
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        />
      </Head>
      <Navbar />
      <main className='flex-grow p-3 flex flex-col select-none'>
        {children}
        <Toaster
          position='bottom-left'
          toastOptions={{ style: { maxWidth: 500 } }}
        />
      </main>
      <Footer />
    </>
  );
}
