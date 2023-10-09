import { parseJwt, rainbowColors, unique, groupBy, formatPrice, patchEmptyString } from '../../src/utils/utils';

describe('parseJwt', () => {
  it('should return null for an invalid token', () => {
    expect(parseJwt('invalid.token')).toBeNull();
  });

  it('should return the information inside the token for a valid token', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const expected = {
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022
    };
    expect(parseJwt(token)).toEqual(expected);
  });
});

describe('rainbowColors', () => {
  it('should return a color in hexadecimal format', () => {
    const color = rainbowColors(10, 5);
    expect(color).toMatch(/^#[0-9A-F]{6}DF$/i);
  });
});

describe('unique', () => {
  it('should return true for a unique value', () => {
    const arr = [1, 2, 3];
    const result = arr.filter(unique);
    expect(result).toEqual(arr);
  });

  it('should return false for a non-unique value', () => {
    const arr = [1, 2, 3, 2];
    const result = arr.filter(unique);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('groupBy', () => {
  it('should group an array of values by a key and sort the resulting map by the keys', () => {
    const arr = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: 25 }
    ];
    const expected = new Map<number, { name: string, age: number }[]>([
      [25, [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }]],
      [30, [{ name: 'Bob', age: 30 }]]
    ]);
    const result = groupBy(arr, (item) => item.age, (a, b) => a - b);
    expect(result).toEqual(expected);
  });
});

describe('formatPrice', () => {
  it('should format a number as a price in EUR', () => {
    const price = formatPrice(1234.56);
    expect(price).toBe('1\u202f234,56 €');
  });

  it('should return an empty string for a null amount', () => {
    const price = formatPrice(null);
    expect(price).toBe('');
  });
});

describe('patchEmptyString', () => {
  it('should replace empty strings in an object with null', () => {
    const obj = { name: 'Alice', age: '', email: 'alice@example.com' };
    const expected = { name: 'Alice', age: null, email: 'alice@example.com' };
    const result = patchEmptyString(obj);
    expect(result).toEqual(expected);
  });
});