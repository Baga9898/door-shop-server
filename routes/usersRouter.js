import { Router } from 'express';

import { roleMiddleWare } from '../middleware/roleMiddleware.js';
import * as constants     from '../constants.js';
import * as texts         from '../texts.js';
import User               from '../models/User.js';

const router = new Router();
const basePath = constants.usersPath;

router.post(basePath, roleMiddleWare([constants.adminRole]), async(req, res) => {
    try {
        const { username, password, roles, favourites } = req.body;
        const user = new User({ username, password, roles, favourites });
        await user.save();
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

router.get(basePath, roleMiddleWare([constants.adminRole]), async(req, res) => {
    try {
        const user = await User.find();
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${basePath}/:id`, roleMiddleWare([constants.adminRole]), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({ message: texts.idDoesNotExist });
        const user = await User.findById(id);
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

router.put(`${basePath}/:id`, roleMiddleWare([constants.adminRole]), async(req, res) => {
    try {
        const {id} = req.params;
        const { username, password, roles, favourites } = req.body;
        const user = ({ username, password, roles, favourites });
        !id && res.status(400).json({message: texts.idDoesNotExist});
        const updatedUser = await User.findByIdAndUpdate(id, user, {new: true});
        return res.json(updatedUser);
    } catch (error) {
        return res.json(error);
    }
});

router.delete(`${basePath}/:id`, roleMiddleWare([constants.adminRole]), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({message: texts.idDoesNotExist});
        const user = await User.findByIdAndDelete(id);
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

export default router;
