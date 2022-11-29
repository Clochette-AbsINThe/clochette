import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', `jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);

    // This redirect is used to force the setting of the cookie
    res.redirect(302, '/login');
}
