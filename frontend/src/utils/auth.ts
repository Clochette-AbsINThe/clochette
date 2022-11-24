import { endpoints } from '@endpoints';
import axios, { AxiosError } from 'axios';
import { environmentVariable } from '@utils/settings';

type responseType = {
    status: number;
    token: {
        access_token: string;
        token_type: string;
    };
    error?: { detail: string };
};

/**
 * This function is used to login the user by sending a POST request to the backend with the username and password in urlencoded format
 * @returns An object containing the status of the request and the token if the request was successful, an error message otherwise
 */
export async function signIn({ username, password }: { username: string; password: string }): Promise<responseType> {
    const data = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    try {
        const res = await axios.request({
            url: environmentVariable.BACKEND_API_URL + endpoints.v1.login,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data
        });
        const { access_token, token_type } = res.data as { access_token: string; token_type: string };
        return {
            status: res.status,
            token: {
                access_token,
                token_type
            }
        };
    } catch (error) {
        const err = error as AxiosError<any | any>;
        return {
            error: err.response?.data,
            status: err.response?.status as number,
            token: {
                access_token: '',
                token_type: ''
            }
        };
    }
}

/**
 * This function is used to store the JWT token inside a httpOnly cookie by using the internal API of Next.js
 */
export async function saveJwtInCookie({ jwt }: { jwt: string }) {
    await axios.request({
        url: environmentVariable.INTERNAL_API_URL + endpoints.internal.saveJwtInCookie,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ jwt })
    });
    return true;
}

/**
 * This function is used to get the JWT token from the httpOnly cookie by using the internal API of Next.js
 * @returns The JWT token stored inside the httpOnly cookie
 */
export async function getJwtInCookie(): Promise<{ data: { jwt: string } }> {
    const res = await axios.request({
        url: environmentVariable.INTERNAL_API_URL + endpoints.internal.getJwtInCookie,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
}

/**
 * This function is used to remove the JWT token from the httpOnly cookie by using the internal API of Next.js
 */
export async function deleteJwtInCookie() {
    await axios.request({
        url: environmentVariable.INTERNAL_API_URL + endpoints.internal.deleteJwtInCookie,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return true;
}
