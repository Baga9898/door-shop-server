import * as dotenv from 'dotenv';
import jwt         from 'jsonwebtoken';

import { userNotAuthError } from '../texts.js';

dotenv.config();

export const authMiddleWare = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: userNotAuthError });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: userNotAuthError });
    }
};
