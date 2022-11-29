import { endpoints } from '@endpoints';
import { deleteJwtInCookie, getJwtInCookie, saveJwtInCookie, signIn } from '@utils/auth';
import { environmentVariable } from '@utils/settings';
import { rest } from 'msw';
import { jwt, server } from '../setupTests';

test('test signIn function', async () => {
    const username = 'username';
    const password = 'password';

    server.use(
        rest.post(environmentVariable.BACKEND_API_URL + endpoints.v1.login, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({ access_token: jwt, token_type: 'bearer' }));
        })
    );

    expect(await signIn({ username, password })).toStrictEqual({
        status: 200,
        token: {
            access_token: jwt,
            token_type: 'bearer'
        }
    });
});

test('test signIn function with wrong credentials', async () => {
    const username = 'username';
    const password = 'password';

    server.use(
        rest.post(environmentVariable.BACKEND_API_URL + endpoints.v1.login, (req, res, ctx) => {
            return res(ctx.status(401), ctx.json({ detail: 'Incorrect authentication credentials.' }));
        })
    );

    expect(await signIn({ username, password })).toStrictEqual({
        status: 401,
        token: {
            access_token: '',
            token_type: ''
        },
        error: {
            detail: 'Incorrect authentication credentials.'
        }
    });
});

test('test signIn function with server error', async () => {
    const username = 'username';
    const password = 'password';

    server.use(
        rest.post(environmentVariable.BACKEND_API_URL + endpoints.v1.login, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );

    expect(await signIn({ username, password })).toStrictEqual({
        status: 500,
        token: {
            access_token: '',
            token_type: ''
        },
        error: ''
    });
});

test('saveJwtInCookie function', async () => {
    server.use(
        rest.post(environmentVariable.INTERNAL_API_URL + endpoints.internal.saveJwtInCookie, (req, res, ctx) => {
            return res(ctx.status(200));
        })
    );

    expect(await saveJwtInCookie({ jwt })).toStrictEqual(true);
});

test('deleteJwtInCookie function', async () => {
    server.use(
        rest.post(environmentVariable.INTERNAL_API_URL + endpoints.internal.deleteJwtInCookie, (req, res, ctx) => {
            return res(ctx.status(200));
        })
    );

    expect(await deleteJwtInCookie()).toStrictEqual(true);
});

test('getJwtInCookie function', async () => {
    expect((await getJwtInCookie()).data.jwt).toStrictEqual(jwt);
});
