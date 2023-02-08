import { Router } from "express";

import { roleMiddleWare } from '../middleware/roleMiddleware.js';
import User               from "../models/User.js";

const router = new Router();
const basePath = '/users';

router.post(basePath, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const { username, password, roles, favourites } = req.body;
        const user = new User({ username, password, roles, favourites });
        await user.save();
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

router.get(basePath, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const user = await User.find();
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${basePath}/:id`, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({ message: 'ID don\'t exist' });
        const user = await User.findById(id);
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

router.put(`${basePath}/:id`, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const {id} = req.params;
        const { username, password, roles, favourites } = req.body;
        const user = ({ username, password, roles, favourites });
        !id && res.status(400).json({message: 'ID don\'t exist'});
        const updatedUser = await User.findByIdAndUpdate(id, user, {new: true});
        return res.json(updatedUser);
    } catch (error) {
        return res.json(error);
    }
});

router.delete(`${basePath}/:id`, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({message: 'ID don\'t exist'});
        const user = await User.findByIdAndDelete(id);
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }
});

export default router;
