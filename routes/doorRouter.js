import { Router } from "express";
import multer     from "multer";

import { errorMessage }   from "../constants.js";
import { roleMiddleWare } from '../middleware/roleMiddleware.js';
import Door               from "../models/Door.js";

const router = new Router();
const basePath = '/doors';
const upload = multer({ dest: 'uploads/' });

const middleWare =  {
    requireRole: roleMiddleWare(['admin']),
    upload: upload.single('image'),
};

router.post(basePath, [middleWare.requireRole, middleWare.upload], async(req, res) => { 
    if (!req.file) {
        res.send({ code: 500, message: 'err' });
    }
    const { 
        name, 
        price,
        makeDate,
        category,
        article,
        country,
        color,
        description,
        sizes,
        withLeftRight,
        material,
        construction,
        surface,
        specs,
    } = req.body;
    const image = req.file.path;

    if (!name || !image) {
        return res.send({ code: 400, message: 'Bad request' });
    }

    const newDoor = new Door({
        name: name,
        price: price,
        makeDate: makeDate,
        category: category,
        article: article,
        country: country,
        color: color,
        description: description,
        sizes: sizes,
        withLeftRight: withLeftRight,
        material: material,
        construction: construction,
        surface: surface,
        specs: specs,
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
        const doors = await Door.find({}).sort({$natural: -1}).skip(0).limit(20);
        return res.json(doors);
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.get(`${basePath}/length`, async(req, res) => {
    try {
        const doors = await Door.find();
        return res.json(doors.length);
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.get(`${basePath}/last-arrivals`, async(req, res) => {
    try {
        const newDoors = await Door.find({});
        const doors = newDoors.reverse();
        return res.json(doors.slice(-16));
        // const doors = await Door.find({}).sort({$natural: -1}.limit(16));
        // return res.json(doors);
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.post(`${basePath}/sort`, async(req, res) => {
    try {
        const { sortMode, currentPage, pageSize } = req.body;
        const skip = (currentPage - 1) * pageSize;
        let doors;

        switch (sortMode) {
            case 'new':
                doors = await Door.find({}).sort({$natural: -1}).skip(skip).limit(pageSize);
                break;
            
            case 'cheap':
                doors = await Door.find({}).sort({ price: 1 }).skip(skip).limit(pageSize);
                break;

            case 'expencive':
                doors = await Door.find({}).sort({ price: -1 }).skip(skip).limit(pageSize);
                break;

            default:
                doors = await Door.find({}).sort({$natural: -1}).skip(skip).limit(pageSize);
                break;
        }

        return res.json(doors);
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.get(`${basePath}/:id`, async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({ message: 'ID don\'t exist' });
        const door = await Door.findById(id);
        return res.json(door);
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

router.delete(`${basePath}/:id`, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({message: 'ID don\'t exist'});
        const door = await Door.findByIdAndDelete(id);
        return res.json(door);
    } catch (error) {
        return res.json({message: errorMessage});
    }
});

export default router;
