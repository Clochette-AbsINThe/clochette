import { environmentVariable, SECRET_KEY } from '@utils/settings';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const regex = /\/account\/(?!\/)[^\/]*/;

export async function middleware(req: NextRequest) {
    const jwtCookie = req.cookies.get('jwt')?.value;

    if (jwtCookie) {
        try {
            // This function verfies the token with the same secret key as the one used to sign it in the backend
            const jwtResult = await jwtVerify(jwtCookie, new TextEncoder().encode(SECRET_KEY), { algorithms: ['HS256'] });

            // We check the role of the user to see if he has access to the page
            if (regex.test(req.nextUrl.pathname) && jwtResult.payload?.roles === 'ADMIN') { //TODO
                return NextResponse.redirect(environmentVariable.BASE_URL + '/account');
            }
            return NextResponse.next({ status: 200 });
        } catch (error) {
            // If we catch an error here, it means that the token is invalid and we redirect to the login page
            console.error(error);
        }
    }
    const url = new URL('/login', environmentVariable.BASE_URL);
    url.searchParams.set('redirect', environmentVariable.BASE_URL + req.nextUrl.pathname);
    return NextResponse.redirect(url);
}

// All thoses paths require authentification
export const config = {
    matcher: ['/transaction', '/stock', '/configuration/:path*', '/account/:path*']
};
