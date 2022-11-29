import { NextApiRequest, NextApiResponse } from 'next';
import { parseJwt } from '@utils/utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const jwt = req.body['jwt'];

    try {
        const decodedJWT = parseJwt(jwt);
        res.setHeader('Set-Cookie', `jwt=${jwt}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${decodedJWT.exp - decodedJWT.iat};`);
    } catch {
        res.status(400).json({ error: 'Invalid JWT' });
    }
    // This redirect is used to prevent the browser from displaying the JSON response and to force the setting of the cookie
    res.redirect(302, '/login');
}
