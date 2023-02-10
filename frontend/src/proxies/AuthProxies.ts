import { endpoints } from '@endpoints';
import { AccountCreate } from '@types';
import { environmentVariable } from '@utils/settings';
import axios, { AxiosError } from 'axios';

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
export async function login({ username, password }: { username: string; password: string }): Promise<responseType> {
    const data = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`; // &scope=president`; // TODO : remove scope=president
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

export async function register(data: AccountCreate) {
    try {
        const res = await axios.request({
            url: environmentVariable.BACKEND_API_URL + endpoints.v1.account,
            method: 'POST',
            data
        });
        return res;
    } catch (error) {
        const err = error as AxiosError<any | any>;
        return err.response!;
    }
}
