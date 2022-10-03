import { useState } from 'react';

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ResponseValues<T> {
    loading: boolean
    error: AxiosError | null
    response?: AxiosResponse<T> | null
}

type UseAxiosResult<T> = [ResponseValues<T>, (_config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>];


export default function useAxios<T>(url: string, _config?: AxiosRequestConfig): UseAxiosResult<T> {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AxiosError | null>(null);
    const [response, setResponse] = useState<AxiosResponse<T> | null>(null);

    const request = async (config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios(url, config);
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
