import { render, screen } from '@testing-library/react';
import LoginButton from '@components/Layout/Navbar/LoginButton';
import { AppContext } from '@components/Context';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { server } from '../setupTests';
import { endpoints } from '@endpoints';
import { environmentVariable } from '@utils/settings';
import { rest } from 'msw';

test('LoginButton authenticated', () => {
    render(
        <AppContext.Provider value={{ jwt: '', setJwt: () => {}, authenticated: true }}>
            <LoginButton />
        </AppContext.Provider>
    );

    expect(screen.queryByText('Se déconnecter')).toBeInTheDocument();
});

test('LoginButton not authenticated', () => {
    render(
        <AppContext.Provider value={{ jwt: '', setJwt: () => {}, authenticated: false }}>
            <LoginButton />
        </AppContext.Provider>
    );

    expect(screen.queryByText('Se connecter')).toBeInTheDocument();
});

test('LoginButton signout', async () => {
    server.use(
        rest.post(environmentVariable.INTERNAL_API_URL + endpoints.internal.deleteJwtInCookie, (req, res, ctx) => {
            return res(ctx.status(200));
        })
    );

    render(
        <AppContext.Provider value={{ jwt: '', setJwt: () => {}, authenticated: true }}>
            <LoginButton />
        </AppContext.Provider>
    );

    expect(screen.queryByText('Se déconnecter')).toBeInTheDocument();
    await act(async () => {
        await userEvent.click(screen.getByText('Se déconnecter'));
    });
});
