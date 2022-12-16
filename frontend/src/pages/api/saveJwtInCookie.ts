import { NextApiRequest, NextApiResponse } from 'next';
import { parseJwt } from '@utils/utils';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const jwt = req.body['jwt'];

    const decodedJWT = parseJwt(jwt);

    if (decodedJWT === null) return res.status(400).json({ error: 'Invalid JWT' });

    res.setHeader('Set-Cookie', `jwt=${jwt}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${decodedJWT.exp - decodedJWT.iat};`);
    // This redirect is used to prevent the browser from displaying the JSON response and to force the setting of the cookie
    res.redirect(302, '/login');
}
