import { addIdToUrl, getErrorMessage, getIdFromUrl, getRedirectUrlEncoded, parseJwt, removeIdFromUrl } from '@utils/utils';
import { jwt } from 'tests/setupTests';

test('test parseJWT function', () => {
    const jwtPayload = parseJwt(jwt);
    expect(jwtPayload).toStrictEqual({
        sub: 'admin',
        iat: 1669242203,
        exp: 1669328603,
        token_type: 'access_token'
    });
});

test('test id in url', () => {
    addIdToUrl(1);
    expect(window.location.search).toEqual('?id=1');
    expect(getIdFromUrl()).toEqual(1);
    removeIdFromUrl();
    expect(window.location.search).toEqual('');
    expect(getIdFromUrl()).toEqual(null);
});

test('Not a number in url', () => {
    window.history.pushState({}, 'Test', '?id=notanumber');
    expect(getIdFromUrl()).toEqual(null);
});

describe('getErrorMessage', () => {
    test('Error 422', () => {
        expect(
            getErrorMessage({
                status: 422,
                data: { detail: [{ loc: [], msg: 'Error message' }] },
                statusText: '',
                headers: {},
                config: {}
            })
        ).toEqual('Error message');
    });
    test('Error 400', () => {
        expect(
            getErrorMessage({
                status: 400,
                data: { detail: 'Error message' },
                statusText: '',
                headers: {},
                config: {}
            })
        ).toEqual('Error message');
    });
    test('Error 500', () => {
        expect(
            getErrorMessage({
                status: 500,
                data: {},
                statusText: '',
                headers: {},
                config: {}
            })
        ).toEqual('Erreur serveur');
    });
});

test('RedirectUrlEncoded', () => {
    expect(getRedirectUrlEncoded('/transaction')).toEqual('http%3A%2F%2Flocalhost%3A3000%2Ftransaction');
});
