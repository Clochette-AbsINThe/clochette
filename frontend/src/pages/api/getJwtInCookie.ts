import { NextApiRequest, NextApiResponse } from 'next/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const jwt = req.cookies['jwt'];

    res.status(200).json({ jwt });
}
