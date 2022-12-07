import { endpoints } from '@endpoints';
import axios from 'axios';
import { environmentVariable } from '@utils/settings';

/**
 * This function is used to store the JWT token inside a httpOnly cookie by using the internal API of Next.js
 */
export async function saveJwtInCookie({ jwt }: { jwt: string }) {
    await axios.request({
        url: environmentVariable.INTERNAL_API_URL + endpoints.internal.saveJwtInCookie,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ jwt })
    });
    return true;
}

/**
 * This function is used to get the JWT token from the httpOnly cookie by using the internal API of Next.js
 * @returns The JWT token stored inside the httpOnly cookie
 */
export async function getJwtInCookie(): Promise<{ data: { jwt: string } }> {
    const res = await axios.request({
        url: environmentVariable.INTERNAL_API_URL + endpoints.internal.getJwtInCookie,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return res;
}

/**
 * This function is used to remove the JWT token from the httpOnly cookie by using the internal API of Next.js
 */
export async function deleteJwtInCookie() {
    await axios.request({
        url: environmentVariable.INTERNAL_API_URL + endpoints.internal.deleteJwtInCookie,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return true;
}
