import { getSession } from 'next-auth/react';
import { ClochetteContext } from './clochetteContext';
import type * as Schemas from './clochetteSchemas';
import { patchedRoutes, unprotectedRoutes } from './clochetteUtilities';
import { BACKEND_URL } from '@/utils/constant';

const baseUrl = BACKEND_URL;

export type ApiError = ErrorWrapper<
  {
    status: 400;
    payload: Schemas.HTTPError;
  }
  | {
    status: 401;
    payload: Schemas.HTTPError;
  }
  | {
    status: 404;
    payload: Schemas.HTTPError;
  }
  | {
    status: 422;
    payload: Schemas.HTTPValidationError;
  }>;

export function generateApiErrorMessage(error: ApiError): string {
  if (typeof error.payload === 'string') {
    return error.payload;
  }

  switch (error.status) {
    case 400:
      return error.payload.detail;
    case 401:
      return error.payload.detail;
    case 404:
      return error.payload.detail;
    case 422:
      return error.payload.detail?.map((e) => e.msg).join(' ') ?? 'Erreur de validation';
    default:
      return error.payload as string;
  }
}

export type ErrorWrapper<TError> = TError | { status: number; payload: string };

export type ClochetteFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
} & ClochetteContext['fetcherOptions'];

export async function clochetteFetch<TData, TError, TBody extends {} | FormData | undefined | null, THeaders extends {}, TQueryParams extends {}, TPathParams extends {}>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal
}: ClochetteFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>): Promise<TData> {
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers
  };

  let preBody = undefined;
  /**
     * As the fetch API is being used, when multipart/form-data is specified
     * the Content-Type header must be deleted so that the browser can set
     * the correct boundary.
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
     */
  if (requestHeaders['Content-Type']?.toLowerCase().includes('multipart/form-data')) {
    delete requestHeaders['Content-Type'];
    preBody = body as FormData;
  }

  if (patchedRoutes.some(({ path, method: _method }) => path === url && method === _method)) {
    requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    preBody = new URLSearchParams(body as Record<string, string>);
  }

  if (requestHeaders['Content-Type']?.toLowerCase().includes('application/json')) {
    preBody = JSON.stringify(body);
  }

  if (unprotectedRoutes.some(({ path, method: _method }) => path === url && method === _method)) {
    delete requestHeaders['authorization'];
  } else if (requestHeaders['authorization'] === undefined) {
    const session = await getSession();
    const token = session?.token;
    requestHeaders['authorization'] = token ? `Bearer ${token}` : "";
  }

  let response: Response;

  try {

    response = await fetch(`${baseUrl}${resolveUrl(url, queryParams, pathParams)}`, {
      signal,
      method: method.toUpperCase(),
      body: preBody,
      headers: requestHeaders
    });
  } catch (e) {
    throw {
      status: 0,
      payload: e instanceof Error ? `Network error (${e.message})` : 'Network error',
    };
  }

  if (!response.ok) {
    let error: ErrorWrapper<TError> = {
      status: response.status,
      payload: 'Unexpected error'
    };
    try {
      error.payload = await response.json();
    } catch (e) {
      error.payload = e instanceof Error ? `Unexpected error (${e.message})` : 'Unexpected error';
    }

    //logger.error(JSON.stringify(error, null, 2));

    throw error;
  }

  if (response.headers.get('content-type')?.includes('json')) {
    return await response.json();
  } else {
    // if it is not a json response, assume it is a blob and cast it to TData
    return (await response.blob()) as unknown as TData;
  }
}

const resolveUrl = (url: string, queryParams: Record<string, string> = {}, pathParams: Record<string, string> = {}) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]!) + query;
};
