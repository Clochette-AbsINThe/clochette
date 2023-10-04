import { JWT } from 'next-auth/jwt';

/**
 * This function could return null if the token is invalid in its format, for example if the token is not a JWT token
 * @param token JWT token
 * @returns Inforamtions inside the token
 */
export function parseJwt(token: string): JWT | null {
  try {
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
  } catch {
    return null;
  }
}

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

export function unique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

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

export function formatPrice(amount: number | null, signDisplay: 'always' | 'never' | 'auto' | 'exceptZero' = 'auto'): string {
  if (amount === null) return '';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: signDisplay
  }).format(amount);
}

export function patchEmptyString(obj: Record<string, unknown>): Record<string, unknown> {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '') obj[key] = null;
  });
  return obj;
}
