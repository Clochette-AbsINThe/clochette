import Login from '@components/Login';
import { endpoints } from '@endpoints';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { environmentVariable } from '@utils/settings';
import { rest } from 'msw';
import { jwt, server } from '../setupTests';

test('render Login component', () => {
    render(<Login />);
    const login = screen.queryByText('Connectez-vous');
    expect(login).toBeInTheDocument();
});

test('submit username and password', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/auth/login/', (req, res, ctx) => {
            return res(
                ctx.json({
                    jwt
                }),
                ctx.status(200)
            );
        }),
        rest.post(environmentVariable.INTERNAL_API_URL + endpoints.internal.saveJwtInCookie, (req, res, ctx) => {
            return res(ctx.status(200));
        })
    );
    render(<Login />);
    const login = screen.queryByText('Connectez-vous');
    expect(login).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('username'), 'test');
    await userEvent.type(screen.getByLabelText('password'), 'test');
    await userEvent.click(screen.getByRole('submit'));
});

test('submit username and password with wrong credentials', async () => {
    server.use(
        rest.post('https://clochette.dev/api/v1/auth/login/', (req, res, ctx) => {
            return res(ctx.status(401));
        })
    );
    render(<Login />);
    const login = screen.queryByText('Connectez-vous');
    expect(login).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('username'), 'test');
    await userEvent.type(screen.getByLabelText('password'), 'test');
    await userEvent.click(screen.getByRole('submit'));
});
