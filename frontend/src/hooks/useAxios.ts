import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState } from 'react';

interface ResponseValues<T> {
    loading: boolean;
    error: AxiosError | null;
    response?: AxiosResponse<T> | null;
}

type UseAxiosResult<T> = [ResponseValues<T>, (_config?: AxiosRequestConfig, _url?: string) => Promise<AxiosResponse<T>>];

const API = axios.create({
    baseURL: 'https://clochette.dev/api/v1',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

export default function useAxios<T>(url: string, _config?: AxiosRequestConfig): UseAxiosResult<T> {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);
    const [response, setResponse] = useState<AxiosResponse<T> | null>(null);

    const request = async (config?: AxiosRequestConfig, _url?: string): Promise<AxiosResponse<T>> => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.request({ ..._config, ...config, url: _url ?? url });
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
