import type { AxiosError } from 'axios';

const BaseURL = 'https://clochette.dev/api/v1';

export default BaseURL;

export type IProxy = [
    (data?: any) => void,
    {
        loading: boolean
        error?: AxiosError | null
    }];
