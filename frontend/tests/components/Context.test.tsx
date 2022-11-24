import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { AppContextProvider, useAuthContext } from '@components/Context';
import { server } from '../setupTests';
import { rest } from 'msw';

test('context', async () => {
    render(
        <AppContextProvider>
            <div>test</div>
        </AppContextProvider>
    );

    expect(screen.queryByText('test')).toBeInTheDocument();
});

test('context but error on jwt', () => {
    server.use(
        rest.get('http://localhost:3000/internal-api/api/getJwtInCookie', (req, res, ctx) => {
            return res(ctx.status(200));
        })
    );
    render(
        <AppContextProvider>
            <div>test</div>
        </AppContextProvider>
    );

    expect(screen.queryByText('test')).toBeInTheDocument();

    const { result } = renderHook(() => useAuthContext());
    expect(result.current.authenticated).toBe(false);
});
