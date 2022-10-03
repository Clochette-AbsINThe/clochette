import type { AxiosError } from 'axios';

const BaseURL = 'https://clochette.dev/api/v1';

export default BaseURL;

export interface IProxy {
    getData: () => void
    loading: boolean
    error?: AxiosError | null
}
