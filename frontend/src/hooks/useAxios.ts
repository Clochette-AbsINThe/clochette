import { useAuthContext } from '@components/Context';
import { getJwtInCookie } from '@utils/auth_internal_api';
import { environmentVariable } from '@utils/settings';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState } from 'react';

interface ResponseValues<T> {
    loading: boolean;
    error: AxiosError | null;
    response?: AxiosResponse<T> | null;
}

type UseAxiosResult<T> = [ResponseValues<T>, (_config?: AxiosRequestConfig, _url?: string) => Promise<AxiosResponse<T>>];

export const API = axios.create({
    baseURL: environmentVariable.BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

export default function useAxios<T>(url: string, _config?: AxiosRequestConfig): UseAxiosResult<T> {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);
    const [response, setResponse] = useState<AxiosResponse<T> | null>(null);

    const { jwt, setJwt } = useAuthContext();

    const request = async (config?: AxiosRequestConfig, _url?: string): Promise<AxiosResponse<T>> => {
        setLoading(true);
        setError(null);

        // Use to cache the jwt token inside the app context if he doesn't exist when making a request to the backend
        let acces_token = jwt;
        if (jwt === null) {
            const { data } = await getJwtInCookie();
            setJwt(data.jwt);
            acces_token = data.jwt;
        }

        try {
            const response = await API.request({ ..._config, ...config, url: _url ?? url, headers: { Authorization: `Bearer ${acces_token}` } });
            setResponse(response);
            return response;
        } catch (error: any) {
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return [{ loading, error, response }, request];
}
