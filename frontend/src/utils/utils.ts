import { JWT } from 'next-auth/jwt';

/**
 * Parses a JWT token and returns the information inside it, or null if the token is invalid.
 * @param token - The JWT token to parse.
 * @returns The information inside the token or null if the token is invalid.
 */
export function parseJwt(token: string): JWT | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64, 'base64');
    const jsonPayload = decodeURIComponent(
      buffer
        .toString('utf-8')
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Generates a vibrant, evenly spaced color based on the step number and the total number of steps.
 * @param numOfSteps - The total number of steps to get color, which means the total number of colors.
 * @param step - The step number, which means the order of the color.
 * @returns The generated color in hexadecimal format.
 */
export function rainbowColors(numOfSteps: number, step: number): string {
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
  /* c8 ignore next 31 */
  switch (i % 6) {
    case 0:
      red = c;
      green = x;
      break;
    case 1:
      red = x;
      green = x;
      break;
    case 2:
      green = c;
      blue = x;
      break;
    case 3:
      green = x;
      blue = c;
      break;
    case 4:
      red = x;
      blue = c;
      break;
    case 5:
      red = c;
      blue = x;
      break;
  }
  return '#' + ('00' + (~~((red + m) * 255)).toString(16)).slice(-2) + ('00' + (~~((green + m) * 255)).toString(16)).slice(-2) + ('00' + (~~((blue + m) * 255)).toString(16)).slice(-2) + 'DF';
}

/**
 * Determines whether a value is unique in an array, which can be used as a filter callback.
 * @param value - The value to check.
 * @param index - The index of the value in the array.
 * @param self - The array being checked.
 * @returns True if the value is unique, false otherwise.
 */
export function unique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

/**
 * Groups an array of values by a key and sorts the resulting map by the keys.
 * @param array - The array of values to group.
 * @param grouper - A function that returns the key to group by.
 * @param sorter - A function that sorts the keys.
 * @returns A map of the grouped values, sorted by the keys.
 */
export function groupBy<K, V>(array: V[], grouper: (item: V) => K, sorter: (a: K, b: K) => number): Map<K, V[]> {
  const res = array.reduce((store, item) => {
    const key = grouper(item);
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

/**
 * Formats a number as a price in EUR.
 * @param amount - The amount to format.
 * @param signDisplay - Whether to display the currency sign always, never, or only when the amount is negative or zero.
 * @returns The formatted price as a string.
 */
export function formatPrice(amount: number | null, signDisplay: 'always' | 'never' | 'auto' | 'exceptZero' = 'auto'): string {
  if (amount === null) return '';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: signDisplay
  }).format(amount);
}

/**
 * Replaces empty strings in an object with null.
 * @param obj - The object to patch.
 * @returns The patched object.
 */
export function patchEmptyString(obj: Record<string, unknown>): Record<string, unknown> {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '') obj[key] = null;
  });
  return obj;
}
