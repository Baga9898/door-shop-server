import { Router }   from "express";
import multer       from "multer";

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
        const newDoors = await Door.find();
        const doors = newDoors.reverse();
        return res.json(doors);
    } catch (error) {
        return res.json(error);
    }
});

// New arrivals for home page
router.get(`${basePath}/last-arrivals`, async(req, res) => { // Выводить заключительные 16 добавленных дверей.
    try {
        const doors = await Door.find();
        return res.json(doors.slice(-16));
    } catch (error) {
        return res.json(error);
    }
});

// Sorted doors
router.post(`${basePath}/sort`, async(req, res) => {
    try {
        const { sortMode } = req.body;
        let doors;

        switch (sortMode) {
            case 'new':
                const newDoors = await Door.find({}); // Добавить сортировку по году производства.
                doors = newDoors.reverse();
                break;
            
            case 'cheap':
                doors = await Door.find({}).sort({ price: 1 });
                break;

            case 'expencive':
                doors = await Door.find({}).sort({ price: -1 });
                break;

            default:
                const defaultDoors = await Door.find({});
                doors = defaultDoors.reverse();
                break;
        }

        return res.json(doors);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${basePath}/:id`, async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({ message: 'ID don\'t exist' });
        const door = await Door.findById(id);
        return res.json(door);
    } catch (error) {
        return res.json(error);
    }
});

router.delete(`${basePath}/:id`, roleMiddleWare(['admin']), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({message: 'ID don\'t exist'});
        const door = await Door.findByIdAndDelete(id);
        return res.json(door);
    } catch (error) {
        return res.json(error);
    }
});

export default router;
