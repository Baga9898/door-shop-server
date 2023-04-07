import { check, validationResult } from 'express-validator';
import { Router }                  from 'express';
import * as dotenv                 from 'dotenv';
import bcrypt                      from 'bcryptjs';
import jwt                         from 'jsonwebtoken';

import { authMiddleWare } from '../middleware/authMiddleware.js';
import * as constants     from '../constants.js';
import * as texts         from '../texts.js';
import Role               from '../models/Role.js';
import User               from '../models/User.js';

dotenv.config();

const router = new Router();

const generateAccessToken = (id, roles) => {
    const payload = { id, roles }
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: constants.tokenExpireTime });
};

router.post(constants.registrationPath, [
        check('username', texts.canNotBeEmpty).notEmpty(),
        check('password', texts.mustContainThree).isLength({ min: constants.minPasswordLenght }),
    ], async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ message: texts.errorMessage });
        }

        const { username, password } = req.body;
        const candidate = await User.findOne({ username });
        if (candidate) {
            return res.status(400).json({ message: texts.errorMessage });
        };

        const hashedPassword = bcrypt.hashSync(password, constants.encriptionComplexity);
        const userRole = await Role.findOne({ name: constants.watcherRole });
        const user = new User({ username, password: hashedPassword, roles: [userRole.name] });
        user.save();
        const token = generateAccessToken(user._id, user.roles);
        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles,
            },
            message: texts.registrationSuccess,
        });
    } catch (error) {
        return res.json({message: texts.errorMessage});
    }
});

router.post(constants.loginPath, async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: texts.errorMessage });
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: texts.errorMessage });
        }
        const token = generateAccessToken(user._id, user.roles);
        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles,
            },
            message: texts.loginSuccess,
        });
    } catch (error) {
        return res.json({message: texts.errorMessage});
    }
});

router.get(constants.authPath, authMiddleWare, async(req, res) => { 
    try {
        const user = await User.findOne({ _id: req.user.id });
        const token = generateAccessToken(user._id, user.roles);
        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles,
            },
        });
    } catch (error) {
        return res.json({message: texts.errorMessage});
    }
});

export default router;
