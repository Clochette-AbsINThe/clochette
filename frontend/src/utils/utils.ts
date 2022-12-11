import { AxiosResponse } from 'axios';
import { environmentVariable } from '@utils/settings';
import { Barrel, Consumable, OutOfStockBuy, OutOfStockSell, Glass, TableData, ItemTransactionResponse, TransactionType, TransactionResponse } from '@types';

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

export interface Token {
    sub: string;
    iat: number;
    exp: number;
    token_type: string;
}

/**
 * This function could throw an error if the token is invalid in its format, for example if the token is not a JWT token
 * @param token JWT token
 * @returns Inforamtions inside the token
 */
export function parseJwt(token: string): Token {
    const base64Url = token.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64 as string, 'base64');
    const jsonPayload = decodeURIComponent(
        buffer
            .toString('utf-8')
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

export function getRedirectUrlEncoded(url: string): string {
    return encodeURIComponent(environmentVariable.BASE_URL + url);
}

// export const unique = (value: any, index: any, self: any[]) => {
//     return self.indexOf(value) === index;
// };

/**
 * @param numOfSteps: Total number steps to get color, means total colors
 * @param step: The step number, means the order of the color
 */
export function rainbowColors(numOfSteps: number, step: number): string {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    const saturation = 0.7;
    const lightness = 0.62;

    let red = 0,
        green = 0,
        blue = 0;

    const h = step / numOfSteps;
    const i = ~~(h * 6);
    const hue = h * 360;
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation,
        x = c * (1 - Math.abs(((hue / 60) % 2) - 1)),
        m = lightness - c / 2;
    switch (i % 6) {
        case 0:
            red = c;
            green = x;
            blue = 0;
            break;
        case 1:
            red = x;
            green = x;
            blue = 0;
            break;
        case 2:
            red = 0;
            green = c;
            blue = x;
            break;
        case 3:
            red = 0;
            green = x;
            blue = c;
            break;
        case 4:
            red = x;
            green = 0;
            blue = c;
            break;
        case 5:
            red = c;
            green = 0;
            blue = x;
            break;
    }
    return '#' + ('00' + (~~((red + m) * 255)).toString(16)).slice(-2) + ('00' + (~~((green + m) * 255)).toString(16)).slice(-2) + ('00' + (~~((blue + m) * 255)).toString(16)).slice(-2) + 'DF';
}

export const unique = (value: any, index: any, self: any[]) => {
    return self.indexOf(value) === index;
};

export function groupBy<K, V>(array: V[], grouper: (item: V) => K, sorter: (a: K, b: K) => number): Map<K, V[]> {
    const res = array.reduce((store, item) => {
        var key = grouper(item);
        if (store.has(key)) {
            store.get(key)!.push(item);
        } else {
            store.set(key, [item]);
        }
        return store;
    }, new Map<K, V[]>());
    // Return res as a sorted map
    return new Map<K, V[]>(Array.from(res.entries()).sort((a, b) => sorter(a[0], b[0])));
}

function generateQuantityArray(items: Barrel[] | Consumable[] | Array<OutOfStockBuy | OutOfStockSell> | Glass[], table: TableData): ItemTransactionResponse[] {
    const quantityArray: ItemTransactionResponse[] = [];
    items.forEach((item) => {
        const element = quantityArray.find((element) => element.item.name === item.name);
        if (element === undefined) {
            quantityArray.push({
                quantity: 1,
                table: table,
                item
            });
        } else {
            element.quantity += 1;
        }
    });
    return quantityArray;
}

export function generateTransactionItemArray(transactionData: TransactionResponse): ItemTransactionResponse[] {
    return [
        generateQuantityArray(transactionData.barrels, 'barrel'),
        generateQuantityArray(transactionData.glasses, 'glass'),
        generateQuantityArray(transactionData.consumablesPurchase, 'consumable'),
        generateQuantityArray(transactionData.consumablesSale, 'consumable'),
        generateQuantityArray(transactionData.outOfStocks, 'out_of_stock')
    ].flat();
}

export function translateTable(table: TableData, quantity: number): string {
    switch (table) {
        case 'barrel':
            return 'Fût' + (quantity > 1 ? 's' : '');
        case 'glass':
            return 'Verre' + (quantity > 1 ? 's' : '');
        default:
            return '';
    }
}
