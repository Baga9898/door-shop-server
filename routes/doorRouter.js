import { Router } from "express";
import multer     from "multer";

import { roleMiddleWare } from '../middleware/roleMiddleware.js';
import Door               from "../models/Door.js";

const router = new Router();
const basePath = '/doors';
const upload = multer({ dest: 'uploads/' });

router.post(basePath, upload.single('image'), async(req, res) => { 
    console.log(req.file, req.body);

    if (!req.file) {
        res.send({ code: 500, message: 'err' });
    }

    const name = req.body.name;
    const image = req.file.path;

    if (!name || !image) {
        return res.send({ code: 400, message: 'Bad request' });
    }

    const newDoor = new Door({
        name: name,
        image: image,
    });

    const success = await newDoor.save();

    if (success) {
        return res.send({ code: 200, message: 'Added success' });
    } else {
        return res.send({ code: 500, message: 'Service error' });
    }
});

router.get(basePath, async(req, res) => {
    try {
        const door = await Door.find();
        return res.json(door);
    } catch (error) {
        return res.json(error);
    }
});

export default router;
