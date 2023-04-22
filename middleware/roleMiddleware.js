import * as dotenv from 'dotenv';
import jwt         from 'jsonwebtoken';

import * as texts from '../texts.js';

dotenv.config();

export const roleMiddleWare = (roles) => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            return next();
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: texts.userNotAuthError });
            }
            const { roles: userRoles } = jwt.verify(token, process.env.SECRET_KEY);
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: texts.accessDeniedError });
            }
            next();
        } catch (error) {
            return res.status(403).json({ message: texts.userNotAuthError });
        }
    };
};
