import { AxiosResponse } from 'axios';
import { environmentVariable } from '@utils/settings';

export const addIdToUrl = (id: number): void => {
    const url = new URL(window.location.href);
    url.searchParams.set('id', id.toString());
    window.history.pushState({}, '', url.href);
};

export const removeIdFromUrl = (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.href);
};

export const getIdFromUrl = (): number | null => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    if (id === null) return null;
    if (/^(-|)[0-9]+$/.test(id)) return parseInt(id);
    return null;
};

export function getErrorMessage(data: AxiosResponse<unknown, any>): string {
    if (data.status === 422) {
        const { detail } = data.data as {
            detail: [
                {
                    loc: [string, number];
                    msg: string;
                    type: string;
                }
            ];
        };
        return (
            detail
                .map((e) => e.msg)
                .join(' ')
                .charAt(0)
                .toUpperCase() +
            detail
                .map((e) => e.msg)
                .join(' ')
                .slice(1)
        );
    } else if (data.status === 500) {
        return 'Erreur serveur';
    } else {
        const { detail } = data.data as { detail: string };
        return detail;
    }
}

export interface Token {
    sub: string;
    iat: number;
    exp: number;
    token_type: string;
}

/**
 * This function could throw an error if the token is invalid in its format, for example if the token is not a JWT token
 * @param token JWT token
 * @returns Inforamtions inside the token
 */
export function parseJwt(token: string): Token {
    const base64Url = token.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64 as string, 'base64');
    const jsonPayload = decodeURIComponent(
        buffer
            .toString('utf-8')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

export function getRedirectUrlEncoded(url: string): string {
    return encodeURIComponent(environmentVariable.BASE_URL + url);
}
