import type { QueryKey, QueryOptions, UseQueryOptions } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { QueryOperation } from '../openapi-codegen/clochetteComponents';

export type ClochetteContext<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  fetcherOptions: {
    /**
     * Headers to inject in the fetcher
     */
    headers?: {
      authorization?: string;
    };
    /**
     * Query params to inject in the fetcher
     */
    queryParams?: Record<string, string | number | boolean>;
  };
  queryOptions: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | "queryFn">;
  /**
   * Query key manager.
   */
  queryKeyFn: (operation: QueryOperation) => QueryKey;
};

/**
 * Context injected into every react-query hook wrappers
 *
 * @param queryOptions options from the useQuery wrapper
 */
export function useClochetteContext<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
  _queryOptions?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): ClochetteContext<TQueryFnData, TError, TData, TQueryKey> {
  const session = useSession();
  const token = session?.data?.token;
  return {
    fetcherOptions: {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    },
    queryOptions: {
      retry: false,
      networkMode: 'always'
    },
    queryKeyFn
  };
}

export const queryKeyFn = (operation: QueryOperation) => {
  const queryKey: unknown[] = hasPathParams(operation)
    ? operation.path
      .split('/')
      .filter(Boolean)
      .map((i) => resolvePathParam(i, operation.variables.pathParams))
    : operation.path.split('/').filter(Boolean);

  if (hasQueryParams(operation)) {
    queryKey.push(operation.variables.queryParams);
  }

  if (hasBody(operation)) {
    queryKey.push(operation.variables.body);
  }

  return queryKey;
};
// Helpers
const resolvePathParam = (key: string, pathParams: Record<string, string>) => {
  if (key.startsWith('{') && key.endsWith('}')) {
    const slicedKey = key.slice(1, -1);
    const camelizeKey = slicedKey.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    return pathParams[camelizeKey];
  }
  return key;
};

const hasPathParams = (
  operation: QueryOperation
): operation is QueryOperation & {
  variables: { pathParams: Record<string, string> };
} => {
  return Boolean((operation.variables as any).pathParams);
};

const hasBody = (
  operation: QueryOperation
): operation is QueryOperation & {
  variables: { body: Record<string, unknown> };
} => {
  return Boolean((operation.variables as any).body);
};

const hasQueryParams = (
  operation: QueryOperation
): operation is QueryOperation & {
  variables: { queryParams: Record<string, unknown> };
} => {
  return Boolean((operation.variables as any).queryParams);
};
