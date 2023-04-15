import { Barrel, Consumable, OutOfStockBuy, OutOfStockSell, Glass, TableData } from '@types';
import { addIdToUrl, generateQuantityArray, getErrorMessage, getIdFromUrl, getRedirectUrlEncoded, groupBy, parseJwt, rainbowColors, removeIdFromUrl, translateTable, unique } from '@utils/utils';
import { jwt } from 'tests/setupTests';

test('test parseJWT function', () => {
    const jwtPayload = parseJwt(jwt);
    expect(jwtPayload).toStrictEqual({
        sub: 'admin',
        iat: 1669242203,
        exp: 1669328603,
        token_type: 'access_token'
    });
});

test('test parseJWT function with invalid token', () => {
    const jwtPayload = parseJwt('invalid token');
    expect(jwtPayload).toBeNull();
});

test('test id in url', () => {
    addIdToUrl(1);
    expect(window.location.search).toEqual('?id=1');
    expect(getIdFromUrl()).toEqual(1);
    removeIdFromUrl();
    expect(window.location.search).toEqual('');
    expect(getIdFromUrl()).toEqual(null);
});

test('Not a number in url', () => {
    window.history.pushState({}, 'Test', '?id=notanumber');
    expect(getIdFromUrl()).toEqual(null);
});

describe('getErrorMessage', () => {
    test('Error 422', () => {
        expect(
            getErrorMessage({
                status: 422,
                data: { detail: [{ loc: [], msg: 'Error message' }] },
                statusText: '',
                headers: {},
                config: {}
            })
        ).toEqual('Error message');
    });
    test('Error 400', () => {
        expect(
            getErrorMessage({
                status: 400,
                data: { detail: 'Error message' },
                statusText: '',
                headers: {},
                config: {}
            })
        ).toEqual('Error message');
    });
    test('Error 500', () => {
        expect(
            getErrorMessage({
                status: 500,
                data: {},
                statusText: '',
                headers: {},
                config: {}
            })
        ).toEqual('Erreur serveur');
    });
});

test('RedirectUrlEncoded', () => {
    expect(getRedirectUrlEncoded('/transaction')).toEqual('http%3A%2F%2Flocalhost%3A3000%2Ftransaction');
});

test('unique', () => {
    const array = [1, 2, 3, 3];
    const result = array.filter(unique);
    expect(result).toEqual([1, 2, 3]);
});

describe('rainbowColors', () => {
    it('should return a hex color string', () => {
        const result = rainbowColors(5, 1);
        expect(result).toMatch(/^#[0-9a-f]{6}DF$/);
    });

    it('should return different colors for different steps', () => {
        const result1 = rainbowColors(5, 1);
        const result2 = rainbowColors(5, 2);
        const result3 = rainbowColors(5, 3);
        expect(result1).not.toEqual(result2);
        expect(result1).not.toEqual(result3);
        expect(result2).not.toEqual(result3);
    });

    it('should return the same color for the same step and different number of steps', () => {
        const result1 = rainbowColors(5, 3);
        const result2 = rainbowColors(10, 6);
        expect(result1).toEqual(result2);
    });

    it('should handle a step of 0', () => {
        const result = rainbowColors(5, 0);
        expect(result).toMatch(/^#[0-9a-f]{6}DF$/);
    });

    it('should handle a step equal to the number of steps', () => {
        const result = rainbowColors(5, 5);
        expect(result).toMatch(/^#[0-9a-f]{6}DF$/);
    });
});

describe('groupBy', () => {
    it('should group the array by the grouper function', () => {
        const array = [
            { name: 'Alice', age: 21 },
            { name: 'Bob', age: 22 },
            { name: 'Eve', age: 21 }
        ];
        const grouper = (item: { name: string; age: number }) => item.age;
        const sorter = (a: number, b: number) => a - b;
        const result = groupBy(array, grouper, sorter);
        expect(result.get(21)).toEqual([
            { name: 'Alice', age: 21 },
            { name: 'Eve', age: 21 }
        ]);
        expect(result.get(22)).toEqual([{ name: 'Bob', age: 22 }]);
    });

    it('should return an empty map if the array is empty', () => {
        const array: any[] = [];
        const grouper = (item: { name: string; age: number }) => item.age;
        const sorter = (a: number, b: number) => a - b;
        const result = groupBy(array, grouper, sorter);
        expect(result).toEqual(new Map());
    });
});

describe('generateQuantityArray', () => {
    it('should count duplicate items correctly', () => {
        const items: Barrel[] = [
            {
                name: 'Barrel 1',
                fkId: 1,
                empty: false,
                icon: 'Barrel',
                isMounted: false,
                sellPrice: 2,
                unitPrice: 2
            },
            {
                name: 'Barrel 2',
                fkId: 2,
                empty: false,
                icon: 'Barrel',
                isMounted: false,
                sellPrice: 2,
                unitPrice: 2
            },
            {
                name: 'Barrel 2',
                fkId: 2,
                empty: false,
                icon: 'Barrel',
                isMounted: false,
                sellPrice: 2,
                unitPrice: 2
            }
        ];
        const table: TableData = 'barrel';
        const result = generateQuantityArray(items, table);
        expect(result).toEqual([
            {
                quantity: 1,
                table: 'barrel',
                item: {
                    name: 'Barrel 1',
                    fkId: 1,
                    empty: false,
                    icon: 'Barrel',
                    isMounted: false,
                    sellPrice: 2,
                    unitPrice: 2
                }
            },
            {
                quantity: 2,
                table: 'barrel',
                item: {
                    name: 'Barrel 2',
                    fkId: 2,
                    empty: false,
                    icon: 'Barrel',
                    isMounted: false,
                    sellPrice: 2,
                    unitPrice: 2
                }
            }
        ]);
    });
});

test('transalteTable', () => {
    expect(translateTable('barrel', 1)).toEqual('Fût');
    expect(translateTable('barrel', 2)).toEqual('Fûts');
    expect(translateTable('glass', 1)).toEqual('Verre');
    expect(translateTable('glass', 2)).toEqual('Verres');
    expect(translateTable('consumable', 1)).toEqual('');
});
