import { Router } from 'express';
import multer     from 'multer';

import { roleMiddleWare } from '../middleware/roleMiddleware.js';
import * as constants     from '../constants.js';
import * as texts         from '../texts.js';
import Door               from '../models/Door.js';

const router = new Router();
const upload = multer({ dest: constants.uploadsPath });

const middleWare =  {
    requireRole: roleMiddleWare([constants.adminRole]),
    upload: upload.single('image'),
};

router.post(constants.basePath, [middleWare.requireRole, middleWare.upload], async(req, res) => { 
    if (!req.file) {
        res.send({ code: 500, message: texts.fileNotFound });
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
        return res.send({ code: 400, message: texts.badRequest });
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
        return res.send({ code: 200, message: texts.addedSuccess });
    } else {
        return res.send({ code: 500, message: texts.serviceError });
    }
});

router.get(constants.basePath, async(req, res) => {
    try {
        const doors = await Door.find({}).sort({$natural: -1}).skip(0).limit(constants.defaultLimitValue);
        return res.json(doors);
    } catch (error) {
        return res.json(error);
    }
});

router.post(`${constants.basePath}/search`, async(req, res) => {
    try {
        const { searchText } = req.body;
        const search = searchText ? {
            '$or': [
                { name: { $regex: searchText, $options: 'i' } },
                { article: { $regex: searchText, $options: 'i' } },
            ],
        } : {};
        const resultDoors = await Door.find(search).limit(constants.limitOfSearch);
        return res.json(resultDoors);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${constants.basePath}/all`, async(req, res) => {
    try {
        const doors = await Door.find();
        return res.json(doors);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${constants.basePath}/length`, async(req, res) => {
    try {
        const doors = await Door.find();
        return res.json(doors.length);
    } catch (error) {
        return res.json(error);
    }
});

router.get(`${constants.basePath}/last-arrivals`, async(req, res) => {
    try {
        const doors = await Door.find({}).sort({$natural: -1}).limit(constants.mainPageItemsCount);
        return res.json(doors);
    } catch (error) {
        return res.json(error);
    }
});

router.post(`${constants.basePath}/sort`, async(req, res) => {
    try {
        const { sortMode, currentPage, pageSize } = req.body;
        const skip = (currentPage - 1) * pageSize;
        let doors;

        switch (sortMode) { // Переписать сортировку, в данный момент работает некорректно.
            case 'new': // В константы.
                doors = await Door.find({}).sort({$natural: -1}).skip(skip).limit(pageSize);
                break;
            
            // case 'cheap': // В константы.
            //     doors = await Door.find({}).sort({ price: 1 }).skip(skip).limit(pageSize);
            //     break;

            // case 'expencive': // В константы.
            //     doors = await Door.find({}).sort({ price: -1 }).skip(skip).limit(pageSize);
            //     break;

            default:
                doors = await Door.find({}).sort({$natural: -1}).skip(skip).limit(pageSize);
                break;
        }

        setTimeout(() => {
            return res.json(doors);
        }, 1000)
    } catch (error) {
        return res.json({message: texts.errorMessage});
    }
});

router.get(`${constants.basePath}/:id`, async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({ message: texts.idDoesNotExist });
        const door = await Door.findById(id);
        return res.json(door);
    } catch (error) {
        return res.json(error);
    }
});

router.delete(`${constants.basePath}/:id`, roleMiddleWare([constants.adminRole]), async(req, res) => {
    try {
        const {id} = req.params;
        !id && res.status(400).json({message: texts.idDoesNotExist});
        const door = await Door.findByIdAndDelete(id);
        return res.json(door);
    } catch (error) {
        return res.json({message: texts.errorMessage});
    }
});

export default router;
