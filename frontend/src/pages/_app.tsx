import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import '@/styles/base.scss';

import { ThemeProvider } from '@/components/theme-provider';

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps): React.JSX.Element {
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
        >
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
