import { AxiosResponse } from 'axios';

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
