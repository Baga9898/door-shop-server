import { check, validationResult } from "express-validator";
import { Router }                  from "express";
import * as dotenv                 from 'dotenv';
import bcrypt                      from 'bcryptjs';
import jwt                         from "jsonwebtoken";

import { authMiddleWare } from '../middleware/authMiddleware.js';
import { errorMessage }   from '../constants.js';
import Role               from "../models/Role.js";
import User               from "../models/User.js";

dotenv.config();

const router = new Router();

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    }
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
};

router.post('/registration', [
        check('username', 'Не может быть пустым').notEmpty(),
        check('password', 'Пароль должен содержать не менее 3 символов').isLength({ min: 3 }),
    ], async(req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ message: errorMessage });
        }
        const { username, password } = req.body;
        const candidate = await User.findOne({ username });
        if (candidate) {
            return res.status(400).json({ message: errorMessage });
        };
        const hashedPassword = bcrypt.hashSync(password, 7);
        const userRole = await Role.findOne({ name: 'watcher' });
        const user = new User({ username, password: hashedPassword, roles: [userRole.name] });
        user.save();
        return res.json({ user: user.username, message: 'Регистрация пользователя прошла успешно' })
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: errorMessage });
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: errorMessage });
        }
        const token = generateAccessToken(user._id, user.roles);
        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles,
            },
            message: 'Вход выполнен успешно',
        });
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.get('/auth', authMiddleWare, async(req, res) => { // Убрать мидлвеир авторизации.
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
        return res.json({message: errorMessage});
    }
});

export default router;
